import type { Employee } from './calc-metode-a'

export type JabatanWithPoin = {
  jabatan: string
  poin: number
}

export type JabatanStruktur = {
  jabatan: string
  poin: number
  min: number
  mid: number
  maks: number
}

export type EmployeeDetailB = {
  no: number
  nama: string
  jabatan: string
  poinJabatan: number
  gajiLama: number
  minJabatan: number
  midJabatan: number
  maksJabatan: number
  gapVsMinRp: number
  gapVsMinPct: number
  gapVsMidRp: number
  gapVsMidPct: number
  gapVsMaksRp: number
  gapVsMaksPct: number
  rowClass: 'row-danger' | 'row-success' | 'row-warning'
}

export type MetodeBResult = {
  struktur: JabatanStruktur[]
  detail: EmployeeDetailB[]
  a: number
  b: number
}

export type FaktorDef = {
  id: string
  nama: string
  maksimal: number
}

export const DEFAULT_FAKTORS: FaktorDef[] = [
  { id: 'tj', nama: 'Tanggung Jawab', maksimal: 300 },
  { id: 'ke', nama: 'Keahlian', maksimal: 250 },
  { id: 'us', nama: 'Usaha', maksimal: 200 },
  { id: 'lk', nama: 'Lingkungan Kerja', maksimal: 150 },
]

export function calcMetodeB(
  jabatanPoin: JabatanWithPoin[],
  employees: Employee[],
  p1Jabatan: string,
  u1: number,
  p2Jabatan: string,
  u2: number,
  minPct: number,
  maksPct: number
): MetodeBResult {
  const p1 = jabatanPoin.find((j) => j.jabatan === p1Jabatan)?.poin ?? 0
  const p2 = jabatanPoin.find((j) => j.jabatan === p2Jabatan)?.poin ?? 0

  const a = p2 !== p1 ? (u2 - u1) / (p2 - p1) : 0
  const b = u1 - a * p1

  const struktur: JabatanStruktur[] = [...jabatanPoin]
    .sort((x, y) => x.poin - y.poin)
    .map((j) => {
      const mid = a * j.poin + b
      return {
        jabatan: j.jabatan,
        poin: j.poin,
        min: mid * (minPct / 100),
        mid,
        maks: mid * (maksPct / 100),
      }
    })

  const strukturMap = new Map(struktur.map((s) => [s.jabatan, s]))

  const detail: EmployeeDetailB[] = employees.map((emp, idx) => {
    const s = strukturMap.get(emp.jabatan)
    if (!s) {
      return {
        no: idx + 1,
        nama: emp.nama,
        jabatan: emp.jabatan,
        poinJabatan: 0,
        gajiLama: emp.gaji,
        minJabatan: 0,
        midJabatan: 0,
        maksJabatan: 0,
        gapVsMinRp: 0,
        gapVsMinPct: 0,
        gapVsMidRp: 0,
        gapVsMidPct: 0,
        gapVsMaksRp: 0,
        gapVsMaksPct: 0,
        rowClass: 'row-success' as const,
      }
    }

    const gapVsMinRp = emp.gaji - s.min
    const gapVsMinPct = s.min > 0 ? (gapVsMinRp / s.min) * 100 : 0
    const gapVsMidRp = emp.gaji - s.mid
    const gapVsMidPct = s.mid > 0 ? (gapVsMidRp / s.mid) * 100 : 0
    const gapVsMaksRp = emp.gaji - s.maks
    const gapVsMaksPct = s.maks > 0 ? (gapVsMaksRp / s.maks) * 100 : 0

    let rowClass: EmployeeDetailB['rowClass']
    if (emp.gaji < s.min) rowClass = 'row-danger'
    else if (emp.gaji > s.maks) rowClass = 'row-warning'
    else rowClass = 'row-success'

    return {
      no: idx + 1,
      nama: emp.nama,
      jabatan: emp.jabatan,
      poinJabatan: s.poin,
      gajiLama: emp.gaji,
      minJabatan: s.min,
      midJabatan: s.mid,
      maksJabatan: s.maks,
      gapVsMinRp,
      gapVsMinPct,
      gapVsMidRp,
      gapVsMidPct,
      gapVsMaksRp,
      gapVsMaksPct,
      rowClass,
    }
  })

  return { struktur, detail, a, b }
}

export function calcPoinDariFaktor(
  jabatanList: string[],
  faktors: FaktorDef[],
  matrix: Record<string, Record<string, number>>
): JabatanWithPoin[] {
  return jabatanList.map((jabatan) => ({
    jabatan,
    poin: faktors.reduce((sum, f) => sum + (matrix[jabatan]?.[f.id] ?? 0), 0),
  }))
}

export function autoDetectTitik(jabatanPoin: JabatanWithPoin[]): {
  terendah: string
  tertinggi: string
} {
  if (jabatanPoin.length === 0) return { terendah: '', tertinggi: '' }
  const sorted = [...jabatanPoin].sort((a, b) => a.poin - b.poin)
  return {
    terendah: sorted[0].jabatan,
    tertinggi: sorted[sorted.length - 1].jabatan,
  }
}

export function avgGajiForJabatan(employees: Employee[], jabatan: string): number | null {
  const matching = employees.filter((e) => e.jabatan === jabatan)
  if (matching.length === 0) return null
  return matching.reduce((sum, e) => sum + e.gaji, 0) / matching.length
}
