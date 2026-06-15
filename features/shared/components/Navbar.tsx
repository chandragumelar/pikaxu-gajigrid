import Link from 'next/link'

export function Navbar() {
  return (
    <nav
      style={{
        height: '64px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'var(--bg)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 var(--sp-6)',
      }}
    >
      <Link
        href="/"
        style={{
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '20px',
            fontWeight: 600,
            color: 'var(--text-1)',
            letterSpacing: '-0.01em',
          }}
        >
          gajigrid
        </span>
        <span
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: 'var(--accent)',
            display: 'inline-block',
            marginBottom: '2px',
          }}
        />
        <span
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '11px',
            fontWeight: 500,
            color: 'var(--text-3)',
            letterSpacing: '0.02em',
            marginTop: '1px',
          }}
        >
          by pikaxu
        </span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-1)' }}>
        <Link href="/faq" className="navbar-btn" style={{ textDecoration: 'none' }}>
          FAQ
        </Link>
      </div>
    </nav>
  )
}
