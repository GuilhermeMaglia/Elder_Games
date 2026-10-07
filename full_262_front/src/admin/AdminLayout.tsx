import { Outlet } from "react-router-dom"
import { Titulo } from "./components/Titulo" // Ajuste o caminho se necessário

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-[#121214] text-white">
      <Titulo />
      <main className="max-w-screen-xl mx-auto p-4">
        <Outlet />
      </main>
    </div>
  )
}