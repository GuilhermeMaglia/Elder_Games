import { Link } from "react-router-dom"
import { useClienteStore } from "../context/ClienteContext"
import { useNavigate } from "react-router-dom"

export default function Titulo() {
    const { cliente, deslogaCliente } = useClienteStore()
    const navigate = useNavigate()

    function clienteSair() {
        if (confirm("Confirma saída do sistema?")) {
            deslogaCliente()
            if (localStorage.getItem("clienteKey")) {
                localStorage.removeItem("clienteKey")
            }
            navigate("/login")
        }
    }

    return (
  <nav className="border-b border-[#C89B3C]/30 bg-[#1C1C1E] text-white shadow-md">
    <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
      <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
        <img src="icon.png" className="h-12 w-auto object-contain" alt="Logo" />
        <span className="self-center text-2xl font-semibold whitespace-nowrap bg-gradient-to-r from-[#E5BD55] via-[#C89B3C] to-[#8C6820] bg-clip-text text-transparent">
          Elder Games
        </span>
      </Link>
      
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

      <div className="hidden w-full md:block md:w-auto" id="navbar-solid-bg">
        <ul className="flex flex-col font-medium mt-4 rounded-lg bg-[#242426] md:flex-row md:items-center md:space-x-6 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-transparent">
          <li>
            {cliente.id ? (
              <div className="flex items-center space-x-4">
                <span className="text-[#D2AC67] font-medium">
                  {cliente.nome}
                </span>
                
                <Link 
                  to="/minhasPropostas" 
                  className="text-black font-semibold bg-gradient-to-r from-[#E5BD55] to-[#C89B3C] hover:from-[#C89B3C] hover:to-[#8C6820] focus:ring-2 focus:outline-none focus:ring-[#E5BD55] rounded-lg text-sm px-4 py-2 text-center transition-all duration-200"
                >
                  Minhas Propostas
                </Link>
                
                <span 
                  className="cursor-pointer font-bold text-gray-400 hover:text-[#E5BD55] transition-colors"
                  onClick={clienteSair}
                >
                  Sair
                </span>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="block py-2 px-3 md:p-0 text-[#E5BD55] hover:text-[#FFFFFF] rounded-sm hover:bg-[#242426] md:hover:bg-transparent transition-colors"
              >
                Identifique-se
              </Link>
            )}
          </li>
        </ul>
      </div>
    </div>
  </nav>
)
}