import type { InputHTMLAttributes } from 'react'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  helper?: string
  error?: string
  isNumeric?: boolean
  prefix?: string
}

export function Input({
  label,
  helper,
  error,
  isNumeric = false,
  prefix,
  id,
  style,
  ...props
}: InputProps) {
  const hasError = Boolean(error)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-1)' }}>
      {label && (
        <label
          htmlFor={id}
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '12px',
            fontWeight: 500,
            lineHeight: 1.4,
            color: 'var(--text-2)',
            display: 'block',
            marginBottom: '6px',
          }}
        >
          {label}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        {prefix && (
          <span
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              fontFamily: 'var(--font-mono)',
              fontSize: '14px',
              color: 'var(--text-3)',
              pointerEvents: 'none',
            }}
          >
            {prefix}
          </span>
        )}
        <input
          id={id}
          style={{
            background: 'var(--bg-1)',
            border: `1px solid ${hasError ? 'var(--danger)' : 'var(--border)'}`,
            color: 'var(--text-1)',
            borderRadius: 'var(--radius)',
            padding: prefix ? '10px 14px 10px 36px' : '10px 14px',
            fontFamily: isNumeric ? 'var(--font-mono)' : 'var(--font-body)',
            fontWeight: isNumeric ? 500 : 400,
            fontSize: '14px',
            width: '100%',
            textAlign: isNumeric ? 'right' : 'left',
            outline: 'none',
            transition: 'border 150ms ease-out, box-shadow 150ms ease-out',
            ...style,
          }}
          {...props}
        />
      </div>
      {(helper || error) && (
        <span
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '12px',
            color: hasError ? 'var(--danger)' : 'var(--text-3)',
            marginTop: '4px',
          }}
        >
          {error ?? helper}
        </span>
      )}
    </div>
  )
}
