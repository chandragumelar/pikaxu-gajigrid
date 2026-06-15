// @vitest-environment node
import { describe, it, expect } from 'vitest'
import {
  calcMetodeB,
  calcPoinDariFaktor,
  autoDetectTitik,
  avgGajiForJabatan,
  type JabatanWithPoin,
  type FaktorDef,
} from './calc-metode-b'
import type { Employee } from './calc-metode-a'

function emp(id: string, jabatan: string, gaji: number): Employee {
  return { id, nama: `Emp${id}`, jabatan, gaji }
}

const JP: JabatanWithPoin[] = [
  { jabatan: 'Staff', poin: 100 },
  { jabatan: 'Manager', poin: 500 },
]

const EMPS: Employee[] = [emp('1', 'Staff', 3000000), emp('2', 'Manager', 5000000)]

describe('calcMetodeB — linear formula', () => {
  it('computes a and b correctly', () => {
    const r = calcMetodeB(JP, EMPS, 'Staff', 3000000, 'Manager', 8000000, 80, 120)
    // a = (8M-3M)/(500-100) = 12500, b = 3M - 12500*100 = 1750000
    expect(r.a).toBeCloseTo(12500)
    expect(r.b).toBeCloseTo(1750000)
  })

  it('struktur mid matches Y=aX+b for each jabatan', () => {
    const r = calcMetodeB(JP, EMPS, 'Staff', 3000000, 'Manager', 8000000, 80, 120)
    const staff = r.struktur.find((s) => s.jabatan === 'Staff')!
    const mgr = r.struktur.find((s) => s.jabatan === 'Manager')!
    expect(staff.mid).toBeCloseTo(3000000)
    expect(mgr.mid).toBeCloseTo(8000000)
  })

  it('min and maks computed from minPct/maksPct', () => {
    const r = calcMetodeB(JP, EMPS, 'Staff', 3000000, 'Manager', 8000000, 80, 120)
    const staff = r.struktur.find((s) => s.jabatan === 'Staff')!
    expect(staff.min).toBeCloseTo(3000000 * 0.8)
    expect(staff.maks).toBeCloseTo(3000000 * 1.2)
  })

  it('struktur sorted ascending by poin', () => {
    const r = calcMetodeB(JP, EMPS, 'Staff', 3000000, 'Manager', 8000000, 80, 120)
    expect(r.struktur[0].poin).toBeLessThanOrEqual(r.struktur[1].poin)
  })

  it('row-danger when salary below min', () => {
    // Manager mid=8M, min=6.4M; EMPS mgr gaji=5M < 6.4M
    const r = calcMetodeB(JP, EMPS, 'Staff', 3000000, 'Manager', 8000000, 80, 120)
    const mgrDetail = r.detail.find((d) => d.jabatan === 'Manager')!
    expect(mgrDetail.rowClass).toBe('row-danger')
  })

  it('row-success when salary in range', () => {
    // Staff mid=3M, min=2.4M, maks=3.6M; gaji=3M → success
    const r = calcMetodeB(JP, EMPS, 'Staff', 3000000, 'Manager', 8000000, 80, 120)
    const staffDetail = r.detail.find((d) => d.jabatan === 'Staff')!
    expect(staffDetail.rowClass).toBe('row-success')
  })

  it('row-warning when salary above maks', () => {
    const empsOverPaid = [emp('1', 'Staff', 3000000), emp('2', 'Manager', 12000000)]
    const r = calcMetodeB(JP, empsOverPaid, 'Staff', 3000000, 'Manager', 8000000, 80, 120)
    const mgrDetail = r.detail.find((d) => d.jabatan === 'Manager')!
    expect(mgrDetail.rowClass).toBe('row-warning')
  })

  it('a=0 when both reference points have same poin (boundary)', () => {
    const samePoin: JabatanWithPoin[] = [
      { jabatan: 'A', poin: 200 },
      { jabatan: 'B', poin: 200 },
    ]
    const r = calcMetodeB(samePoin, [], 'A', 5000000, 'B', 8000000, 80, 120)
    expect(r.a).toBe(0)
    expect(r.b).toBe(5000000)
  })

  it('returns empty detail for empty employees', () => {
    const r = calcMetodeB(JP, [], 'Staff', 3000000, 'Manager', 8000000, 80, 120)
    expect(r.detail).toHaveLength(0)
    expect(r.struktur).toHaveLength(2)
  })
})

describe('calcPoinDariFaktor', () => {
  const faktors: FaktorDef[] = [
    { id: 'tj', nama: 'TJ', maksimal: 300 },
    { id: 'ke', nama: 'Keahlian', maksimal: 250 },
  ]

  it('sums faktor poin per jabatan', () => {
    const matrix = {
      Staff: { tj: 100, ke: 80 },
      Manager: { tj: 250, ke: 200 },
    }
    const result = calcPoinDariFaktor(['Staff', 'Manager'], faktors, matrix)
    expect(result.find((r) => r.jabatan === 'Staff')?.poin).toBe(180)
    expect(result.find((r) => r.jabatan === 'Manager')?.poin).toBe(450)
  })

  it('defaults missing faktor to 0', () => {
    const matrix = { Staff: { tj: 150 } }
    const result = calcPoinDariFaktor(['Staff'], faktors, matrix)
    expect(result[0].poin).toBe(150) // ke = 0, tj = 150
  })

  it('returns empty array for empty jabatan list', () => {
    expect(calcPoinDariFaktor([], faktors, {})).toHaveLength(0)
  })
})

describe('autoDetectTitik', () => {
  it('finds lowest and highest poin jabatan', () => {
    const jp: JabatanWithPoin[] = [
      { jabatan: 'Manager', poin: 500 },
      { jabatan: 'Staff', poin: 100 },
      { jabatan: 'Senior', poin: 300 },
    ]
    const r = autoDetectTitik(jp)
    expect(r.terendah).toBe('Staff')
    expect(r.tertinggi).toBe('Manager')
  })

  it('returns same jabatan for single entry', () => {
    const r = autoDetectTitik([{ jabatan: 'Solo', poin: 200 }])
    expect(r.terendah).toBe('Solo')
    expect(r.tertinggi).toBe('Solo')
  })

  it('returns empty strings for empty input', () => {
    const r = autoDetectTitik([])
    expect(r.terendah).toBe('')
    expect(r.tertinggi).toBe('')
  })

  it('returns first and last in sort order for equal poin', () => {
    const jp: JabatanWithPoin[] = [
      { jabatan: 'A', poin: 100 },
      { jabatan: 'B', poin: 100 },
    ]
    const r = autoDetectTitik(jp)
    // sorted stable: A before B → terendah='A', tertinggi='B'
    expect(r.terendah).toBe('A')
    expect(r.tertinggi).toBe('B')
  })
})

describe('avgGajiForJabatan', () => {
  it('averages salaries for matching jabatan', () => {
    const emps = [emp('1', 'Staff', 3000000), emp('2', 'Staff', 5000000)]
    expect(avgGajiForJabatan(emps, 'Staff')).toBeCloseTo(4000000)
  })

  it('returns single value for one match', () => {
    expect(avgGajiForJabatan([emp('1', 'Staff', 3000000)], 'Staff')).toBe(3000000)
  })

  it('returns null when no match', () => {
    expect(avgGajiForJabatan([emp('1', 'Staff', 3000000)], 'Manager')).toBeNull()
  })

  it('returns null for empty employee list', () => {
    expect(avgGajiForJabatan([], 'Staff')).toBeNull()
  })
})
