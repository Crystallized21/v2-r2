import NameHeader from "@/components/home/NameHeader";
import { Suspense } from "react";
import AlbumList from "@/components/home/AlbumList";
import AlbumListSkeleton from "@/components/home/AlbumListSkeleton";

export default function Home() {
  return (
    <div className="mx-auto bg-background max-w-7xl px-4 py-8">
      <NameHeader/>
      <Suspense
        fallback={<AlbumListSkeleton/>}
      >
        <AlbumList/>
      </Suspense>
    </div>
  );
}
