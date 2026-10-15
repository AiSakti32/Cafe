import { useParams } from 'react-router-dom'

export default function DetailTransaksi() {
  const { id } = useParams()
  return <h1 className="p-4 text-2xl font-bold">Detail Transaksi {id}</h1>
}
