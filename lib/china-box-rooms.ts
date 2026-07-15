import { get, head, put } from "@vercel/blob";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import {
  getBlobClientOptions,
  getBlobPutOptions,
  shouldUseBlob,
} from "@/lib/blob-storage";
import { chinaBoxMenuItems, chinaBoxMenuVersion } from "@/lib/china-box-menu";

export type ChinaBoxOrderItem = {
  itemId: string;
  quantity: number;
};

export type ChinaBoxOrder = {
  participantId: string;
  name: string;
  items: ChinaBoxOrderItem[];
  note: string;
  totalPence: number;
  submittedAt: string;
  updatedAt: string;
};

export type ChinaBoxRoom = {
  roomId: string;
  menuVersion: string;
  orders: ChinaBoxOrder[];
  extraPence: number;
  createdAt: string;
  updatedAt: string;
  revision: number;
};

const LOCAL_DIR = path.join(process.cwd(), "data", "china-box-rooms");
const BLOB_PREFIX = "china-box-rooms/";
export const DEFAULT_CHINA_BOX_ROOM_ID = "room-live";

function blobPathname(roomId: string) {
  return `${BLOB_PREFIX}${roomFileName(roomId)}`;
}

export function createChinaBoxRoomId() {
  return `room-${Math.random().toString(36).slice(2, 8)}`;
}

async function ensureLocalDir() {
  await mkdir(LOCAL_DIR, { recursive: true });
}

function roomFileName(roomId: string) {
  return `${roomId}.json`;
}

async function readLocalRoom(roomId: string): Promise<ChinaBoxRoom | null> {
  try {
    const content = await readFile(path.join(LOCAL_DIR, roomFileName(roomId)), "utf8");
    return JSON.parse(content) as ChinaBoxRoom;
  } catch {
    return null;
  }
}

async function saveLocalRoom(room: ChinaBoxRoom) {
  await ensureLocalDir();
  await writeFile(
    path.join(LOCAL_DIR, roomFileName(room.roomId)),
    JSON.stringify(room),
    "utf8",
  );
}

async function readBlobRoomContent(
  pathname: string,
  downloadUrl: string,
): Promise<ChinaBoxRoom | null> {
  try {
    const result = await get(pathname, {
      access: "public",
      useCache: false,
      ...getBlobClientOptions(),
    });

    if (result?.statusCode === 200 && result.stream) {
      const content = await new Response(result.stream).text();
      return JSON.parse(content) as ChinaBoxRoom;
    }
  } catch {
    // Fall back to the blob download URL below.
  }

  try {
    const response = await fetch(downloadUrl, { cache: "no-store" });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as ChinaBoxRoom;
  } catch {
    return null;
  }
}

async function getBlobRoom(roomId: string): Promise<ChinaBoxRoom | null> {
  const pathname = blobPathname(roomId);

  try {
    const metadata = await head(pathname, getBlobClientOptions());
    return readBlobRoomContent(pathname, metadata.downloadUrl);
  } catch {
    return null;
  }
}

async function saveBlobRoom(room: ChinaBoxRoom) {
  await put(
    blobPathname(room.roomId),
    JSON.stringify(room),
    getBlobPutOptions({
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
    }),
  );
}

async function persistRoom(room: ChinaBoxRoom) {
  if (shouldUseBlob()) {
    await saveBlobRoom(room);
    return;
  }

  if (process.env.VERCEL) {
    throw new Error(
      "Order storage is not configured. Connect Vercel Blob to the NinoLive project.",
    );
  }

  await saveLocalRoom(room);
}

function createEmptyRoom(roomId = createChinaBoxRoomId()): ChinaBoxRoom {
  const timestamp = new Date().toISOString();

  return {
    roomId,
    menuVersion: chinaBoxMenuVersion,
    orders: [],
    extraPence: 0,
    createdAt: timestamp,
    updatedAt: timestamp,
    revision: 1,
  };
}

function sanitizeOrderItems(items: ChinaBoxOrderItem[]) {
  const merged = new Map<string, number>();

  for (const item of items) {
    if (!item || typeof item.itemId !== "string") {
      continue;
    }

    const menuItem = chinaBoxMenuItems[item.itemId];

    if (!menuItem) {
      continue;
    }

    const quantity = Number(item.quantity);

    if (!Number.isFinite(quantity) || quantity <= 0) {
      continue;
    }

    merged.set(item.itemId, Math.min((merged.get(item.itemId) ?? 0) + Math.floor(quantity), 99));
  }

  return Array.from(merged.entries()).map(([itemId, quantity]) => ({
    itemId,
    quantity,
  }));
}

function calculateTotalPence(items: ChinaBoxOrderItem[]) {
  return items.reduce((total, item) => {
    const menuItem = chinaBoxMenuItems[item.itemId];
    return total + (menuItem ? menuItem.pence * item.quantity : 0);
  }, 0);
}

export async function getChinaBoxRoom(roomId: string): Promise<ChinaBoxRoom | null> {
  if (shouldUseBlob()) {
    return getBlobRoom(roomId);
  }

  return readLocalRoom(roomId);
}

export async function getChinaBoxRoomOrDefault(
  roomId: string,
): Promise<ChinaBoxRoom> {
  const existing = await getChinaBoxRoom(roomId);
  return existing ?? createEmptyRoom(roomId);
}

