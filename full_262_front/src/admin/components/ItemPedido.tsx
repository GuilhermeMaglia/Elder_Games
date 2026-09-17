import { TiDeleteOutline } from "react-icons/ti"
import { FaRegEdit } from "react-icons/fa"
import { FcOk } from "react-icons/fc"

import type { PedidoType } from "../../utils/PedidoType"
import { useAdminStore } from "../context/AdminContext"

type ItemPedidoProps = {
  pedido: PedidoType
  pedidos: PedidoType[]
  setPedidos: React.Dispatch<React.SetStateAction<PedidoType[]>>
}

const apiUrl = import.meta.env.VITE_API_URL

export default function ItemPedido({ pedido, pedidos, setPedidos }: ItemPedidoProps) {
  const { admin } = useAdminStore()

  async function excluirPedido() {
    if (confirm(`Confirma a exclusão do pedido para "${pedido.produto?.nome}"?`)) {
      const response = await fetch(`${apiUrl}/pedidos/${pedido.id}`, {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${admin.token}`
        }
      })

      if (response.ok) {
        setPedidos(pedidos.filter(x => x.id !== pedido.id))
        alert("Pedido excluído com sucesso.")
      } else {
        alert("Erro ao excluir o pedido.")
      }
    }
  }

  async function atualizarStatus() {
    const novoStatus = prompt(`Informe o novo status do pedido (ex: Em Processamento, Enviado, Concluído):`, pedido.status || "")

    if (novoStatus == null || novoStatus.trim() === "") {
      return
    }

    const response = await fetch(`${apiUrl}/pedidos/${pedido.id}`, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${admin.token}`
      },
      body: JSON.stringify({ status: novoStatus })
    })

    if (response.ok) {
      const pedidosAtualizados = pedidos.map(x => {
        if (x.id === pedido.id) {
          return { ...x, status: novoStatus }
        }
        return x
      })
      setPedidos(pedidosAtualizados)
    } else {
      alert("Erro ao atualizar o status do pedido.")
    }
  }

  const imagemExibicao = pedido.produto?.fotos && pedido.produto.fotos.length > 0
    ? pedido.produto.fotos[0].url
    : "/placeholder-game.png"

  return (
    <tr className="bg-[#1C1C1E] border-b border-[#C89B3C]/20 hover:bg-[#242426] transition-colors">
      <td className="px-6 py-4">
        <img 
          src={imagemExibicao} 
          alt={pedido.produto?.nome || "Foto do Produto"} 
          className="w-20 h-16 object-cover rounded-lg border border-[#C89B3C]/30"
        />
      </td>
      <td className="px-6 py-4 font-bold text-white">
        {pedido.produto?.nome || "Produto Não Encontrado"}
      </td>
      <td className="px-6 py-4 font-semibold text-[#E5BD55]">
        R$: {Number(pedido.produto?.preco || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
      </td>
      <td className="px-6 py-4 text-gray-300">
        {pedido.clienteId}
      </td>
      <td className="px-6 py-4 text-gray-300">
        {pedido.descricao}
      </td>
      <td className="px-6 py-4">
        <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-[#C89B3C]/20 text-[#E5BD55] border border-[#C89B3C]/40">
          {pedido.status || "Pendente"}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          {pedido.status === "Concluído" ? (
            <FcOk className="text-3xl" title="Pedido Concluído" />
          ) : (
            <>
              <TiDeleteOutline 
                className="text-3xl text-red-500 hover:text-red-400 cursor-pointer transition-colors" 
                title="Excluir Pedido"
                onClick={excluirPedido} 
              />
              <FaRegEdit 
                className="text-2xl text-[#E5BD55] hover:text-[#C89B3C] cursor-pointer transition-colors" 
                title="Atualizar Status"
                onClick={atualizarStatus} 
              />
            </>
          )}
        </div>
      </td>
    </tr>
  )
}