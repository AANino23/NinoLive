"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  adminDeleteChinaBoxOrder,
  adminRemoveChinaBoxItem,
  adminRemoveChinaBoxItemFromOrder,
  deleteChinaBoxOrder,
  resetChinaBoxRoom,
  saveChinaBoxExtra,
  submitChinaBoxOrder,
} from "@/app/china-box/actions";
import {
  formatPence,
  type ChinaBoxMenuCategory,
  type ChinaBoxMenuItem,
} from "@/lib/china-box-menu";
import type { ChinaBoxOrderItem, ChinaBoxRoom } from "@/lib/china-box-rooms";

type ChinaBoxRoomViewProps = {
  initialRoom: ChinaBoxRoom;
  menu: ChinaBoxMenuCategory[];
};

type CartState = Record<string, number>;
type ActiveTab = "menu" | "group";

const POLL_INTERVAL_MS = 4000;
const ADMIN_TAP_COUNT = 10;
const ADMIN_TAP_RESET_MS = 2000;

function createParticipantId() {
  return `guest-${crypto.randomUUID()}`;
}

function buildCartFromOrder(order: ChinaBoxRoom["orders"][number] | undefined) {
  if (!order) {
    return {};
  }

  return Object.fromEntries(
    order.items.map((item) => [item.itemId, item.quantity]),
  ) as CartState;
}

function calculateCartTotal(
  cart: CartState,
  menuItems: Record<string, ChinaBoxMenuItem>,
) {
  return Object.entries(cart).reduce(
    (summary, [itemId, quantity]) => {
      const menuItem = menuItems[itemId];

      if (!menuItem) {
        return summary;
      }

      return {
        count: summary.count + quantity,
        totalPence: summary.totalPence + menuItem.pence * quantity,
      };
    },
    { count: 0, totalPence: 0 },
  );
}

function aggregateOrders(
  room: ChinaBoxRoom,
  menuOrder: string[],
  menuItems: Record<string, ChinaBoxMenuItem>,
) {
  const totals = new Map<string, number>();
  let totalItems = 0;
  let grandTotal = 0;

  for (const order of room.orders) {
    grandTotal += order.totalPence;

    for (const item of order.items) {
      totalItems += item.quantity;
      totals.set(item.itemId, (totals.get(item.itemId) ?? 0) + item.quantity);
    }
  }

  const aggregateLines = menuOrder
    .filter((itemId) => totals.has(itemId))
    .map((itemId) => {
      const quantity = totals.get(itemId) ?? 0;
      const menuItem = menuItems[itemId];

      return {
        itemId,
        name: menuItem.name,
        quantity,
        totalPence: quantity * menuItem.pence,
      };
    });

  return { aggregateLines, totalItems, grandTotal };
}

function splitTotals(orders: ChinaBoxRoom["orders"], extraPence: number) {
  const people = orders.length;

  if (people === 0) {
    return [];
  }

  const baseShare = Math.floor(extraPence / people);
  const remainder = extraPence - baseShare * people;

  return orders.map((order, index) => {
    const share = baseShare + (index < remainder ? 1 : 0);
    return {
      participantId: order.participantId,
      name: order.name,
      foodPence: order.totalPence,
      sharePence: share,
      owedPence: order.totalPence + share,
    };
  });
}

