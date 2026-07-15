import { redirect } from "next/navigation";
import { DEFAULT_CHINA_BOX_ROOM_ID } from "@/lib/china-box-rooms";

export const dynamic = "force-dynamic";

export default function ChinaBoxEntryPage() {
  redirect(`/china-box/${DEFAULT_CHINA_BOX_ROOM_ID}`);
}
