import type { HTMLAttributes, ReactNode } from 'react'

export type BadgeVariant = 'accent' | 'violet' | 'success' | 'warning' | 'danger' | 'neutral'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  children: ReactNode
}

const VARIANT_STYLES: Record<BadgeVariant, { background: string; color: string; border: string }> =
  {
    accent: {
      background: 'var(--accent-dim)',
      color: 'var(--accent)',
      border: '1px solid rgba(0,212,168,0.2)',
    },
    violet: {
      background: 'var(--accent-b-dim)',
      color: 'var(--accent-b)',
      border: '1px solid rgba(124,92,252,0.2)',
    },
    success: {
      background: 'var(--success-bg)',
      color: 'var(--success)',
      border: '1px solid rgba(34,197,94,0.2)',
    },
    warning: {
      background: 'var(--warning-bg)',
      color: 'var(--warning)',
      border: '1px solid rgba(245,158,11,0.2)',
    },
    danger: {
      background: 'var(--danger-bg)',
      color: 'var(--danger)',
      border: '1px solid rgba(239,68,68,0.2)',
    },
    neutral: {
      background: 'var(--bg-3)',
      color: 'var(--text-2)',
      border: '1px solid var(--border)',
    },
  }

export function Badge({ variant = 'neutral', children, style, ...props }: BadgeProps) {
  const vs = VARIANT_STYLES[variant]
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '3px 8px',
        borderRadius: 'var(--radius-sm)',
        fontFamily: 'var(--font-body)',
        fontSize: '11px',
        fontWeight: 500,
        lineHeight: 1.4,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
        ...vs,
        ...style,
      }}
      {...props}
    >
      {children}
    </span>
  )
}
