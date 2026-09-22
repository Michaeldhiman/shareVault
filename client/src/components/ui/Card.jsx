import React from 'react';
import { motion } from 'framer-motion';

/**
 * Unified Card Component
 * Consistent surface styling across the entire SecureVault application.
 */
export default function Card({
  children,
  className = '',
  hover = false,
  padding = 'p-5',
  as: Tag = 'div',
  onClick,
  ...props
}) {
  const Wrapper = hover ? motion.div : Tag;
  const hoverProps = hover
    ? {
        whileHover: { y: -2 },
        transition: { duration: 0.2 },
      }
    : {};

  return (
    <Wrapper
      className={`rounded-2xl ${padding} transition-colors duration-150 ${className}`}
      style={{
        backgroundColor: 'var(--sv-surface)',
        border: '1px solid var(--sv-border)',
        ...(hover ? {} : {}),
      }}
      onMouseEnter={
        hover
          ? (e) => {
              e.currentTarget.style.borderColor = 'var(--sv-border-hover)';
            }
          : undefined
      }
      onMouseLeave={
        hover
          ? (e) => {
              e.currentTarget.style.borderColor = 'var(--sv-border)';
            }
          : undefined
      }
      onClick={onClick}
      {...hoverProps}
      {...props}
    >
      {children}
    </Wrapper>
  );
}

/**
 * Card sub-components for compound usage
 */
Card.Header = function CardHeader({ children, className = '' }) {
  return (
    <div
      className={`pb-4 mb-4 ${className}`}
      style={{ borderBottom: '1px solid var(--sv-border)' }}
    >
      {children}
    </div>
  );
};

Card.Footer = function CardFooter({ children, className = '' }) {
  return (
    <div
      className={`pt-4 mt-4 ${className}`}
      style={{ borderTop: '1px solid var(--sv-border)' }}
    >
      {children}
    </div>
  );
};
