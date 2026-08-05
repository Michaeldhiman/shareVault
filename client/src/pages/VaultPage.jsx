import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/useAuthStore';
import { useVaultStore } from '../store/useVaultStore';
import DashboardLayout from '../layouts/DashboardLayout';
import PasswordCard from '../components/PasswordCard';
import PasswordFormModal from '../components/PasswordFormModal';
import UnlockVaultModal from '../components/UnlockVaultModal';
import VaultSkeleton from '../components/skeletons/VaultSkeleton';
import ConfirmationDialog from '../components/ui/ConfirmationDialog';
import Button from '../components/ui/Button';
import { CATEGORIES } from '../constants/categories';
import { KeyRound, Search, Plus, Star, ArrowUpDown } from 'lucide-react';

export default function VaultPage() {
  const encryptionKey = useAuthStore((state) => state.encryptionKey);
  const items = useVaultStore((state) => state.items);
  const fetchVault = useVaultStore((state) => state.fetchVault);
  const deleteVaultItem = useVaultStore((state) => state.deleteVaultItem);
  const loading = useVaultStore((state) => state.loading);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'oldest' | 'alphabetical'

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);

  // Confirmation Dialog State
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (encryptionKey) {
      fetchVault(encryptionKey);
    }
  }, [encryptionKey, fetchVault]);

  // Filter & Sort Logic
  const filteredAndSortedItems = useMemo(() => {
    let result = items.filter((item) => {
      const matchesSearch =
        item.website.toLowerCase().includes(search.toLowerCase()) ||
        item.username.toLowerCase().includes(search.toLowerCase()) ||
        (item.notes && item.notes.toLowerCase().includes(search.toLowerCase()));

      const matchesCategory = category === 'All' || item.category === category;
      const matchesFavorite = !showFavoritesOnly || item.favorite;

      return matchesSearch && matchesCategory && matchesFavorite;
    });

    if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === 'oldest') {
      result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortBy === 'alphabetical') {
      result.sort((a, b) => a.website.localeCompare(b.website));
    }

    return result;
  }, [items, search, category, showFavoritesOnly, sortBy]);

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
    <DashboardLayout>
      {/* Session Unlock Modal */}
      {!encryptionKey && <UnlockVaultModal />}

      {loading && items.length === 0 ? (
        <VaultSkeleton />
      ) : (
        <div className="space-y-8 pb-12">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#242433] pb-5">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight font-heading">
                  Vault Credentials
                </h1>
                <span className="bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono text-[10px] px-2.5 py-0.5 rounded-full font-bold">
                  {items.length} Stored
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Manage, search, and retrieve all your AES-GCM 255-bit encrypted credential assets locally.
              </p>
            </div>

            <div>
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

          {/* Control Bar: Search, Favorites Filter, Sort */}
          <div className="bg-[#151521]/60 border border-[#242433] rounded-2xl p-4 shadow-xl space-y-4 backdrop-blur-md">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                <input
                  type="text"
                  id="vault-search"
                  placeholder="Search website, username, or notes..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-900 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-sans"
                />
              </div>

              {/* Filter options */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all border ${
                    showFavoritesOnly
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 font-bold shadow-sm'
                      : 'bg-slate-950 border-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  <Star className={`w-3.5 h-3.5 ${showFavoritesOnly ? 'fill-amber-400 text-amber-400' : ''}`} />
                  <span>Favorites Only</span>
                </button>

                {/* Sort Selector */}
                <div className="flex items-center gap-1 bg-slate-950 border border-slate-900 rounded-xl px-2.5 py-1.5">
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-transparent text-xs text-slate-300 focus:outline-none cursor-pointer font-sans"
                  >
                    <option value="newest" className="bg-[#151521] text-white">Newest First</option>
                    <option value="oldest" className="bg-[#151521] text-white">Oldest First</option>
                    <option value="alphabetical" className="bg-[#151521] text-white">Alphabetical (A-Z)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pt-3 border-t border-slate-900/60 scrollbar-none">
              {['All', ...CATEGORIES].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                    category === cat
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-slate-950 hover:bg-slate-900 border border-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Credentials Grid */}
          {filteredAndSortedItems.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {filteredAndSortedItems.map((item) => (
                <PasswordCard
                  key={item.id}
                  item={item}
                  onEdit={handleEdit}
                  onDelete={(id) => setItemToDelete(id)}
                />
              ))}
            </motion.div>
          ) : (
            <div className="bg-[#151521]/40 border border-[#242433] rounded-2xl py-16 px-4 text-center max-w-md mx-auto backdrop-blur-sm shadow-lg">
              <KeyRound className="w-12 h-12 text-slate-700 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white mb-1 font-heading">No credentials found</h3>
              <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                {search || category !== 'All' || showFavoritesOnly
                  ? 'No credentials match your active search filter parameters.'
                  : 'You have not added any credentials to your SecureVault yet.'}
              </p>
              <Button
                variant="primary"
                icon={Plus}
                onClick={() => {
                  setItemToEdit(null);
                  setIsAddModalOpen(true);
                }}
                className="text-xs"
              >
                Add First Credential
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Add / Edit Form Modal */}
      {isAddModalOpen && (
        <PasswordFormModal
          itemToEdit={itemToEdit}
          onClose={() => {
            setIsAddModalOpen(false);
            setItemToEdit(null);
          }}
          onOpenGenerator={() => {
            setIsAddModalOpen(false);
            navigate('/generator'); // Navigate directly to full page
          }}
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
