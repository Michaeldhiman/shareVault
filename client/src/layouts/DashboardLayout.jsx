import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/useAuthStore';
import {
  LayoutDashboard,
  Lock,
  Unlock,
  ShieldAlert,
  KeyRound,
  User,
  LogOut,
  Menu,
  X,
  Plus,
  Search,
  ChevronDown,
  ShieldCheck,
  Zap,
  Sparkles
} from 'lucide-react';
import PasswordFormModal from '../components/PasswordFormModal';
import UnlockVaultModal from '../components/UnlockVaultModal';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';

export default function DashboardLayout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [internalAddModalOpen, setInternalAddModalOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const user = useAuthStore((state) => state.user);
  const logoutUser = useAuthStore((state) => state.logoutUser);
  const lockVault = useAuthStore((state) => state.lockVault);
  const encryptionKey = useAuthStore((state) => state.encryptionKey);
  const isVaultUnlocked = !!encryptionKey;

  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const handleAddClick = () => {
    setInternalAddModalOpen(true);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen(true);
      }
      if (e.key === 'Escape' && userDropdownOpen) {
        setUserDropdownOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [userDropdownOpen]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/vault?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchModalOpen(false);
      setSearchQuery('');
    }
  };

  const navSections = [
    {
      title: 'CORE',
      items: [
        { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { label: 'Vault', path: '/vault', icon: Lock },
      ],
    },
    {
      title: 'SECURITY',
      items: [
        { label: 'Security Audit', path: '/security', icon: ShieldAlert },
      ],
    },
    {
      title: 'TOOLS & CONFIG',
      items: [
        { label: 'Generator', path: '/generator', icon: KeyRound },
        { label: 'Account Profile', path: '/profile', icon: User },
      ],
    },
  ];

  const userInitials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'SV';

  return (
    <div className="min-h-screen text-slate-100 flex flex-col md:flex-row font-sans" style={{ backgroundColor: 'var(--sv-bg)' }}>
      {/* Sidebar Desktop */}
      <aside 
        className="hidden md:flex md:w-64 flex-col justify-between p-4 shrink-0 select-none border-r"
        style={{ backgroundColor: 'var(--sv-surface)', borderColor: 'var(--sv-border)' }}
      >
        <div>
          {/* Logo Header */}
          <div className="flex items-center gap-3 px-3 py-3 mb-4">
            <div className="w-8.5 h-8.5 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-700 border border-emerald-400/30 text-white flex items-center justify-center shadow-md shadow-emerald-600/20">
              <ShieldCheck className="w-4.5 h-4.5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-extrabold text-white text-sm tracking-tight font-sans">SecureVault</h1>
              </div>
              <p className="text-[10px] text-slate-400 font-mono tracking-wide">Zero-Knowledge</p>
            </div>
          </div>

          {/* Quick Add Button */}
          <div className="px-1 mb-5">
            <Button
              variant="primary"
              icon={Plus}
              onClick={handleAddClick}
              className="w-full py-2 justify-center shadow-emerald-500/15 text-xs font-semibold"
            >
              Add Credential
            </Button>
          </div>

          {/* Nav Sections */}
          <div className="space-y-4 px-1">
            {navSections.map((section) => (
              <div key={section.title}>
                <p className="px-3 mb-1.5 text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase">
                  {section.title}
                </p>
                <nav className="space-y-1">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;

                    return (
                      <Link
                        key={item.label}
                        to={item.path}
                        className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150 group ${
                          isActive
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold shadow-sm'
                            : 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.04]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
                          <span>{item.label}</span>
                        </div>
                        {isActive && (
                          <motion.div
                            layoutId="activePill"
                            className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50"
                          />
                        )}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Desktop Top Header Bar */}
        <header 
          className="hidden md:flex border-b px-6 py-3 items-center justify-between backdrop-blur-md sticky top-0 z-30"
          style={{ backgroundColor: 'rgba(17, 19, 24, 0.8)', borderColor: 'var(--sv-border)' }}
        >
          {/* Quick Search Input Trigger */}
          <button
            onClick={() => setSearchModalOpen(true)}
            className="flex items-center gap-3 px-3.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.07] text-slate-400 hover:text-slate-200 text-xs transition-all w-72 justify-between cursor-pointer border"
            style={{ borderColor: 'var(--sv-border)' }}
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span>Search vault credentials...</span>
            </div>
            <kbd className="text-[10px] font-mono bg-white/[0.08] px-1.5 py-0.5 rounded text-slate-300 border" style={{ borderColor: 'var(--sv-border)' }}>
              ⌘K
            </kbd>
          </button>

          {/* Right Action Bar */}
          <div className="flex items-center gap-3">
            {/* Security Indicator Badge */}
            <Link
              to="/security"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/[0.08] border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/[0.12] text-xs font-semibold transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>AES-256 Protected</span>
            </Link>

            {/* User Dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1 rounded-xl hover:bg-white/[0.05] transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-600 to-emerald-700 text-white font-extrabold text-[11px] flex items-center justify-center">
                  {userInitials}
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <AnimatePresence>
                {userDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setUserDropdownOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-52 rounded-2xl border shadow-2xl p-2 z-50 space-y-1 backdrop-blur-xl text-xs"
                      style={{ backgroundColor: 'var(--sv-surface-elevated)', borderColor: 'var(--sv-border)' }}
                    >
                      <div className="px-3 py-2 border-b" style={{ borderColor: 'var(--sv-border)' }}>
                        <p className="font-bold text-slate-200 truncate">{user?.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono truncate">{user?.email}</p>
                      </div>
                      <Link
                        to="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors"
                      >
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>Account Profile</span>
                      </Link>
                      <Link
                        to="/security"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors"
                      >
                        <ShieldAlert className="w-3.5 h-3.5 text-slate-400" />
                        <span>Security Audit</span>
                      </Link>
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          handleLogout();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-colors text-left"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Mobile Header Bar */}
        <header 
          className="md:hidden border-b px-4 py-3 flex items-center justify-between backdrop-blur-md sticky top-0 z-30"
          style={{ backgroundColor: 'rgba(17, 19, 24, 0.9)', borderColor: 'var(--sv-border)' }}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-600 to-emerald-700 text-white flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="font-extrabold text-white text-sm font-sans">SecureVault</span>
              <p className="text-[9px] text-slate-400 font-mono">Zero-Knowledge</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="primary" size="sm" icon={Plus} onClick={handleAddClick}>
              Add
            </Button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-white/[0.06]"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </header>

        {/* Mobile Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-b p-4 space-y-3 overflow-hidden"
              style={{ backgroundColor: 'var(--sv-surface)', borderColor: 'var(--sv-border)' }}
            >
              {navSections.flatMap((s) => s.items).map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate(item.path);
                  }}
                  className={`w-full text-left py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-between ${
                    location.pathname === item.path
                      ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'
                      : 'text-slate-300 hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                </button>
              ))}
              <button
                onClick={handleLogout}
                className="w-full text-left py-2.5 px-3 text-rose-400 text-xs font-semibold flex items-center gap-2.5 pt-3 border-t"
                style={{ borderColor: 'var(--sv-border)' }}
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>

      {/* Quick Search Modal */}
      <Modal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        title=""
        maxWidth="max-w-lg"
        showClose={false}
      >
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-3">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search vault items by title, username, category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none font-sans py-2"
          />
          <button
            type="button"
            onClick={() => setSearchModalOpen(false)}
            className="text-xs text-slate-400 hover:text-slate-200 px-2 py-1 rounded bg-white/[0.05]"
          >
            ESC
          </button>
        </form>
        <div className="pt-3 mt-3 text-[11px] text-slate-400 flex items-center justify-between border-t" style={{ borderColor: 'var(--sv-border)' }}>
          <span>Press Enter to search vault items</span>
          <span className="font-mono text-slate-500">SecureVault</span>
        </div>
      </Modal>

      {/* Unlock Vault Modal if locked */}
      {!isVaultUnlocked && location.pathname !== '/login' && location.pathname !== '/register' && (
        <UnlockVaultModal />
      )}

      {/* Add Credential Modal Triggered Globally */}
      {internalAddModalOpen && (
        <PasswordFormModal
          onClose={() => setInternalAddModalOpen(false)}
          onOpenGenerator={() => {
            setInternalAddModalOpen(false);
            navigate('/generator');
          }}
        />
      )}
    </div>
  );
}
