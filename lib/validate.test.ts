// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { validateEmployeeRows } from './validate'

describe('validateEmployeeRows', () => {
  it('returns no errors for valid rows', () => {
    const result = validateEmployeeRows([
      { nama: 'Budi', jabatan: 'Staff', gaji: '5000000' },
      { nama: 'Ani', jabatan: 'Manager', gaji: '10000000' },
    ])
    expect(result).toHaveLength(0)
  })

  it('returns error for empty nama', () => {
    const result = validateEmployeeRows([{ nama: '', jabatan: 'Staff', gaji: '5000000' }])
    expect(result).toContainEqual(expect.objectContaining({ col: 'Nama' }))
  })

  it('returns error for empty jabatan', () => {
    const result = validateEmployeeRows([{ nama: 'Budi', jabatan: '', gaji: '5000000' }])
    expect(result).toContainEqual(expect.objectContaining({ col: 'Jabatan' }))
  })

  it('returns error for empty gaji', () => {
    const result = validateEmployeeRows([{ nama: 'Budi', jabatan: 'Staff', gaji: '' }])
    expect(result).toContainEqual(expect.objectContaining({ col: 'Gaji' }))
  })

  it('returns error for non-numeric gaji', () => {
    const result = validateEmployeeRows([{ nama: 'Budi', jabatan: 'Staff', gaji: 'abc' }])
    expect(result).toContainEqual(expect.objectContaining({ col: 'Gaji' }))
  })

  it('returns error for gaji <= 0', () => {
    const result = validateEmployeeRows([{ nama: 'Budi', jabatan: 'Staff', gaji: '0' }])
    expect(result).toContainEqual(expect.objectContaining({ col: 'Gaji' }))
  })

  it('returns multiple errors for multiple invalid rows', () => {
    const result = validateEmployeeRows([
      { nama: '', jabatan: '', gaji: '' },
      { nama: 'Ani', jabatan: 'Staff', gaji: '-100' },
    ])
    expect(result.length).toBeGreaterThan(2)
  })

  it('returns no errors for empty input array', () => {
    expect(validateEmployeeRows([])).toHaveLength(0)
  })
})
