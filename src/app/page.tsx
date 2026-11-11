import { Suspense } from "react";
import AlbumList from "@/components/home/AlbumList";
import AlbumListSkeleton from "@/components/home/AlbumListSkeleton";

// so new albums show up without a redeploy
export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <Suspense
      fallback={<AlbumListSkeleton/>}
    >
      <AlbumList/>
    </Suspense>
  );
}
