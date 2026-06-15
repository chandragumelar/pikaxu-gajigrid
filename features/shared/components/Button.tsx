import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react'

export type ButtonVariant = 'primary' | 'ghost' | 'outline-accent' | 'ghost-accent' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
  children: ReactNode
}

const BASE: CSSProperties = {
  fontFamily: 'var(--font-body)',
  fontWeight: 500,
  transition: 'all 150ms ease-out',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
}

const VARIANT_STYLES: Record<ButtonVariant, CSSProperties> = {
  primary: { background: 'var(--accent)', color: '#08090f', border: 'none' },
  ghost: { background: 'transparent', color: 'var(--text-1)', border: '1px solid var(--border)' },
  'outline-accent': {
    background: 'var(--accent-dim)',
    color: 'var(--accent)',
    border: '1px solid rgba(0,212,168,0.25)',
  },
  'ghost-accent': { background: 'transparent', color: 'var(--accent)', border: 'none' },
  danger: {
    background: 'transparent',
    color: 'var(--danger)',
    border: '1px solid var(--danger-border)',
  },
}

const SIZE_STYLES: Record<ButtonSize, CSSProperties> = {
  sm: { padding: '6px 12px', fontSize: '13px', borderRadius: 'var(--radius-sm)' },
  md: { padding: '10px 18px', fontSize: '14px', borderRadius: 'var(--radius)' },
  lg: { padding: '13px 24px', fontSize: '15px', borderRadius: 'var(--radius-lg)' },
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  disabled,
  style,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || isLoading
  return (
    <button
      disabled={isDisabled}
      style={{
        ...BASE,
        ...VARIANT_STYLES[variant],
        ...SIZE_STYLES[size],
        ...(isDisabled ? { opacity: 0.4, cursor: 'not-allowed' } : {}),
        ...style,
      }}
      {...props}
    >
      {isLoading ? 'Memproses...' : children}
    </button>
  )
}
