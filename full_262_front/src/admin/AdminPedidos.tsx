import { useEffect, useState } from "react"

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000"

type StatusPedido = "PENDENTE" | "EM_ANDAMENTO" | "CONCLUIDO" | "CANCELADO"

interface PedidoAdmin {
  id: number
  createdAt: string
  status: StatusPedido
  cliente: { nome: string }
  produto: { preco: number | string }
}

const statusPedidos: { value: StatusPedido; label: string }[] = [
  { value: "PENDENTE", label: "Pendente" },
  { value: "EM_ANDAMENTO", label: "Em andamento" },
  { value: "CONCLUIDO", label: "Concluído" },
  { value: "CANCELADO", label: "Cancelado" },
]

export default function AdminPedidos() {
  const [pedidos, setPedidos] = useState<PedidoAdmin[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState("")

  useEffect(() => {
    async function carregarPedidos() {
      try {
        const token = localStorage.getItem("adminKey") || sessionStorage.getItem("adminKey")
        const response = await fetch(`${apiUrl}/pedidos`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        })
        if (!response.ok) {
          const dados = await response.json().catch(() => ({}))
          throw new Error(
            dados.erro || `Falha ao carregar pedidos (${response.status}).`
          )
        }
        setPedidos(await response.json())
      } catch (error) {
        console.error("Erro ao carregar pedidos:", error)
        setErro(
          error instanceof Error
            ? error.message
            : "Não foi possível carregar os pedidos."
        )
      } finally {
        setCarregando(false)
      }
    }

    carregarPedidos()
  }, [])

  async function alterarStatus(id: number, novoStatus: StatusPedido) {
    setErro("")
    try {
      const token = localStorage.getItem("adminKey") || sessionStorage.getItem("adminKey")
      const response = await fetch(`${apiUrl}/pedidos/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ status: novoStatus }),
      })

      if (!response.ok) {
        const dados = await response.json().catch(() => ({}))
        throw new Error(dados.erro || `Falha ao atualizar o pedido (${response.status}).`)
      }

      const pedidoAtualizado: PedidoAdmin = await response.json()
      setPedidos((atuais) =>
        atuais.map((pedido) => (pedido.id === id ? pedidoAtualizado : pedido))
      )
    } catch (error) {
      console.error("Erro ao atualizar status do pedido:", error)
      setErro(error instanceof Error ? error.message : "Não foi possível atualizar o pedido.")
    }
  }

  function formatarData(dataString: string) {
    const dataParsed = new Date(dataString)
    if (isNaN(dataParsed.getTime())) return "N/A"
    return dataParsed.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  function formatarValor(valor: number | string) {
    return `R$ ${Number(valor).toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold bg-gradient-to-r from-[#E5BD55] via-[#C89B3C] to-[#8C6820] bg-clip-text text-transparent">
        Gestão de Pedidos
      </h1>

      {erro && (
        <p role="alert" className="text-red-400">
          {erro}
        </p>
      )}

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg border border-[#C89B3C]/30 bg-[#1C1C1E]">
        <table className="w-full text-sm text-left text-gray-300">
          <thead className="text-xs uppercase bg-[#242426] text-[#E5BD55] border-b border-[#C89B3C]/30">
            <tr>
              <th scope="col" className="px-6 py-3"># ID</th>
              <th scope="col" className="px-6 py-3">Cliente</th>
              <th scope="col" className="px-6 py-3">Data</th>
              <th scope="col" className="px-6 py-3">Valor do Produto</th>
              <th scope="col" className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {carregando ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-400">
                  Carregando pedidos...
                </td>
              </tr>
            ) : pedidos.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-400">
                  Nenhum pedido cadastrado.
                </td>
              </tr>
            ) : (
              pedidos.map((pedido) => (
                <tr
                  key={pedido.id}
                  className="border-b border-gray-800 hover:bg-[#242426]/50 transition-colors"
                >
                  <td className="px-6 py-4 font-bold text-white">#{pedido.id}</td>
                  <td className="px-6 py-4 text-gray-200">{pedido.cliente.nome}</td>
                  <td className="px-6 py-4 text-gray-400">{formatarData(pedido.createdAt)}</td>
                  <td className="px-6 py-4 text-[#E5BD55] font-semibold">
                    {formatarValor(pedido.produto.preco)}
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={pedido.status}
                      onChange={(e) => alterarStatus(pedido.id, e.target.value as StatusPedido)}
                      className="bg-[#242426] text-xs text-white border border-[#C89B3C]/40 rounded-lg p-2 focus:ring-1 focus:ring-[#C89B3C] focus:outline-none cursor-pointer"
                    >
                      {statusPedidos.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
