'use client'

interface Option {
  value: string
  label: string
}

interface ToggleTabProps {
  options: Option[]
  value: string
  onChange: (value: string) => void
}

export function ToggleTab({ options, value, onChange }: ToggleTabProps) {
  return (
    <div
      style={{
        display: 'inline-flex',
        background: 'var(--bg-2)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        padding: '3px',
        gap: '2px',
      }}
    >
      {options.map((opt) => {
        const isActive = opt.value === value
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            style={{
              padding: '7px 16px',
              borderRadius: 'var(--radius-sm)',
              fontFamily: 'var(--font-body)',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 150ms',
              ...(isActive
                ? {
                    background: 'var(--bg-1)',
                    border: '1px solid var(--border-accent)',
                    color: 'var(--accent)',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
                  }
                : {
                    background: 'transparent',
                    border: '1px solid transparent',
                    color: 'var(--text-3)',
                  }),
            }}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