export type ChinaBoxRoomPollResponse =
  | (ChinaBoxRoom & { stored: true })
  | {
      stored: false;
      roomId: string;
      revision: 0;
      orders: [];
    };

export async function getChinaBoxRoomForPoll(
  roomId: string,
): Promise<ChinaBoxRoomPollResponse> {
  const existing = await getChinaBoxRoom(roomId);

  if (existing) {
    return { stored: true, ...existing };
  }

  return {
    stored: false,
    roomId,
    revision: 0,
    orders: [],
  };
}

export async function createChinaBoxRoom(roomId?: string) {
  const room = createEmptyRoom(roomId);
  await persistRoom(room);
  return room;
}

export async function ensureChinaBoxRoom(roomId: string) {
  const existing = await getChinaBoxRoom(roomId);

  if (existing) {
    return existing;
  }

  return createChinaBoxRoom(roomId);
}

export async function upsertChinaBoxOrder(input: {
  roomId: string;
  participantId: string;
  name: string;
  note?: string;
  items: ChinaBoxOrderItem[];
}) {
  const room = await ensureChinaBoxRoom(input.roomId);
  const sanitizedItems = sanitizeOrderItems(input.items);

  if (sanitizedItems.length === 0) {
    throw new Error("An order must include at least one item.");
  }

  const name = input.name.trim();

  if (name.length === 0) {
    throw new Error("A name is required.");
  }

  const now = new Date().toISOString();
  const current = room.orders.find(
    (order) => order.participantId === input.participantId,
  );

  const order: ChinaBoxOrder = {
    participantId: input.participantId,
    name,
    items: sanitizedItems,
    note: (input.note ?? "").trim(),
    totalPence: calculateTotalPence(sanitizedItems),
    submittedAt: current?.submittedAt ?? now,
    updatedAt: now,
  };

  const nextOrders = room.orders.filter(
    (entry) => entry.participantId !== input.participantId,
  );
  nextOrders.push(order);

  nextOrders.sort((left, right) => {
    if (left.submittedAt !== right.submittedAt) {
      return left.submittedAt.localeCompare(right.submittedAt);
    }

    return left.name.localeCompare(right.name);
  });

  const nextRoom: ChinaBoxRoom = {
    ...room,
    orders: nextOrders,
    menuVersion: chinaBoxMenuVersion,
    updatedAt: now,
    revision: room.revision + 1,
  };

  await persistRoom(nextRoom);
  return nextRoom;
}

export async function removeChinaBoxOrder(roomId: string, participantId: string) {
  const room = await ensureChinaBoxRoom(roomId);
  const nextOrders = room.orders.filter(
    (order) => order.participantId !== participantId,
  );

  if (nextOrders.length === room.orders.length) {
    return room;
  }

  const nextRoom: ChinaBoxRoom = {
    ...room,
    orders: nextOrders,
    updatedAt: new Date().toISOString(),
    revision: room.revision + 1,
  };

  await persistRoom(nextRoom);
  return nextRoom;
}

export async function updateChinaBoxRoomExtra(
  roomId: string,
  extraPence: number,
) {
  const room = await ensureChinaBoxRoom(roomId);
  const nextRoom: ChinaBoxRoom = {
    ...room,
    extraPence: Math.max(0, Math.floor(extraPence)),
    updatedAt: new Date().toISOString(),
    revision: room.revision + 1,
  };

  await persistRoom(nextRoom);
  return nextRoom;
}

export async function clearChinaBoxRoom(roomId: string) {
  const room = await ensureChinaBoxRoom(roomId);
  const nextRoom: ChinaBoxRoom = {
    ...room,
    orders: [],
    extraPence: 0,
    updatedAt: new Date().toISOString(),
    revision: room.revision + 1,
  };

  await persistRoom(nextRoom);
  return nextRoom;
}

export async function removeChinaBoxItemGlobally(
  roomId: string,
  itemId: string,
) {
  const room = await ensureChinaBoxRoom(roomId);
  const now = new Date().toISOString();

  const nextOrders = room.orders
    .map((order) => {
      const items = order.items.filter((entry) => entry.itemId !== itemId);

      if (items.length === 0) {
        return null;
      }

      return {
        ...order,
        items,
        totalPence: calculateTotalPence(items),
        updatedAt: now,
      };
    })
    .filter((order): order is ChinaBoxOrder => order !== null);

  const nextRoom: ChinaBoxRoom = {
    ...room,
    orders: nextOrders,
    updatedAt: now,
    revision: room.revision + 1,
  };

  await persistRoom(nextRoom);
  return nextRoom;
}

export async function removeChinaBoxItemFromOrder(
  roomId: string,
  participantId: string,
  itemId: string,
) {
  const room = await ensureChinaBoxRoom(roomId);
  const now = new Date().toISOString();

  const nextOrders = room.orders
    .map((order) => {
      if (order.participantId !== participantId) {
        return order;
      }

      const items = order.items.filter((entry) => entry.itemId !== itemId);

      if (items.length === 0) {
        return null;
      }

      return {
        ...order,
        items,
        totalPence: calculateTotalPence(items),
        updatedAt: now,
      };
    })
    .filter((order): order is ChinaBoxOrder => order !== null);

  const nextRoom: ChinaBoxRoom = {
    ...room,
    orders: nextOrders,
    updatedAt: now,
    revision: room.revision + 1,
  };

  await persistRoom(nextRoom);
  return nextRoom;
}
