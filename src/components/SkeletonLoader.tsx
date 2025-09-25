'use client'

export function SkeletonLoader({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="rounded-xl border border-gray-800 p-4 lg:p-6 animate-pulse"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-800 rounded" />
              <div className="w-16 h-4 bg-gray-800 rounded" />
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-800 rounded-lg" />
              <div className="w-8 h-8 bg-gray-800 rounded-lg" />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="h-4 bg-gray-800 rounded w-full" />
            <div className="h-4 bg-gray-800 rounded w-5/6" />
            <div className="h-4 bg-gray-800 rounded w-4/6" />
          </div>
          
          <div className="mt-4 pt-3 border-t border-gray-800 flex items-center justify-between">
            <div className="w-24 h-3 bg-gray-800 rounded" />
            <div className="w-16 h-3 bg-gray-800 rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}