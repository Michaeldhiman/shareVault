import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Sparkles, Edit3, ChevronDown, ChevronUp, Copy, CheckCircle2 } from 'lucide-react';
import Button from './ui/Button';

/**
 * Get generated initials and background colors based on name to simulate service logos.
 */
const getWebsiteAvatar = (name) => {
  const cleanName = name ? name.trim().toUpperCase() : 'W';
  const initial = cleanName.charAt(0);
  
  // Set up premium muted background colors
  const colors = [
    'bg-blue-600/10 text-blue-400 border-blue-500/20',
    'bg-purple-600/10 text-purple-400 border-purple-500/20',
    'bg-amber-600/10 text-amber-400 border-amber-500/20',
    'bg-rose-600/10 text-rose-400 border-rose-500/20',
    'bg-emerald-600/10 text-emerald-400 border-emerald-500/20',
    'bg-cyan-600/10 text-cyan-400 border-cyan-500/20',
  ];
  
  // Simple deterministic hash
  let hash = 0;
  for (let i = 0; i < cleanName.length; i++) {
    hash = cleanName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colorIndex = Math.abs(hash) % colors.length;
  
  return { initial, classes: colors[colorIndex] };
};

/**
 * PasswordReuseCard
 *
 * Displays password reuse analysis results.
 * No plaintext passwords are ever rendered.
 */
export default function PasswordReuseCard({ report, isAnalyzing, onEdit, onOpenGenerator }) {
  const [expandedGroups, setExpandedGroups] = useState(new Set([0])); // Keep first item open

  const toggleGroup = (idx) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return next;
    });
  };

  if (isAnalyzing) {
    return (
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 shadow-xl backdrop-blur-md animate-pulse">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-4 h-4 bg-slate-800 rounded" />
          <div className="w-36 h-3 bg-slate-800 rounded" />
        </div>
        <div className="space-y-2">
          <div className="w-full h-2.5 bg-slate-900 rounded" />
          <div className="w-3/4 h-2.5 bg-slate-900 rounded" />
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-5 shadow-xl backdrop-blur-md">
        <SectionHeader />
        <p className="text-xs text-slate-500 mt-3">Unlock vault to evaluate password reuse.</p>
      </div>
    );
  }

  if (report.totalGroups === 0) {
    return (
      <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-5 shadow-xl backdrop-blur-md">
        <SectionHeader />
        <SummaryRow report={report} />
        <div className="mt-5 flex flex-col items-center justify-center py-6 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
          <CheckCircle2 className="w-9 h-9 text-emerald-400 mb-2" />
          <p className="text-sm font-semibold text-emerald-300">No Reused Passwords</p>
          <p className="text-xs text-slate-400 mt-1 text-center max-w-xs px-4">
            Excellent! Every account uses a unique, independent password.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-5 shadow-xl backdrop-blur-md">
      <SectionHeader count={report.totalGroups} />
      <SummaryRow report={report} />

      {/* Warnings */}
      <div className="mt-4 flex items-start gap-2.5 px-3.5 py-3 rounded-xl bg-amber-500/5 border border-amber-500/10 text-amber-400">
        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
        <p className="text-xs leading-relaxed">
          <span className="font-semibold">{report.totalAffectedAccounts} accounts</span> share duplicate passwords. Ensure you rotate them to protect against credential stuffing.
        </p>
      </div>

      {/* Reuse Lists */}
      <ul className="mt-4 space-y-3">
        <AnimatePresence>
          {report.reusedGroups.map((group, idx) => (
            <ReuseGroupItem
              key={group.hash}
              group={group}
              index={idx}
              isExpanded={expandedGroups.has(idx)}
              onToggle={() => toggleGroup(idx)}
              onEdit={onEdit}
              onOpenGenerator={onOpenGenerator}
            />
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}

function SectionHeader({ count }) {
  return (
    <div className="flex items-center justify-between mb-1">
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-heading flex items-center gap-2">
        <Copy className="w-4 h-4 text-amber-400" />
        <span>Password Reuse Analysis</span>
      </h3>
      {count != null && count > 0 && (
        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
          {count} group{count > 1 ? 's' : ''} detected
        </span>
      )}
    </div>
  );
}

function SummaryRow({ report }) {
  const stats = [
    { label: 'Total', value: report.totalCredentials },
    { label: 'Unique', value: report.uniquePasswords, color: 'text-emerald-400' },
    { label: 'Reused', value: report.totalGroups, color: report.totalGroups > 0 ? 'text-amber-400' : 'text-slate-300' },
    { label: 'Affected', value: report.totalAffectedAccounts, color: report.totalAffectedAccounts > 0 ? 'text-rose-400' : 'text-slate-300' },
  ];

  return (
    <div className="grid grid-cols-4 gap-2 mt-4">
      {stats.map(({ label, value, color }) => (
        <div key={label} className="bg-slate-950/60 border border-slate-800/60 rounded-xl p-2 text-center shadow-inner">
          <p className={`text-base font-extrabold font-mono ${color}`}>{value}</p>
          <p className="text-[9px] text-slate-500 leading-tight mt-0.5">{label}</p>
        </div>
      ))}
    </div>
  );
}

function ReuseGroupItem({ group, index, isExpanded, onToggle, onEdit, onOpenGenerator }) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="bg-slate-950/40 border border-slate-800/60 rounded-xl overflow-hidden shadow-sm"
    >
      {/* Header Toggle */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-slate-900/20 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400 shrink-0">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-200">
              {group.accounts.map((a) => a.website).join(', ')}
            </span>
            <p className="text-[10px] text-slate-500 mt-0.5">
              Used by {group.accounts.length} accounts
            </p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
        )}
      </button>

      {/* Expanded Account List */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1.5 border-t border-slate-800/60 space-y-3">
              <p className="text-[9px] text-slate-500 uppercase tracking-wider font-semibold">
                Affected Credentials
              </p>
              
              <ul className="space-y-2">
                {group.accounts.map((account) => {
                  const avatar = getWebsiteAvatar(account.website);
                  return (
                    <li
                      key={account.id}
                      className="flex items-center justify-between bg-slate-900/60 border border-slate-850 rounded-xl px-3 py-2.5 shadow-sm"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Generated initial logo */}
                        <div className={`w-8 h-8 rounded-lg border flex items-center justify-center font-bold text-xs shrink-0 ${avatar.classes}`}>
                          {avatar.initial}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-200 truncate">{account.website}</p>
                          <p className="text-[10px] text-slate-400 font-mono truncate">{account.username}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => onEdit(account)}
                        className="text-blue-400 hover:text-blue-300 p-2 rounded-lg bg-blue-500/5 hover:bg-blue-500/15 border border-blue-500/10 transition-colors shrink-0"
                        title={`Edit ${account.website}`}
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </li>
                  );
                })}
              </ul>

              {/* Actions & Recommendation */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-800/60">
                <p className="text-[10px] text-slate-400">
                  <span className="text-amber-400 font-semibold">Recommendation: </span>
                  Replace reuse with unique passwords.
                </p>
                <Button
                  size="sm"
                  variant="ghost"
                  icon={Sparkles}
                  onClick={onOpenGenerator}
                  className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 shrink-0"
                >
                  Generate Unique Password
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  );
}
