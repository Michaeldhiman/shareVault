import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/useAuthStore';
import AuthLayout from '../layouts/AuthLayout';
import Button from '../components/ui/Button';
import { LogIn, Eye, EyeOff, Lock } from 'lucide-react';

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState(null);
  const loginUser = useAuthStore((state) => state.loginUser);
  const loading = useAuthStore((state) => state.loading);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setApiError(null);
    const result = await loginUser({
      email: data.email,
      masterPassword: data.masterPassword,
    });

    if (result.success) {
      navigate('/dashboard');
    } else {
      setApiError(result.message);
    }
  };

  return (
    <AuthLayout title="Welcome Back" subtitle="Enter your Master Password to derive your AES-256 key and unlock your vault.">
      <AnimatePresence>
        {apiError && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium leading-relaxed"
          >
            {apiError}
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="login-email" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Email Address
          </label>
          <input
            id="login-email"
            type="email"
            placeholder="john@example.com"
            aria-invalid={errors.email ? 'true' : 'false'}
            {...register('email', {
              required: 'Email is required',
              pattern: { value: /^\S+@\S+$/i, message: 'Invalid email format' },
            })}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
          {errors.email && <p className="text-xs text-rose-400 mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="login-password" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Master Password
          </label>
          <div className="relative">
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••••••"
              aria-invalid={errors.masterPassword ? 'true' : 'false'}
              {...register('masterPassword', { required: 'Master password is required' })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-3.5 pr-10 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-mono"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-200 p-1 rounded-lg transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.masterPassword && (
            <p className="text-xs text-rose-400 mt-1">{errors.masterPassword.message}</p>
          )}
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            icon={LogIn}
            isLoading={loading}
            className="w-full justify-center py-3 font-semibold shadow-blue-600/20"
          >
            {loading ? 'Deriving Key & Unlocking...' : 'Unlock Vault'}
          </Button>
        </div>
      </form>

      <div className="mt-6 pt-4 border-t border-slate-800/60 text-center text-xs text-slate-400">
        Don't have a vault yet?{' '}
        <Link to="/register" className="text-blue-400 hover:text-blue-300 hover:underline font-semibold transition-colors">
          Create Account
        </Link>
      </div>
    </AuthLayout>
  );
}
