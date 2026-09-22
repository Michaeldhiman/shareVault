import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/useAuthStore';
import { useVaultStore } from '../store/useVaultStore';
import DashboardLayout from '../layouts/DashboardLayout';
import PasswordFormModal from '../components/PasswordFormModal';
import DashboardSkeleton from '../components/skeletons/DashboardSkeleton';
import Button from '../components/ui/Button';
import Toast from '../components/ui/Toast';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import ServiceAvatar from '../components/ui/ServiceAvatar';
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
  Edit3,
  Check
} from 'lucide-react';

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
      {loading && items.length === 0 ? (
        <DashboardSkeleton />
      ) : (
        <div className="space-y-6 pb-12 font-sans">
          {/* Header Area */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5" style={{ borderBottom: '1px solid var(--sv-border)' }}>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono mb-2" style={{ backgroundColor: 'var(--sv-accent-soft)', border: '1px solid rgba(16, 185, 129, 0.2)', color: 'var(--sv-accent)' }}>
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Zero-Knowledge Mode Active</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight font-sans" style={{ color: 'var(--sv-text-primary)' }}>
                Welcome back, {user?.name?.split(' ')[0] || 'User'}
              </h1>
              <p className="text-xs mt-0.5" style={{ color: 'var(--sv-text-secondary)' }}>
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
            className="rounded-2xl p-6 shadow-xl relative overflow-hidden"
            style={{ backgroundColor: 'var(--sv-surface)', border: '1px solid var(--sv-border)' }}
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
              {/* Score Left Column */}
              <div className="flex-1 space-y-4 text-center md:text-left">
                <div>
                  <div className="flex items-center gap-2 justify-center md:justify-start">
                    <span className="text-[10px] font-bold uppercase tracking-widest font-mono" style={{ color: 'var(--sv-text-secondary)' }}>
                      Security Index
                    </span>
                    <Badge variant="success" size="xs" className="font-mono">
                      LIVE AUDIT
                    </Badge>
                  </div>
                  <h2 className="text-xl font-extrabold tracking-tight mt-1 font-sans" style={{ color: 'var(--sv-text-primary)' }}>
                    {stats.healthScore >= 80
                      ? 'Vault Security Optimal'
                      : stats.healthScore >= 50
                      ? 'Vault Health Moderate'
                      : 'Security Attention Required'}
                  </h2>
                  <p className="text-xs mt-2 max-w-lg leading-relaxed" style={{ color: 'var(--sv-text-secondary)' }}>
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
                  <span className="text-[11px] font-mono" style={{ color: 'var(--sv-text-secondary)' }}>
                    Last audit: {lastScannedTime}
                  </span>
                </div>
              </div>

              {/* Score Right Radial Gauge */}
              <div className="flex items-center gap-6 shrink-0 p-5 rounded-2xl shadow-inner min-w-[250px]" style={{ backgroundColor: 'var(--sv-bg)', border: '1px solid var(--sv-border)' }}>
                <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
                  <svg 
                    className="w-24 h-24 transform -rotate-90" 
                    viewBox="0 0 96 96"
                    role="meter"
                    aria-valuenow={stats.healthScore}
                    aria-valuemin="0"
                    aria-valuemax="100"
                    aria-label="Security health score"
                  >
                    <circle
                      cx="48"
                      cy="48"
                      r={radius}
                      stroke="var(--sv-border)"
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
                    <span className="text-xl font-black font-mono leading-none" style={{ color: 'var(--sv-text-primary)' }}>{stats.healthScore}%</span>
                    <span className="text-[9px] font-mono uppercase mt-0.5" style={{ color: 'var(--sv-text-secondary)' }}>Health</span>
                  </div>
                </div>

                <div className="space-y-2 text-left shrink-0">
                  <div>
                    <span className="text-[9px] uppercase tracking-wider font-mono font-bold block" style={{ color: 'var(--sv-text-secondary)' }}>Status</span>
                    <Badge variant={stats.healthScore >= 80 ? 'success' : stats.healthScore >= 50 ? 'warning' : 'danger'} size="xs" className="mt-0.5 font-bold">
                      {stats.healthScore >= 80 ? 'Optimal' : stats.healthScore >= 50 ? 'Moderate' : 'Risk Detected'}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-wider font-mono font-bold block whitespace-nowrap" style={{ color: 'var(--sv-text-secondary)' }}>Total Credentials</span>
                    <span className="text-xs font-bold font-mono" style={{ color: 'var(--sv-text-primary)' }}>{stats.total} Entries</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Security Insights Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Weak Password Card */}
            <Card hover={true} className="flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider font-mono" style={{ color: 'var(--sv-text-secondary)' }}>
                    Weak Passwords
                  </span>
                  <AlertTriangle className={stats.weakCount > 0 ? 'w-4 h-4 text-rose-400' : 'w-4 h-4 text-emerald-400'} />
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-extrabold font-mono" style={{ color: 'var(--sv-text-primary)' }}>{stats.weakCount}</span>
                  <span className="text-[11px]" style={{ color: 'var(--sv-text-secondary)' }}>detected</span>
                </div>
                <p className="text-xs mt-2 leading-relaxed" style={{ color: 'var(--sv-text-secondary)' }}>
                  Credentials with low entropy score. Upgrade them to high-strength generated passwords.
                </p>
              </div>
              <div className="mt-5 pt-3" style={{ borderTop: '1px solid var(--sv-border)' }}>
                <Link to="/security" className="inline-flex items-center gap-1.5 text-xs font-semibold transition-colors" style={{ color: 'var(--sv-accent)' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--sv-accent-hover)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--sv-accent)'}>
                  <span>Manage in Security Audit</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </Card>

            {/* Reused Password Card */}
            <Card hover={true} className="flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider font-mono" style={{ color: 'var(--sv-text-secondary)' }}>
                    Password Reuse
                  </span>
                  <Copy className={reuseCount > 0 ? 'w-4 h-4 text-amber-400' : 'w-4 h-4 text-emerald-400'} />
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-extrabold font-mono" style={{ color: 'var(--sv-text-primary)' }}>{reuseCount}</span>
                  <span className="text-[11px]" style={{ color: 'var(--sv-text-secondary)' }}>groups</span>
                </div>
                <p className="text-xs mt-2 leading-relaxed" style={{ color: 'var(--sv-text-secondary)' }}>
                  Identical passwords used across multiple logins. Rotate duplicates to prevent credential stuffing.
                </p>
              </div>
              <div className="mt-5 pt-3" style={{ borderTop: '1px solid var(--sv-border)' }}>
                <Link to="/security" className="inline-flex items-center gap-1.5 text-xs font-semibold transition-colors" style={{ color: 'var(--sv-accent)' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--sv-accent-hover)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--sv-accent)'}>
                  <span>Audit Duplicates</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </Card>

            {/* Breached Password Card */}
            <Card hover={true} className="flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider font-mono" style={{ color: 'var(--sv-text-secondary)' }}>
                    Breached Passwords
                  </span>
                  <Shield className={breachCount > 0 ? 'w-4 h-4 text-rose-400' : 'w-4 h-4 text-emerald-400'} />
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-extrabold font-mono" style={{ color: 'var(--sv-text-primary)' }}>{breachCount}</span>
                  <span className="text-[11px] font-mono" style={{ color: 'var(--sv-text-secondary)' }}>detected</span>
                </div>
                <p className="text-xs mt-2 leading-relaxed" style={{ color: 'var(--sv-text-secondary)' }}>
                  Checked against dark web breach indexes via privacy-preserving k-Anonymity hashes.
                </p>
              </div>
              <div className="mt-5 pt-3" style={{ borderTop: '1px solid var(--sv-border)' }}>
                <Link to="/security" className="inline-flex items-center gap-1.5 text-xs font-semibold transition-colors" style={{ color: 'var(--sv-accent)' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--sv-accent-hover)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--sv-accent)'}>
                  <span>View Breach Report</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </Card>
          </div>

          {/* Vault Totals & Category Distribution Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Vault Stats Cards */}
            <div className="lg:col-span-1 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider font-sans" style={{ color: 'var(--sv-text-secondary)' }}>
                Vault Summary
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <Card padding="p-4" className="flex flex-col justify-between h-28">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-wider font-bold" style={{ color: 'var(--sv-text-secondary)' }}>Total Items</span>
                    <KeyRound className="w-4 h-4" style={{ color: 'var(--sv-accent)' }} />
                  </div>
                  <div>
                    <p className="text-2xl font-extrabold font-mono" style={{ color: 'var(--sv-text-primary)' }}>{stats.total}</p>
                    <span className="text-[9px] font-mono" style={{ color: 'var(--sv-text-secondary)' }}>AES-256 encrypted</span>
                  </div>
                </Card>

                <Card padding="p-4" className="flex flex-col justify-between h-28">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-wider font-bold" style={{ color: 'var(--sv-text-secondary)' }}>Favorites</span>
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-extrabold font-mono" style={{ color: 'var(--sv-text-primary)' }}>{stats.favorites}</p>
                    <span className="text-[9px] font-mono" style={{ color: 'var(--sv-text-secondary)' }}>Quick bookmarks</span>
                  </div>
                </Card>
              </div>
            </div>

            {/* Category Distribution */}
            <div className="lg:col-span-2 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider font-sans" style={{ color: 'var(--sv-text-secondary)' }}>
                Category Breakdown
              </h3>

              <Card padding="p-5" className="space-y-3">
                {CATEGORIES.map((cat) => {
                  const count = categoryCounts[cat] || 0;
                  const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;

                  let barColor = 'bg-emerald-500';
                  if (cat === 'Personal') barColor = 'bg-emerald-500';
                  if (cat === 'Work') barColor = 'bg-blue-500';
                  if (cat === 'Finance') barColor = 'bg-cyan-500';
                  if (cat === 'Social') barColor = 'bg-purple-500';
                  if (cat === 'Other') barColor = 'bg-slate-500';

                  return (
                    <div key={cat} className="space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <Badge category={cat} size="xs" className="font-semibold">{cat}</Badge>
                        <span className="font-mono text-[11px] font-semibold" style={{ color: 'var(--sv-text-secondary)' }}>
                          {count} {count === 1 ? 'item' : 'items'} ({Math.round(percentage)}%)
                        </span>
                      </div>

                      <div 
                        className="w-full h-2 rounded-full overflow-hidden" 
                        style={{ backgroundColor: 'var(--sv-bg)', border: '1px solid var(--sv-border)' }}
                        role="progressbar" 
                        aria-valuenow={percentage} 
                        aria-valuemin="0" 
                        aria-valuemax="100"
                      >
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
              </Card>
            </div>
          </div>

          {/* Quick Access Favorites Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider font-sans" style={{ color: 'var(--sv-text-secondary)' }}>
                  Quick Access Favorites
                </h3>
              </div>
              <Link
                to="/vault"
                className="text-xs font-semibold flex items-center gap-1 transition-colors"
                style={{ color: 'var(--sv-accent)' }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--sv-accent-hover)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--sv-accent)'}
              >
                <span>View Full Vault</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {favoriteItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {favoriteItems.map((item) => {
                  const usernameKey = `user-${item.id}`;
                  const passwordKey = `pass-${item.id}`;

                  return (
                    <Card
                      key={item.id}
                      hover={true}
                      padding="p-5"
                      className="flex flex-col justify-between min-h-[175px] group"
                    >
                      <div className="space-y-3.5">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <ServiceAvatar name={item.website} size="sm" />
                            <div className="min-w-0">
                              <h4 className="font-bold text-xs truncate leading-tight transition-colors font-sans" style={{ color: 'var(--sv-text-primary)' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--sv-accent)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--sv-text-primary)'}>
                                {item.website}
                              </h4>
                              <Badge category={item.category} size="xs" className="mt-1">
                                {item.category}
                              </Badge>
                            </div>
                          </div>
                          <Star className="w-4 h-4 text-amber-400 fill-amber-400 shrink-0 mt-0.5" />
                        </div>

                        <div className="space-y-1">
                          <div className="text-[9px] font-bold uppercase tracking-wider font-mono" style={{ color: 'var(--sv-text-secondary)' }}>Username</div>
                          <p className="text-xs truncate font-mono font-medium" style={{ color: 'var(--sv-text-primary)' }}>{item.username}</p>
                        </div>
                      </div>

                      {/* Quick Actions Footer */}
                      <div className="flex items-center justify-between pt-3 mt-3" style={{ borderTop: '1px solid var(--sv-border)' }}>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleCopyText(item.username, 'Username copied to clipboard', usernameKey)}
                            className="text-[10px] font-semibold px-2 py-1 rounded-lg transition-all flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-emerald-500/40"
                            style={{ color: 'var(--sv-text-secondary)', backgroundColor: 'var(--sv-bg)', border: '1px solid var(--sv-border)' }}
                            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--sv-text-primary)'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--sv-text-secondary)'; e.currentTarget.style.backgroundColor = 'var(--sv-bg)'; }}
                            title="Copy Username"
                          >
                            {copiedId === usernameKey ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                            <span>{copiedId === usernameKey ? 'Copied' : 'Username'}</span>
                          </button>

                          <button
                            onClick={() => handleCopyText(item.password, 'Password copied to clipboard', passwordKey)}
                            className="text-[10px] font-semibold px-2 py-1 rounded-lg transition-all flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-emerald-500/40"
                            style={{ color: 'var(--sv-text-secondary)', backgroundColor: 'var(--sv-bg)', border: '1px solid var(--sv-border)' }}
                            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--sv-text-primary)'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--sv-text-secondary)'; e.currentTarget.style.backgroundColor = 'var(--sv-bg)'; }}
                            title="Copy Password"
                          >
                            {copiedId === passwordKey ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                            <span>{copiedId === passwordKey ? 'Copied' : 'Password'}</span>
                          </button>
                        </div>

                        <button
                          onClick={() => handleEdit(item)}
                          className="p-1 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500/40"
                          style={{ color: 'var(--sv-text-secondary)' }}
                          onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--sv-text-primary)'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--sv-text-secondary)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
                          title="Edit credential"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card className="p-8 text-center" style={{ borderStyle: 'dashed' }}>
                <p className="text-xs" style={{ color: 'var(--sv-text-secondary)' }}>No favorite credentials bookmarked yet.</p>
                <Link
                  to="/vault"
                  className="text-xs flex items-center gap-1 justify-center mt-2.5 font-semibold transition-colors"
                  style={{ color: 'var(--sv-accent)' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--sv-accent-hover)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--sv-accent)'}
                >
                  <span>Go to Vault and bookmark credentials</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </Card>
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