function buildSummaryText(
  room: ChinaBoxRoom,
  menuOrder: string[],
  menuItems: Record<string, ChinaBoxMenuItem>,
) {
  const { aggregateLines, totalItems, grandTotal } = aggregateOrders(
    room,
    menuOrder,
    menuItems,
  );
  const splitLines = splitTotals(room.orders, room.extraPence);
  const now = new Date(room.updatedAt);
  const dateLabel = new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(now);

  const aggregateText =
    aggregateLines
      .map(
        (line) => `${line.quantity}x ${line.name} - ${formatPence(line.totalPence)}`,
      )
      .join("\n") || "No orders yet.";

  const perPersonText =
    splitLines
      .map((line) => {
        const extra =
          line.sharePence > 0
            ? ` (food ${formatPence(line.foodPence)} + extra ${formatPence(line.sharePence)})`
            : "";
        return `${line.name} - ${formatPence(line.owedPence)}${extra}`;
      })
      .join("\n") || "Nobody has submitted yet.";

  const extraLine =
    room.extraPence > 0
      ? `\nDelivery / extra split between ${room.orders.length} people: ${formatPence(room.extraPence)}`
      : "";

  return [
    "CHINA BOX - GROUP ORDER",
    `${dateLabel} - ${room.orders.length} ${
      room.orders.length === 1 ? "person" : "people"
    } - ${totalItems} items`,
    "",
    aggregateText,
    "",
    `TOTAL: ${formatPence(grandTotal)}`,
    "",
    "WHO OWES WHAT",
    perPersonText,
    extraLine,
    "",
    "Call to order: 01204 294014",
    "523 Wigan Road, Bolton BL3 4QN",
  ]
    .filter(Boolean)
    .join("\n");
}

