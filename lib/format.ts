function formatThousands(n: number): string {
  return Math.abs(Math.round(n))
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

export function formatRupiah(value: number): string {
  return 'Rp ' + formatThousands(value)
}

export function formatPersen(value: number): string {
  return value.toFixed(1).replace('.', ',') + '%'
}

export function formatGapRp(value: number): string {
  const prefix = value >= 0 ? '+Rp ' : '-Rp '
  return prefix + formatThousands(value)
}

export function formatGapPct(value: number): string {
  const sign = value > 0 ? '+' : ''
  return sign + value.toFixed(1).replace('.', ',') + '%'
}

export function parseGajiInput(raw: string): number {
  return Number(raw.replace(/\./g, '').replace(',', '.'))
}
