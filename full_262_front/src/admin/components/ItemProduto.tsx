import type { Dispatch, SetStateAction } from "react"
import type { ProdutoType } from "../../utils/ProdutoType"

interface ItemProdutoProps {
  produto: ProdutoType
  produtos: ProdutoType[]
  setProdutos: Dispatch<SetStateAction<ProdutoType[]>>
}

export default function ItemProduto({ produto, produtos, setProdutos }: ItemProdutoProps) {
  const apiUrl = import.meta.env.VITE_API_URL

  async function excluirProduto() {
    if (!confirm(`Confirma a exclusão do produto "${produto.nome}"?`)) return

    const response = await fetch(`${apiUrl}/produtos/${produto.id}`, {
      method: "DELETE"
    })

    if (response.ok) {
      setProdutos(produtos.filter(p => p.id !== produto.id))
    } else {
      alert("Erro ao excluir o produto.")
    }
  }

  const imagemExibicao = produto.fotos && produto.fotos.length > 0
    ? produto.fotos[0].url
    : "/placeholder-game.png"

  return (
    <tr className="bg-[#1C1C1E] border-b border-[#C89B3C]/20 hover:bg-[#242426] transition-colors">
      <td className="px-6 py-4">
        <img 
          src={imagemExibicao} 
          alt={produto.nome} 
          className="w-16 h-12 object-cover rounded-lg border border-[#C89B3C]/30"
        />
      </td>
      <td className="px-6 py-4 font-bold text-white">
        {produto.nome}
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