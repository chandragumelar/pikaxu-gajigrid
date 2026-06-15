import type { HTMLAttributes, ReactNode } from 'react'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  isInteractive?: boolean
  isSelected?: boolean
}

export function Card({
  children,
  isInteractive = false,
  isSelected = false,
  style,
  ...props
}: CardProps) {
  return (
    <div
      style={{
        background: isSelected ? 'var(--bg-2)' : 'var(--bg-1)',
        border: `1px solid ${isSelected ? 'var(--accent)' : 'var(--border)'}`,
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--sp-6)',
        boxShadow: 'var(--shadow-card)',
        ...(isInteractive
          ? { cursor: 'pointer', transition: 'border 200ms, box-shadow 200ms, transform 150ms' }
          : {}),
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  )
}

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export function CardHeader({ children, style, ...props }: CardHeaderProps) {
  return (
    <div
      style={{
        paddingBottom: 'var(--sp-4)',
        borderBottom: '1px solid var(--border-subtle)',
        marginBottom: 'var(--sp-5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  )
}
