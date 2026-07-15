import { chinaBoxMenu } from "@/lib/china-box-menu";
import { isPersistentStorageConfigured } from "@/lib/blob-storage";
import { getChinaBoxRoomOrDefault } from "@/lib/china-box-rooms";
import { ChinaBoxRoomView } from "./china-box-room";

type ChinaBoxRoomPageProps = {
  params: Promise<{ roomId: string }>;
};

export const dynamic = "force-dynamic";

export default async function ChinaBoxRoomPage({
  params,
}: ChinaBoxRoomPageProps) {
  const { roomId } = await params;
  const room = await getChinaBoxRoomOrDefault(roomId);

  return (
    <ChinaBoxRoomView
      initialRoom={room}
      menu={chinaBoxMenu}
      storageConfigured={isPersistentStorageConfigured()}
    />
  );
}
