import React from 'react';
import { ShieldCheck, Loader2 } from 'lucide-react';

/**
 * Full-Screen Page Loader
 * Used as Suspense fallback during route lazy-loading.
 */
export default function PageLoader() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4 font-sans"
      style={{ backgroundColor: 'var(--sv-bg)' }}
      role="status"
      aria-live="polite"
    >
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 animate-pulse"
        style={{
          backgroundColor: 'var(--sv-accent-soft)',
          border: '1px solid var(--sv-accent-border, rgba(16,185,129,0.25))',
          color: 'var(--sv-accent)',
        }}
      >
        <ShieldCheck className="w-6 h-6" />
      </div>
      <div className="flex items-center gap-2 text-xs font-medium font-mono" style={{ color: 'var(--sv-text-muted)' }}>
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
        <span>Loading SecureVault...</span>
      </div>
    </div>
  );
}
