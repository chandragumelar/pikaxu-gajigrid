import type { ReactNode } from 'react'
import { Info } from 'lucide-react'

interface InfoCalloutProps {
  variant?: 'accent' | 'violet'
  label?: string
  children: ReactNode
}

export function InfoCallout({ variant = 'accent', label, children }: InfoCalloutProps) {
  const color = variant === 'violet' ? 'var(--accent-b)' : 'var(--accent)'
  return (
    <div
      style={{
        background: 'var(--bg-2)',
        border: '1px solid var(--border)',
        borderLeft: `3px solid ${color}`,
        borderRadius: 'var(--radius)',
        padding: '12px 16px',
        marginTop: 'var(--sp-3)',
      }}
    >
      {label && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '6px',
          }}
        >
          <Info size={14} color={color} />
          <span className="text-label" style={{ color, letterSpacing: '0.02em' }}>
            {label}
          </span>
        </div>
      )}
      <div className="text-body-sm" style={{ color: 'var(--text-2)', lineHeight: 1.6 }}>
        {children}
      </div>
    </div>
  )
}
