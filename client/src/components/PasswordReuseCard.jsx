import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Sparkles, Edit3, ChevronDown, ChevronUp, Copy, CheckCircle2 } from 'lucide-react';
import Button from './ui/Button';
import ServiceAvatar from './ui/ServiceAvatar';
import Badge from './ui/Badge';

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
      <div className="bg-[var(--sv-surface)] border border-[var(--sv-border)] rounded-2xl p-5 shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-4 h-4 bg-[var(--sv-surface-elevated)] rounded" />
          <div className="w-36 h-3 bg-[var(--sv-surface-elevated)] rounded" />
        </div>
        <div className="space-y-2">
          <div className="w-full h-2.5 bg-[var(--sv-bg)] rounded" />
          <div className="w-3/4 h-2.5 bg-[var(--sv-bg)] rounded" />
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="bg-[var(--sv-surface)] border border-[var(--sv-border)] rounded-2xl p-5 shadow-xl backdrop-blur-md">
        <SectionHeader />
        <p className="text-xs text-[var(--sv-text-muted)] mt-3">Unlock vault to evaluate password reuse.</p>
      </div>
    );
  }

  if (report.totalGroups === 0) {
    return (
      <div className="bg-[var(--sv-surface)] border border-[var(--sv-border)] rounded-2xl p-5 shadow-xl backdrop-blur-md">
        <SectionHeader />
        <SummaryRow report={report} />
        <div className="mt-5 flex flex-col items-center justify-center py-6 rounded-xl bg-[var(--sv-accent-soft)] border border-[var(--sv-accent)]/20">
          <CheckCircle2 className="w-9 h-9 text-[var(--sv-accent)] mb-2" />
          <p className="text-sm font-semibold text-[var(--sv-accent)]">No Reused Passwords</p>
          <p className="text-xs text-[var(--sv-text-secondary)] mt-1 text-center max-w-xs px-4">
            Excellent! Every account uses a unique, independent password.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--sv-surface)] border border-[var(--sv-border)] rounded-2xl p-5 shadow-xl backdrop-blur-md">
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
      <h3 className="text-xs font-bold text-[var(--sv-text-secondary)] uppercase tracking-wider font-sans flex items-center gap-2">
        <Copy className="w-4 h-4 text-amber-400" />
        <span>Password Reuse Analysis</span>
      </h3>
      {count != null && count > 0 && (
        <Badge variant="warning">{count} groups detected</Badge>
      )}
    </div>
  );
}

function SummaryRow({ report }) {
  const stats = [
    { label: 'Total', value: report.totalCredentials },
    { label: 'Unique', value: report.uniquePasswords, color: 'text-emerald-400' },
    { label: 'Reused', value: report.totalGroups, color: report.totalGroups > 0 ? 'text-amber-400' : 'text-[var(--sv-text-primary)]' },
    { label: 'Affected', value: report.totalAffectedAccounts, color: report.totalAffectedAccounts > 0 ? 'text-rose-400' : 'text-[var(--sv-text-primary)]' },
  ];

  return (
    <div className="grid grid-cols-4 gap-2 mt-4">
      {stats.map(({ label, value, color }) => (
        <div key={label} className="bg-[var(--sv-surface-elevated)] border border-[var(--sv-border)] rounded-xl p-2 text-center shadow-inner">
          <p className={`text-base font-extrabold font-mono ${color}`}>{value}</p>
          <p className="text-[9px] text-[var(--sv-text-muted)] leading-tight mt-0.5">{label}</p>
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
      className="bg-[var(--sv-surface-elevated)] border border-[var(--sv-border)] rounded-xl overflow-hidden shadow-sm"
    >
      {/* Header Toggle */}
      <button
        onClick={onToggle}
        aria-expanded={isExpanded}
        aria-controls={`reuse-group-${index}`}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-[var(--sv-border-hover)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40"
      >
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400 shrink-0">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-semibold text-[var(--sv-text-primary)]">
              {group.accounts.map((a) => a.website).join(', ')}
            </span>
            <p className="text-[10px] text-[var(--sv-text-secondary)] mt-0.5">
              Used by {group.accounts.length} accounts
            </p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-[var(--sv-text-secondary)] shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-[var(--sv-text-secondary)] shrink-0" />
        )}
      </button>

      {/* Expanded Account List */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            id={`reuse-group-${index}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1.5 border-t border-[var(--sv-border)] space-y-3">
              <p className="text-[9px] text-[var(--sv-text-secondary)] uppercase tracking-wider font-semibold">
                Affected Credentials
              </p>
              
              <ul className="space-y-2">
                {group.accounts.map((account) => {
                  return (
                    <li
                      key={account.id}
                      className="flex items-center justify-between bg-[var(--sv-surface)] border border-[var(--sv-border)] rounded-xl px-3 py-2.5 shadow-sm"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <ServiceAvatar name={account.website} className="w-8 h-8 text-xs shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-[var(--sv-text-primary)] truncate">{account.website}</p>
                          <p className="text-[10px] text-[var(--sv-text-secondary)] font-mono truncate">{account.username}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => onEdit(account)}
                        className="text-[var(--sv-accent)] hover:text-[var(--sv-accent-hover)] p-2 rounded-lg bg-[var(--sv-accent-soft)] border border-[var(--sv-accent)]/20 transition-colors shrink-0"
                        title={`Edit ${account.website}`}
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </li>
                  );
                })}
              </ul>

              {/* Actions & Recommendation */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[var(--sv-border)]">
                <p className="text-[10px] text-[var(--sv-text-secondary)]">
                  <span className="text-amber-400 font-semibold">Recommendation: </span>
                  Replace reuse with unique passwords.
                </p>
                <Button
                  size="sm"
                  variant="ghost"
                  icon={Sparkles}
                  onClick={onOpenGenerator}
                  className="text-[var(--sv-accent)] hover:text-[var(--sv-accent-hover)] hover:bg-[var(--sv-accent-soft)] shrink-0"
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
