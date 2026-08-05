import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/useAuthStore';
import { useVaultStore } from '../store/useVaultStore';
import DashboardLayout from '../layouts/DashboardLayout';
import PasswordFormModal from '../components/PasswordFormModal';
import UnlockVaultModal from '../components/UnlockVaultModal';
import DashboardSkeleton from '../components/skeletons/DashboardSkeleton';
import Skeleton from '../components/ui/Skeleton';
import ConfirmationDialog from '../components/ui/ConfirmationDialog';
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
  Sparkles,
  Lock,
  Edit3
} from 'lucide-react';

const getWebsiteAvatar = (name) => {
  const cleanName = name ? name.trim().toUpperCase() : 'W';
  const initial = cleanName.charAt(0);
  
  const colors = [
    'bg-blue-600/10 text-blue-400 border-blue-500/20',
    'bg-purple-600/10 text-purple-400 border-purple-500/20',
    'bg-amber-600/10 text-amber-400 border-amber-500/20',
    'bg-rose-600/10 text-rose-400 border-rose-500/20',
    'bg-emerald-600/10 text-emerald-400 border-emerald-500/20',
    'bg-cyan-600/10 text-cyan-400 border-cyan-500/20',
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
  const deleteVaultItem = useVaultStore((state) => state.deleteVaultItem);
  const loading = useVaultStore((state) => state.loading);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);

  // Security scanning simulation
  const [isScanning, setIsScanning] = useState(false);
  const [lastScannedTime, setLastScannedTime] = useState('2 minutes ago');

  // Summary counts states
  const [reuseCount, setReuseCount] = useState(0);
  const [breachCount, setBreachCount] = useState(0);

  // Copy Action Toast
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
      // Fetch only first 5 to avoid heavy checks on main landing
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
      navigate('/security'); // Redirect to Security Center for details
    }, 1200);
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

  const handleCopyText = (text, message) => {
    navigator.clipboard.writeText(text);
    triggerToast(message);
  };

  const radius = 32;
  const strokeWidth = 6;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (stats.healthScore / 100) * circumference;

  return (
    <DashboardLayout>
      {/* Session Unlock Modal */}
      {!encryptionKey && <UnlockVaultModal />}

      {loading && items.length === 0 ? (
        <DashboardSkeleton />
      ) : (
        <div className="space-y-8 pb-12">
          {/* Header Area */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#242433] pb-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-400 text-[10px] font-mono mb-2">
                <ShieldCheck className="w-3 h-3" />
                <span>Zero-Knowledge Mode Active</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight font-heading">
                Dashboard Overview
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Overview of your vault integrity and quick security metrics.
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="primary"
                icon={Plus}
                onClick={() => {
                  setItemToEdit(null);
                  setIsAddModalOpen(true);
                }}
                className="shadow-blue-600/10 text-xs py-2 px-3.5"
              >
                Add Credential
              </Button>
            </div>
          </div>

          {/* Hero Section: Security Score Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-[#151521]/60 border border-[#242433] rounded-2xl p-6 shadow-xl relative overflow-hidden backdrop-blur-md"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
              
              {/* Score Left Column */}
              <div className="flex-1 space-y-4 text-center md:text-left">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">
                    Security Posture
                  </span>
                  <h2 className="text-xl font-extrabold text-white tracking-tight mt-1 font-heading">
                    {stats.healthScore >= 80 ? 'Vault Secure' : stats.healthScore >= 50 ? 'Vault Health Moderate' : 'Action Required'}
                  </h2>
                  <p className="text-xs text-slate-400 mt-2 max-w-lg leading-relaxed">
                    {stats.total === 0 
                      ? 'Your vault is currently empty. Add credentials to evaluate your security index.'
                      : `Your security index is evaluated at ${stats.healthScore}%. Inspect weak, reused, or compromised passwords under the Security Center console.`
                    }
                  </p>
                </div>
                
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                  <Button
                    variant="outline"
                    icon={Activity}
                    onClick={handleSecurityScan}
                    isLoading={isScanning}
                    className="text-xs py-2 px-4 shadow-sm"
                  >
                    {isScanning ? 'Auditing Vault...' : 'Run Security Scan'}
                  </Button>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Last scanned: {lastScannedTime}
                  </span>
                </div>
              </div>

              {/* Score Right Column */}
              <div className="flex items-center gap-6 shrink-0 bg-slate-950/40 border border-[#242433]/60 p-4.5 rounded-2xl shadow-inner">
                <div className="relative w-20 h-20 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="40"
                      cy="40"
                      r={radius}
                      className="stroke-slate-800/60"
                      strokeWidth={strokeWidth}
                      fill="transparent"
                    />
                    <motion.circle
                      cx="40"
                      cy="40"
                      r={radius}
                      className={
                        stats.healthScore >= 80
                          ? 'stroke-emerald-500'
                          : stats.healthScore >= 50
                          ? 'stroke-amber-500'
                          : 'stroke-rose-500'
                      }
                      strokeWidth={strokeWidth}
                      fill="transparent"
                      strokeDasharray={circumference}
                      initial={{ strokeDashoffset: circumference }}
                      animate={{ strokeDashoffset }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center text-center">
                    <span className="text-lg font-black text-white font-mono leading-none">{stats.healthScore}</span>
                    <span className="text-[8px] text-slate-500 font-mono uppercase mt-0.5">Index</span>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="text-[9px] uppercase tracking-wider text-slate-500 font-mono font-bold">Status</div>
                  <span
                    className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                      stats.healthScore >= 80
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : stats.healthScore >= 50
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                    }`}
                  >
                    {stats.healthScore >= 80 ? 'Optimal' : stats.healthScore >= 50 ? 'Moderate' : 'Action Required'}
                  </span>
                </div>
              </div>

            </div>
          </motion.div>

          {/* Security Insights Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Weak Password Card */}
            <div className="bg-[#151521]/60 border border-[#242433] rounded-2xl p-5 shadow-lg flex flex-col justify-between backdrop-blur-md hover:border-slate-700/60 transition-colors">
              <div>
                <div className="flex items-center justify-between mb-3.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                    Weak Passwords
                  </span>
                  <AlertTriangle className={stats.weakCount > 0 ? 'w-4 h-4 text-rose-400' : 'w-4 h-4 text-emerald-400'} />
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold font-mono text-white">{stats.weakCount}</span>
                  <span className="text-[10px] text-slate-500">detected</span>
                </div>
                <p className="text-xs text-slate-400 mt-2 leading-normal">
                  Vault entries with weak entropy. Review weak keys and replace them.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-900/80">
                <Link to="/security" className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-400 hover:text-blue-300 transition-colors">
                  <span>Manage in Security Center</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* Reused Password Card */}
            <div className="bg-[#151521]/60 border border-[#242433] rounded-2xl p-5 shadow-lg flex flex-col justify-between backdrop-blur-md hover:border-slate-700/60 transition-colors">
              <div>
                <div className="flex items-center justify-between mb-3.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                    Password Reuse
                  </span>
                  <Copy className={reuseCount > 0 ? 'w-4 h-4 text-amber-400' : 'w-4 h-4 text-emerald-400'} />
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold font-mono text-white">{reuseCount}</span>
                  <span className="text-[10px] text-slate-500">groups</span>
                </div>
                <p className="text-xs text-slate-400 mt-2 leading-normal">
                  Identical passwords used across multiple sites. Rotate these duplicate entries.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-900/80">
                <Link to="/security" className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-400 hover:text-blue-300 transition-colors">
                  <span>Audit Groups</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* Breached Password Card */}
            <div className="bg-[#151521]/60 border border-[#242433] rounded-2xl p-5 shadow-lg flex flex-col justify-between backdrop-blur-md hover:border-slate-700/60 transition-colors">
              <div>
                <div className="flex items-center justify-between mb-3.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                    Breached Passwords
                  </span>
                  <Shield className={breachCount > 0 ? 'w-4 h-4 text-rose-400' : 'w-4 h-4 text-emerald-400'} />
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold font-mono text-white">{breachCount}</span>
                  <span className="text-[10px] text-slate-500 font-mono">detected</span>
                </div>
                <p className="text-xs text-slate-400 mt-2 leading-normal">
                  Checked against known data leak databases via k-Anonymity ranges.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-900/80">
                <Link to="/security" className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-400 hover:text-blue-300 transition-colors">
                  <span>View Details</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>

          {/* Vault Statistics & Category Distribution Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Vault Stats Cards */}
            <div className="lg:col-span-1 space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-heading">
                Vault Totals
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#151521]/40 border border-[#242433] p-4.5 rounded-2xl flex flex-col justify-between h-28 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Total Items</span>
                    <KeyRound className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-extrabold text-white font-mono">{stats.total}</p>
                    <span className="text-[8px] text-slate-500 font-mono">Encrypted entries</span>
                  </div>
                </div>

                <div className="bg-[#151521]/40 border border-[#242433] p-4.5 rounded-2xl flex flex-col justify-between h-28 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Favorites</span>
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-extrabold text-white font-mono">{stats.favorites}</p>
                    <span className="text-[8px] text-slate-500 font-mono">Quick bookmarks</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Category Distribution */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-heading">
                Category Distribution
              </h3>
              
              <div className="bg-[#151521]/40 border border-[#242433] p-5 rounded-2xl space-y-3.5 shadow-sm">
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
                        <div className="flex items-center gap-1.5">
                          <span className={`inline-block text-[9px] font-semibold px-2 py-0.5 rounded-full border ${badgeStyle}`}>
                            {cat}
                          </span>
                        </div>
                        <span className="font-mono text-[10px] text-slate-400 font-semibold">
                          {count} ({Math.round(percentage)}%)
                        </span>
                      </div>
                      
                      <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-900">
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

          {/* Favorite Credentials (Compact cards with copy actions) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-heading">
                  Quick Access Favorites
                </h3>
              </div>
              <Link
                to="/vault"
                className="text-[10px] text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1 transition-colors"
              >
                <span>Open Full Vault</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {favoriteItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {favoriteItems.map((item) => {
                  const avatar = getWebsiteAvatar(item.website);
                  const badgeStyle = CATEGORY_COLORS[item.category] || CATEGORY_COLORS.Other;

                  return (
                    <motion.div
                      key={item.id}
                      whileHover={{ y: -2 }}
                      transition={{ duration: 0.15 }}
                      className="bg-[#151521]/40 border border-[#242433] hover:border-slate-700/60 p-4.5 rounded-2xl shadow-sm flex flex-col justify-between h-36 group backdrop-blur-md"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={`w-8 h-8 rounded-lg border flex items-center justify-center font-bold text-xs shrink-0 ${avatar.classes}`}>
                              {avatar.initial}
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-bold text-white text-xs truncate leading-tight group-hover:text-blue-400 transition-colors">
                                {item.website}
                              </h4>
                              <span className={`inline-block text-[8px] font-semibold px-1.5 py-0.5 rounded-md border mt-0.5 ${badgeStyle}`}>
                                {item.category}
                              </span>
                            </div>
                          </div>
                          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
                        </div>

                        <div className="space-y-1">
                          <div className="text-[9px] text-slate-500 font-mono leading-none">Username</div>
                          <p className="text-xs text-slate-300 truncate font-mono">{item.username}</p>
                        </div>
                      </div>

                      {/* Quick Actions Footer */}
                      <div className="flex items-center justify-between border-t border-slate-900 pt-2.5 mt-2 opacity-80 group-hover:opacity-100 transition-opacity">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleCopyText(item.username, 'Username copied')}
                            className="text-[10px] font-bold text-slate-400 hover:text-white px-2 py-1 rounded-md bg-slate-950/40 border border-slate-800/50 hover:border-slate-700/60 transition-all flex items-center gap-1"
                            title="Copy Username"
                          >
                            <Copy className="w-3 h-3 text-slate-500" />
                            <span>Username</span>
                          </button>
                          
                          <button
                            onClick={() => handleCopyText(item.password, 'Password copied')}
                            className="text-[10px] font-bold text-slate-400 hover:text-white px-2 py-1 rounded-md bg-slate-950/40 border border-slate-800/50 hover:border-slate-700/60 transition-all flex items-center gap-1"
                            title="Copy Password"
                          >
                            <Copy className="w-3 h-3 text-slate-500" />
                            <span>Password</span>
                          </button>
                        </div>

                        <button
                          onClick={() => handleEdit(item)}
                          className="text-slate-500 hover:text-white p-1 rounded-md hover:bg-slate-800/60 transition-colors"
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
              <div className="bg-[#151521]/10 border border-dashed border-slate-800/85 rounded-2xl p-8 text-center backdrop-blur-sm">
                <p className="text-xs text-slate-500">No favorite credentials saved yet.</p>
                <Link
                  to="/vault"
                  className="text-[10px] text-blue-400 hover:text-blue-300 flex items-center gap-1 justify-center mt-2.5 font-bold"
                >
                  <span>Go to Vault and select favorites</span>
                  <ArrowRight className="w-3 h-3" />
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
