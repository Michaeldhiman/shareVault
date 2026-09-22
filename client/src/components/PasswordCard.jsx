import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Copy, Check, Eye, EyeOff, Edit2, Trash2 } from 'lucide-react';
import { useVaultStore } from '../store/useVaultStore';
import { evaluatePasswordStrength } from '../utils/passwordStrength';
import Badge from './ui/Badge';
import ServiceAvatar from './ui/ServiceAvatar';
import Card from './ui/Card';

export default function PasswordCard({ item, onEdit, onDelete, onCopy }) {
  const [showPassword, setShowPassword] = useState(false);
  const [copiedField, setCopiedField] = useState(null);
  const toggleFavorite = useVaultStore((state) => state.toggleFavorite);

  const handleCopy = (text, field, message) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    if (onCopy) onCopy(message);
    setTimeout(() => {
      setCopiedField(null);
    }, 2000);
  };

  const strength = evaluatePasswordStrength(item.password);
  const getStrengthBadge = () => {
    if (strength.score >= 4) {
      return { label: 'Strong', variant: 'success' };
    }
    if (strength.score >= 3) {
      return { label: 'Fair', variant: 'info' };
    }
    if (strength.score >= 2) {
      return { label: 'Moderate', variant: 'warning' };
    }
    return { label: 'Weak', variant: 'danger' };
  };

  const strengthBadge = getStrengthBadge();

  return (
    <Card hover={true} padding="p-5" className="flex flex-col justify-between group">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <ServiceAvatar name={item.website} size="md" />
            <div className="min-w-0">
              <h3 className="font-bold text-sm tracking-tight leading-tight truncate font-sans transition-colors" style={{ color: 'var(--sv-text-primary)' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--sv-accent)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--sv-text-primary)'}>
                {item.website}
              </h3>
              <div className="flex items-center gap-1.5 mt-1">
                <Badge category={item.category} size="xs">
                  {item.category}
                </Badge>
                <Badge variant={strengthBadge.variant} size="xs" className="font-mono">
                  {strengthBadge.label}
                </Badge>
              </div>
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 1.2 }}
            onClick={() => toggleFavorite(item.id)}
            className="p-1.5 rounded-lg transition-colors shrink-0 focus-visible:ring-2 focus-visible:ring-emerald-500/40"
            style={{ color: item.favorite ? '#FBBF24' : 'var(--sv-text-muted)' }}
            onMouseEnter={(e) => {
               if (!item.favorite) {
                  e.currentTarget.style.color = '#FBBF24';
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)';
               }
            }}
            onMouseLeave={(e) => {
               if (!item.favorite) {
                  e.currentTarget.style.color = 'var(--sv-text-muted)';
                  e.currentTarget.style.backgroundColor = 'transparent';
               }
            }}
            title={item.favorite ? 'Remove from favorites' : 'Mark as favorite'}
            aria-label={item.favorite ? 'Remove from favorites' : 'Mark as favorite'}
          >
            <Star className={`w-4 h-4 ${item.favorite ? 'fill-[#FBBF24] text-[#FBBF24]' : ''}`} />
          </motion.button>
        </div>

        {/* Username / Email Field */}
        <div className="rounded-xl p-2.5 mb-2.5 flex items-center justify-between" style={{ backgroundColor: 'var(--sv-bg)', border: '1px solid var(--sv-border)' }}>
          <div className="overflow-hidden pr-2">
            <p className="text-[9px] uppercase font-bold font-mono tracking-wider" style={{ color: 'var(--sv-text-secondary)' }}>Username / Email</p>
            <p className="text-xs font-mono truncate mt-0.5" style={{ color: 'var(--sv-text-primary)' }}>{item.username}</p>
          </div>
          <button
            onClick={() => handleCopy(item.username, 'username', 'Username copied to clipboard')}
            className="p-1.5 rounded-lg transition-colors shrink-0 focus-visible:ring-2 focus-visible:ring-emerald-500/40"
            style={{ color: 'var(--sv-text-muted)' }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--sv-text-primary)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--sv-text-muted)'}
            title="Copy Username"
            aria-label="Copy username"
          >
            {copiedField === 'username' ? (
              <Check className="w-3.5 h-3.5" style={{ color: 'var(--sv-accent)' }} />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {/* Password Field */}
        <div className="rounded-xl p-2.5 mb-3 flex items-center justify-between" style={{ backgroundColor: 'var(--sv-bg)', border: '1px solid var(--sv-border)' }}>
          <div className="overflow-hidden pr-2">
            <p className="text-[9px] uppercase font-bold font-mono tracking-wider" style={{ color: 'var(--sv-text-secondary)' }}>Password</p>
            <p className="text-xs font-mono truncate mt-0.5" style={{ color: 'var(--sv-text-primary)' }}>
              {showPassword ? item.password : '••••••••••••'}
            </p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="p-1.5 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500/40"
              style={{ color: 'var(--sv-text-muted)' }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--sv-text-primary)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--sv-text-muted)'}
              title={showPassword ? 'Hide password' : 'Show password'}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => handleCopy(item.password, 'password', 'Password copied to clipboard')}
              className="p-1.5 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500/40"
              style={{ color: 'var(--sv-text-muted)' }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--sv-text-primary)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--sv-text-muted)'}
              title="Copy Password"
              aria-label="Copy password"
            >
              {copiedField === 'password' ? (
                <Check className="w-3.5 h-3.5" style={{ color: 'var(--sv-accent)' }} />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Notes preview if present */}
        {item.notes && (
          <div className="text-xs p-2.5 rounded-xl mb-3 truncate" style={{ backgroundColor: 'var(--sv-bg)', border: '1px solid var(--sv-border)', color: 'var(--sv-text-secondary)' }}>
            <span className="font-semibold" style={{ color: 'var(--sv-text-secondary)' }}>Notes:</span> {item.notes}
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between pt-3 text-xs" style={{ borderTop: '1px solid var(--sv-border)', color: 'var(--sv-text-secondary)' }}>
        <span className="font-mono text-[10px]">
          Saved {new Date(item.createdAt).toLocaleDateString()}
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(item)}
            className="p-1.5 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500/40"
            style={{ color: 'var(--sv-text-muted)' }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--sv-accent)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--sv-text-muted)'}
            title="Edit Credential"
            aria-label="Edit credential"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="p-1.5 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500/40"
            style={{ color: 'var(--sv-text-muted)' }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--sv-danger, #EF4444)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--sv-text-muted)'}
            title="Delete Credential"
            aria-label="Delete credential"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </Card>
  );
}
