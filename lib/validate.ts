export type ValidationError = { row: number; col: string; message: string }

export function validateEmployeeRows(
  rows: { nama: string; jabatan: string; gaji: string }[]
): ValidationError[] {
  const errors: ValidationError[] = []
  rows.forEach((row, i) => {
    const n = i + 1
    if (!row.nama.trim()) {
      errors.push({ row: n, col: 'Nama', message: 'tidak boleh kosong.' })
    }
    if (!row.jabatan.trim()) {
      errors.push({ row: n, col: 'Jabatan', message: 'tidak boleh kosong.' })
    }
    if (!row.gaji) {
      errors.push({ row: n, col: 'Gaji', message: 'tidak boleh kosong.' })
    } else if (isNaN(Number(row.gaji)) || Number(row.gaji) <= 0) {
      errors.push({ row: n, col: 'Gaji', message: 'harus berupa angka lebih dari 0.' })
    }
  })
  return errors
}