export function ChinaBoxRoomView({
  initialRoom,
  menu,
}: ChinaBoxRoomViewProps) {
  const [room, setRoom] = useState(initialRoom);
  const [activeTab, setActiveTab] = useState<ActiveTab>("menu");
  const [search, setSearch] = useState("");
  const [nameDraft, setNameDraft] = useState("");
  const [participantId, setParticipantId] = useState<string | null>(null);
  const [participantName, setParticipantName] = useState("");
  const [cart, setCart] = useState<CartState>({});
  const [note, setNote] = useState("");
  const [extraInput, setExtraInput] = useState(
    (initialRoom.extraPence / 100).toFixed(2),
  );
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingExtra, setIsSavingExtra] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [armedAction, setArmedAction] = useState<string | null>(null);
  const hasInitializedIdentity = useRef(false);
  const titleTapCountRef = useRef(0);
  const titleTapTimeoutRef = useRef<number | null>(null);

  const roomStorageKeys = useMemo(
    () => ({
      name: `china-box:${room.roomId}:name`,
      participant: `china-box:${room.roomId}:participant`,
    }),
    [room.roomId],
  );

  const menuItems = useMemo(
    () =>
      Object.fromEntries(
        menu.flatMap((category) => category.items.map((item) => [item.id, item])),
      ) as Record<string, ChinaBoxMenuItem>,
    [menu],
  );

  const menuOrder = useMemo(
    () => menu.flatMap((category) => category.items.map((item) => item.id)),
    [menu],
  );

  const currentOrder = useMemo(
    () =>
      participantId
        ? room.orders.find((order) => order.participantId === participantId)
        : undefined,
    [participantId, room.orders],
  );

  const visibleCategories = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return menu;
    }

    return menu
      .map((category) => ({
        ...category,
        items: category.items.filter((item) => {
          const haystack = [
            item.name,
            item.description ?? "",
            category.title,
            category.description ?? "",
          ]
            .join(" ")
            .toLowerCase();

          return haystack.includes(query);
        }),
      }))
      .filter((category) => category.items.length > 0);
  }, [menu, search]);

  const cartSummary = useMemo(
    () => calculateCartTotal(cart, menuItems),
    [cart, menuItems],
  );

  const aggregateSummary = useMemo(
    () => aggregateOrders(room, menuOrder, menuItems),
    [menuItems, menuOrder, room],
  );

  const splitSummary = useMemo(
    () => splitTotals(room.orders, room.extraPence),
    [room.extraPence, room.orders],
  );

  useEffect(() => {
    setExtraInput((room.extraPence / 100).toFixed(2));
  }, [room.extraPence]);

  useEffect(() => {
    if (typeof window === "undefined" || hasInitializedIdentity.current) {
      return;
    }

    hasInitializedIdentity.current = true;

    const savedName = window.localStorage.getItem(roomStorageKeys.name) ?? "";
    const savedParticipant =
      window.localStorage.getItem(roomStorageKeys.participant) ?? "";

    if (savedName) {
      setNameDraft(savedName);
      setParticipantName(savedName);
    }

    if (savedParticipant) {
      setParticipantId(savedParticipant);
      const existingOrder = room.orders.find(
        (order) => order.participantId === savedParticipant,
      );

      if (existingOrder) {
        setCart(buildCartFromOrder(existingOrder));
        setNote(existingOrder.note);
      }
    }
  }, [room.orders, roomStorageKeys]);

  useEffect(() => {
    let cancelled = false;

    const poll = async () => {
      try {
        const response = await fetch(`/china-box/rooms/${room.roomId}`, {
          cache: "no-store",
        });

        if (!response.ok) {
          return;
        }

        const nextRoom = (await response.json()) as ChinaBoxRoom;

        if (!cancelled && nextRoom.revision !== room.revision) {
          setRoom(nextRoom);
        }
      } catch {
        // Ignore transient polling failures and keep the last room snapshot.
      }
    };

    const interval = window.setInterval(poll, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [room.revision, room.roomId]);

  const roomLink =
    typeof window === "undefined" ? "" : window.location.href;

  function changeQuantity(itemId: string, nextQuantity: number) {
    setCart((current) => {
      const next = { ...current };

      if (nextQuantity <= 0) {
        delete next[itemId];
      } else {
        next[itemId] = Math.min(nextQuantity, 99);
      }

      return next;
    });
  }

  function handleEnterRoom() {
    const nextName = nameDraft.trim();

    if (!nextName) {
      setError("Enter your name to start building your order.");
      return;
    }

    const nextParticipantId = participantId ?? createParticipantId();
    const existingOrder = room.orders.find(
      (order) => order.participantId === nextParticipantId,
    );

    setParticipantId(nextParticipantId);
    setParticipantName(nextName);
    setCart(buildCartFromOrder(existingOrder));
    setNote(existingOrder?.note ?? "");
    setError("");
    setFeedback("");

    if (typeof window !== "undefined") {
      window.localStorage.setItem(roomStorageKeys.name, nextName);
      window.localStorage.setItem(roomStorageKeys.participant, nextParticipantId);
    }
  }

  async function handleConfirmOrder() {
    if (!participantId) {
      setError("Enter your name before submitting your order.");
      return;
    }

    const items: ChinaBoxOrderItem[] = Object.entries(cart).map(
      ([itemId, quantity]) => ({
        itemId,
        quantity,
      }),
    );

    if (items.length === 0) {
      setError("Add at least one menu item before confirming your order.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const nextRoom = await submitChinaBoxOrder({
        roomId: room.roomId,
        participantId,
        name: participantName || nameDraft.trim(),
        note,
        items,
      });

      setRoom(nextRoom);
      setFeedback("Your box has been added to the shared order.");
      setActiveTab("group");
    } catch {
      setError("Something went wrong while saving your order.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleRemoveMyOrder() {
    if (!participantId) {
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const nextRoom = await deleteChinaBoxOrder({
        roomId: room.roomId,
        participantId,
      });

      setRoom(nextRoom);
      setCart({});
      setNote("");
      setFeedback("Your order was removed from the room.");
      setActiveTab("menu");
    } catch {
      setError("Something went wrong while removing your order.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSaveExtra() {
    const parsed = Number.parseFloat(extraInput);

    if (Number.isNaN(parsed) || parsed < 0) {
      setError("Enter a valid delivery or extra amount.");
      return;
    }

    setIsSavingExtra(true);
    setError("");

    try {
      const nextRoom = await saveChinaBoxExtra({
        roomId: room.roomId,
        extraPence: Math.round(parsed * 100),
      });

      setRoom(nextRoom);
      setFeedback("Shared extra charges updated.");
    } catch {
      setError("Could not save the shared extra charge.");
    } finally {
      setIsSavingExtra(false);
    }
  }

  async function handleCopyRoomLink() {
    if (!roomLink) {
      return;
    }

    try {
      await navigator.clipboard.writeText(roomLink);
      setFeedback("Room link copied. Send it to your friends.");
    } catch {
      setError("Could not copy the room link automatically.");
    }
  }

  async function handleCopySummary() {
    try {
      await navigator.clipboard.writeText(
        buildSummaryText(room, menuOrder, menuItems),
      );
      setFeedback("Collector summary copied.");
    } catch {
      setError("Could not copy the summary automatically.");
    }
  }

  function handleTitleTap() {
    titleTapCountRef.current += 1;

    if (titleTapTimeoutRef.current) {
      window.clearTimeout(titleTapTimeoutRef.current);
    }

    titleTapTimeoutRef.current = window.setTimeout(() => {
      titleTapCountRef.current = 0;
    }, ADMIN_TAP_RESET_MS);

    if (titleTapCountRef.current >= ADMIN_TAP_COUNT) {
      titleTapCountRef.current = 0;
      setIsAdminMode(true);
      setActiveTab("group");
      setFeedback("Admin mode enabled.");
      setError("");
    }
  }

  function syncLocalCartAfterRoomChange(nextRoom: ChinaBoxRoom) {
    if (!participantId) {
      return;
    }

    const myOrder = nextRoom.orders.find(
      (order) => order.participantId === participantId,
    );

    if (myOrder) {
      setCart(buildCartFromOrder(myOrder));
      setNote(myOrder.note);
      return;
    }

    setCart({});
    setNote("");
  }

  async function runAdminAction(
    actionKey: string,
    action: () => Promise<ChinaBoxRoom>,
    successMessage: string,
  ) {
    if (armedAction !== actionKey) {
      setArmedAction(actionKey);
      setError("");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setArmedAction(null);

    try {
      const nextRoom = await action();
      setRoom(nextRoom);
      syncLocalCartAfterRoomChange(nextRoom);
      setFeedback(successMessage);
    } catch {
      setError("Admin action failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleAdminResetRoom() {
    await runAdminAction("reset-room", async () => {
      return resetChinaBoxRoom({ roomId: room.roomId });
    }, "Room order reset.");
  }

  async function handleAdminRemoveGlobalItem(itemId: string) {
    await runAdminAction(`remove-global:${itemId}`, async () => {
      return adminRemoveChinaBoxItem({ roomId: room.roomId, itemId });
    }, "Item removed from the group order.");
  }

  async function handleAdminRemovePerson(participantId: string) {
    await runAdminAction(`remove-person:${participantId}`, async () => {
      return adminDeleteChinaBoxOrder({ roomId: room.roomId, participantId });
    }, "Person removed from the room.");
  }

  async function handleAdminRemovePersonItem(
    participantId: string,
    itemId: string,
  ) {
    await runAdminAction(
      `remove-person-item:${participantId}:${itemId}`,
      async () => {
        return adminRemoveChinaBoxItemFromOrder({
          roomId: room.roomId,
          participantId,
          itemId,
        });
      },
      "Item removed from that person's order.",
    );
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10 sm:px-10 sm:py-14">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-slate-950/40 backdrop-blur sm:p-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.35em] text-sky-300">
              NinoLive
            </p>
            <h1
              className="mt-5 cursor-default select-none text-4xl font-semibold tracking-tight text-white sm:text-5xl"
              onClick={handleTitleTap}
            >
              China Box
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
              Build your order, confirm it into this room, and keep one shared
              list ready for whoever phones it through later.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-sm text-slate-200 lg:max-w-sm">
            <p className="font-medium text-white">Room code</p>
            <p className="mt-2 font-mono text-sky-200">{room.roomId}</p>
            <button
              type="button"
              onClick={handleCopyRoomLink}
              className="mt-4 inline-flex rounded-full border border-sky-400/40 bg-sky-400/10 px-4 py-2 text-sm font-medium text-sky-200 transition hover:border-sky-300 hover:bg-sky-400/20"
            >
              Copy invite link
            </button>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setActiveTab("menu")}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              activeTab === "menu"
                ? "border border-sky-400/50 bg-sky-400/15 text-sky-100"
                : "border border-white/10 bg-slate-950/60 text-slate-300 hover:border-sky-400/40"
            }`}
          >
            Menu
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("group")}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              activeTab === "group"
                ? "border border-sky-400/50 bg-sky-400/15 text-sky-100"
                : "border border-white/10 bg-slate-950/60 text-slate-300 hover:border-sky-400/40"
            }`}
          >
            Group order
            <span className="ml-2 rounded-full bg-white/10 px-2 py-0.5 text-xs text-slate-200">
              {room.orders.length}
            </span>
          </button>
        </div>

        {feedback ? (
          <p className="mt-6 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
            {feedback}
          </p>
        ) : null}

        {error ? (
          <p className="mt-6 rounded-xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
            {error}
          </p>
        ) : null}

        {isAdminMode ? (
          <div className="mt-6 rounded-2xl border border-amber-400/30 bg-amber-400/10 p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-200">
                  Admin mode
                </p>
                <p className="mt-2 text-sm text-amber-100/90">
                  Remove items, clear people, or reset the whole room order.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleAdminResetRoom}
                  disabled={isSubmitting}
                  className="rounded-full border border-rose-400/40 bg-rose-400/10 px-4 py-2 text-sm font-medium text-rose-200 transition hover:border-rose-300 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {armedAction === "reset-room"
                    ? "Tap again to reset room"
                    : "Reset entire order"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsAdminMode(false);
                    setArmedAction(null);
                    setFeedback("Admin mode disabled.");
                  }}
                  className="rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-sky-400/40 hover:text-white"
                >
                  Exit admin
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {!participantId ? (
          <section className="mt-8 rounded-3xl border border-white/10 bg-slate-950/70 p-6">
            <h2 className="text-2xl font-semibold text-white">Who&apos;s ordering?</h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">
              Enter your name once, then build your box and confirm it into this
              live room.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <input
                value={nameDraft}
                onChange={(event) => setNameDraft(event.target.value)}
                placeholder="Your name"
                autoComplete="name"
                className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-sky-400/60"
              />
              <button
                type="button"
                onClick={handleEnterRoom}
                className="inline-flex shrink-0 items-center justify-center rounded-xl border border-sky-400/40 bg-sky-400/10 px-5 py-3 text-sm font-medium text-sky-200 transition hover:border-sky-300 hover:bg-sky-400/20"
              >
                Open the menu
              </button>
            </div>
          </section>
        ) : null}

        {participantId ? (
          <div className="mt-8 flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-slate-300">
            <p>
              Ordering as <span className="font-medium text-white">{participantName}</span>
            </p>
            <button
              type="button"
              onClick={() => {
                setParticipantId(null);
                setParticipantName("");
                setNameDraft("");
                setCart({});
                setNote("");
                setFeedback("");
                setError("");

                if (typeof window !== "undefined") {
                  window.localStorage.removeItem(roomStorageKeys.name);
                  window.localStorage.removeItem(roomStorageKeys.participant);
                }
              }}
              className="rounded-full border border-white/10 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-slate-300 transition hover:border-sky-400/40 hover:text-white"
            >
              Switch
            </button>
          </div>
        ) : null}

        {activeTab === "menu" ? (
          <section className="mt-8">
            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                type="search"
                placeholder="Search the menu"
                className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-sky-400/60"
              />

              <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
                {menu.map((category) => (
                  <a
                    key={category.id}
                    href={`#category-${category.id}`}
                    className="shrink-0 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-200 transition hover:border-sky-400/40 hover:text-white"
                  >
                    {category.emoji} {category.title}
                  </a>
                ))}
              </div>
            </div>

            <div className="mt-6 space-y-6">
              {visibleCategories.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-8 text-center text-sm text-slate-400">
                  No menu items matched that search.
                </div>
              ) : null}

              {visibleCategories.map((category) => (
                <section
                  id={`category-${category.id}`}
                  key={category.id}
                  className="rounded-3xl border border-white/10 bg-slate-950/50 p-5"
                >
                  <div className="flex flex-wrap items-center gap-3 border-b border-white/10 pb-4">
                    <span className="text-xl">{category.emoji}</span>
                    <h2 className="text-lg font-semibold text-white">
                      {category.title}
                    </h2>
                    <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs text-slate-300">
                      {category.items.length}
                    </span>
                  </div>

                  {category.description ? (
                    <p className="mt-3 text-sm italic text-slate-400">
                      {category.description}
                    </p>
                  ) : null}

                  <div className="mt-4 space-y-3">
                    {category.items.map((item) => {
                      const quantity = cart[item.id] ?? 0;
                      return (
                        <article
                          key={item.id}
                          className="rounded-2xl border border-white/10 bg-slate-950/60 p-4"
                        >
                          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="font-medium text-white">{item.name}</h3>
                                {item.flags?.includes("popular") ? (
                                  <span className="rounded-full border border-amber-400/30 bg-amber-400/15 px-2 py-0.5 text-[11px] font-medium uppercase tracking-[0.18em] text-amber-200">
                                    Popular
                                  </span>
                                ) : null}
                                {item.flags?.includes("vegetarian") ? (
                                  <span className="rounded-full border border-emerald-400/30 bg-emerald-400/15 px-2 py-0.5 text-[11px] font-medium uppercase tracking-[0.18em] text-emerald-200">
                                    Veg
                                  </span>
                                ) : null}
                              </div>

                              {item.description ? (
                                <p className="mt-2 text-sm leading-6 text-slate-300">
                                  {item.description}
                                </p>
                              ) : null}

                              <p className="mt-3 text-sm font-medium text-sky-200">
                                {formatPence(item.pence)}
                              </p>
                            </div>

                            <div className="flex shrink-0 items-center gap-2">
                              {quantity > 0 ? (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => changeQuantity(item.id, quantity - 1)}
                                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-lg font-medium text-white transition hover:border-sky-400/40"
                                  >
                                    -
                                  </button>
                                  <span className="w-10 text-center text-sm font-medium text-white">
                                    {quantity}
                                  </span>
                                </>
                              ) : null}

                              <button
                                type="button"
                                onClick={() => changeQuantity(item.id, quantity + 1)}
                                className="inline-flex min-w-24 items-center justify-center rounded-full border border-sky-400/40 bg-sky-400/10 px-4 py-2 text-sm font-medium text-sky-200 transition hover:border-sky-300 hover:bg-sky-400/20"
                              >
                                {quantity > 0 ? "Add more" : "+ Add"}
                              </button>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>

            <div className="mt-8 rounded-3xl border border-white/10 bg-slate-950/70 p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-lg font-semibold text-white">
                    {formatPence(cartSummary.totalPence)}
                  </p>
                  <p className="mt-1 text-sm text-slate-300">
                    {cartSummary.count} {cartSummary.count === 1 ? "item" : "items"} in
                    your box
                  </p>
                </div>
                <div className="flex gap-3">
                  {currentOrder ? (
                    <button
                      type="button"
                      onClick={handleRemoveMyOrder}
                      disabled={isSubmitting}
                      className="inline-flex items-center justify-center rounded-full border border-rose-400/30 bg-rose-400/10 px-4 py-2 text-sm font-medium text-rose-200 transition hover:border-rose-300 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Remove my order
                    </button>
                  ) : null}
                  <button
                    type="button"
                    onClick={handleConfirmOrder}
                    disabled={isSubmitting || !participantId}
                    className="inline-flex items-center justify-center rounded-full border border-sky-400/40 bg-sky-400/10 px-5 py-2.5 text-sm font-medium text-sky-200 transition hover:border-sky-300 hover:bg-sky-400/20 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting
                      ? "Saving..."
                      : currentOrder
                        ? "Update my order"
                        : "Confirm my order"}
                  </button>
                </div>
              </div>

              <div className="mt-5">
                <label
                  htmlFor="order-note"
                  className="text-sm font-medium text-slate-200"
                >
                  Order notes
                </label>
                <textarea
                  id="order-note"
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  rows={3}
                  placeholder="Optional notes like no onions, extra sauce, or drink swaps."
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-sky-400/60"
                />
              </div>
            </div>
          </section>
        ) : (
          <section className="mt-8 space-y-6">
            <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    Shared order summary
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    Use this as the collector view when it is time to place the
                    order.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handleCopySummary}
                    className="rounded-full border border-sky-400/40 bg-sky-400/10 px-4 py-2 text-sm font-medium text-sky-200 transition hover:border-sky-300 hover:bg-sky-400/20"
                  >
                    Copy summary
                  </button>
                  <a
                    href="tel:01204294014"
                    className="rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-slate-100 transition hover:border-sky-400/40 hover:text-white"
                  >
                    Call China Box
                  </a>
                </div>
              </div>

              {room.orders.length === 0 ? (
                <p className="mt-6 rounded-2xl border border-white/10 bg-white/5 px-4 py-5 text-sm text-slate-400">
                  No orders yet. Share the room link and ask everyone to confirm
                  their box.
                </p>
              ) : (
                <>
                  <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
                    <div className="flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-4">
                      <div>
                        <p className="text-sm uppercase tracking-[0.25em] text-sky-300">
                          Group receipt
                        </p>
                        <p className="mt-2 text-sm text-slate-300">
                          {room.orders.length}{" "}
                          {room.orders.length === 1 ? "person" : "people"} ·{" "}
                          {aggregateSummary.totalItems} items
                        </p>
                      </div>
                      <p className="text-2xl font-semibold text-white">
                        {formatPence(aggregateSummary.grandTotal)}
                      </p>
                    </div>

                    <div className="mt-4 space-y-3">
                      {aggregateSummary.aggregateLines.map((line) => (
                        <div
                          key={line.itemId}
                          className="flex items-start justify-between gap-4 text-sm"
                        >
                          <span className="text-slate-100">
                            {line.quantity}x {line.name}
                          </span>
                          <div className="flex items-center gap-3">
                            <span className="text-slate-300">
                              {formatPence(line.totalPence)}
                            </span>
                            {isAdminMode ? (
                              <button
                                type="button"
                                onClick={() =>
                                  handleAdminRemoveGlobalItem(line.itemId)
                                }
                                disabled={isSubmitting}
                                className="rounded-full border border-rose-400/30 bg-rose-400/10 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.12em] text-rose-200 transition hover:border-rose-300 disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                {armedAction === `remove-global:${line.itemId}`
                                  ? "Confirm"
                                  : "Remove all"}
                              </button>
                            ) : null}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          Split delivery or extras
                        </h3>
                        <p className="mt-2 text-sm text-slate-300">
                          Add any shared extra charge and split it evenly across
                          everyone in the room.
                        </p>
                      </div>

                      <div className="flex gap-3">
                        <div className="flex items-center rounded-xl border border-white/10 bg-slate-950/70 px-3">
                          <span className="text-sm text-slate-300">£</span>
                          <input
                            value={extraInput}
                            onChange={(event) => setExtraInput(event.target.value)}
                            inputMode="decimal"
                            className="w-28 bg-transparent px-2 py-3 text-right text-white outline-none"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleSaveExtra}
                          disabled={isSavingExtra}
                          className="rounded-full border border-sky-400/40 bg-sky-400/10 px-4 py-2 text-sm font-medium text-sky-200 transition hover:border-sky-300 hover:bg-sky-400/20 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {isSavingExtra ? "Saving..." : "Save extra"}
                        </button>
                      </div>
                    </div>

                    <div className="mt-5 space-y-3">
                      {splitSummary.map((line) => (
                        <div
                          key={line.participantId}
                          className="flex items-start justify-between gap-4 rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3"
                        >
                          <div>
                            <p className="font-medium text-white">{line.name}</p>
                            {line.sharePence > 0 ? (
                              <p className="mt-1 text-xs text-slate-400">
                                Food {formatPence(line.foodPence)} + extra{" "}
                                {formatPence(line.sharePence)}
                              </p>
                            ) : null}
                          </div>
                          <p className="font-medium text-sky-200">
                            {formatPence(line.owedPence)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              {room.orders.map((order) => {
                const isMine = order.participantId === participantId;

                return (
                  <article
                    key={order.participantId}
                    className="rounded-3xl border border-white/10 bg-slate-950/60 p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold text-white">
                            {order.name}
                          </h3>
                          {isMine ? (
                            <span className="rounded-full border border-sky-400/30 bg-sky-400/10 px-2 py-0.5 text-[11px] font-medium uppercase tracking-[0.18em] text-sky-200">
                              You
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-1 text-sm text-slate-400">
                          Updated{" "}
                          {new Intl.DateTimeFormat("en-GB", {
                            hour: "2-digit",
                            minute: "2-digit",
                          }).format(new Date(order.updatedAt))}
                        </p>
                      </div>
                      <p className="text-base font-medium text-sky-200">
                        {formatPence(order.totalPence)}
                      </p>
                    </div>

                    <div className="mt-4 space-y-2 text-sm text-slate-200">
                      {order.items.map((item) => (
                        <div
                          key={item.itemId}
                          className="flex items-start justify-between gap-4"
                        >
                          <span>
                            {item.quantity}x {menuItems[item.itemId]?.name ?? item.itemId}
                          </span>
                          <div className="flex items-center gap-3">
                            <span className="text-slate-400">
                              {formatPence(
                                (menuItems[item.itemId]?.pence ?? 0) * item.quantity,
                              )}
                            </span>
                            {isAdminMode ? (
                              <button
                                type="button"
                                onClick={() =>
                                  handleAdminRemovePersonItem(
                                    order.participantId,
                                    item.itemId,
                                  )
                                }
                                disabled={isSubmitting}
                                className="rounded-full border border-rose-400/30 bg-rose-400/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.12em] text-rose-200 transition hover:border-rose-300 disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                {armedAction ===
                                `remove-person-item:${order.participantId}:${item.itemId}`
                                  ? "Confirm"
                                  : "Remove"}
                              </button>
                            ) : null}
                          </div>
                        </div>
                      ))}
                    </div>

                    {isAdminMode ? (
                      <div className="mt-4">
                        <button
                          type="button"
                          onClick={() =>
                            handleAdminRemovePerson(order.participantId)
                          }
                          disabled={isSubmitting}
                          className="rounded-full border border-rose-400/30 bg-rose-400/10 px-3 py-1.5 text-xs font-medium text-rose-200 transition hover:border-rose-300 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {armedAction === `remove-person:${order.participantId}`
                            ? "Tap again to remove person"
                            : "Remove person"}
                        </button>
                      </div>
                    ) : null}

                    {order.note ? (
                      <p className="mt-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
                        {order.note}
                      </p>
                    ) : null}
                  </article>
                );
              })}
            </div>
          </section>
        )}

        <Link
          href="/"
          className="mt-10 inline-flex w-fit rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300 transition hover:border-sky-400/60 hover:text-white"
        >
          Back to dashboard
        </Link>
      </div>
    </main>
  );
}
