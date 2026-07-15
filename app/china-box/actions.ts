"use server";

import { revalidatePath } from "next/cache";
import {
  clearChinaBoxRoom,
  removeChinaBoxItemFromOrder,
  removeChinaBoxItemGlobally,
  removeChinaBoxOrder,
  type ChinaBoxOrderItem,
  upsertChinaBoxOrder,
  updateChinaBoxRoomExtra,
} from "@/lib/china-box-rooms";

function roomPath(roomId: string) {
  return `/china-box/${roomId}`;
}

export async function submitChinaBoxOrder(input: {
  roomId: string;
  participantId: string;
  name: string;
  note?: string;
  items: ChinaBoxOrderItem[];
}) {
  const room = await upsertChinaBoxOrder(input);
  revalidatePath(roomPath(input.roomId));
  return room;
}

export async function deleteChinaBoxOrder(input: {
  roomId: string;
  participantId: string;
}) {
  const room = await removeChinaBoxOrder(input.roomId, input.participantId);
  revalidatePath(roomPath(input.roomId));
  return room;
}

export async function saveChinaBoxExtra(input: {
  roomId: string;
  extraPence: number;
}) {
  const room = await updateChinaBoxRoomExtra(input.roomId, input.extraPence);
  revalidatePath(roomPath(input.roomId));
  return room;
}

export async function resetChinaBoxRoom(input: { roomId: string }) {
  const room = await clearChinaBoxRoom(input.roomId);
  revalidatePath(roomPath(input.roomId));
  return room;
}

export async function adminRemoveChinaBoxItem(input: {
  roomId: string;
  itemId: string;
}) {
  const room = await removeChinaBoxItemGlobally(input.roomId, input.itemId);
  revalidatePath(roomPath(input.roomId));
  return room;
}

export async function adminDeleteChinaBoxOrder(input: {
  roomId: string;
  participantId: string;
}) {
  const room = await removeChinaBoxOrder(input.roomId, input.participantId);
  revalidatePath(roomPath(input.roomId));
  return room;
}

export async function adminRemoveChinaBoxItemFromOrder(input: {
  roomId: string;
  participantId: string;
  itemId: string;
}) {
  const room = await removeChinaBoxItemFromOrder(
    input.roomId,
    input.participantId,
    input.itemId,
  );
  revalidatePath(roomPath(input.roomId));
  return room;
}
