import { Link, useNavigate } from "react-router-dom"

interface AdminLayoutProps {
  children?: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const navigate = useNavigate()

  function deslogarAdmin() {
    localStorage.removeItem("adminKey")
    sessionStorage.removeItem("adminKey")
    navigate("/admin/login")
  }

  return (
    <div className="min-h-screen bg-[#141415] text-white">
      <header className="bg-[#1C1C1E] border-b border-[#C89B3C]/30 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <h1 className="text-xl font-bold bg-gradient-to-r from-[#E5BD55] via-[#C89B3C] to-[#8C6820] bg-clip-text text-transparent">
            Elder Games - Admin
          </h1>

          <nav className="flex space-x-4 text-sm text-gray-300">
            <Link to="/admin" className="hover:text-[#E5BD55] transition-colors">
              Dashboard
            </Link>
            <Link to="/admin/produtos" className="hover:text-[#E5BD55] transition-colors">
              Produtos
            </Link>
            <Link to="/admin/novo-produto" className="bg-[#C89B3C] hover:bg-[#E5BD55] text-black font-semibold px-3 py-1 rounded transition-colors">
              + Cadastrar Jogo/Item
            </Link>
          </nav>
        </div>

        <div className="flex items-center space-x-4 text-sm">
          <Link to="/" className="text-gray-400 hover:text-white transition-colors">
            Ver Loja
          </Link>
          <button onClick={deslogarAdmin} className="bg-red-600/80 hover:bg-red-600 text-white px-3 py-1 rounded transition-colors cursor-pointer">
            Sair
          </button>
        </div>
      </header>

      <main className="p-6">
        {children}
      </main>
    </div>
  )
}