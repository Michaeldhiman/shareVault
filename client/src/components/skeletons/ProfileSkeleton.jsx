import React from 'react';
import Skeleton from '../ui/Skeleton';

/**
 * Profile Settings Skeleton Loader
 * Mirrors exact layout dimensions of profile page form and security architecture card.
 */
export default function ProfileSkeleton() {
  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-pulse" aria-hidden="true">
      {/* Header Skeleton */}
      <div className="flex items-center gap-3 mb-6">
        <Skeleton className="h-12 w-12 rounded-2xl shrink-0" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-7 w-48 rounded-xl" />
          <Skeleton className="h-4 w-72 rounded-lg" />
        </div>
      </div>

      {/* Profile Form Card Skeleton */}
      <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-6 space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-3 w-36" />
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>
        <Skeleton className="h-10 w-32 rounded-xl mt-4" />
      </div>

      {/* Security Architecture Card Skeleton */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 space-y-3">
        <Skeleton className="h-5 w-56 rounded-lg" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
}
