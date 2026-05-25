type SkeletonProps = {
    className?: string;
};

function Skeleton({ className = "" }: SkeletonProps) {
    return (
        <div
            className={`animate-pulse rounded-2xl bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 ${className}`}
        />
    );
}

export default Skeleton;