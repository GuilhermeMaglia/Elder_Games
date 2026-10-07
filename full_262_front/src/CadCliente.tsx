import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000"

export default function CadCliente() {
  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [cidade, setCidade] = useState("")

  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    try {
      const response = await fetch(`${apiUrl}/clientes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, senha, cidade }),
      })

      if (response.ok) {
        alert("Conta criada com sucesso! Faça login para continuar.")
        navigate("/login")
      } else {
        const erro = await response.json()
        alert(erro.erro || "Erro ao cadastrar cliente.")
      }
    } catch (error) {
      console.error("Erro ao conectar com a API:", error)
      alert("Erro de conexão com o servidor.")
    }
  }

  return (
    <div className="min-h-screen bg-[#1C1C1E] text-white flex items-center justify-center px-4 py-8">
      <div className="bg-[#242426] border border-[#C89B3C]/30 rounded-2xl p-8 max-w-md w-full shadow-2xl">
        <h2 className="text-2xl font-bold text-[#E5BD55] mb-2 text-center">
          Criar Conta de Cliente
        </h2>
        <p className="text-xs text-gray-400 text-center mb-6">
          Preencha os dados abaixo para se cadastrar na loja
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Nome Completo
            </label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              minLength={6}
              maxLength={60}
              placeholder="Seu nome"
              className="w-full bg-[#1C1C1E] border border-[#C89B3C]/40 rounded-lg p-3 text-white text-sm focus:outline-none focus:border-[#E5BD55]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Cidade
            </label>
            <input
              type="text"
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
              required
              minLength={3}
              maxLength={30}
              placeholder="Sua cidade"
              className="w-full bg-[#1C1C1E] border border-[#C89B3C]/40 rounded-lg p-3 text-white text-sm focus:outline-none focus:border-[#E5BD55]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              maxLength={60}
              placeholder="seu@email.com"
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
              minLength={8}
              maxLength={60}
              placeholder="••••••••"
              className="w-full bg-[#1C1C1E] border border-[#C89B3C]/40 rounded-lg p-3 text-white text-sm focus:outline-none focus:border-[#E5BD55]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 mt-4 bg-gradient-to-r from-[#E5BD55] via-[#C89B3C] to-[#8C6820] text-black font-bold rounded-lg hover:brightness-110 transition-all shadow-md"
          >
            Cadastrar
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-6">
          Já tem uma conta?{" "}
          <Link to="/login" className="text-[#E5BD55] hover:underline font-semibold">
            Faça Login
          </Link>
        </p>
      </div>
    </div>
  )
}