import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/useAuthStore';
import { useVaultStore } from '../store/useVaultStore';
import DashboardLayout from '../layouts/DashboardLayout';
import PasswordCard from '../components/PasswordCard';
import PasswordFormModal from '../components/PasswordFormModal';
import PasswordGeneratorModal from '../components/PasswordGeneratorModal';
import UnlockVaultModal from '../components/UnlockVaultModal';
import DashboardSkeleton from '../components/skeletons/DashboardSkeleton';
import Skeleton from '../components/ui/Skeleton';
import ConfirmationDialog from '../components/ui/ConfirmationDialog';
import Button from '../components/ui/Button';
import { evaluatePasswordStrength } from '../utils/passwordStrength';
import { CATEGORIES, CATEGORY_COLORS } from '../constants/categories';
import { Shield, KeyRound, Star, AlertTriangle, Plus, ArrowRight, ShieldCheck, Activity } from 'lucide-react';

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const encryptionKey = useAuthStore((state) => state.encryptionKey);
  const items = useVaultStore((state) => state.items);
  const fetchVault = useVaultStore((state) => state.fetchVault);
  const deleteVaultItem = useVaultStore((state) => state.deleteVaultItem);
  const loading = useVaultStore((state) => state.loading);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);

  // Accessible Confirmation Dialog State
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (encryptionKey) {
      fetchVault(encryptionKey);
    }
  }, [encryptionKey, fetchVault]);

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

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    await deleteVaultItem(itemToDelete);
    setIsDeleting(false);
    setItemToDelete(null);
  };

  return (
    <DashboardLayout
      onOpenAddModal={() => {
        setItemToEdit(null);
        setIsAddModalOpen(true);
      }}
      onOpenGenerator={() => setIsGeneratorOpen(true)}
    >
      {/* Session Unlock Modal */}
      {!encryptionKey && <UnlockVaultModal />}

      {loading && items.length === 0 ? (
        <DashboardSkeleton />
      ) : (
        <>
          {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-gradient-to-r from-blue-950/40 via-slate-900 to-slate-900 border border-blue-500/20 rounded-2xl p-6 mb-8 relative overflow-hidden shadow-xl backdrop-blur-md"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Zero-Knowledge Mode Active</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-heading">
              Welcome back, {user?.name || 'User'}!
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-xl leading-relaxed">
              Your master password derived a 256-bit AES-GCM encryption key safely in your browser. The server only sees ciphertext.
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
              className="shadow-blue-600/20"
            >
              Add Credential
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Security Health & Metrics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Security Health Card */}
        <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-5 shadow-xl flex flex-col justify-between backdrop-blur-md">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-heading flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span>Vault Security Score</span>
              </h3>
              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  stats.healthScore >= 80
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : stats.healthScore >= 50
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                }`}
              >
                {stats.healthScore >= 80 ? 'Optimal' : stats.healthScore >= 50 ? 'Moderate' : 'Action Needed'}
              </span>
            </div>

            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-4xl font-extrabold text-white font-mono">{stats.healthScore}%</span>
              <span className="text-xs text-slate-400">Health Index</span>
            </div>

            <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden mb-4 border border-slate-800">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${stats.healthScore}%` }}
                transition={{ duration: 0.8 }}
                className={`h-full ${
                  stats.healthScore >= 80
                    ? 'bg-emerald-500'
                    : stats.healthScore >= 50
                    ? 'bg-amber-500'
                    : 'bg-rose-500'
                }`}
              />
            </div>
          </div>

          <p className="text-xs text-slate-400">
            {stats.weakCount === 0
              ? 'All passwords in your vault meet strong security criteria!'
              : `${stats.weakCount} credential${stats.weakCount > 1 ? 's' : ''} have weak or guessable passwords.`}
          </p>
        </div>

        {/* 4 Stat Boxes */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-4">
          <div className="bg-slate-900/90 border border-slate-800/80 p-5 rounded-2xl shadow-xl flex flex-col justify-between backdrop-blur-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Credentials</span>
              <KeyRound className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-3xl font-extrabold text-white font-mono">{stats.total}</p>
            <span className="text-[10px] text-slate-500 mt-2">Stored securely in ciphertext</span>
          </div>

          <div className="bg-slate-900/90 border border-slate-800/80 p-5 rounded-2xl shadow-xl flex flex-col justify-between backdrop-blur-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Favorites</span>
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            </div>
            <p className="text-3xl font-extrabold text-white font-mono">{stats.favorites}</p>
            <span className="text-[10px] text-slate-500 mt-2">Quick access credentials</span>
          </div>

          <div className="bg-slate-900/90 border border-slate-800/80 p-5 rounded-2xl shadow-xl flex flex-col justify-between backdrop-blur-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Categories</span>
              <Shield className="w-5 h-5 text-purple-400" />
            </div>
            <p className="text-3xl font-extrabold text-white font-mono">{stats.categoriesCount}</p>
            <span className="text-[10px] text-slate-500 mt-2">Active category groups</span>
          </div>

          <div className="bg-slate-900/90 border border-slate-800/80 p-5 rounded-2xl shadow-xl flex flex-col justify-between backdrop-blur-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Weak Passwords</span>
              <AlertTriangle className="w-5 h-5 text-rose-400" />
            </div>
            <p className="text-3xl font-extrabold text-white font-mono">{stats.weakCount}</p>
            <span className="text-[10px] text-slate-500 mt-2">Recommended for update</span>
          </div>
        </div>
      </div>

      {/* Category Breakdown & Distribution */}
      <div className="mb-8">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 font-heading">Category Distribution</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {CATEGORIES.map((cat) => {
            const count = categoryCounts[cat] || 0;
            const badgeStyle = CATEGORY_COLORS[cat] || CATEGORY_COLORS.Other;
            return (
              <div key={cat} className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-3.5 text-center shadow-lg">
                <span className={`inline-block text-[10px] font-semibold px-2.5 py-0.5 rounded-full border mb-2 ${badgeStyle}`}>
                  {cat}
                </span>
                <p className="text-xl font-bold text-white font-mono">{count}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Access Favorites Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <h2 className="text-base font-bold text-white font-heading">Favorite Credentials</h2>
          </div>

          <Link
            to="/vault"
            className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 transition-colors"
          >
            <span>View All Vault Credentials</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Skeleton variant="card" />
            <Skeleton variant="card" />
            <Skeleton variant="card" />
          </div>
        ) : favoriteItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {favoriteItems.map((item) => (
              <PasswordCard
                key={item.id}
                item={item}
                onEdit={handleEdit}
                onDelete={(id) => setItemToDelete(id)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-slate-900/40 border border-slate-800/50 rounded-2xl p-8 text-center backdrop-blur-sm">
            <p className="text-xs text-slate-400 mb-3">No favorite credentials marked yet.</p>
            <Link
              to="/vault"
              className="text-xs text-blue-400 hover:text-blue-300 hover:underline inline-flex items-center gap-1 font-semibold"
            >
              <span>Browse Vault to mark favorites</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        )}
      </div>
      </>
      )}

      {/* Form & Generator Modals */}
      {isAddModalOpen && (
        <PasswordFormModal
          itemToEdit={itemToEdit}
          onClose={() => {
            setIsAddModalOpen(false);
            setItemToEdit(null);
          }}
          onOpenGenerator={() => setIsGeneratorOpen(true)}
        />
      )}

      {isGeneratorOpen && (
        <PasswordGeneratorModal
          onClose={() => setIsGeneratorOpen(false)}
        />
      )}

      {/* Accessible Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={!!itemToDelete}
        title="Delete Credential?"
        message="Are you sure you want to delete this credential? This action cannot be undone."
        confirmText="Delete Credential"
        isLoading={isDeleting}
        onConfirm={confirmDelete}
        onCancel={() => setItemToDelete(null)}
      />
    </DashboardLayout>
  );
}
