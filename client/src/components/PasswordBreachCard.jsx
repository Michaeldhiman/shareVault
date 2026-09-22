import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, CheckCircle2, AlertTriangle, Sparkles, Edit3, ChevronDown, ChevronUp } from 'lucide-react';
import Button from './ui/Button';
import ServiceAvatar from './ui/ServiceAvatar';
import Badge from './ui/Badge';

/**
 * PasswordBreachCard
 *
 * Renders HIBP password breach checking summary and lists compromised accounts.
 * Zero plaintext passwords are ever shown in the UI.
 */
export default function PasswordBreachCard({ report, isChecking, onEdit, onOpenGenerator }) {
  const [isExpanded, setIsExpanded] = useState(true);

  if (isChecking) {
    return (
      <div className="bg-[var(--sv-surface)] border border-[var(--sv-border)] rounded-2xl p-5 shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-4 h-4 bg-[var(--sv-surface-elevated)] rounded" />
          <div className="w-44 h-3 bg-[var(--sv-surface-elevated)] rounded" />
        </div>
        <div className="space-y-2">
          <div className="w-full h-2.5 bg-[var(--sv-bg)] rounded" />
          <div className="w-5/6 h-2.5 bg-[var(--sv-bg)] rounded" />
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="bg-[var(--sv-surface)] border border-[var(--sv-border)] rounded-2xl p-5 shadow-xl backdrop-blur-md">
        <CardHeader />
        <p className="text-xs text-[var(--sv-text-muted)] mt-3">Unlock vault to run breach check.</p>
      </div>
    );
  }

  const { compromised, safeCount, errorCount, totalChecked } = report;

  return (
    <div className="bg-[var(--sv-surface)] border border-[var(--sv-border)] rounded-2xl p-5 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between">
        <CardHeader count={compromised.length} />
        {compromised.length > 0 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-[var(--sv-text-secondary)] hover:text-[var(--sv-text-primary)] p-1 rounded-lg hover:bg-[var(--sv-border-hover)] transition-colors"
            aria-label={isExpanded ? 'Collapse breached items' : 'Expand breached items'}
            aria-expanded={isExpanded}
            aria-controls="breach-list"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-4 gap-2 mt-4">
        <StatBox label="Checked" value={totalChecked} color="text-[var(--sv-text-primary)]" />
        <StatBox label="Safe" value={safeCount} color="text-emerald-400" />
        <StatBox label="Compromised" value={compromised.length} color={compromised.length > 0 ? 'text-rose-400 font-bold' : 'text-[var(--sv-text-primary)]'} />
        <StatBox label="Check Failed" value={errorCount} color={errorCount > 0 ? 'text-amber-400' : 'text-[var(--sv-text-muted)]'} />
      </div>

      {/* Warning Alert if errors occurred during check */}
      {errorCount > 0 && (
        <div className="mt-3 text-[10px] text-amber-400 bg-amber-500/5 border border-amber-500/10 px-3 py-2 rounded-lg flex items-center gap-1.5 shadow-sm">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-400" />
          <span>Could not check {errorCount} credential{errorCount > 1 ? 's' : ''}. Check internet connection.</span>
        </div>
      )}

      {/* Compromised Credentials List */}
      <AnimatePresence>
        {isExpanded && compromised.length > 0 && (
          <motion.div
            id="breach-list"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden mt-4 space-y-3"
          >
            <div className="border-t border-[var(--sv-border)] pt-3">
              <p className="text-[9px] font-semibold text-[var(--sv-text-muted)] uppercase tracking-wider mb-2.5">
                Leaked Credentials Details
              </p>
              
              <ul className="space-y-2">
                {compromised.map((item, idx) => {
                  return (
                    <motion.li
                      key={item.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.04 }}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-[var(--sv-surface-elevated)] border border-rose-500/15 rounded-xl shadow-sm hover:border-rose-500/25 transition-all"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <ServiceAvatar name={item.website} className="w-9 h-9 text-xs shrink-0" />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-[var(--sv-text-primary)] truncate">{item.website}</span>
                            <span className="text-[9px] font-mono text-[var(--sv-text-secondary)] truncate">{item.username}</span>
                          </div>
                          <p className="text-[10px] text-rose-400 mt-1 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3 text-rose-400" />
                            <span>Found in <span className="font-semibold font-mono">{item.breachCount.toLocaleString()}</span> known breaches.</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        <Button
                          size="sm"
                          variant="ghost"
                          icon={Sparkles}
                          onClick={onOpenGenerator}
                          className="text-[var(--sv-accent)] hover:text-[var(--sv-accent-hover)] hover:bg-[var(--sv-accent-soft)]"
                        >
                          Generate
                        </Button>
                        <button
                          onClick={() => onEdit(item)}
                          className="text-[var(--sv-accent)] hover:text-[var(--sv-accent-hover)] p-2 rounded-lg bg-[var(--sv-accent-soft)] border border-[var(--sv-accent)]/20 transition-colors"
                          title="Update Password"
                          aria-label={`Update password for ${item.website}`}
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </motion.li>
                  );
                })}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* No Compromised Passwords Success State */}
      {compromised.length === 0 && (
        <div className="mt-5 flex flex-col items-center justify-center py-6 rounded-xl bg-[var(--sv-accent-soft)] border border-[var(--sv-accent)]/20 text-center">
          <CheckCircle2 className="w-9 h-9 text-[var(--sv-accent)] mb-2" />
          <p className="text-sm font-semibold text-[var(--sv-accent)]">All Passwords Safe</p>
          <p className="text-xs text-[var(--sv-text-secondary)] mt-1 max-w-xs px-4">
            Excellent! Checked passwords do not appear in any known public breach databases.
          </p>
        </div>
      )}
    </div>
  );
}

function CardHeader({ count }) {
  return (
    <div className="flex items-center gap-2">
      <ShieldAlert className="w-4 h-4 text-rose-400" />
      <h3 className="text-xs font-bold text-[var(--sv-text-secondary)] uppercase tracking-wider font-sans">
        Have I Been Pwned checks
      </h3>
      {count != null && count > 0 && (
        <Badge variant="danger">{count} compromised</Badge>
      )}
    </div>
  );
}

function StatBox({ label, value, color }) {
  return (
    <div className="bg-[var(--sv-surface-elevated)] border border-[var(--sv-border)] rounded-xl p-2 text-center shadow-inner">
      <p className={`text-base font-extrabold font-mono ${color}`}>{value}</p>
      <p className="text-[9px] text-[var(--sv-text-muted)] leading-tight mt-0.5">{label}</p>
    </div>
  );
}
