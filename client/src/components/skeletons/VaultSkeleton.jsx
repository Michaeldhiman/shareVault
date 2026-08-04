import React from 'react';
import Skeleton from '../ui/Skeleton';

/**
 * Vault Page Skeleton Loader
 * Mirrors exact layout dimensions of Vault header, search control bar, and 6-card credential grid.
 */
export default function VaultSkeleton() {
  return (
    <div className="space-y-6 animate-pulse" aria-hidden="true">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-52 rounded-xl" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-10 w-36 rounded-xl shrink-0" />
      </div>

      {/* Control Bar Skeleton */}
      <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <Skeleton className="h-10 flex-1 rounded-xl" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-32 rounded-xl" />
            <Skeleton className="h-10 w-36 rounded-xl" />
          </div>
        </div>
        <div className="flex gap-2 pt-2 border-t border-slate-800/60 overflow-x-auto">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <Skeleton key={i} className="h-7 w-16 rounded-lg shrink-0" />
          ))}
        </div>
      </div>

      {/* 6-Card Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} variant="card" />
        ))}
      </div>
    </div>
  );
}
