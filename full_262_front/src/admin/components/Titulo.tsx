import { Link, useNavigate } from "react-router-dom"
import { FiUsers, FiBox, FiPlusSquare, FiShoppingBag } from "react-icons/fi"
import { useAdminStore } from "../context/AdminContext"

export function Titulo() {
  const { admin, deslogaAdmin } = useAdminStore()
  const navigate = useNavigate()

  function adminSair() {
    if (confirm("Confirma saída do painel administrativo?")) {
      deslogaAdmin()
      if (localStorage.getItem("adminKey")) {
        localStorage.removeItem("adminKey")
      }
      if (sessionStorage.getItem("adminKey")) {
        sessionStorage.removeItem("adminKey")
      }
      navigate("/admin/login")
    }
  }

  return (
    <nav className="border-b border-[#C89B3C]/30 bg-[#1C1C1E] text-white shadow-md">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        
        {/* Lado Esquerdo: Logo e Menu de Navegação das Rotas Admin */}
        <div className="flex items-center space-x-6">
          <Link to="/admin" className="flex items-center space-x-3 rtl:space-x-reverse">
            <img src="/icon.png" className="h-10 w-auto object-contain" alt="Logo Elder Games" />
            <span className="self-center text-2xl font-semibold whitespace-nowrap bg-gradient-to-r from-[#E5BD55] via-[#C89B3C] to-[#8C6820] bg-clip-text text-transparent">
              Elder Games: Admin
            </span>
          </Link>

          {/* Links para as Páginas/Rotas do Admin */}
          <div className="hidden md:flex items-center space-x-4 border-l border-gray-700 pl-6 text-sm font-medium">
            <Link
              to="/admin/produtos"
              className="flex items-center space-x-1.5 text-gray-300 hover:text-[#E5BD55] transition-colors"
            >
              <FiBox className="text-[#E5BD55]" />
              <span>Produtos</span>
            </Link>

            <Link
              to="/admin/pedidos"
              className="flex items-center space-x-1.5 text-gray-300 hover:text-[#E5BD55] transition-colors"
            >
              <FiShoppingBag className="text-[#E5BD55]" />
              <span>Pedidos</span>
            </Link>
          </div>
        </div>

        {/* Botão Mobile */}
        <button
          data-collapse-toggle="navbar-solid-bg"
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-[#E5BD55] rounded-lg md:hidden hover:bg-[#242426] focus:outline-none focus:ring-2 focus:ring-[#C89B3C]"
          aria-controls="navbar-solid-bg"
          aria-expanded="false"
        >
          <span className="sr-only">Open main menu</span>
          <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
          </svg>
        </button>

        {/* Lado Direito: Usuário, Botão + Novo Item, Sair e Ver Loja */}
        <div className="hidden w-full md:block md:w-auto" id="navbar-solid-bg">
          <ul className="flex flex-col font-medium mt-4 rounded-lg bg-[#242426] md:flex-row md:items-center md:space-x-6 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-transparent">
            <li>
              {admin?.id || admin?.nome ? (
                <div className="flex items-center space-x-4 text-sm">
                  {/* Nome do Admin Logado */}
                  <div className="flex items-center text-[#D2AC67] font-medium">
                    <FiUsers className="mr-2 text-[#E5BD55]" />
                    <span>{admin.nome}</span>
                  </div>

                  {/* Botão Dourado de Novo Item */}
                  <Link
                    to="/admin/produtos/novo"
                    className="flex items-center space-x-1 px-4 py-2 bg-gradient-to-r from-[#E5BD55] via-[#C89B3C] to-[#8C6820] text-black font-bold rounded-lg hover:brightness-110 transition-all shadow-md text-sm"
                  >
                    <FiPlusSquare />
                    <span>+ Novo Item</span>
                  </Link>

                  {/* Botão Sair */}
                  <span
                    className="cursor-pointer font-bold text-gray-400 hover:text-[#E5BD55] transition-colors"
                    onClick={adminSair}
                  >
                    Sair
                  </span>

                  <span className="text-gray-600">|</span>

                  {/* Atalho para a Loja Pública */}
                  <Link
                    to="/"
                    className="text-xs text-gray-400 hover:text-[#E5BD55] transition-colors"
                  >
                    Ver Loja
                  </Link>
                </div>
              ) : (
                <div className="flex items-center space-x-4 text-sm">
                  <Link
                    to="/admin/login"
                    className="text-[#E5BD55] hover:text-white transition-colors font-medium"
                  >
                    Login Admin
                  </Link>

                  <span className="text-gray-600">|</span>

                  <Link
                    to="/"
                    className="text-xs text-gray-400 hover:text-[#E5BD55] transition-colors"
                  >
                    Ver Loja
                  </Link>
                </div>
              )}
            </li>
          </ul>
        </div>

      </div>
    </nav>
  )
}