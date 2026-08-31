import { ProductGridSkeleton } from "@/components/ui/loading-skeleton";

export default function Loading() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-24 lg:px-8" aria-label="Loading">
      <div className="mb-8 space-y-3">
        <div className="h-4 w-40 rounded-full bg-white/[0.06]" />
        <div className="h-8 w-72 rounded-xl bg-white/[0.06]" />
      </div>
      <ProductGridSkeleton />
    </section>
  );
}
