import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/useAuthStore';
import { Home, Lock, Shield, KeyRound, User, LogOut, Menu, X, Plus } from 'lucide-react';
import PasswordFormModal from '../components/PasswordFormModal';
import Button from '../components/ui/Button';

export default function DashboardLayout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [internalAddModalOpen, setInternalAddModalOpen] = useState(false);

  const user = useAuthStore((state) => state.user);
  const logoutUser = useAuthStore((state) => state.logoutUser);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const handleAddClick = () => {
    setInternalAddModalOpen(true);
  };

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: Home },
    { label: 'Vault', path: '/vault', icon: Lock },
    { label: 'Security', path: '/security', icon: Shield },
    { label: 'Password Generator', path: '/generator', icon: KeyRound },
    { label: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-slate-100 flex flex-col md:flex-row font-sans">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex md:w-64 bg-[#151521]/90 border-r border-[#242433] flex-col justify-between p-5 shrink-0 backdrop-blur-md">
        <div>
          {/* Logo Header */}
          <div className="flex items-center gap-3 px-2 py-3 mb-6 border-b border-[#242433]">
            <div className="w-9 h-9 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shadow-md">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-extrabold text-white text-sm tracking-tight font-heading">SecureVault</h1>
              <span className="text-[9px] text-slate-500 font-mono tracking-wider uppercase">Zero-Knowledge</span>
            </div>
          </div>

          {/* Quick Add Button */}
          <Button
            variant="primary"
            icon={Plus}
            onClick={handleAddClick}
            className="w-full mb-6 py-2.5 justify-center shadow-blue-600/10 text-xs"
          >
            Add Credential
          </Button>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <motion.div whileHover={{ x: 2 }} key={item.label}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                      isActive
                        ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20 font-bold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
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
        <div className="pt-4 border-t border-[#242433] flex items-center justify-between">
          <div className="overflow-hidden pr-2">
            <p className="text-xs font-bold text-white truncate font-heading">{user?.name || 'User'}</p>
            <p className="text-[10px] text-slate-500 font-mono truncate">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-slate-400 hover:text-rose-400 rounded-xl hover:bg-slate-800/60 transition-colors"
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
        <header className="md:hidden bg-[#151521]/90 border-b border-[#242433] px-4 py-3 flex items-center justify-between backdrop-blur-md">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-400" />
            <span className="font-bold text-white text-base font-heading">SecureVault</span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800/60"
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
              className="md:hidden bg-[#151521] border-b border-[#242433] p-4 space-y-3 overflow-hidden"
            >
              <Button
                variant="primary"
                icon={Plus}
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleAddClick();
                }}
                className="w-full justify-center text-xs"
              >
                Add Credential
              </Button>
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate(item.path);
                  }}
                  className={`w-full text-left py-2 px-3 rounded-lg text-xs font-semibold flex items-center gap-2 hover:bg-slate-800/40 ${
                    location.pathname === item.path ? 'text-blue-400 bg-blue-600/5' : 'text-slate-300'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              ))}
              <button
                onClick={handleLogout}
                className="w-full text-left py-2 px-3 text-rose-400 text-xs font-semibold flex items-center gap-2 pt-2 border-t border-[#242433]"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>

      {/* Add Credential Modal Triggered Globally */}
      {internalAddModalOpen && (
        <PasswordFormModal
          onClose={() => setInternalAddModalOpen(false)}
          onOpenGenerator={() => {
            setInternalAddModalOpen(false);
            navigate('/generator'); // Navigate to full generator page
          }}
        />
      )}
    </div>
  );
}
