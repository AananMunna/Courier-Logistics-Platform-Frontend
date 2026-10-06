import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-14">
      <Skeleton className="mx-auto h-9 w-64" />
      <Skeleton className="mx-auto h-12 w-full max-w-xl rounded-xl" />
      <Skeleton className="h-64 w-full rounded-3xl" />
    </div>
  );
}
