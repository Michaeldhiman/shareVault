import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/useAuthStore';
import { useVaultStore } from '../store/useVaultStore';
import DashboardLayout from '../layouts/DashboardLayout';
import PasswordCard from '../components/PasswordCard';
import PasswordFormModal from '../components/PasswordFormModal';
import UnlockVaultModal from '../components/UnlockVaultModal';
import VaultSkeleton from '../components/skeletons/VaultSkeleton';
import ConfirmationDialog from '../components/ui/ConfirmationDialog';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Toast from '../components/ui/Toast';
import { CATEGORIES } from '../constants/categories';
import { KeyRound, Search, Plus, Star, ArrowUpDown } from 'lucide-react';

export default function VaultPage() {
  const encryptionKey = useAuthStore((state) => state.encryptionKey);
  const items = useVaultStore((state) => state.items);
  const fetchVault = useVaultStore((state) => state.fetchVault);
  const deleteVaultItem = useVaultStore((state) => state.deleteVaultItem);
  const loading = useVaultStore((state) => state.loading);

  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState('All');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'oldest' | 'alphabetical'

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);

  // Confirmation Dialog State
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [toastMessage, setToastMessage] = useState(null);
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2000);
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (encryptionKey) {
      fetchVault(encryptionKey);
    }
  }, [encryptionKey, fetchVault]);

  useEffect(() => {
    const urlQuery = searchParams.get('search');
    if (urlQuery !== null) {
      setSearch(urlQuery);
    }
  }, [searchParams]);

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
        <div className="space-y-6 pb-12 font-sans">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5" style={{ borderBottom: '1px solid var(--sv-border)' }}>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight font-sans" style={{ color: 'var(--sv-text-primary)' }}>
                  Vault Credentials
                </h1>
                <span className="font-mono text-[11px] px-2.5 py-0.5 rounded-full font-bold" style={{ backgroundColor: 'var(--sv-accent-soft)', border: '1px solid rgba(16, 185, 129, 0.2)', color: 'var(--sv-accent)' }}>
                  {items.length} {items.length === 1 ? 'Stored' : 'Stored'}
                </span>
              </div>
              <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--sv-text-secondary)' }}>
                Manage, filter, and access your client-side AES-GCM 256-bit encrypted credential vault.
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
                className="text-xs py-2 px-4 shadow-sm"
              >
                Add Credential
              </Button>
            </div>
          </div>

          {/* Control Bar: Search, Favorites Filter, Sort */}
          <Card padding="p-4" className="space-y-4">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-3" style={{ color: 'var(--sv-text-secondary)' }} />
                <input
                  type="text"
                  id="vault-search"
                  aria-label="Search vault"
                  placeholder="Search website, username, or notes..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl pl-10 pr-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all font-sans"
                  style={{ backgroundColor: 'var(--sv-bg)', border: '1px solid var(--sv-border)', color: 'var(--sv-text-primary)' }}
                />
              </div>

              {/* Filter options */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all border cursor-pointer ${
                    showFavoritesOnly ? 'font-bold' : ''
                  }`}
                  style={{
                    backgroundColor: showFavoritesOnly ? 'rgba(245, 158, 11, 0.1)' : 'var(--sv-bg)',
                    borderColor: showFavoritesOnly ? 'rgba(245, 158, 11, 0.3)' : 'var(--sv-border)',
                    color: showFavoritesOnly ? '#FBBF24' : 'var(--sv-text-secondary)',
                  }}
                  onMouseEnter={(e) => !showFavoritesOnly && (e.currentTarget.style.color = 'var(--sv-text-primary)')}
                  onMouseLeave={(e) => !showFavoritesOnly && (e.currentTarget.style.color = 'var(--sv-text-secondary)')}
                >
                  <Star className={`w-3.5 h-3.5 ${showFavoritesOnly ? 'fill-[#FBBF24] text-[#FBBF24]' : ''}`} />
                  <span>Favorites Only</span>
                </button>

                {/* Sort Selector */}
                <div className="flex items-center gap-1 rounded-xl px-2.5 py-1.5" style={{ backgroundColor: 'var(--sv-bg)', border: '1px solid var(--sv-border)' }}>
                  <ArrowUpDown className="w-3.5 h-3.5" style={{ color: 'var(--sv-text-secondary)' }} />
                  <select
                    value={sortBy}
                    aria-label="Sort credentials"
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-transparent text-xs focus:outline-none cursor-pointer font-sans"
                    style={{ color: 'var(--sv-text-primary)' }}
                  >
                    <option value="newest" style={{ backgroundColor: 'var(--sv-surface)', color: 'var(--sv-text-primary)' }}>Newest First</option>
                    <option value="oldest" style={{ backgroundColor: 'var(--sv-surface)', color: 'var(--sv-text-primary)' }}>Oldest First</option>
                    <option value="alphabetical" style={{ backgroundColor: 'var(--sv-surface)', color: 'var(--sv-text-primary)' }}>Alphabetical (A-Z)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pt-3 scrollbar-none" style={{ borderTop: '1px solid var(--sv-border)' }}>
              {['All', ...CATEGORIES].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                    category === cat ? 'shadow-sm' : ''
                  }`}
                  style={{
                    backgroundColor: category === cat ? 'var(--sv-accent)' : 'var(--sv-bg)',
                    border: category === cat ? '1px solid var(--sv-accent)' : '1px solid var(--sv-border)',
                    color: category === cat ? '#fff' : 'var(--sv-text-secondary)',
                  }}
                  onMouseEnter={(e) => {
                    if (category !== cat) {
                      e.currentTarget.style.color = 'var(--sv-text-primary)';
                      e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (category !== cat) {
                      e.currentTarget.style.color = 'var(--sv-text-secondary)';
                      e.currentTarget.style.backgroundColor = 'var(--sv-bg)';
                    }
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </Card>

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
                  onCopy={triggerToast}
                />
              ))}
            </motion.div>
          ) : (
            <Card className="py-16 px-4 text-center max-w-md mx-auto shadow-lg">
              <KeyRound className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--sv-text-muted)' }} />
              <h3 className="text-base font-bold mb-1 font-sans" style={{ color: 'var(--sv-text-primary)' }}>No credentials found</h3>
              <p className="text-xs mb-6 leading-relaxed" style={{ color: 'var(--sv-text-secondary)' }}>
                {search || category !== 'All' || showFavoritesOnly
                  ? 'No credentials match your active search filter parameters.'
                  : 'You have not added any credentials to your SecureVault yet.'}
              </p>
            </Card>
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
            navigate('/generator');
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
      
      <Toast isVisible={!!toastMessage} message={toastMessage} type="success" />
    </DashboardLayout>
  );
}
