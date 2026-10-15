const angka = new Intl.NumberFormat('id-ID')

export const rupiah = (n) => 'Rp' + angka.format(n)
