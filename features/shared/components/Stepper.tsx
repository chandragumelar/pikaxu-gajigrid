import { Check } from 'lucide-react'

type StepDef = { label: string }

interface StepperProps {
  steps: StepDef[]
  current: number
}

export function Stepper({ steps, current }: StepperProps) {
  return (
    <div
      style={{
        height: '68px',
        position: 'sticky',
        top: '64px',
        zIndex: 90,
        background: 'var(--bg)',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 var(--sp-6)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {steps.map((step, i) => {
          const num = i + 1
          const isDone = num < current
          const isActive = num === current

          return (
            <div key={step.label} style={{ display: 'flex', alignItems: 'center' }}>
              {i > 0 && (
                <div
                  style={{
                    width: '72px',
                    height: '1px',
                    background: isDone || isActive ? 'var(--accent)' : 'var(--border)',
                    transition: 'background var(--t-base)',
                  }}
                />
              )}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font-display)',
                    fontSize: '12px',
                    fontWeight: 600,
                    transition: 'all var(--t-base)',
                    ...(isDone
                      ? { background: 'var(--accent)', color: '#08090f', border: 'none' }
                      : isActive
                        ? {
                            background: 'var(--accent-dim)',
                            border: '2px solid var(--accent)',
                            color: 'var(--accent)',
                          }
                        : {
                            background: 'transparent',
                            border: '2px solid var(--border)',
                            color: 'var(--text-3)',
                          }),
                  }}
                >
                  {isDone ? <Check size={12} /> : num}
                </div>
                <span
                  className="text-label"
                  style={{
                    color: isDone || isActive ? 'var(--text-1)' : 'var(--text-3)',
                    transition: 'color var(--t-base)',
                  }}
                >
                  {step.label}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
