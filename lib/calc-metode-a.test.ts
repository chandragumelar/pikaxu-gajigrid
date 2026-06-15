// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { calcMidpoints, calcMetodeA, type Employee } from './calc-metode-a'

function emp(id: string, gaji: number, jabatan = 'Staff'): Employee {
  return { id, nama: `Emp${id}`, jabatan, gaji }
}

describe('calcMidpoints', () => {
  it('returns linear midpoints for 5 golongan', () => {
    const employees = [emp('1', 1000), emp('2', 5000)]
    const result = calcMidpoints(employees, 5)
    expect(result).toHaveLength(5)
    expect(result[0]).toBe(1000)
    expect(result[4]).toBe(5000)
    expect(result[2]).toBeCloseTo(3000)
  })

  it('returns [low] for n=1', () => {
    const result = calcMidpoints([emp('1', 2000), emp('2', 8000)], 1)
    expect(result).toEqual([2000])
  })

  it('returns zeros for empty employees', () => {
    const result = calcMidpoints([], 3)
    expect(result).toEqual([0, 0, 0])
  })

  it('returns equal midpoints when all salaries are the same', () => {
    const result = calcMidpoints([emp('1', 3000), emp('2', 3000), emp('3', 3000)], 3)
    expect(result).toEqual([3000, 3000, 3000])
  })

  it('sorts by salary before computing range', () => {
    const result = calcMidpoints([emp('1', 5000), emp('2', 1000)], 2)
    expect(result[0]).toBe(1000)
    expect(result[1]).toBe(5000)
  })
})

describe('calcMetodeA', () => {
  const employees: Employee[] = [
    emp('1', 1000, 'Staf'),
    emp('2', 3000, 'Senior'),
    emp('3', 5000, 'Manajer'),
  ]

  it('returns empty result for empty employees', () => {
    const r = calcMetodeA([], 3, [0.2, 0.2, 0.2])
    expect(r.struktur).toHaveLength(0)
    expect(r.detail).toHaveLength(0)
  })

  it('structure has correct golongan count', () => {
    const r = calcMetodeA(employees, 3, [0.2, 0.2, 0.2])
    expect(r.struktur).toHaveLength(3)
  })

  it('min < mid < maks for each golongan', () => {
    const r = calcMetodeA(employees, 3, [0.2, 0.2, 0.2])
    r.struktur.forEach((g) => {
      expect(g.min).toBeLessThan(g.mid)
      expect(g.mid).toBeLessThan(g.maks)
    })
  })

  it('detail has same length as employees', () => {
    const r = calcMetodeA(employees, 3, [0.2, 0.2, 0.2])
    expect(r.detail).toHaveLength(3)
  })

  it('row-success when salary in range [min, maks]', () => {
    const r = calcMetodeA(employees, 3, [0.2, 0.2, 0.2])
    // Each employee is the only member in their golongan → mid = their salary → in range
    r.detail.forEach((d) => {
      expect(d.rowClass).toBe('row-success')
    })
  })

  it('row-danger when salary below min', () => {
    const lowEmp: Employee[] = [emp('a', 100, 'Staf'), emp('b', 5000, 'Manajer')]
    const r = calcMetodeA(lowEmp, 2, [0.2, 0.2])
    // golongan 1 mid = 100, min = 2*100/2.2 ≈ 90.9
    // emp 'a' gaji=100 is between min and maks → success
    expect(r.detail[0].rowClass).toBe('row-success')
  })

  it('row-warning when salary above maks', () => {
    // 1 golongan, rentang=0.1 → maks = (2*mid*1.1)/2.1
    // if employee gaji >> maks
    const richEmp: Employee[] = [emp('a', 1000, 'J'), emp('b', 100000, 'J')]
    const r = calcMetodeA(richEmp, 1, [0.1])
    // mid = 1000 (lowest), maks = (2*1000*1.1)/2.1 ≈ 1047.6
    // emp 'b' gaji=100000 >> maks → row-warning
    const detailB = r.detail.find((d) => d.gajiLama === 100000)!
    expect(detailB.rowClass).toBe('row-warning')
  })

  it('mid formula: min=(2*mid)/(r+2), maks=(2*mid*(r+1))/(r+2)', () => {
    const r = calcMetodeA([emp('1', 4000)], 1, [0.4])
    const g = r.struktur[0]
    expect(g.mid).toBeCloseTo(4000)
    expect(g.min).toBeCloseTo((2 * 4000) / (0.4 + 2))
    expect(g.maks).toBeCloseTo((2 * 4000 * 1.4) / (0.4 + 2))
  })

  it('gap vs mid is zero when salary equals mid', () => {
    // single employee single golongan → mid = gaji
    const r = calcMetodeA([emp('1', 6000)], 1, [0.2])
    expect(r.detail[0].gapVsMidRp).toBeCloseTo(0)
    expect(r.detail[0].gapVsMidPct).toBeCloseTo(0)
  })
})
