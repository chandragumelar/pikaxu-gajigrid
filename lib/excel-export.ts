import * as XLSX from 'xlsx'
import type { MetodeAResult } from './calc-metode-a'
import type { MetodeBResult, FaktorDef } from './calc-metode-b'

export function downloadTemplateMetodeA() {
  const ws = XLSX.utils.aoa_to_sheet([['No', 'Nama', 'Jabatan', 'Gaji']])
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Data Karyawan')
  XLSX.writeFile(wb, 'template-metode-a.xlsx')
}

export function downloadMetodeAResult(result: MetodeAResult) {
  const wb = XLSX.utils.book_new()

  const struktur = result.struktur.map((g) => ({
    Golongan: g.golongan,
    'Rentang (%)': +(g.rentang * 100).toFixed(1),
    Min: Math.round(g.min),
    Mid: Math.round(g.mid),
    Maks: Math.round(g.maks),
  }))
  const ws1 = XLSX.utils.json_to_sheet(struktur)
  XLSX.utils.book_append_sheet(wb, ws1, 'Struktur Golongan')

  const detail = result.detail.map((d) => ({
    No: d.no,
    Nama: d.nama,
    Jabatan: d.jabatan,
    Golongan: d.golongan,
    'Gaji Lama': Math.round(d.gajiLama),
    'Min Golongan': Math.round(d.minGolongan),
    'Mid Golongan': Math.round(d.midGolongan),
    'Maks Golongan': Math.round(d.maksGolongan),
    'Gap vs Min (Rp)': Math.round(d.gapVsMinRp),
    'Gap vs Min (%)': +d.gapVsMinPct.toFixed(1),
    'Gap vs Mid (Rp)': Math.round(d.gapVsMidRp),
    'Gap vs Mid (%)': +d.gapVsMidPct.toFixed(1),
    'Gap vs Maks (Rp)': Math.round(d.gapVsMaksRp),
    'Gap vs Maks (%)': +d.gapVsMaksPct.toFixed(1),
  }))
  const ws2 = XLSX.utils.json_to_sheet(detail)
  XLSX.utils.book_append_sheet(wb, ws2, 'Detail Karyawan')

  XLSX.writeFile(wb, 'gajigrid-metode-a.xlsx')
}

export function downloadTemplatePoinJabatan() {
  const ws = XLSX.utils.aoa_to_sheet([['Jabatan', 'Poin']])
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Poin Jabatan')
  XLSX.writeFile(wb, 'template-poin-jabatan.xlsx')
}

export function downloadMetodeBResult(
  result: MetodeBResult,
  poinFaktorData?: {
    jabatanList: string[]
    faktors: FaktorDef[]
    matrix: Record<string, Record<string, number>>
  }
) {
  const wb = XLSX.utils.book_new()

  const struktur = result.struktur.map((s) => ({
    Jabatan: s.jabatan,
    Poin: s.poin,
    Min: Math.round(s.min),
    'Mid (Y)': Math.round(s.mid),
    Maks: Math.round(s.maks),
  }))
  const ws1 = XLSX.utils.json_to_sheet(struktur)
  XLSX.utils.book_append_sheet(wb, ws1, 'Struktur Gaji per Jabatan')

  const detail = result.detail.map((d) => ({
    No: d.no,
    Nama: d.nama,
    Jabatan: d.jabatan,
    'Poin Jabatan': d.poinJabatan,
    'Gaji Lama': Math.round(d.gajiLama),
    'Min Jabatan': Math.round(d.minJabatan),
    'Mid Jabatan': Math.round(d.midJabatan),
    'Maks Jabatan': Math.round(d.maksJabatan),
    'Gap vs Min (Rp)': Math.round(d.gapVsMinRp),
    'Gap vs Min (%)': +d.gapVsMinPct.toFixed(1),
    'Gap vs Mid (Rp)': Math.round(d.gapVsMidRp),
    'Gap vs Mid (%)': +d.gapVsMidPct.toFixed(1),
    'Gap vs Maks (Rp)': Math.round(d.gapVsMaksRp),
    'Gap vs Maks (%)': +d.gapVsMaksPct.toFixed(1),
  }))
  const ws2 = XLSX.utils.json_to_sheet(detail)
  XLSX.utils.book_append_sheet(wb, ws2, 'Detail Karyawan')

  if (poinFaktorData) {
    const { jabatanList, faktors, matrix } = poinFaktorData
    const rows = jabatanList.map((j) => {
      const row: Record<string, unknown> = { Jabatan: j }
      faktors.forEach((f) => {
        row[f.nama] = matrix[j]?.[f.id] ?? 0
      })
      row['Total Poin'] = faktors.reduce((sum, f) => sum + (matrix[j]?.[f.id] ?? 0), 0)
      return row
    })
    const ws3 = XLSX.utils.json_to_sheet(rows)
    XLSX.utils.book_append_sheet(wb, ws3, 'Detail Poin Faktor')
  }

  XLSX.writeFile(wb, 'gajigrid-metode-b.xlsx')
}
