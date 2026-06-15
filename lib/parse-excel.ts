import * as XLSX from 'xlsx'

export type ParsedEmployee = { nama: string; jabatan: string; gaji: string }
export type ParsedPoinJabatan = { jabatan: string; poin: string }

function findCol(row: Record<string, unknown>, ...keys: string[]): string {
  for (const key of keys) {
    const v = row[key] ?? row[key.toLowerCase()] ?? row[key.toUpperCase()]
    if (v !== undefined && v !== null) return String(v).trim()
  }
  return ''
}

export function parseEmployeeExcel(file: File): Promise<ParsedEmployee[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = e.target?.result
        const wb = XLSX.read(data, { type: 'array' })
        const ws = wb.Sheets[wb.SheetNames[0]]
        const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws)
        const parsed: ParsedEmployee[] = rows
          .map((row) => ({
            nama: findCol(row, 'Nama', 'nama', 'NAMA'),
            jabatan: findCol(row, 'Jabatan', 'jabatan', 'JABATAN'),
            gaji: findCol(row, 'Gaji', 'gaji', 'GAJI'),
          }))
          .filter((r) => r.nama !== '')
        resolve(parsed)
      } catch {
        reject(new Error('File tidak dapat dibaca. Pastikan format Excel (.xlsx) benar.'))
      }
    }
    reader.onerror = () => reject(new Error('File tidak dapat dibaca.'))
    reader.readAsArrayBuffer(file)
  })
}

export function parsePoinJabatanExcel(file: File): Promise<ParsedPoinJabatan[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = e.target?.result
        const wb = XLSX.read(data, { type: 'array' })
        const ws = wb.Sheets[wb.SheetNames[0]]
        const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws)
        const parsed: ParsedPoinJabatan[] = rows
          .map((row) => ({
            jabatan: findCol(row, 'Jabatan', 'jabatan', 'JABATAN'),
            poin: findCol(row, 'Poin', 'poin', 'POIN'),
          }))
          .filter((r) => r.jabatan !== '')
        resolve(parsed)
      } catch {
        reject(new Error('File tidak dapat dibaca. Pastikan format Excel (.xlsx) benar.'))
      }
    }
    reader.onerror = () => reject(new Error('File tidak dapat dibaca.'))
    reader.readAsArrayBuffer(file)
  })
}
