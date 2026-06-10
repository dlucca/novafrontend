import { Skeleton } from "@/components/ui/Skeleton";

export default function TiendaLoading() {
  return (
    <main className="min-h-screen bg-[#F8F0E5] px-6 pt-32 pb-24">
      <div className="mx-auto max-w-6xl">
        {/* Header skeleton */}
        <div className="text-center mb-12">
          <Skeleton className="h-10 w-64 mx-auto mb-4" />
          <Skeleton className="h-5 w-96 mx-auto" />
        </div>
        {/* Product grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-white/85 rounded-[28px] overflow-hidden border border-[#E8D7BF] shadow-[0_4px_20px_rgba(0,0,0,0.05)]"
            >
              <Skeleton className="h-48 w-full rounded-none" />
              <div className="p-6 flex flex-col gap-3">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-36" />
                <div className="flex gap-2 mt-2">
                  <Skeleton className="h-7 w-20 rounded-full" />
                  <Skeleton className="h-7 w-20 rounded-full" />
                </div>
                <Skeleton className="h-8 w-28 mt-3" />
                <Skeleton className="h-12 w-full rounded-xl mt-2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
