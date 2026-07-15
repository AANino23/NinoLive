import { chinaBoxMenu } from "@/lib/china-box-menu";
import { ensureChinaBoxRoom } from "@/lib/china-box-rooms";
import { ChinaBoxRoomView } from "./china-box-room";

type ChinaBoxRoomPageProps = {
  params: Promise<{ roomId: string }>;
};

export const dynamic = "force-dynamic";

export default async function ChinaBoxRoomPage({
  params,
}: ChinaBoxRoomPageProps) {
  const { roomId } = await params;
  const room = await ensureChinaBoxRoom(roomId);

  return <ChinaBoxRoomView initialRoom={room} menu={chinaBoxMenu} />;
}
