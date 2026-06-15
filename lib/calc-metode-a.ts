export type Employee = {
  id: string
  nama: string
  jabatan: string
  gaji: number
}

export type GolonganStruktur = {
  golongan: number
  rentang: number
  min: number
  mid: number
  maks: number
}

export type EmployeeDetail = {
  no: number
  nama: string
  jabatan: string
  golongan: number
  gajiLama: number
  minGolongan: number
  midGolongan: number
  maksGolongan: number
  gapVsMinRp: number
  gapVsMinPct: number
  gapVsMidRp: number
  gapVsMidPct: number
  gapVsMaksRp: number
  gapVsMaksPct: number
  rowClass: 'row-danger' | 'row-success' | 'row-warning'
}

export type MetodeAResult = {
  struktur: GolonganStruktur[]
  detail: EmployeeDetail[]
}

export function calcMidpoints(employees: Employee[], n: number): number[] {
  if (employees.length === 0) return Array(n).fill(0)
  const sorted = [...employees].sort((a, b) => a.gaji - b.gaji)
  const low = sorted[0].gaji
  const high = sorted[sorted.length - 1].gaji
  if (n === 1) return [low]
  const step = (high - low) / (n - 1)
  return Array.from({ length: n }, (_, i) => low + step * i)
}

export function calcMetodeA(
  employees: Employee[],
  jumlahGolongan: number,
  rentangPerGolongan: number[]
): MetodeAResult {
  if (employees.length === 0) return { struktur: [], detail: [] }

  const sorted = [...employees].sort((a, b) => a.gaji - b.gaji)
  const midpoints = calcMidpoints(employees, jumlahGolongan)
  const n = jumlahGolongan

  const struktur: GolonganStruktur[] = midpoints.map((mid, i) => {
    const r = rentangPerGolongan[i] ?? 0.2
    return {
      golongan: i + 1,
      rentang: r,
      min: (2 * mid) / (r + 2),
      mid,
      maks: (2 * mid * (r + 1)) / (r + 2),
    }
  })

  const groupSize = Math.ceil(sorted.length / n)
  const golonganMap = new Map<string, number>()
  sorted.forEach((emp, idx) => {
    golonganMap.set(emp.id, Math.min(Math.floor(idx / groupSize) + 1, n))
  })

  const detail: EmployeeDetail[] = employees.map((emp, idx) => {
    const golongan = golonganMap.get(emp.id) ?? 1
    const g = struktur[golongan - 1]
    const gapVsMinRp = emp.gaji - g.min
    const gapVsMinPct = (gapVsMinRp / g.min) * 100
    const gapVsMidRp = emp.gaji - g.mid
    const gapVsMidPct = (gapVsMidRp / g.mid) * 100
    const gapVsMaksRp = emp.gaji - g.maks
    const gapVsMaksPct = (gapVsMaksRp / g.maks) * 100

    let rowClass: EmployeeDetail['rowClass']
    if (emp.gaji < g.min) rowClass = 'row-danger'
    else if (emp.gaji > g.maks) rowClass = 'row-warning'
    else rowClass = 'row-success'

    return {
      no: idx + 1,
      nama: emp.nama,
      jabatan: emp.jabatan,
      golongan,
      gajiLama: emp.gaji,
      minGolongan: g.min,
      midGolongan: g.mid,
      maksGolongan: g.maks,
      gapVsMinRp,
      gapVsMinPct,
      gapVsMidRp,
      gapVsMidPct,
      gapVsMaksRp,
      gapVsMaksPct,
      rowClass,
    }
  })

  return { struktur, detail }
}
