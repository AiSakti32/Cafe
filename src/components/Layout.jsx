import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { ShoppingCart, ChartColumn, Coffee, Settings, TriangleAlert } from 'lucide-react'
import { useStore, perluBackup } from '../store'
import Toast from './Toast'

const nav = [
  { to: '/', label: 'Kasir', icon: ShoppingCart, end: true },
  { to: '/laporan', label: 'Laporan', icon: ChartColumn },
  { to: '/menu', label: 'Menu', icon: Coffee },
  { to: '/pengaturan', label: 'Pengaturan', icon: Settings },
]

export default function Layout() {
  const ingatkanBackup = useStore(perluBackup)
  const namaCafe = useStore((s) => s.pengaturan.namaCafe)
  const { pathname } = useLocation()

  return (
    <div className="min-h-dvh lg:pl-56">
      {/* Sidebar (≥1024px) */}
      <aside className="fixed inset-y-0 left-0 hidden w-56 flex-col border-r border-stone-200 bg-white p-4 lg:flex">
        <div className="mb-6 flex items-center gap-3 px-1">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary-800 text-white shadow-sm">
            <Coffee size={20} aria-hidden="true" />
          </span>
          <span className="truncate text-lg font-bold">{namaCafe || 'Kasir Cafe'}</span>
        </div>
        <nav className="flex flex-col gap-1">
          {nav.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex min-h-11 items-center gap-3 rounded-xl px-3 font-medium transition-colors duration-200 ${
                  isActive ? 'bg-primary-800 text-white shadow-sm' : 'text-stone-600 hover:bg-primary-50 hover:text-primary-900'
                }`
              }
            >
              <Icon size={20} aria-hidden="true" />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="pb-[calc(4rem+env(safe-area-inset-bottom))] lg:pb-0">
        {/* Pengingat backup 7 hari (P3) */}
        {ingatkanBackup && (
          <Link to="/pengaturan" className="flex min-h-11 items-center gap-2 bg-amber-100 px-4 py-2 text-sm text-amber-900">
            <TriangleAlert size={18} className="shrink-0" aria-hidden="true" />
            <span>
              Sudah lebih dari 7 hari belum backup data. <b className="underline">Backup sekarang</b>
            </span>
          </Link>
        )}
        {/* Fade saat pindah halaman. Sengaja tanpa transform: transform di sini merusak posisi elemen fixed. */}
        <div key={pathname} className="animate-pudar">
          <Outlet />
        </div>
      </main>

      {/* Bottom nav (<1024px) */}
      <nav className="fixed inset-x-0 bottom-0 grid grid-cols-4 border-t border-stone-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
        {nav.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex h-16 flex-col items-center justify-center gap-0.5 text-xs font-medium transition-colors duration-200 ${
                isActive ? 'text-primary-800' : 'text-stone-500'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className={`grid h-8 w-14 place-items-center rounded-full transition-colors duration-200 ${isActive ? 'bg-primary-100' : ''}`}>
                  <Icon size={22} aria-hidden="true" />
                </span>
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <Toast />
    </div>
  )
}
