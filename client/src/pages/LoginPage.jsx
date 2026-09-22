import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/useAuthStore';
import AuthLayout from '../layouts/AuthLayout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { LogIn } from 'lucide-react';

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
          <Input
            id="login-email"
            type="email"
            label="Email Address"
            placeholder="john@example.com"
            error={errors.email?.message}
            aria-describedby={errors.email ? 'login-email-error' : undefined}
            {...register('email', {
              required: 'Email is required',
              pattern: { value: /^\S+@\S+$/i, message: 'Invalid email format' },
            })}
          />
        </div>

        <div>
          <Input
            id="login-password"
            type={showPassword ? 'text' : 'password'}
            label="Master Password"
            placeholder="••••••••••••"
            showPasswordToggle
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
            error={errors.masterPassword?.message}
            aria-describedby={errors.masterPassword ? 'login-password-error' : undefined}
            inputClassName="font-mono"
            {...register('masterPassword', { required: 'Master password is required' })}
          />
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            icon={LogIn}
            isLoading={loading}
            className="w-full justify-center py-3 font-semibold shadow-emerald-600/20"
          >
            {loading ? 'Deriving Key & Unlocking...' : 'Unlock Vault'}
          </Button>
        </div>
      </form>

      <div className="mt-6 pt-4 border-t text-center text-xs text-slate-400" style={{ borderColor: 'var(--sv-border)' }}>
        Don't have a vault yet?{' '}
        <Link to="/register" className="text-emerald-400 hover:text-emerald-300 hover:underline font-semibold transition-colors">
          Create Account
        </Link>
      </div>
    </AuthLayout>
  );
}
