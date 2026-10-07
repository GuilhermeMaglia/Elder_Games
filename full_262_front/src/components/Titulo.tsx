import { Link } from "react-router-dom"
import { FiShoppingCart, FiUser } from "react-icons/fi"

export default function Titulo() {
  return (
    <nav className="border-b border-[#C89B3C]/30 bg-[#1C1C1E] text-white shadow-md">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        
        {/* Logo e Nome do Cliente */}
        <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img src="/icon.png" className="h-10 w-auto object-contain" alt="Logo Elder Games" />
          <span className="self-center text-xl font-semibold whitespace-nowrap bg-gradient-to-r from-[#E5BD55] via-[#C89B3C] to-[#8C6820] bg-clip-text text-transparent">
            Elder Games
          </span>
        </Link>

        {/* Links de Navegação do Cliente */}
        <div className="flex items-center space-x-4 md:space-x-6 text-sm">
          <Link
            to="/"
            className="text-gray-300 hover:text-[#E5BD55] transition-colors font-medium"
          >
            Início
          </Link>

          <Link
            to="/meusPedidos"
            className="flex items-center space-x-1 text-gray-300 hover:text-[#E5BD55] transition-colors font-medium"
          >
            <FiShoppingCart className="text-[#E5BD55]" />
            <span>Meus Pedidos</span>
          </Link>

          <Link
            to="/login"
            className="flex items-center space-x-1 text-gray-300 hover:text-[#E5BD55] transition-colors font-medium"
          >
            <FiUser className="text-[#E5BD55]" />
            <span>Entrar</span>
          </Link>

          <span className="text-gray-600">|</span>

          {/* Atalho para o Admin */}
          <Link
            to="/admin/login"
            className="text-xs text-gray-400 hover:text-[#E5BD55] transition-colors"
          >
            Área Admin
          </Link>
        </div>

      </div>
    </nav>
  )
}