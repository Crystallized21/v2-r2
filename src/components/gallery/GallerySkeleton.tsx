const TILE_HEIGHTS = ["h-48", "h-64", "h-56", "h-72", "h-52", "h-60", "h-48", "h-64"];

// Shown while the photo URLs are being signed, the title is already on screen by then
export default function GallerySkeleton() {
  return (
    <div
      className="mt-16 animate-pulse columns-1 gap-4 sm:columns-2 md:columns-3 xl:columns-4"
      aria-busy="true"
      aria-label="Loading photos"
    >
      {TILE_HEIGHTS.map((height, index) => (
        <div key={index} className={`mb-4 break-inside-avoid bg-muted ${height}`} />
      ))}
    </div>
  );
}
