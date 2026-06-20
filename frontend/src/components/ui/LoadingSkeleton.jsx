export default function LoadingSkeleton({ className = "" }) {
  return (
    <div className={`animate-pulse bg-slate-200 rounded ${className}`}></div>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <LoadingSkeleton className="h-4 w-24 mb-4" />
      <LoadingSkeleton className="h-8 w-16" />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200">
        <LoadingSkeleton className="h-6 w-32" />
      </div>
      <div className="divide-y divide-slate-200">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="px-6 py-4 flex gap-4">
            <LoadingSkeleton className="h-4 flex-1" />
            <LoadingSkeleton className="h-4 flex-1" />
            <LoadingSkeleton className="h-4 flex-1" />
            <LoadingSkeleton className="h-4 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}
