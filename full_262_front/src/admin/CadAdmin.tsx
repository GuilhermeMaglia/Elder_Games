import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { toast } from "sonner"
import { useAdminStore } from "./context/AdminContext"
import Titulo from "../components/Titulo"

const apiUrl = import.meta.env.VITE_API_URL

export default function AdminLogin() {
  const [modoCadastro, setModoCadastro] = useState(false)
  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [manterConectado, setManterConectado] = useState(false)

  const navigate = useNavigate()
  const { logaAdmin } = useAdminStore()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const rota = modoCadastro ? `${apiUrl}/admins` : `${apiUrl}/admins/login`
    const body = modoCadastro ? { nome, email, senha } : { email, senha }

    try {
      const response = await fetch(rota, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (response.ok) {
        const adminDados = await response.json()

        logaAdmin(adminDados)

        localStorage.removeItem("adminKey")
        sessionStorage.removeItem("adminKey")

        const key = adminDados.token || adminDados.id
        if (manterConectado) {
          localStorage.setItem("adminKey", String(key))
        } else {
          sessionStorage.setItem("adminKey", String(key))
        }

        toast.success(
          modoCadastro
            ? "Administrador cadastrado com sucesso!"
            : "Login de Admin efetuado!"
        )
        navigate("/admin")
      } else {
        const erro = await response.json()
        toast.error(erro.erro || "Falha na autenticação do administrador.")
      }
    } catch (error) {
      console.error("Erro na requisição:", error)
      toast.error("Erro ao conectar com o servidor.")
    }
  }

  return (
    <div className="min-h-screen bg-[#1C1C1E] text-white flex flex-col">
      {/* Cabeçalho do Projeto */}
      <Titulo />

      {/* Conteúdo Central do Login */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="bg-[#242426] border border-[#E5BD55]/40 rounded-2xl p-8 max-w-md w-full shadow-2xl">
          
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-[#E5BD55] via-[#C89B3C] to-[#8C6820] bg-clip-text text-transparent">
              {modoCadastro ? "Cadastrar Admin" : "Painel do Administrador"}
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              {modoCadastro
                ? "Crie uma nova conta de acesso administrativo"
                : "Identifique-se para gerir a loja"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {modoCadastro && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Nome do Administrador
                </label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                  placeholder="Ex: Carlos Admin"
                  className="w-full bg-[#1C1C1E] border border-[#C89B3C]/40 rounded-lg p-3 text-white text-sm focus:outline-none focus:border-[#E5BD55]"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@eldergames.com"
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
                id="manterConectadoAdmin"
                checked={manterConectado}
                onChange={(e) => setManterConectado(e.target.checked)}
                className="w-4 h-4 accent-[#E5BD55] bg-[#1C1C1E] border-gray-600 rounded cursor-pointer"
              />
              <label
                htmlFor="manterConectadoAdmin"
                className="text-sm text-gray-300 cursor-pointer select-none"
              >
                Manter conectado
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 mt-4 bg-gradient-to-r from-[#E5BD55] via-[#C89B3C] to-[#8C6820] text-black font-bold rounded-lg hover:brightness-110 transition-all shadow-md"
            >
              {modoCadastro ? "Cadastrar" : "Entrar"}
            </button>
          </form>

          <div className="mt-6 flex flex-col items-center space-y-2 border-t border-gray-800 pt-4 text-xs">
            <button
              type="button"
              onClick={() => setModoCadastro(!modoCadastro)}
              className="text-[#E5BD55] hover:underline"
            >
              {modoCadastro
                ? "Já possui conta? Fazer Login"
                : "Criar novo perfil de Administrador"}
            </button>

            <Link to="/" className="text-gray-400 hover:text-white transition-colors">
              ← Voltar para a Loja
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}