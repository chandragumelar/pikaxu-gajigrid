'use client'

import { useState } from 'react'
import { Upload } from 'lucide-react'

interface FileUploadZoneProps {
  onFile: (file: File) => void
  onDownloadTemplate: () => void
  error?: string
}

export function FileUploadZone({ onFile, onDownloadTemplate, error }: FileUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false)

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(true)
  }

  function handleDragLeave() {
    setIsDragging(false)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) onFile(file)
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) onFile(file)
    e.target.value = ''
  }

  return (
    <div>
      <label
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'var(--sp-3)',
          background: isDragging ? 'var(--accent-dim)' : 'var(--bg-1)',
          border: `2px dashed ${isDragging ? 'var(--accent)' : error ? 'var(--danger)' : 'var(--border)'}`,
          borderRadius: 'var(--radius-lg)',
          padding: '48px 32px',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 200ms',
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Upload size={32} color={isDragging ? 'var(--accent)' : 'var(--text-3)'} />
        <div>
          <p
            className="text-subheading"
            style={{ color: 'var(--text-1)', marginBottom: 'var(--sp-1)' }}
          >
            Drag & drop file di sini
          </p>
          <p className="text-body-sm" style={{ color: 'var(--text-3)' }}>
            atau klik untuk pilih file Excel (.xlsx)
          </p>
        </div>
        <input
          type="file"
          accept=".xlsx,.xls"
          style={{ display: 'none' }}
          onChange={handleChange}
        />
      </label>

      {error && (
        <p className="text-body-sm" style={{ color: 'var(--danger)', marginTop: 'var(--sp-2)' }}>
          {error}
        </p>
      )}

      <div style={{ marginTop: 'var(--sp-3)', textAlign: 'center' }}>
        <button
          onClick={onDownloadTemplate}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--accent)',
            fontFamily: 'var(--font-body)',
            fontSize: '13px',
            cursor: 'pointer',
            textDecoration: 'underline',
          }}
        >
          Download template Excel
        </button>
      </div>
    </div>
  )
}
