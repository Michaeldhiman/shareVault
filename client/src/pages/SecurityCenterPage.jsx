import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/useAuthStore';
import { useVaultStore } from '../store/useVaultStore';
import DashboardLayout from '../layouts/DashboardLayout';
import PasswordFormModal from '../components/PasswordFormModal';
import PasswordReuseCard from '../components/PasswordReuseCard';
import PasswordBreachCard from '../components/PasswordBreachCard';
import UnlockVaultModal from '../components/UnlockVaultModal';
import Button from '../components/ui/Button';
import Toast from '../components/ui/Toast';
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

const getWebsiteAvatar = (name) => {
  const cleanName = name ? name.trim().toUpperCase() : 'W';
  const initial = cleanName.charAt(0);

  const colors = [
    'bg-blue-500/10 text-blue-400 border-blue-500/20',
    'bg-purple-500/10 text-purple-400 border-purple-500/20',
    'bg-amber-500/10 text-amber-400 border-amber-500/20',
    'bg-rose-500/10 text-rose-400 border-rose-500/20',
    'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  ];

  let hash = 0;
  for (let i = 0; i < cleanName.length; i++) {
    hash = cleanName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colorIndex = Math.abs(hash) % colors.length;

  return { initial, classes: colors[colorIndex] };
};

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
      {/* Session Unlock Modal */}
      {!encryptionKey && <UnlockVaultModal />}

      <div className="space-y-6 pb-12 font-sans">
        {/* Title Header */}
        <div className="border-b border-white/[0.07] pb-5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
            Security Watchtower
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mt-1 font-heading">
            Security Audit Console
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Audit weak passwords, duplicate credentials, and data breaches via privacy-preserving k-Anonymity checks.
          </p>
        </div>

        {/* Hero Score Console */}
        <div className="bg-[#12141C] border border-white/[0.07] rounded-2xl p-6 shadow-xl relative overflow-hidden backdrop-blur-md">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            <div className="flex-1 space-y-4 text-center md:text-left">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                  Live Posture Assessment
                </span>
                <h2 className="text-xl font-extrabold text-white tracking-tight mt-1 font-heading">
                  {stats.healthScore >= 80 ? 'Vault Security: Optimal' : stats.healthScore >= 50 ? 'Vault Security: Action Needed' : 'Vault Security: Risk Warning'}
                </h2>
                <p className="text-xs text-slate-400 mt-2 max-w-lg leading-relaxed">
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
                <span className="text-[11px] text-slate-400 font-mono">
                  Last audit: {lastScannedTime}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-5 shrink-0 bg-[#0B0C10] border border-white/[0.08] p-4.5 rounded-2xl shadow-inner">
              <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 96 96">
                  <circle
                    cx="48"
                    cy="48"
                    r={radius}
                    className="stroke-white/[0.08]"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                  />
                  <motion.circle
                    cx="48"
                    cy="48"
                    r={radius}
                    className={
                      stats.healthScore >= 80
                        ? 'stroke-emerald-400'
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
                  <span className="text-xl font-black text-white font-mono leading-none">{stats.healthScore}%</span>
                  <span className="text-[9px] text-slate-400 font-mono uppercase mt-0.5">Health</span>
                </div>
              </div>

              <div className="space-y-1.5 text-left">
                <span className="text-[9px] uppercase tracking-wider text-slate-400 font-mono font-bold block">Status</span>
                <span
                  className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded border ${
                    stats.healthScore >= 80
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : stats.healthScore >= 50
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                  }`}
                >
                  {stats.healthScore >= 80 ? 'Optimal' : stats.healthScore >= 50 ? 'Moderate' : 'Action Required'}
                </span>
                <div className="text-[10px] text-slate-400 font-mono mt-1">
                  Checked {stats.total} items
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Issues Lists */}
        <div className="space-y-6">
          {/* Weak Passwords Audit Card */}
          <div className="bg-[#12141C] border border-white/[0.07] rounded-2xl p-5 shadow-xl backdrop-blur-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-heading">
                  Weak Passwords
                </h3>
                {weakItems.length > 0 && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 font-mono">
                    {weakItems.length} flagged
                  </span>
                )}
              </div>

              {weakItems.length > 0 && (
                <button
                  onClick={() => setIsWeakExpanded(!isWeakExpanded)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/[0.06] transition-colors"
                >
                  {isWeakExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              )}
            </div>

            <AnimatePresence>
              {isWeakExpanded && weakItems.length > 0 && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden mt-4 space-y-3"
                >
                  <div className="border-t border-white/[0.06] pt-3">
                    <ul className="space-y-2">
                      {weakItems.map((item) => {
                        const avatar = getWebsiteAvatar(item.website);
                        const score = evaluatePasswordStrength(item.password).score;

                        return (
                          <li
                            key={item.id}
                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-[#0B0C10] border border-white/[0.06] rounded-xl"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className={`w-8 h-8 rounded-lg border flex items-center justify-center font-bold text-xs shrink-0 ${avatar.classes}`}>
                                {avatar.initial}
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs font-bold text-slate-200 truncate">{item.website}</span>
                                  <span className="text-[10px] font-mono text-slate-400 truncate">{item.username}</span>
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-[9px] text-rose-400 bg-rose-500/10 border border-rose-500/20 px-1.5 py-0.5 rounded font-mono">
                                    Score: {score}/4
                                  </span>
                                  <span className="text-[11px] text-slate-400">Weak entropy password</span>
                                </div>
                              </div>
                            </div>

                            <button
                              onClick={() => handleEdit(item)}
                              className="text-blue-400 hover:text-blue-300 p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 transition-colors shrink-0 align-self-end sm:align-self-center"
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
              <div className="mt-5 flex flex-col items-center justify-center py-6 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-center">
                <CheckCircle2 className="w-9 h-9 text-emerald-400 mb-2" />
                <p className="text-sm font-semibold text-emerald-300">All Passwords Strong</p>
                <p className="text-xs text-slate-400 mt-1 max-w-xs px-4">
                  No weak passwords found. Every stored entry meets password complexity guidelines.
                </p>
              </div>
            )}
          </div>

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
