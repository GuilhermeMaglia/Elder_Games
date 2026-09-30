import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

const apiUrl = import.meta.env.VITE_API_URL

export default function AdminNovoProduto() {
  const [titulo, setTitulo] = useState("")
  const [genero, setGenero] = useState("")
  const [preco, setPreco] = useState("")
  const [foto, setFoto] = useState("")
  const [descricao, setDescricao] = useState("")
  
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    try {
      const response = await fetch(`${apiUrl}/produtos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titulo,
          genero,
          preco: Number(preco),
          foto,
          descricao,
        }),
      })

      if (response.ok) {
        toast.success("Produto cadastrado com sucesso!")
        navigate("/admin/produtos")
      } else {
        const erro = await response.json()
        toast.error(erro.erro || "Erro ao cadastrar produto.")
      }
    } catch (error) {
      console.error("Erro na requisição:", error)
      toast.error("Erro ao conectar com o servidor.")
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-[#242426] border border-[#C89B3C]/30 p-6 rounded-xl shadow-xl">
      <h2 className="text-xl font-bold text-[#E5BD55] mb-6">Cadastrar Novo Produto</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Título do Jogo</label>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
            className="w-full bg-[#1C1C1E] border border-gray-700 rounded-lg p-2.5 text-white text-sm focus:border-[#E5BD55] outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Gênero</label>
            <input
              type="text"
              value={genero}
              onChange={(e) => setGenero(e.target.value)}
              required
              className="w-full bg-[#1C1C1E] border border-gray-700 rounded-lg p-2.5 text-white text-sm focus:border-[#E5BD55] outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Preço (R$)</label>
            <input
              type="number"
              step="0.01"
              value={preco}
              onChange={(e) => setPreco(e.target.value)}
              required
              className="w-full bg-[#1C1C1E] border border-gray-700 rounded-lg p-2.5 text-white text-sm focus:border-[#E5BD55] outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">URL da Imagem</label>
          <input
            type="url"
            value={foto}
            onChange={(e) => setFoto(e.target.value)}
            required
            placeholder="https://..."
            className="w-full bg-[#1C1C1E] border border-gray-700 rounded-lg p-2.5 text-white text-sm focus:border-[#E5BD55] outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Descrição</label>
          <textarea
            rows={4}
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            required
            className="w-full bg-[#1C1C1E] border border-gray-700 rounded-lg p-2.5 text-white text-sm focus:border-[#E5BD55] outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-[#E5BD55] via-[#C89B3C] to-[#8C6820] text-black font-bold rounded-lg hover:brightness-110 transition-all shadow-md"
        >
          Salvar Produto
        </button>
      </form>
    </div>
  )
}