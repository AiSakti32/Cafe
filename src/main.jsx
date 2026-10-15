import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import Layout from './components/Layout'
import Kasir from './pages/Kasir'
import Laporan from './pages/Laporan'
import DetailTransaksi from './pages/DetailTransaksi'
import Menu from './pages/Menu'
import Pengaturan from './pages/Pengaturan'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Kasir />} />
          <Route path="laporan" element={<Laporan />} />
          <Route path="laporan/:id" element={<DetailTransaksi />} />
          <Route path="menu" element={<Menu />} />
          <Route path="pengaturan" element={<Pengaturan />} />
        </Route>
      </Routes>
    </HashRouter>
  </StrictMode>,
)
