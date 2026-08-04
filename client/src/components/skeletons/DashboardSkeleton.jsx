import React from 'react';
import Skeleton from '../ui/Skeleton';

/**
 * Dashboard Page Skeleton Loader
 * Mirrors exact layout dimensions of Dashboard hero banner, 4 stat cards, category grid, and favorite credentials.
 */
export default function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse" aria-hidden="true">
      {/* Welcome Banner Skeleton */}
      <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3 flex-1">
          <Skeleton className="h-5 w-44 rounded-full" />
          <Skeleton className="h-8 w-64 rounded-xl" />
          <Skeleton className="h-4 w-full max-w-lg rounded-lg" />
        </div>
        <Skeleton className="h-10 w-36 rounded-xl shrink-0" />
      </div>

      {/* Security Health & Metrics Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Health Score Card Skeleton */}
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 space-y-4">
          <div className="flex justify-between items-center">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-2.5 w-full rounded-full" />
          <Skeleton className="h-3 w-48" />
        </div>

        {/* 4 Stat Boxes Skeleton */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-slate-900/80 border border-slate-800/80 p-5 rounded-2xl space-y-3">
              <div className="flex justify-between items-center">
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-5 w-5 rounded-lg" />
              </div>
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-2.5 w-32" />
            </div>
          ))}
        </div>
      </div>

      {/* Category Distribution Grid Skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-4 w-40" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-3.5 space-y-2 text-center">
              <Skeleton className="h-4 w-16 mx-auto rounded-full" />
              <Skeleton className="h-6 w-8 mx-auto" />
            </div>
          ))}
        </div>
      </div>

      {/* Favorite Cards Grid Skeleton */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-5 w-44" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} variant="card" />
          ))}
        </div>
      </div>
    </div>
  );
}
