import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/useAuthStore';
import { Shield, KeyRound, Sparkles, User, LogOut, Menu, X, Plus } from 'lucide-react';
import PasswordGeneratorModal from '../components/PasswordGeneratorModal';
import PasswordFormModal from '../components/PasswordFormModal';
import Button from '../components/ui/Button';

export default function DashboardLayout({ children, onOpenAddModal, onOpenGenerator }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [internalGeneratorOpen, setInternalGeneratorOpen] = useState(false);
  const [internalAddModalOpen, setInternalAddModalOpen] = useState(false);

  const user = useAuthStore((state) => state.user);
  const logoutUser = useAuthStore((state) => state.logoutUser);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const handleGeneratorClick = () => {
    if (onOpenGenerator) {
      onOpenGenerator();
    } else {
      setInternalGeneratorOpen(true);
    }
  };

  const handleAddClick = () => {
    if (onOpenAddModal) {
      onOpenAddModal();
    } else {
      setInternalAddModalOpen(true);
    }
  };

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: Shield },
    { label: 'Vault Credentials', path: '/vault', icon: KeyRound },
    { label: 'Password Generator', path: '#generator', icon: Sparkles, onClick: handleGeneratorClick },
    { label: 'Profile Settings', path: '/profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row font-sans">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex md:w-64 bg-slate-900/90 border-r border-slate-800/80 flex-col justify-between p-4 shrink-0 backdrop-blur-md">
        <div>
          {/* Logo Header */}
          <div className="flex items-center gap-3 px-3 py-4 mb-6 border-b border-slate-800/80">
            <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shadow-md">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-extrabold text-white text-base tracking-tight font-heading">SecureVault</h1>
              <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">Zero-Knowledge</span>
            </div>
          </div>

          {/* Quick Add Button */}
          <Button
            variant="primary"
            icon={Plus}
            onClick={handleAddClick}
            className="w-full mb-6 py-2.5 justify-center shadow-blue-600/20"
          >
            Add Credential
          </Button>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              if (item.onClick) {
                return (
                  <motion.button
                    whileHover={{ x: 2 }}
                    key={item.label}
                    onClick={item.onClick}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors text-left"
                  >
                    <Icon className="w-4 h-4 text-purple-400" />
                    <span>{item.label}</span>
                  </motion.button>
                );
              }

              return (
                <motion.div whileHover={{ x: 2 }} key={item.label}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20 font-semibold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                </motion.div>
              );
            })}
          </nav>
        </div>

        {/* User Footer */}
        <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
          <div className="overflow-hidden pr-2">
            <p className="text-xs font-semibold text-white truncate font-heading">{user?.name || 'User'}</p>
            <p className="text-[10px] text-slate-400 font-mono truncate">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-slate-400 hover:text-rose-400 rounded-xl hover:bg-slate-800 transition-colors"
            title="Logout"
            aria-label="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="md:hidden bg-slate-900/90 border-b border-slate-800/80 px-4 py-3 flex items-center justify-between backdrop-blur-md">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-400" />
            <span className="font-bold text-white text-base font-heading">SecureVault</span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </header>

        {/* Mobile Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-slate-900 border-b border-slate-800 p-4 space-y-3 overflow-hidden"
            >
              <Button
                variant="primary"
                icon={Plus}
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleAddClick();
                }}
                className="w-full justify-center"
              >
                Add Credential
              </Button>
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (item.onClick) item.onClick();
                    else navigate(item.path);
                  }}
                  className="w-full text-left py-2 text-slate-300 text-xs font-medium flex items-center gap-2 hover:text-white"
                >
                  <item.icon className="w-4 h-4 text-slate-400" />
                  <span>{item.label}</span>
                </button>
              ))}
              <button
                onClick={handleLogout}
                className="w-full text-left py-2 text-rose-400 text-xs font-medium flex items-center gap-2 pt-2 border-t border-slate-800"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>

      {/* Internal Modals */}
      {internalGeneratorOpen && (
        <PasswordGeneratorModal onClose={() => setInternalGeneratorOpen(false)} />
      )}

      {internalAddModalOpen && (
        <PasswordFormModal
          onClose={() => setInternalAddModalOpen(false)}
          onOpenGenerator={() => {
            setInternalAddModalOpen(false);
            setInternalGeneratorOpen(true);
          }}
        />
      )}
    </div>
  );
}
