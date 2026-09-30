import { useEffect, useState } from "react"
import { toast } from "sonner"

const apiUrl = import.meta.env.VITE_API_URL

interface Pedido {
  id: number
  data: string
  status: string
  total: number
  cliente?: { nome: string }
}

export default function AdminPedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([])

  useEffect(() => {
    carregaPedidos()
  }, [])

  async function carregaPedidos() {
    try {
      const response = await fetch(`${apiUrl}/pedidos`)
      if (response.ok) {
        const dados = await response.json()
        setPedidos(dados)
      }
    } catch (error) {
      console.error("Erro ao carregar pedidos:", error)
    }
  }

  async function alteraStatus(id: number, novoStatus: string) {
    try {
      const response = await fetch(`${apiUrl}/pedidos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: novoStatus }),
      })

      if (response.ok) {
        toast.success(`Status do pedido #${id} atualizado!`)
        setPedidos((prev) =>
          prev.map((p) => (p.id === id ? { ...p, status: novoStatus } : p))
        )
      } else {
        toast.error("Erro ao atualizar status.")
      }
    } catch (error) {
      console.error("Erro na alteração:", error)
      toast.error("Falha de conexão com o servidor.")
    }
  }

  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-[#E5BD55] mb-6">Gestão de Pedidos</h2>

      <div className="bg-[#242426] border border-[#C89B3C]/30 rounded-xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-sm text-gray-300">
          <thead className="bg-[#1C1C1E] text-[#E5BD55] uppercase text-xs border-b border-[#C89B3C]/30">
            <tr>
              <th className="p-4"># ID</th>
              <th className="p-4">Cliente</th>
              <th className="p-4">Data</th>
              <th className="p-4">Valor Total</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {pedidos.map((pedido) => (
              <tr key={pedido.id} className="hover:bg-[#1C1C1E]/50 transition-colors">
                <td className="p-4 font-bold text-white">#{pedido.id}</td>
                <td className="p-4">{pedido.cliente?.nome || "Cliente Geral"}</td>
                <td className="p-4">{new Date(pedido.data).toLocaleDateString("pt-BR")}</td>
                <td className="p-4 text-[#E5BD55] font-semibold">
                  R$ {Number(pedido.total).toFixed(2)}
                </td>
                <td className="p-4">
                  <select
                    value={pedido.status}
                    onChange={(e) => alteraStatus(pedido.id, e.target.value)}
                    className="bg-[#1C1C1E] border border-[#C89B3C]/40 text-white rounded-lg p-1.5 text-xs focus:outline-none focus:border-[#E5BD55]"
                  >
                    <option value="Pendente">Pendente</option>
                    <option value="Em Processamento">Em Processamento</option>
                    <option value="Enviado">Enviado</option>
                    <option value="Entregue">Entregue</option>
                    <option value="Cancelado">Cancelado</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}