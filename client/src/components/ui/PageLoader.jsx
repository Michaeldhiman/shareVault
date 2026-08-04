import React from 'react';
import { Shield, Loader2 } from 'lucide-react';

/**
 * Global Page Loading Fallback for React.lazy Suspense code-splitting.
 */
export default function PageLoader() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shadow-lg shadow-blue-500/10 mb-4 animate-pulse">
        <Shield className="w-6 h-6" />
      </div>
      <div className="flex items-center gap-2 text-xs font-medium text-slate-400 font-mono">
        <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
        <span>Loading SecureVault Module...</span>
      </div>
    </div>
  );
}
