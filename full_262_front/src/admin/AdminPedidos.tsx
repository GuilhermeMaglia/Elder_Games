import { useEffect, useState } from "react"
import { FiMessageSquare, FiTrash2, FiCheck, FiX } from "react-icons/fi"

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000"

type StatusPedido = "PENDENTE" | "EM_ANDAMENTO" | "CONCLUIDO" | "CANCELADO"

interface PedidoAdmin {
  id: number
  createdAt: string
  status: StatusPedido
  descricao: string
  resposta?: string | null
  cliente: { id?: string; nome: string; email?: string }
  produto: {
    id: number
    titulo: string
    preco: number | string
    foto?: string
    marca?: { nome: string }
    categoria?: { nome: string }
  }
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

  // Estado para o pedido selecionado para responder
  const [pedidoRespondendo, setPedidoRespondendo] = useState<PedidoAdmin | null>(null)
  const [textoResposta, setTextoResposta] = useState("")
  const [salvandoResposta, setSalvandoResposta] = useState(false)

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
        atuais.map((pedido) => (pedido.id === id ? { ...pedido, status: pedidoAtualizado.status } : pedido))
      )
    } catch (error) {
      console.error("Erro ao atualizar status do pedido:", error)
      setErro(error instanceof Error ? error.message : "Não foi possível atualizar o pedido.")
    }
  }

  function abrirModalResposta(pedido: PedidoAdmin) {
    setPedidoRespondendo(pedido)
    setTextoResposta(pedido.resposta || "")
  }

  function fecharModalResposta() {
    setPedidoRespondendo(null)
    setTextoResposta("")
  }

  async function salvarResposta(e: React.FormEvent) {
    e.preventDefault()
    if (!pedidoRespondendo) return

    setSalvandoResposta(true)
    setErro("")

    try {
      const token = localStorage.getItem("adminKey") || sessionStorage.getItem("adminKey")
      const response = await fetch(`${apiUrl}/pedidos/${pedidoRespondendo.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          resposta: textoResposta.trim() || null,
        }),
      })

      if (!response.ok) {
        const dados = await response.json().catch(() => ({}))
        throw new Error(dados.erro || "Falha ao salvar resposta para o cliente.")
      }

      const pedidoAtualizado: PedidoAdmin = await response.json()
      setPedidos((atuais) =>
        atuais.map((p) =>
          p.id === pedidoRespondendo.id ? { ...p, resposta: pedidoAtualizado.resposta } : p
        )
      )
      fecharModalResposta()
    } catch (error) {
      console.error("Erro ao salvar resposta do pedido:", error)
      alert(error instanceof Error ? error.message : "Não foi possível salvar a resposta.")
    } finally {
      setSalvandoResposta(false)
    }
  }

  async function excluirPedido(id: number, tituloProduto: string) {
    if (!confirm(`Confirma a exclusão do pedido #${id} (${tituloProduto})?`)) {
      return
    }

    try {
      const token = localStorage.getItem("adminKey") || sessionStorage.getItem("adminKey")
      const response = await fetch(`${apiUrl}/pedidos/${id}`, {
        method: "DELETE",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      })

      if (!response.ok) {
        const dados = await response.json().catch(() => ({}))
        throw new Error(dados.erro || "Falha ao excluir o pedido.")
      }

      setPedidos((atuais) => atuais.filter((p) => p.id !== id))
    } catch (error) {
      console.error("Erro ao excluir pedido:", error)
      alert(error instanceof Error ? error.message : "Não foi possível excluir o pedido.")
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-[#E5BD55] via-[#C89B3C] to-[#8C6820] bg-clip-text text-transparent">
            Gestão de Pedidos & Atendimento
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Consulte mensagens dos clientes, responda dúvidas e atualize status
          </p>
        </div>
      </div>

      {erro && (
        <p role="alert" className="text-red-400 bg-red-950/30 border border-red-800/40 p-3 rounded-lg text-sm">
          {erro}
        </p>
      )}

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg border border-[#C89B3C]/30 bg-[#1C1C1E]">
        <table className="w-full text-sm text-left text-gray-300">
          <thead className="text-xs uppercase bg-[#242426] text-[#E5BD55] border-b border-[#C89B3C]/30">
            <tr>
              <th scope="col" className="px-4 py-3"># ID</th>
              <th scope="col" className="px-4 py-3">Produto</th>
              <th scope="col" className="px-4 py-3">Cliente</th>
              <th scope="col" className="px-4 py-3">Mensagem do Cliente</th>
              <th scope="col" className="px-4 py-3">Resposta da Loja</th>
              <th scope="col" className="px-4 py-3">Status</th>
              <th scope="col" className="px-4 py-3 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {carregando ? (
              <tr>
                <td colSpan={7} className="px-6 py-6 text-center text-gray-400">
                  Carregando pedidos...
                </td>
              </tr>
            ) : pedidos.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-400">
                  Nenhum pedido cadastrado no momento.
                </td>
              </tr>
            ) : (
              pedidos.map((pedido) => {
                const fotoProduto = pedido.produto?.foto || "/placeholder-game.png"
                const tituloProduto = pedido.produto?.titulo || "Produto"

                return (
                  <tr
                    key={pedido.id}
                    className="border-b border-gray-800 hover:bg-[#242426]/50 transition-colors"
                  >
                    {/* ID e Data */}
                    <td className="px-4 py-4 font-mono">
                      <span className="font-bold text-white block">#{pedido.id}</span>
                      <span className="text-[11px] text-gray-500 block mt-0.5">
                        {formatarData(pedido.createdAt)}
                      </span>
                    </td>

                    {/* Produto (Imagem, Título, Preço) */}
                    <td className="px-4 py-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={fotoProduto}
                          alt={tituloProduto}
                          className="w-12 h-12 object-cover rounded-md border border-[#C89B3C]/30 bg-black/40"
                          onError={(e) => {
                            ;(e.target as HTMLImageElement).src =
                              "https://via.placeholder.com/60?text=Sem+Foto"
                          }}
                        />
                        <div>
                          <p className="font-medium text-white line-clamp-1 max-w-[180px]">
                            {tituloProduto}
                          </p>
                          <p className="text-xs text-[#E5BD55] font-semibold">
                            {formatarValor(pedido.produto?.preco || 0)}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Cliente */}
                    <td className="px-4 py-4 text-gray-200">
                      <p className="font-semibold text-white">{pedido.cliente?.nome || "Cliente"}</p>
                      {pedido.cliente?.email && (
                        <p className="text-xs text-gray-400">{pedido.cliente.email}</p>
                      )}
                    </td>

                    {/* Descrição / Mensagem */}
                    <td className="px-4 py-4">
                      <p className="text-xs text-gray-300 max-w-[200px] line-clamp-3">
                        {pedido.descricao || "Sem mensagem."}
                      </p>
                    </td>

                    {/* Resposta da Loja */}
                    <td className="px-4 py-4">
                      {pedido.resposta ? (
                        <p className="text-xs text-emerald-400 max-w-[200px] line-clamp-3 italic">
                          "{pedido.resposta}"
                        </p>
                      ) : (
                        <span className="text-xs text-gray-500 italic">
                          Sem resposta ainda
                        </span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-4">
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

                    {/* Ações */}
                    <td className="px-4 py-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          type="button"
                          onClick={() => abrirModalResposta(pedido)}
                          className="p-2 bg-[#C89B3C]/20 hover:bg-[#C89B3C]/40 text-[#E5BD55] rounded-lg transition-colors cursor-pointer"
                          title="Responder ao Cliente"
                        >
                          <FiMessageSquare size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => excluirPedido(pedido.id, tituloProduto)}
                          className="p-2 bg-red-500/10 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors cursor-pointer"
                          title="Excluir Pedido"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal para Responder ao Cliente */}
      {pedidoRespondendo && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#242426] border border-[#C89B3C]/50 rounded-2xl max-w-lg w-full p-6 text-white shadow-2xl relative">
            <div className="flex justify-between items-center mb-4 border-b border-gray-800 pb-3">
              <h2 className="text-lg font-bold text-[#E5BD55]">
                Responder Pedido #{pedidoRespondendo.id}
              </h2>
              <button
                type="button"
                onClick={fecharModalResposta}
                className="text-gray-400 hover:text-white"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="space-y-3 mb-4 text-sm">
              <div>
                <span className="text-xs text-gray-400">Cliente:</span>
                <p className="font-semibold text-white">{pedidoRespondendo.cliente?.nome}</p>
              </div>

              <div>
                <span className="text-xs text-gray-400">Produto:</span>
                <p className="font-semibold text-[#E5BD55]">
                  {pedidoRespondendo.produto?.titulo}
                </p>
              </div>

              <div className="bg-[#1C1C1E] p-3 rounded-lg border border-gray-800">
                <span className="text-xs text-gray-400 block mb-1">
                  Mensagem enviada pelo cliente:
                </span>
                <p className="text-gray-200 text-xs">
                  {pedidoRespondendo.descricao}
                </p>
              </div>
            </div>

            <form onSubmit={salvarResposta} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Resposta da Loja para o Cliente:
                </label>
                <textarea
                  rows={4}
                  maxLength={255}
                  value={textoResposta}
                  onChange={(e) => setTextoResposta(e.target.value)}
                  placeholder="Ex: Olá! Temos o item disponível para pronta entrega..."
                  className="w-full bg-[#1C1C1E] border border-[#C89B3C]/40 rounded-lg p-3 text-sm focus:outline-none focus:border-[#E5BD55] text-white"
                />
                <span className="text-[11px] text-gray-400 float-right">
                  {textoResposta.length}/255 caracteres
                </span>
              </div>

              <div className="flex justify-end space-x-3 pt-3">
                <button
                  type="button"
                  onClick={fecharModalResposta}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm text-gray-200 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={salvandoResposta}
                  className="flex items-center space-x-1.5 px-5 py-2 bg-gradient-to-r from-[#E5BD55] to-[#8C6820] text-black font-bold rounded-lg hover:brightness-110 transition-all text-sm cursor-pointer disabled:opacity-50"
                >
                  <FiCheck />
                  <span>{salvandoResposta ? "Salvando..." : "Enviar Resposta"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
