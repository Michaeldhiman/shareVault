import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/useAuthStore';
import AuthLayout from '../layouts/AuthLayout';
import PasswordStrength from '../components/PasswordStrength';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { ShieldCheck } from 'lucide-react';

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [apiError, setApiError] = useState(null);
  const registerUser = useAuthStore((state) => state.registerUser);
  const loading = useAuthStore((state) => state.loading);
  const navigate = useNavigate();

  const masterPassword = watch('masterPassword', '');

  const onSubmit = async (data) => {
    setApiError(null);
    const result = await registerUser({
      name: data.name,
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
    <AuthLayout
      title="Create Your Vault"
      subtitle="Get started with client-side zero-knowledge password protection"
    >
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
            id="reg-name"
            type="text"
            label="Full Name"
            placeholder="John Doe"
            error={errors.name?.message}
            aria-describedby={errors.name ? 'reg-name-error' : undefined}
            {...register('name', { required: 'Name is required' })}
          />
        </div>

        <div>
          <Input
            id="reg-email"
            type="email"
            label="Email Address"
            placeholder="john@example.com"
            error={errors.email?.message}
            aria-describedby={errors.email ? 'reg-email-error' : undefined}
            {...register('email', {
              required: 'Email is required',
              pattern: { value: /^\S+@\S+$/i, message: 'Invalid email format' },
            })}
          />
        </div>

        <div>
          <Input
            id="reg-password"
            type={showPassword ? 'text' : 'password'}
            label="Master Password"
            placeholder="••••••••••••"
            showPasswordToggle
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
            error={errors.masterPassword?.message}
            aria-describedby={errors.masterPassword ? 'reg-password-error' : undefined}
            inputClassName="font-mono"
            {...register('masterPassword', {
              required: 'Master password is required',
              minLength: { value: 8, message: 'Master password must be at least 8 characters' },
            })}
          />
          
          <div className="mt-2">
            <PasswordStrength password={masterPassword} />
          </div>
        </div>

        <div>
          <Input
            id="reg-confirm"
            type={showConfirmPassword ? 'text' : 'password'}
            label="Confirm Master Password"
            placeholder="••••••••••••"
            showPasswordToggle
            showPassword={showConfirmPassword}
            onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
            error={errors.confirmPassword?.message}
            aria-describedby={errors.confirmPassword ? 'reg-confirm-error' : undefined}
            inputClassName="font-mono"
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: (value) => value === watch('masterPassword') || 'Passwords do not match',
            })}
          />
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            icon={ShieldCheck}
            isLoading={loading}
            className="w-full justify-center py-3 font-semibold shadow-emerald-600/20"
          >
            {loading ? 'Deriving Keys & Creating Vault...' : 'Create Secure Vault'}
          </Button>
        </div>
      </form>

      <div className="mt-6 pt-4 border-t text-center text-xs text-slate-400" style={{ borderColor: 'var(--sv-border)' }}>
        Already have a vault?{' '}
        <Link to="/login" className="text-emerald-400 hover:text-emerald-300 hover:underline font-semibold transition-colors">
          Log in
        </Link>
      </div>
    </AuthLayout>
  );
}
