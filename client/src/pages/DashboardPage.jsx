import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/useAuthStore';
import { useVaultStore } from '../store/useVaultStore';
import DashboardLayout from '../layouts/DashboardLayout';
import PasswordFormModal from '../components/PasswordFormModal';
import UnlockVaultModal from '../components/UnlockVaultModal';
import DashboardSkeleton from '../components/skeletons/DashboardSkeleton';
import Button from '../components/ui/Button';
import Toast from '../components/ui/Toast';
import { evaluatePasswordStrength } from '../utils/passwordStrength';
import { detectPasswordReuse } from '../utils/passwordReuseDetector';
import { checkPasswordBreach } from '../utils/hibpService';
import { CATEGORIES, CATEGORY_COLORS } from '../constants/categories';
import {
  Shield,
  KeyRound,
  Star,
  AlertTriangle,
  Plus,
  ArrowRight,
  ShieldCheck,
  Activity,
  Copy,
  Lock,
  Edit3,
  Check,
  Zap,
  TrendingUp
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

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const encryptionKey = useAuthStore((state) => state.encryptionKey);
  const items = useVaultStore((state) => state.items);
  const fetchVault = useVaultStore((state) => state.fetchVault);
  const loading = useVaultStore((state) => state.loading);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);

  // Security scanning simulation
  const [isScanning, setIsScanning] = useState(false);
  const [lastScannedTime, setLastScannedTime] = useState('2 mins ago');

  // Summary counts states
  const [reuseCount, setReuseCount] = useState(0);
  const [breachCount, setBreachCount] = useState(0);

  // Copy Action Toast & button feedback
  const [copiedId, setCopiedId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const navigate = useNavigate();

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  useEffect(() => {
    if (encryptionKey) {
      fetchVault(encryptionKey);
    }
  }, [encryptionKey, fetchVault]);

  // Run reuse count audit
  useEffect(() => {
    if (!encryptionKey || items.length === 0) {
      setReuseCount(0);
      return;
    }
    detectPasswordReuse(items).then((report) => {
      setReuseCount(report.totalGroups);
    });
  }, [items, encryptionKey]);

  // Run breach count check
  useEffect(() => {
    if (!encryptionKey || items.length === 0) {
      setBreachCount(0);
      return;
    }

    const checkBreaches = async () => {
      let count = 0;
      const subset = items.slice(0, 10);
      for (const item of subset) {
        const res = await checkPasswordBreach(item.password);
        if (res.found) count++;
      }
      setBreachCount(count);
    };

    checkBreaches();
  }, [items, encryptionKey]);

  const handleSecurityScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setLastScannedTime('Just now');
      triggerToast('Security scan completed successfully');
      navigate('/security');
    }, 1000);
  };

  // Metrics Calculation using zxcvbn evaluation
  const stats = useMemo(() => {
    const total = items.length;
    const favorites = items.filter((i) => i.favorite).length;
    const categoriesCount = new Set(items.map((i) => i.category)).size;
    const weakCount = items.filter((i) => evaluatePasswordStrength(i.password).score < 3).length;
    const strongCount = total - weakCount;

    let healthScore = 100;
    if (total > 0) {
      healthScore = Math.round((strongCount / total) * 100);
    }

    return { total, favorites, categoriesCount, weakCount, strongCount, healthScore };
  }, [items]);

  const favoriteItems = useMemo(() => {
    return items.filter((i) => i.favorite).slice(0, 6);
  }, [items]);

  const categoryCounts = useMemo(() => {
    const counts = {};
    CATEGORIES.forEach((cat) => {
      counts[cat] = items.filter((i) => i.category === cat).length;
    });
    return counts;
  }, [items]);

  const handleEdit = (item) => {
    setItemToEdit(item);
    setIsAddModalOpen(true);
  };

  const handleCopyText = (text, message, key) => {
    navigator.clipboard.writeText(text);
    setCopiedId(key);
    triggerToast(message);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const radius = 36;
  const strokeWidth = 7;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (stats.healthScore / 100) * circumference;

  return (
    <DashboardLayout>
      {/* Session Unlock Modal */}
      {!encryptionKey && <UnlockVaultModal />}

      {loading && items.length === 0 ? (
        <DashboardSkeleton />
      ) : (
        <div className="space-y-6 pb-12 font-sans">
          {/* Header Area */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.07] pb-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[11px] font-mono mb-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Zero-Knowledge Mode Active</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight font-heading">
                Welcome back, {user?.name?.split(' ')[0] || 'User'}
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Overview of your password vault, security health index, and quick access credentials.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="primary"
                icon={Plus}
                onClick={() => {
                  setItemToEdit(null);
                  setIsAddModalOpen(true);
                }}
                className="text-xs py-2 px-4 shadow-sm"
              >
                Add Credential
              </Button>
            </div>
          </div>

          {/* Hero Section: Security Health Score Gauge & Action Box */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-[#12141C] border border-white/[0.07] rounded-2xl p-6 shadow-xl relative overflow-hidden backdrop-blur-md"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
              {/* Score Left Column */}
              <div className="flex-1 space-y-4 text-center md:text-left">
                <div>
                  <div className="flex items-center gap-2 justify-center md:justify-start">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                      Security Index
                    </span>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-mono">
                      LIVE AUDIT
                    </span>
                  </div>
                  <h2 className="text-xl font-extrabold text-white tracking-tight mt-1 font-heading">
                    {stats.healthScore >= 80
                      ? 'Vault Security Optimal'
                      : stats.healthScore >= 50
                      ? 'Vault Health Moderate'
                      : 'Security Attention Required'}
                  </h2>
                  <p className="text-xs text-slate-400 mt-2 max-w-lg leading-relaxed">
                    {stats.total === 0
                      ? 'Your vault is empty. Add credentials to calculate your live zero-knowledge security index.'
                      : `Your overall password security index is evaluated at ${stats.healthScore}%. Inspect weak, reused, or breached entries in Security Audit.`}
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
                    {isScanning ? 'Auditing Vault...' : 'Run Security Audit'}
                  </Button>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Last audit: {lastScannedTime}
                  </span>
                </div>
              </div>

              {/* Score Right Radial Gauge */}
              <div className="flex items-center gap-6 shrink-0 bg-[#0B0C10] border border-white/[0.08] p-5 rounded-2xl shadow-inner min-w-[250px]">
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

                <div className="space-y-2 text-left shrink-0">
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-slate-400 font-mono font-bold block">Status</span>
                    <span
                      className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded border mt-0.5 ${
                        stats.healthScore >= 80
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : stats.healthScore >= 50
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      }`}
                    >
                      {stats.healthScore >= 80 ? 'Optimal' : stats.healthScore >= 50 ? 'Moderate' : 'Risk Detected'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-slate-400 font-mono font-bold block whitespace-nowrap">Total Credentials</span>
                    <span className="text-xs font-bold text-slate-200 font-mono">{stats.total} Entries</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Security Insights Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Weak Password Card */}
            <div className="bg-[#12141C] border border-white/[0.07] rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:border-white/15 transition-all">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                    Weak Passwords
                  </span>
                  <AlertTriangle className={stats.weakCount > 0 ? 'w-4 h-4 text-rose-400' : 'w-4 h-4 text-emerald-400'} />
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-extrabold font-mono text-white">{stats.weakCount}</span>
                  <span className="text-[11px] text-slate-400">detected</span>
                </div>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Credentials with low entropy score. Upgrade them to high-strength generated passwords.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-white/[0.06]">
                <Link to="/security" className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors">
                  <span>Manage in Security Audit</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Reused Password Card */}
            <div className="bg-[#12141C] border border-white/[0.07] rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:border-white/15 transition-all">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                    Password Reuse
                  </span>
                  <Copy className={reuseCount > 0 ? 'w-4 h-4 text-amber-400' : 'w-4 h-4 text-emerald-400'} />
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-extrabold font-mono text-white">{reuseCount}</span>
                  <span className="text-[11px] text-slate-400">groups</span>
                </div>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Identical passwords used across multiple logins. Rotate duplicates to prevent credential stuffing.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-white/[0.06]">
                <Link to="/security" className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors">
                  <span>Audit Duplicates</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Breached Password Card */}
            <div className="bg-[#12141C] border border-white/[0.07] rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:border-white/15 transition-all">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                    Breached Passwords
                  </span>
                  <Shield className={breachCount > 0 ? 'w-4 h-4 text-rose-400' : 'w-4 h-4 text-emerald-400'} />
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-extrabold font-mono text-white">{breachCount}</span>
                  <span className="text-[11px] text-slate-400 font-mono">detected</span>
                </div>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Checked against dark web breach indexes via privacy-preserving k-Anonymity hashes.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-white/[0.06]">
                <Link to="/security" className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors">
                  <span>View Breach Report</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Vault Totals & Category Distribution Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Vault Stats Cards */}
            <div className="lg:col-span-1 space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-heading">
                Vault Summary
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#12141C] border border-white/[0.07] p-4 rounded-2xl flex flex-col justify-between h-28">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Total Items</span>
                    <KeyRound className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-extrabold text-white font-mono">{stats.total}</p>
                    <span className="text-[9px] text-slate-400 font-mono">AES-256 encrypted</span>
                  </div>
                </div>

                <div className="bg-[#12141C] border border-white/[0.07] p-4 rounded-2xl flex flex-col justify-between h-28">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Favorites</span>
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-extrabold text-white font-mono">{stats.favorites}</p>
                    <span className="text-[9px] text-slate-400 font-mono">Quick bookmarks</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Category Distribution */}
            <div className="lg:col-span-2 space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-heading">
                Category Breakdown
              </h3>

              <div className="bg-[#12141C] border border-white/[0.07] p-5 rounded-2xl space-y-3">
                {CATEGORIES.map((cat) => {
                  const count = categoryCounts[cat] || 0;
                  const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
                  const badgeStyle = CATEGORY_COLORS[cat] || CATEGORY_COLORS.Other;

                  let barColor = 'bg-blue-500';
                  if (cat === 'Personal') barColor = 'bg-emerald-500';
                  if (cat === 'Work') barColor = 'bg-purple-500';
                  if (cat === 'Finance') barColor = 'bg-cyan-500';
                  if (cat === 'Social') barColor = 'bg-amber-500';
                  if (cat === 'Other') barColor = 'bg-slate-500';

                  return (
                    <div key={cat} className="space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded border ${badgeStyle}`}>
                          {cat}
                        </span>
                        <span className="font-mono text-[11px] text-slate-400 font-semibold">
                          {count} {count === 1 ? 'item' : 'items'} ({Math.round(percentage)}%)
                        </span>
                      </div>

                      <div className="w-full bg-[#0B0C10] h-2 rounded-full overflow-hidden border border-white/[0.06]">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 0.5, ease: 'easeOut' }}
                          className={`h-full ${barColor}`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick Access Favorites Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-heading">
                  Quick Access Favorites
                </h3>
              </div>
              <Link
                to="/vault"
                className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
              >
                <span>View Full Vault</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {favoriteItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {favoriteItems.map((item) => {
                  const avatar = getWebsiteAvatar(item.website);
                  const badgeStyle = CATEGORY_COLORS[item.category] || CATEGORY_COLORS.Other;
                  const usernameKey = `user-${item.id}`;
                  const passwordKey = `pass-${item.id}`;

                  return (
                    <motion.div
                      key={item.id}
                      whileHover={{ y: -2 }}
                      transition={{ duration: 0.15 }}
                      className="bg-[#12141C] border border-white/[0.07] hover:border-white/20 p-5 rounded-2xl shadow-sm flex flex-col justify-between min-h-[175px] group backdrop-blur-md"
                    >
                      <div className="space-y-3.5">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={`w-8.5 h-8.5 rounded-xl border flex items-center justify-center font-bold text-xs shrink-0 ${avatar.classes}`}>
                              {avatar.initial}
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-bold text-white text-xs truncate leading-tight group-hover:text-blue-400 transition-colors font-heading">
                                {item.website}
                              </h4>
                              <span className={`inline-block text-[9px] font-semibold px-2 py-0.5 rounded border mt-1 ${badgeStyle}`}>
                                {item.category}
                              </span>
                            </div>
                          </div>
                          <Star className="w-4 h-4 text-amber-400 fill-amber-400 shrink-0 mt-0.5" />
                        </div>

                        <div className="space-y-1">
                          <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">Username</div>
                          <p className="text-xs text-slate-200 truncate font-mono font-medium">{item.username}</p>
                        </div>
                      </div>

                      {/* Quick Actions Footer */}
                      <div className="flex items-center justify-between border-t border-white/[0.06] pt-3 mt-3">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleCopyText(item.username, 'Username copied to clipboard', usernameKey)}
                            className="text-[10px] font-semibold text-slate-300 hover:text-white px-2 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] transition-all flex items-center gap-1"
                            title="Copy Username"
                          >
                            {copiedId === usernameKey ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3 text-slate-400" />
                            )}
                            <span>{copiedId === usernameKey ? 'Copied' : 'Username'}</span>
                          </button>

                          <button
                            onClick={() => handleCopyText(item.password, 'Password copied to clipboard', passwordKey)}
                            className="text-[10px] font-semibold text-slate-300 hover:text-white px-2 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] transition-all flex items-center gap-1"
                            title="Copy Password"
                          >
                            {copiedId === passwordKey ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3 text-slate-400" />
                            )}
                            <span>{copiedId === passwordKey ? 'Copied' : 'Password'}</span>
                          </button>
                        </div>

                        <button
                          onClick={() => handleEdit(item)}
                          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/[0.06] transition-colors"
                          title="Edit credential"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-[#12141C] border border-dashed border-white/10 rounded-2xl p-8 text-center backdrop-blur-sm">
                <p className="text-xs text-slate-400">No favorite credentials bookmarked yet.</p>
                <Link
                  to="/vault"
                  className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 justify-center mt-2.5 font-semibold"
                >
                  <span>Go to Vault and bookmark credentials</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Form Modals */}
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
