import React from 'react';

/**
 * Shared Service Avatar Component
 * Generates a deterministic colored avatar from a website/service name.
 * Replaces 3 duplicated getWebsiteAvatar() implementations.
 */

const AVATAR_COLORS = [
  { bg: 'rgba(59, 130, 246, 0.12)', text: '#60A5FA', border: 'rgba(59, 130, 246, 0.20)' },
  { bg: 'rgba(16, 185, 129, 0.12)', text: '#34D399', border: 'rgba(16, 185, 129, 0.20)' },
  { bg: 'rgba(168, 85, 247, 0.12)', text: '#C084FC', border: 'rgba(168, 85, 247, 0.20)' },
  { bg: 'rgba(245, 158, 11, 0.12)', text: '#FBBF24', border: 'rgba(245, 158, 11, 0.20)' },
  { bg: 'rgba(6, 182, 212, 0.12)', text: '#22D3EE', border: 'rgba(6, 182, 212, 0.20)' },
  { bg: 'rgba(244, 63, 94, 0.12)', text: '#FB7185', border: 'rgba(244, 63, 94, 0.20)' },
];

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

export default function ServiceAvatar({
  name = '',
  size = 'md',
  className = '',
}) {
  const initial = name.charAt(0).toUpperCase() || '?';
  const colorIndex = hashString(name) % AVATAR_COLORS.length;
  const colors = AVATAR_COLORS[colorIndex];

  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  };

  return (
    <div
      className={`rounded-xl flex items-center justify-center font-bold shrink-0 ${sizes[size]} ${className}`}
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
        border: `1px solid ${colors.border}`,
      }}
      aria-hidden="true"
    >
      {initial}
    </div>
  );
}
