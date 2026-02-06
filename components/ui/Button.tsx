'use client';

import React from 'react';

/**
 * Reusable Button component with variants, sizes, loading and disabled states, and icon support.
 *
 * @example
 * // Primary button
 * <Button variant="primary">Add to Cart</Button>
 *
 * @example
 * // Loading state
 * <Button loading={isSubmitting}>Place Order</Button>
 *
 * @example
 * // With icon
 * <Button icon={ShoppingCart} variant="secondary">View Cart</Button>
 *
 * @example
 * // Icon only
 * <Button icon={Trash} variant="ghost" size="sm" aria-label="Delete" />
 */
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  onClick?: () => void;
  children?: React.ReactNode;
  'aria-label'?: string;
}

function LoadingSpinner({ className }: { className?: string }) {
  return (
    <svg
      className={`animate-spin ${className ?? ''}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

const variantStyles: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary:
    'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 focus-visible:ring-primary-500',
  secondary:
    'bg-white text-primary-600 border-2 border-primary-600 hover:bg-primary-50 active:bg-primary-100 focus-visible:ring-primary-500',
  outline:
    'bg-transparent text-primary-600 border-2 border-primary-600 hover:bg-primary-50 active:bg-primary-100 focus-visible:ring-primary-500',
  ghost:
    'bg-transparent text-primary-600 border-transparent hover:bg-primary-50 active:bg-primary-100 focus-visible:ring-primary-500',
  danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus-visible:ring-red-500',
};

const sizeStyles: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'px-3 py-1.5 text-sm gap-1.5',
  md: 'px-4 py-2 text-base gap-2',
  lg: 'px-6 py-3 text-lg gap-2.5',
};

const iconSizes: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon,
  type = 'button',
  className = '',
  onClick,
  children,
  'aria-label': ariaLabel,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const baseStyles =
    'inline-flex items-center justify-center font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const combinedClassName =
    `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`.trim();

  const handleClick = () => {
    if (!isDisabled && onClick) {
      onClick();
    }
  };

  return (
    <button
      type={type}
      className={combinedClassName}
      onClick={handleClick}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      aria-busy={loading}
      aria-label={ariaLabel}
    >
      {loading ? (
        <>
          <LoadingSpinner className={`flex-shrink-0 ${iconSizes[size]}`} />
          {children && <span>{children}</span>}
        </>
      ) : (
        <>
          {Icon && <Icon className={`flex-shrink-0 ${iconSizes[size]}`} />}
          {children && <span>{children}</span>}
        </>
      )}
    </button>
  );
}
