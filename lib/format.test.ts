// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { formatRupiah, formatPersen, formatGapRp, formatGapPct } from './format'

describe('formatRupiah', () => {
  it('formats positive value with thousand separator', () => {
    expect(formatRupiah(5000000)).toBe('Rp 5.000.000')
  })
  it('rounds decimal before formatting', () => {
    expect(formatRupiah(5000000.7)).toBe('Rp 5.000.001')
  })
  it('formats zero', () => {
    expect(formatRupiah(0)).toBe('Rp 0')
  })
})

describe('formatPersen', () => {
  it('formats with 1 decimal and comma separator', () => {
    expect(formatPersen(20)).toBe('20,0%')
  })
  it('formats decimal value', () => {
    expect(formatPersen(12.5)).toBe('12,5%')
  })
  it('formats zero', () => {
    expect(formatPersen(0)).toBe('0,0%')
  })
})

describe('formatGapRp', () => {
  it('prefixes positive gap with +', () => {
    expect(formatGapRp(1000000)).toBe('+Rp 1.000.000')
  })
  it('prefixes negative gap with -', () => {
    expect(formatGapRp(-500000)).toBe('-Rp 500.000')
  })
  it('formats zero as positive', () => {
    expect(formatGapRp(0)).toBe('+Rp 0')
  })
})

describe('formatGapPct', () => {
  it('prefixes positive with +', () => {
    expect(formatGapPct(5.5)).toBe('+5,5%')
  })
  it('negative has no extra prefix', () => {
    expect(formatGapPct(-3.2)).toBe('-3,2%')
  })
  it('zero has no + prefix', () => {
    expect(formatGapPct(0)).toBe('0,0%')
  })
})
