import { redirect } from "next/navigation";
import { createChinaBoxRoomId } from "@/lib/china-box-rooms";

export const dynamic = "force-dynamic";

export default function ChinaBoxEntryPage() {
  redirect(`/china-box/${createChinaBoxRoomId()}`);
}
