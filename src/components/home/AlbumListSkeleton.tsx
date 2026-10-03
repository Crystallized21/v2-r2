export default function AlbumListSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      {[...Array(5)].map(( _, i ) => (
        <div key={i} className="py-2">
          <div className="h-8 bg-gray-200 rounded animate-pulse w-48"></div>
        </div>
      ))}
    </div>
  );
}