export function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--border)',
        padding: 'var(--sp-6) var(--sp-6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 'var(--sp-3)',
      }}
    >
      <p className="text-body-sm" style={{ color: 'var(--text-3)', margin: 0 }}>
        GajiGrid dibuat oleh <span style={{ color: 'var(--text-2)', fontWeight: 500 }}>Pikaxu</span>
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-4)' }}>
        <a
          href="mailto:hello.chandragumelar@gmail.com"
          className="text-body-sm"
          style={{ color: 'var(--text-3)', textDecoration: 'none' }}
        >
          hello.chandragumelar@gmail.com
        </a>
        <a
          href="https://x.com/win32_icang"
          target="_blank"
          rel="noopener noreferrer"
          className="text-body-sm"
          style={{ color: 'var(--text-3)', textDecoration: 'none' }}
        >
          @win32_icang
        </a>
      </div>
    </footer>
  )
}
