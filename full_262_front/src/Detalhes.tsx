import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { useClienteStore } from "./context/ClienteContext"
import type { ProdutoType } from "./utils/ProdutoType"

const apiUrl = import.meta.env.VITE_API_URL

type Inputs = {
  descricao: string
}

export default function Detalhes() {
  const { id } = useParams()
  const [produto, setProduto] = useState<ProdutoType | null>(null)
  const [fotoPrincipal, setFotoPrincipal] = useState<string>("")
  const { cliente } = useClienteStore()
  const { register, handleSubmit, reset } = useForm<Inputs>()

  useEffect(() => {
    async function buscaProduto() {
      const response = await fetch(`${apiUrl}/produtos/${id}`)
      const dados = await response.json()
      setProduto(dados)
      
      // Define a primeira foto como principal por padrão
      if (dados.fotos && dados.fotos.length > 0) {
        setFotoPrincipal(dados.fotos[0].url)
      }
    }
    buscaProduto()
  }, [id])

  async function enviaPedido(data: Inputs) {
    if (!cliente.id) {
      toast.error("Você precisa estar logado para realizar um pedido.")
      return
    }

    const response = await fetch(`${apiUrl}/pedidos`, {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({
        clienteId: cliente.id,
        produtoId: Number(id),
        descricao: data.descricao
      })
    })

    if (response.status === 201) {
      toast.success("Pedido realizado com sucesso!")
      reset()
    } else {
      toast.error("Erro: Não foi possível registrar o seu pedido.")
    }
  }

  if (!produto) {
    return (
      <div className="min-h-screen bg-[#1C1C1E] flex items-center justify-center text-[#E5BD55]">
        Carregando detalhes do produto...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#1C1C1E] text-white py-8 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 bg-[#242426] p-6 rounded-2xl border border-[#C89B3C]/30 shadow-xl">
        
        {/* Galeria de Fotos */}
        <div className="flex flex-col gap-4">
          <div className="w-full h-80 bg-[#E3E3E3] rounded-xl overflow-hidden flex items-center justify-center border border-[#C89B3C]/30">
            <img 
              src={fotoPrincipal || "/placeholder-game.png"} 
              alt={produto.nome} 
              className="w-full h-full object-cover"
            />
          </div>

          {/* Miniaturas de Fotos */}
          {produto.fotos && produto.fotos.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {produto.fotos.map((foto) => (
                <button
                  key={foto.id}
                  onClick={() => setFotoPrincipal(foto.url)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    fotoPrincipal === foto.url ? "border-[#E5BD55]" : "border-transparent opacity-60"
                  }`}
                >
                  <img src={foto.url} alt="Miniatura" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Informações do Produto & Form de Pedido */}
        <div className="flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[#E5BD55] via-[#C89B3C] to-[#D2AC67] bg-clip-text text-transparent">
                {produto.nome}
              </h1>
              {produto.marca?.nome && (
                <span className="bg-[#1C1C1E] text-[#E5BD55] text-xs font-bold px-3 py-1.5 rounded-lg border border-[#C89B3C]/40">
                  {produto.marca.nome}
                </span>
              )}
            </div>

            <p className="text-2xl font-extrabold text-[#E5BD55] mt-3">
              R$: {Number(produto.preco).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </p>

            <div className="mt-4 space-y-2 text-sm text-gray-300">
              <p><b>Categoria:</b> {produto.categoria?.nome || "Geral"}</p>
              <p><b>Ano de Lançamento:</b> {produto.ano}</p>
              <p><b>Disponibilidade:</b> {produto.quant > 0 ? `${produto.quant} unidades em estoque` : "Esgotado"}</p>
            </div>

            <div className="mt-4 pt-4 border-t border-[#C89B3C]/20">
              <h3 className="text-sm font-semibold text-[#E5BD55] mb-1">Descrição:</h3>
              <p className="text-gray-300 text-sm leading-relaxed">{produto.descricao}</p>
            </div>
          </div>

          {/* Formulário de Pedido */}
          <form onSubmit={handleSubmit(enviaPedido)} className="mt-6 pt-6 border-t border-[#C89B3C]/20">
            <label className="block text-sm font-medium text-[#E5BD55] mb-2">
              Observações / Solicitação do Pedido:
            </label>
            <textarea
              {...register("descricao")}
              rows={3}
              placeholder="Ex: Gostaria de saber o prazo de entrega para o meu CEP..."
              className="w-full p-3 bg-[#1C1C1E] text-white border border-[#C89B3C]/40 rounded-xl focus:outline-none focus:border-[#E5BD55] text-sm"
              required
            ></textarea>

            <div className="flex gap-4 mt-4">
              <Link
                to="/"
                className="flex-1 py-3 text-center text-sm font-semibold text-[#E5BD55] bg-transparent border border-[#C89B3C]/50 rounded-xl hover:bg-[#C89B3C]/20 transition-all"
              >
                Voltar
              </Link>
              <button
                type="submit"
                disabled={produto.quant <= 0}
                className="flex-1 py-3 text-sm font-bold text-black bg-gradient-to-r from-[#E5BD55] via-[#C89B3C] to-[#8C6820] hover:brightness-110 rounded-xl transition-all disabled:opacity-50"
              >
                Fazer Pedido
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  )
}