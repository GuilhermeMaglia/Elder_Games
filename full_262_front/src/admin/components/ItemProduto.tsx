import type { Dispatch, SetStateAction } from "react"
import type { ProdutoType } from "../../utils/ProdutoType"

interface ItemProdutoProps {
  produto: ProdutoType
  produtos: ProdutoType[]
  setProdutos: Dispatch<SetStateAction<ProdutoType[]>>
}

export default function ItemProduto({ produto, produtos, setProdutos }: ItemProdutoProps) {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000"

  async function excluirProduto() {
    if (!confirm(`Confirma a exclusão do produto "${produto.titulo}"?`)) return

    const token = localStorage.getItem("adminKey") || sessionStorage.getItem("adminKey")
    const response = await fetch(`${apiUrl}/produtos/${produto.id}`, {
      method: "DELETE",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    })

    if (response.ok) {
      setProdutos(produtos.filter(p => p.id !== produto.id))
      alert("Produto excluído com sucesso.")
    } else {
      const erro = await response.json().catch(() => ({}))
      alert(erro.erro || "Erro ao excluir o produto.")
    }
  }

  const imagemExibicao = produto.foto || "/placeholder-game.png"

  return (
    <tr className="bg-[#1C1C1E] border-b border-[#C89B3C]/20 hover:bg-[#242426] transition-colors">
      <td className="px-6 py-4">
        <img 
          src={imagemExibicao} 
          alt={produto.titulo}
          className="w-16 h-12 object-cover rounded-lg border border-[#C89B3C]/30"
        />
      </td>
      <td className="px-6 py-4 font-bold text-white">
        {produto.titulo}
      </td>
      <td className="px-6 py-4 text-gray-300">
        {produto.marca?.nome || "N/A"}
      </td>
      <td className="px-6 py-4 text-gray-300">
        {produto.categoria?.nome || "Geral"}
      </td>
      <td className="px-6 py-4 font-semibold text-[#E5BD55]">
        R$: {Number(produto.preco).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
      </td>
      <td className="px-6 py-4 text-gray-300">
        {produto.quant} un.
      </td>
      <td className="px-6 py-4">
        <button
          onClick={excluirProduto}
          className="text-red-400 hover:text-red-200 font-medium transition-colors"
        >
          Excluir
        </button>
      </td>
    </tr>
  )
}