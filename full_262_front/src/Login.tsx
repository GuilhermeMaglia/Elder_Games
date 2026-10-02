import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useClienteStore } from "./context/ClienteContext"

const apiUrl = import.meta.env.VITE_API_URL

export default function Login() {
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [manterConectado, setManterConectado] = useState(false)

  const navigate = useNavigate()
  const { logaCliente } = useClienteStore()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    try {
      const response = await fetch(`${apiUrl}/clientes/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      })

      if (response.ok) {
        const clienteDados = await response.json()

        logaCliente(clienteDados)

        localStorage.removeItem("clienteKey")
        sessionStorage.removeItem("clienteKey")

        if (manterConectado) {
          localStorage.setItem("clienteKey", clienteDados.id)
        } else {
          sessionStorage.setItem("clienteKey", clienteDados.id)
        }

        navigate("/")
      } else {
        alert("E-mail ou senha incorretos.")
      }
    } catch (error) {
      console.error("Erro ao realizar login:", error)
      alert("Erro ao conectar com o servidor.")
    }
  }

  return (
    <div className="min-h-screen bg-[#1C1C1E] text-white flex items-center justify-center px-4">
      <div className="bg-[#242426] border border-[#C89B3C]/30 rounded-2xl p-8 max-w-md w-full shadow-2xl">
        <h2 className="text-2xl font-bold text-[#E5BD55] mb-6 text-center">
          Identifique-se
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="teu@email.com"
              className="w-full bg-[#1C1C1E] border border-[#C89B3C]/40 rounded-lg p-3 text-white text-sm focus:outline-none focus:border-[#E5BD55]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Senha
            </label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full bg-[#1C1C1E] border border-[#C89B3C]/40 rounded-lg p-3 text-white text-sm focus:outline-none focus:border-[#E5BD55]"
            />
          </div>

          <div className="flex items-center space-x-2 pt-1">
            <input
              type="checkbox"
              id="manterConectado"
              checked={manterConectado}
              onChange={(e) => setManterConectado(e.target.checked)}
              className="w-4 h-4 accent-[#E5BD55] bg-[#1C1C1E] border-gray-600 rounded cursor-pointer"
            />
            <label
              htmlFor="manterConectado"
              className="text-sm text-gray-300 cursor-pointer select-none"
            >
              Manter conectado
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-3 mt-4 bg-gradient-to-r from-[#E5BD55] via-[#C89B3C] to-[#8C6820] text-black font-bold rounded-lg hover:brightness-110 transition-all shadow-md"
          >
            Entrar
          </button>
        </form>

        {/* Link para cadastrar novo cliente */}
        <div className="text-center mt-6 text-xs text-gray-400">
          Não tem uma conta?{" "}
          <Link to="/cadCliente" className="text-[#E5BD55] font-bold hover:underline ml-1">
            Cadastre-se aqui
          </Link>
        </div>
      </div>
    </div>
  )
}