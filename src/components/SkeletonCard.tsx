import { Skeleton } from '@/components/ui/skeleton';

const SkeletonCard = () => (
    <div className="rounded-xl border p-4 shadow-sm space-y-4 w-full">
        <Skeleton className="h-[180px] w-[300px] rounded-md" />
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-20" />
    </div>
);

export default SkeletonCard;
