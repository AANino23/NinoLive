import { redirect } from "next/navigation";
import { createChinaBoxRoom } from "@/lib/china-box-rooms";

export const dynamic = "force-dynamic";

export default async function ChinaBoxEntryPage() {
  const room = await createChinaBoxRoom();
  redirect(`/china-box/${room.roomId}`);
}
