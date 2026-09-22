import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/useAuthStore';
import { useVaultStore } from '../store/useVaultStore';
import DashboardLayout from '../layouts/DashboardLayout';
import PasswordFormModal from '../components/PasswordFormModal';
import PasswordReuseCard from '../components/PasswordReuseCard';
import PasswordBreachCard from '../components/PasswordBreachCard';
import Button from '../components/ui/Button';
import Toast from '../components/ui/Toast';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import ServiceAvatar from '../components/ui/ServiceAvatar';
import { evaluatePasswordStrength } from '../utils/passwordStrength';
import { detectPasswordReuse } from '../utils/passwordReuseDetector';
import { checkPasswordBreach } from '../utils/hibpService';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Activity,
  Plus,
  Edit3,
  ChevronDown,
  ChevronUp,
  ShieldCheck
} from 'lucide-react';

export default function SecurityCenterPage() {
  const encryptionKey = useAuthStore((state) => state.encryptionKey);
  const items = useVaultStore((state) => state.items);
  const fetchVault = useVaultStore((state) => state.fetchVault);
  const loading = useVaultStore((state) => state.loading);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Security Center Audit states
  const [reuseReport, setReuseReport] = useState(null);
  const [isAnalyzingReuse, setIsAnalyzingReuse] = useState(false);

  const [hibpReport, setHibpReport] = useState(null);
  const [isCheckingHibp, setIsCheckingHibp] = useState(false);

  const [isScanning, setIsScanning] = useState(false);
  const [lastScannedTime, setLastScannedTime] = useState('2 mins ago');
  const [isWeakExpanded, setIsWeakExpanded] = useState(true);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  useEffect(() => {
    if (encryptionKey) {
      fetchVault(encryptionKey);
    }
  }, [encryptionKey, fetchVault]);

  // Compute weak credentials list
  const weakItems = useMemo(() => {
    return items.filter((i) => evaluatePasswordStrength(i.password).score < 3);
  }, [items]);

  // Run reuse checking
  useEffect(() => {
    if (!encryptionKey || items.length === 0) {
      setReuseReport(null);
      return;
    }
    let cancelled = false;
    setIsAnalyzingReuse(true);
    detectPasswordReuse(items).then((report) => {
      if (!cancelled) {
        setReuseReport(report);
        setIsAnalyzingReuse(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [items, encryptionKey]);

  // Run HIBP checks
  const runBreachCheck = useCallback(async () => {
    if (!encryptionKey || items.length === 0) return;
    setIsCheckingHibp(true);
    const results = [];
    const chunkSize = 5;

    for (let i = 0; i < items.length; i += chunkSize) {
      const chunk = items.slice(i, i + chunkSize);
      const promises = chunk.map(async (item) => {
        const res = await checkPasswordBreach(item.password);
        return {
          id: item.id,
          website: item.website,
          username: item.username,
          ...res,
        };
      });
      const chunkResults = await Promise.all(promises);
      results.push(...chunkResults);
    }

    const compromised = results.filter((r) => r.found);
    const safeCount = results.filter((r) => !r.found && !r.error).length;
    const errorCount = results.filter((r) => r.error).length;

    setHibpReport({
      compromised,
      safeCount,
      errorCount,
      totalChecked: results.length,
    });
    setIsCheckingHibp(false);
  }, [items, encryptionKey]);

  useEffect(() => {
    runBreachCheck();
  }, [runBreachCheck]);

  // Run full scan audit simulation
  const handleSecurityScan = async () => {
    setIsScanning(true);
    await runBreachCheck();
    setTimeout(() => {
      setIsScanning(false);
      setLastScannedTime('Just now');
      triggerToast('Full vault security scan completed');
    }, 1000);
  };

  const handleEdit = (item) => {
    setItemToEdit(item);
    setIsAddModalOpen(true);
  };

  const handleEditFromSummary = useCallback((accountStub) => {
    const fullItem = items.find((i) => i.id === accountStub.id);
    if (fullItem) handleEdit(fullItem);
  }, [items]);

  // Metrics Calculation using zxcvbn evaluation
  const stats = useMemo(() => {
    const total = items.length;
    const weakCount = weakItems.length;
    const strongCount = total - weakCount;

    let healthScore = 100;
    if (total > 0) {
      healthScore = Math.round((strongCount / total) * 100);
    }

    return { total, weakCount, healthScore };
  }, [items, weakItems]);

  const radius = 36;
  const strokeWidth = 7;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (stats.healthScore / 100) * circumference;

  return (
    <DashboardLayout>
      <div className="space-y-6 pb-12 font-sans">
        {/* Title Header */}
        <div className="border-b border-[var(--sv-border)] pb-5">
          <span className="text-[10px] font-bold text-[var(--sv-text-secondary)] uppercase tracking-widest font-mono">
            Security Watchtower
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[var(--sv-text-primary)] tracking-tight mt-1 font-sans">
            Security Audit Console
          </h1>
          <p className="text-xs text-[var(--sv-text-muted)] mt-0.5">
            Audit weak passwords, duplicate credentials, and data breaches via privacy-preserving k-Anonymity checks.
          </p>
        </div>

        {/* Hero Score Console */}
        <Card className="p-6 relative overflow-hidden backdrop-blur-md">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            <div className="flex-1 space-y-4 text-center md:text-left">
              <div>
                <span className="text-[10px] font-bold text-[var(--sv-text-secondary)] uppercase tracking-widest font-mono">
                  Live Posture Assessment
                </span>
                <h2 className="text-xl font-extrabold text-[var(--sv-text-primary)] tracking-tight mt-1 font-sans">
                  {stats.healthScore >= 80 ? 'Vault Security: Optimal' : stats.healthScore >= 50 ? 'Vault Security: Action Needed' : 'Vault Security: Risk Warning'}
                </h2>
                <p className="text-xs text-[var(--sv-text-muted)] mt-2 max-w-lg leading-relaxed">
                  Your Master Password derives client keys locally. We audit password entropy and breach registries without exposing unencrypted secrets.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-1">
                <Button
                  variant="secondary"
                  icon={Activity}
                  onClick={handleSecurityScan}
                  isLoading={isScanning}
                  className="text-xs py-2 px-4"
                >
                  {isScanning ? 'Scanning Vault...' : 'Run Security Audit'}
                </Button>
                <span className="text-[11px] text-[var(--sv-text-muted)] font-mono">
                  Last audit: {lastScannedTime}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-5 shrink-0 bg-[var(--sv-bg)] border border-[var(--sv-border)] p-4.5 rounded-2xl shadow-inner">
              <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
                <svg 
                  className="w-24 h-24 transform -rotate-90" 
                  viewBox="0 0 96 96"
                  role="meter"
                  aria-valuenow={stats.healthScore}
                  aria-valuemin="0"
                  aria-valuemax="100"
                >
                  <circle
                    cx="48"
                    cy="48"
                    r={radius}
                    className="stroke-[var(--sv-border-hover)]"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                  />
                  <motion.circle
                    cx="48"
                    cy="48"
                    r={radius}
                    className={
                      stats.healthScore >= 80
                        ? 'stroke-[var(--sv-accent)]'
                        : stats.healthScore >= 50
                        ? 'stroke-amber-400'
                        : 'stroke-rose-400'
                    }
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    fill="transparent"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-xl font-black text-[var(--sv-text-primary)] font-mono leading-none">{stats.healthScore}%</span>
                  <span className="text-[9px] text-[var(--sv-text-secondary)] font-mono uppercase mt-0.5">Health</span>
                </div>
              </div>

              <div className="space-y-1.5 text-left">
                <span className="text-[9px] uppercase tracking-wider text-[var(--sv-text-secondary)] font-mono font-bold block">Status</span>
                <Badge variant={stats.healthScore >= 80 ? 'success' : stats.healthScore >= 50 ? 'warning' : 'danger'}>
                  {stats.healthScore >= 80 ? 'Optimal' : stats.healthScore >= 50 ? 'Moderate' : 'Action Required'}
                </Badge>
                <div className="text-[10px] text-[var(--sv-text-muted)] font-mono mt-1">
                  Checked {stats.total} items
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Detailed Issues Lists */}
        <div className="space-y-6">
          {/* Weak Passwords Audit Card */}
          <Card className="p-5 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <h3 className="text-xs font-bold text-[var(--sv-text-secondary)] uppercase tracking-wider font-sans">
                  Weak Passwords
                </h3>
                {weakItems.length > 0 && (
                  <Badge variant="danger">{weakItems.length} flagged</Badge>
                )}
              </div>

              {weakItems.length > 0 && (
                <button
                  onClick={() => setIsWeakExpanded(!isWeakExpanded)}
                  className="text-[var(--sv-text-secondary)] hover:text-[var(--sv-text-primary)] p-1 rounded-lg hover:bg-[var(--sv-border-hover)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40"
                  aria-expanded={isWeakExpanded}
                  aria-controls="weak-passwords-list"
                >
                  {isWeakExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              )}
            </div>

            <AnimatePresence>
              {isWeakExpanded && weakItems.length > 0 && (
                <motion.div
                  id="weak-passwords-list"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden mt-4 space-y-3"
                >
                  <div className="border-t border-[var(--sv-border)] pt-3">
                    <ul className="space-y-2">
                      {weakItems.map((item) => {
                        const score = evaluatePasswordStrength(item.password).score;

                        return (
                          <li
                            key={item.id}
                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-[var(--sv-bg)] border border-[var(--sv-border)] rounded-xl"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <ServiceAvatar name={item.website} className="w-8 h-8 shrink-0 text-xs" />
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs font-bold text-[var(--sv-text-primary)] truncate">{item.website}</span>
                                  <span className="text-[10px] font-mono text-[var(--sv-text-secondary)] truncate">{item.username}</span>
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant="danger">Score: {score}/4</Badge>
                                  <span className="text-[11px] text-[var(--sv-text-muted)]">Weak entropy password</span>
                                </div>
                              </div>
                            </div>

                            <button
                              onClick={() => handleEdit(item)}
                              className="text-[var(--sv-accent)] hover:text-[var(--sv-accent-hover)] p-1.5 rounded-lg bg-[var(--sv-accent-soft)] border border-[var(--sv-accent)]/20 transition-colors shrink-0 align-self-end sm:align-self-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40"
                              title="Update Password"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {weakItems.length === 0 && (
              <div className="mt-5 flex flex-col items-center justify-center py-6 rounded-xl bg-[var(--sv-accent-soft)] border border-[var(--sv-accent)]/20 text-center">
                <CheckCircle2 className="w-9 h-9 text-[var(--sv-accent)] mb-2" />
                <p className="text-sm font-semibold text-[var(--sv-accent)]">All Passwords Strong</p>
                <p className="text-xs text-[var(--sv-text-secondary)] mt-1 max-w-xs px-4">
                  No weak passwords found. Every stored entry meets password complexity guidelines.
                </p>
              </div>
            )}
          </Card>

          {/* Reused Passwords Audit Card */}
          <PasswordReuseCard
            report={reuseReport}
            isAnalyzing={isAnalyzingReuse}
            onEdit={handleEditFromSummary}
            onOpenGenerator={() => {}}
          />

          {/* Breached Passwords Audit Card */}
          <PasswordBreachCard
            report={hibpReport}
            isChecking={isCheckingHibp}
            onEdit={handleEditFromSummary}
            onOpenGenerator={() => {}}
          />
        </div>
      </div>

      {isAddModalOpen && (
        <PasswordFormModal
          itemToEdit={itemToEdit}
          onClose={() => {
            setIsAddModalOpen(false);
            setItemToEdit(null);
          }}
        />
      )}

      {/* Copy Actions Toast Notification */}
      <Toast isVisible={!!toastMessage} message={toastMessage} type="success" />
    </DashboardLayout>
  );
}
