import { useState } from 'react'
import { Plus, Pencil, Trash2, Check, X, ImagePlus } from 'lucide-react'
import { useStore } from '../store'
import { rupiah } from '../lib/format'
import MenuThumb from '../components/MenuThumb'
import { kompresGambar } from '../lib/gambar'
import { useTutup } from '../lib/useTutup'
import { toast } from '../components/Toast'

export default function Menu() {
  const [tab, setTab] = useState('menu')
  const [form, setForm] = useState(null) // null = tertutup, {} = menu baru, menu = ubah

  return (
    <div className="mx-auto max-w-3xl p-4">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h1 className="text-2xl font-bold">Menu</h1>
        {tab === 'menu' && (
          <button onClick={() => setForm({})} className="btn btn-primary">
            <Plus size={18} /> Tambah menu
          </button>
        )}
      </div>

      <div role="tablist" className="mb-4 grid grid-cols-2 gap-1 rounded-xl bg-stone-200/70 p-1">
        {[
          ['menu', 'Daftar Menu'],
          ['kategori', 'Kategori'],
        ].map(([id, label]) => (
          <button
            key={id}
            role="tab"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
            className={`min-h-11 rounded-lg font-semibold transition-colors duration-200 ${tab === id ? 'bg-white text-primary-800 shadow-sm' : 'text-stone-500'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'menu' ? <DaftarMenu onUbah={setForm} onTambah={() => setForm({})} /> : <DaftarKategori />}
      {form && <FormMenu menu={form} onTutup={() => setForm(null)} />}
    </div>
  )
}

function DaftarMenu({ onUbah, onTambah }) {
  const { menu, kategori, toggleTersedia, isiContoh } = useStore()

  if (!menu.length)
    return (
      <div className="rounded-2xl bg-white p-8 text-center ring-1 ring-stone-200">
        <p className="font-semibold">Belum ada menu</p>
        <p className="mt-1 text-sm text-stone-500">Tambah menu sendiri, atau isi menu contoh untuk langsung mencoba.</p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <button onClick={onTambah} className="btn btn-primary">
            <Plus size={18} /> Tambah menu
          </button>
          <button onClick={() => toast(`${isiContoh()} menu contoh ditambahkan`)} className="btn btn-secondary">
            Isi menu contoh
          </button>
        </div>
      </div>
    )

  return kategori.map((k) => {
    const isi = menu.filter((m) => m.kategoriId === k.id)
    if (!isi.length) return null
    return (
      <section key={k.id} className="mb-6">
        <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold text-stone-500">
          <span className="size-2.5 rounded-full" style={{ backgroundColor: k.warna }} />
          {k.nama} · {isi.length}
        </h2>
        <ul className="divide-y divide-stone-100 overflow-hidden rounded-2xl bg-white ring-1 ring-stone-200">
          {isi.map((m) => (
            <li key={m.id} className="flex items-center gap-3 p-3">
              <button onClick={() => onUbah(m)} className="flex min-w-0 flex-1 items-center gap-3 text-left">
                <MenuThumb
                  nama={m.nama}
                  foto={m.foto}
                  warna={k.warna}
                  className={`size-12 shrink-0 rounded-xl ${m.tersedia ? '' : 'opacity-40 grayscale'}`}
                />
                <div className="min-w-0">
                  <div className={`truncate font-semibold ${m.tersedia ? '' : 'text-stone-400'}`}>{m.nama}</div>
                  <div className="text-sm text-stone-500 tabular-nums">{rupiah(m.harga)}</div>
                </div>
              </button>
              <button
                onClick={() => toggleTersedia(m.id)}
                aria-pressed={m.tersedia}
                aria-label={`${m.nama}: ${m.tersedia ? 'Tersedia' : 'Habis'}. Ketuk untuk mengubah`}
                className={`min-h-11 w-24 shrink-0 rounded-full text-sm font-semibold transition active:scale-95 ${
                  m.tersedia ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' : 'bg-rose-50 text-rose-600 ring-1 ring-rose-200'
                }`}
              >
                {m.tersedia ? 'Tersedia' : 'Habis'}
              </button>
            </li>
          ))}
        </ul>
      </section>
    )
  })
}

function FormMenu({ menu, onTutup }) {
  const { kategori, simpanMenu, hapusMenu } = useStore()
  const [nama, setNama] = useState(menu.nama ?? '')
  const [kategoriId, setKategoriId] = useState(menu.kategoriId ?? kategori[0]?.id ?? '')
  const [harga, setHarga] = useState(menu.harga ?? '')
  const [foto, setFoto] = useState(menu.foto ?? null)
  useTutup(true, onTutup)

  // Validasi nama/harga/kategori pakai atribut bawaan (required, pattern, min).
  const simpan = (e) => {
    e.preventDefault()
    simpanMenu({ id: menu.id, nama: nama.trim(), kategoriId, harga: Number(harga), foto })
    toast(menu.id ? 'Menu disimpan' : 'Menu ditambahkan')
    onTutup()
  }

  const pilihFoto = async (e) => {
    const file = e.target.files[0]
    e.target.value = ''
    if (!file) return
    try {
      setFoto(await kompresGambar(file, 300))
    } catch {
      alert('Foto tidak bisa dibaca. Coba foto lain (JPG/PNG).')
    }
  }

  const hapus = () => {
    if (confirm(`Hapus menu "${menu.nama}"?`)) {
      hapusMenu(menu.id)
      toast('Menu dihapus')
      onTutup()
    }
  }

  return (
    <div onClick={onTutup} className="fixed inset-0 z-50 flex animate-pudar items-end justify-center bg-stone-900/50 sm:items-center sm:p-4">
      <form
        onSubmit={simpan}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90dvh] w-full animate-naik overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:animate-muncul p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] sm:max-w-md sm:rounded-3xl sm:pb-5"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">{menu.id ? 'Ubah menu' : 'Tambah menu'}</h2>
          <button type="button" onClick={onTutup} aria-label="Tutup" className="grid size-11 place-items-center rounded-full hover:bg-stone-100">
            <X size={20} />
          </button>
        </div>

        <div className="mb-4 flex items-center gap-4">
          <MenuThumb
            nama={nama}
            foto={foto}
            warna={kategori.find((k) => k.id === kategoriId)?.warna}
            className="size-20 shrink-0 rounded-2xl text-2xl"
          />
          <div className="flex flex-wrap gap-2">
            <label className="btn btn-secondary cursor-pointer">
              <ImagePlus size={18} /> {foto ? 'Ganti foto' : 'Pilih foto'}
              <input type="file" accept="image/*" onChange={pilihFoto} className="sr-only" />
            </label>
            {foto && (
              <button type="button" onClick={() => setFoto(null)} className="btn text-rose-600 hover:bg-rose-50">
                Hapus foto
              </button>
            )}
          </div>
        </div>

        <label className="mb-3 block">
          <span className="mb-1 block text-sm font-semibold">Nama menu</span>
          <input
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            required
            pattern=".*\S.*"
            title="Nama menu wajib diisi"
            placeholder="Contoh: Es Kopi Susu"
            className="input"
          />
        </label>

        <label className="mb-3 block">
          <span className="mb-1 block text-sm font-semibold">Kategori</span>
          <select value={kategoriId} onChange={(e) => setKategoriId(e.target.value)} required className="input">
            {kategori.map((k) => (
              <option key={k.id} value={k.id}>
                {k.nama}
              </option>
            ))}
          </select>
          {!kategori.length && <span className="mt-1 block text-sm text-rose-600">Belum ada kategori. Buat dulu di tab Kategori.</span>}
        </label>

        <label className="mb-5 block">
          <span className="mb-1 block text-sm font-semibold">Harga (Rp)</span>
          <input
            type="number"
            inputMode="numeric"
            min="1"
            step="1"
            value={harga}
            onChange={(e) => setHarga(e.target.value)}
            required
            placeholder="18000"
            className="input tabular-nums"
          />
        </label>

        <div className="flex gap-2">
          {menu.id && (
            <button type="button" onClick={hapus} className="btn text-rose-600 ring-1 ring-rose-200 hover:bg-rose-50">
              <Trash2 size={18} /> Hapus
            </button>
          )}
          <button className="btn btn-primary flex-1">Simpan</button>
        </div>
      </form>
    </div>
  )
}

function DaftarKategori() {
  const { kategori, menu, tambahKategori, ubahKategori, hapusKategori } = useStore()
  const [baru, setBaru] = useState('')
  const [edit, setEdit] = useState(null) // { id, nama } kategori yang sedang diubah

  const tambah = (e) => {
    e.preventDefault()
    tambahKategori(baru.trim())
    toast('Kategori ditambahkan')
    setBaru('')
  }

  const simpanEdit = (e) => {
    e.preventDefault()
    ubahKategori(edit.id, edit.nama.trim())
    toast('Nama kategori diubah')
    setEdit(null)
  }

  return (
    <>
      <form onSubmit={tambah} className="mb-4 flex gap-2">
        <input
          value={baru}
          onChange={(e) => setBaru(e.target.value)}
          required
          pattern=".*\S.*"
          title="Nama kategori wajib diisi"
          placeholder="Nama kategori baru"
          aria-label="Nama kategori baru"
          className="input"
        />
        <button className="btn btn-primary shrink-0">
          <Plus size={18} /> Tambah
        </button>
      </form>

      <ul className="divide-y divide-stone-100 overflow-hidden rounded-2xl bg-white ring-1 ring-stone-200">
        {kategori.map((k) => {
          const jumlah = menu.filter((m) => m.kategoriId === k.id).length
          return (
            <li key={k.id} className="flex min-h-17 items-center gap-3 p-3">
              <span className="size-4 shrink-0 rounded-full" style={{ backgroundColor: k.warna }} />
              {edit?.id === k.id ? (
                <form onSubmit={simpanEdit} className="flex flex-1 gap-2">
                  <input
                    autoFocus
                    value={edit.nama}
                    onChange={(e) => setEdit({ ...edit, nama: e.target.value })}
                    required
                    pattern=".*\S.*"
                    title="Nama kategori wajib diisi"
                    aria-label="Nama kategori"
                    className="input"
                  />
                  <button aria-label="Simpan" className="btn btn-primary shrink-0 px-3">
                    <Check size={18} />
                  </button>
                  <button type="button" aria-label="Batal" onClick={() => setEdit(null)} className="btn btn-secondary shrink-0 px-3">
                    <X size={18} />
                  </button>
                </form>
              ) : (
                <>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-semibold">{k.nama}</div>
                    <div className="text-sm text-stone-500">{jumlah} menu</div>
                  </div>
                  <button
                    onClick={() => setEdit({ id: k.id, nama: k.nama })}
                    aria-label={`Ubah nama ${k.nama}`}
                    className="grid size-11 place-items-center rounded-xl text-stone-600 hover:bg-stone-100"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => {
                      if (!confirm(`Hapus kategori "${k.nama}"?`)) return
                      hapusKategori(k.id)
                      toast('Kategori dihapus')
                    }}
                    disabled={jumlah > 0}
                    aria-label={`Hapus ${k.nama}`}
                    className="grid size-11 place-items-center rounded-xl text-rose-600 hover:bg-rose-50 disabled:text-stone-300 disabled:hover:bg-transparent"
                  >
                    <Trash2 size={18} />
                  </button>
                </>
              )}
            </li>
          )
        })}
      </ul>
      <p className="mt-2 text-sm text-stone-500">Kategori yang masih dipakai menu tidak bisa dihapus.</p>
    </>
  )
}
