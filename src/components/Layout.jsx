import { NavLink, Outlet } from 'react-router-dom'
import { ShoppingCart, ChartColumn, Coffee, Settings } from 'lucide-react'

const nav = [
  { to: '/', label: 'Kasir', icon: ShoppingCart, end: true },
  { to: '/laporan', label: 'Laporan', icon: ChartColumn },
  { to: '/menu', label: 'Menu', icon: Coffee },
  { to: '/pengaturan', label: 'Pengaturan', icon: Settings },
]

export default function Layout() {
  return (
    <div className="min-h-dvh lg:pl-56">
      {/* Sidebar (≥1024px) */}
      <aside className="fixed inset-y-0 left-0 hidden w-56 flex-col border-r border-stone-200 bg-white p-4 lg:flex">
        <div className="mb-6 px-3 text-lg font-bold">Kasir Cafe</div>
        <nav className="flex flex-col gap-1">
          {nav.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex min-h-11 items-center gap-3 rounded-xl px-3 font-medium transition-colors ${
                  isActive ? 'bg-amber-700 text-white' : 'text-stone-600 hover:bg-stone-100'
                }`
              }
            >
              <Icon size={20} />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="pb-[calc(4rem+env(safe-area-inset-bottom))] lg:pb-0">
        <Outlet />
      </main>

      {/* Bottom nav (<1024px) */}
      <nav className="fixed inset-x-0 bottom-0 grid grid-cols-4 border-t border-stone-200 bg-white pb-[env(safe-area-inset-bottom)] lg:hidden">
        {nav.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex h-16 flex-col items-center justify-center gap-1 text-xs font-medium ${
                isActive ? 'text-amber-700' : 'text-stone-500'
              }`
            }
          >
            <Icon size={22} />
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
