import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useClienteStore } from "./context/ClienteContext"
import type { PedidoType } from "./utils/PedidoType"

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000"

export default function MeusPedidos() {
  const [pedidos, setPedidos] = useState<PedidoType[]>([])
  const [carregando, setCarregando] = useState<boolean>(true)
  const [erro, setErro] = useState("")
  const { cliente } = useClienteStore()

  useEffect(() => {
    async function buscaPedidos() {
      // Obtém o ID do cliente logado via Context ou localStorage
      const idCliente =
        cliente?.id ||
        localStorage.getItem("clienteKey") ||
        sessionStorage.getItem("clienteKey")
      const token =
        localStorage.getItem("clienteToken") ||
        sessionStorage.getItem("clienteToken")

      if (idCliente && token) {
        try {
          const response = await fetch(`${apiUrl}/pedidos/cliente/${idCliente}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          if (response.ok) {
            const dados = await response.json()
            setPedidos(dados)
          } else {
            const dados = await response.json().catch(() => ({}))
            throw new Error(dados.erro || `Falha ao carregar pedidos (${response.status}).`)
          }
        } catch (error) {
          console.error("Erro ao carregar histórico de pedidos:", error)
          setErro(error instanceof Error ? error.message : "Não foi possível carregar os pedidos.")
        }
      } else if (!token) {
        setErro("Entre novamente na sua conta para consultar seus pedidos.")
      }
      setCarregando(false)
    }

    buscaPedidos()
  }, [cliente])

  function formatarData(dataIso?: string) {
    if (!dataIso) return ""
    const data = new Date(dataIso)
    return data.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    })
  }

  function rotuloStatus(status: PedidoType["status"]) {
    const rotulos: Record<PedidoType["status"], string> = {
      PENDENTE: "Pendente",
      EM_ANDAMENTO: "Em andamento",
      CONCLUIDO: "Concluído",
      CANCELADO: "Cancelado",
    }
    return rotulos[status]
  }

  if (carregando) {
    return (
      <div className="min-h-screen bg-[#1C1C1E] text-white flex items-center justify-center">
        <p className="text-xl font-semibold text-[#E5BD55] animate-pulse">
          Carregando teus pedidos... 🎮
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#1C1C1E] text-white w-full py-8">
      <section className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-white md:text-4xl lg:text-5xl">
            Meus{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E5BD55] via-[#C89B3C] to-[#8C6820]">
              Pedidos
            </span>
          </h1>
          <p className="text-gray-400 mt-2 text-sm md:text-base">
            Acompanha os pedidos e mensagens enviados à loja.
          </p>
        </div>

        {erro ? (
          <div role="alert" className="bg-[#242426] border border-[#C89B3C]/30 rounded-2xl p-8 text-center max-w-2xl mx-auto my-12 shadow-xl">
            <p className="text-gray-300">{erro}</p>
            <Link
              to="/login"
              className="inline-block mt-6 px-6 py-3 bg-gradient-to-r from-[#E5BD55] via-[#C89B3C] to-[#8C6820] text-black font-bold rounded-lg hover:brightness-110 transition-all shadow-md"
            >
              Entrar
            </Link>
          </div>
        ) : pedidos.length === 0 ? (
          <div className="bg-[#242426] border border-[#C89B3C]/30 rounded-2xl p-8 text-center max-w-2xl mx-auto my-12 shadow-xl">
            <div className="text-5xl mb-4">🙄</div>
            <h2 className="text-xl font-bold text-[#E5BD55] mb-2">
              Nenhum pedido encontrado!
            </h2>
            <p className="text-gray-400 mb-6">
              Ah... Você ainda não realizou pedidos de jogos ou produtos na Elder Games.
            </p>
            <Link
              to="/"
              className="inline-block px-6 py-3 bg-gradient-to-r from-[#E5BD55] via-[#C89B3C] to-[#8C6820] text-black font-bold rounded-lg hover:brightness-110 transition-all shadow-md"
            >
              Explorar Loja
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-[#C89B3C]/30 shadow-2xl bg-[#1C1C1E]">
            <table className="w-full text-sm text-left text-gray-300">
              <thead className="text-xs uppercase bg-[#242426] text-[#E5BD55] border-b border-[#C89B3C]/30">
                <tr>
                  <th scope="col" className="px-6 py-4">Imagem</th>
                  <th scope="col" className="px-6 py-4">Produto</th>
                  <th scope="col" className="px-6 py-4">Descrição / Mensagem</th>
                  <th scope="col" className="px-6 py-4">Resposta da Loja</th>
                  <th scope="col" className="px-6 py-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#C89B3C]/20">
                {pedidos.map((pedido) => {
                  const fotoExibicao =
                    pedido.produto?.foto && pedido.produto.foto.trim() !== ""
                      ? pedido.produto.foto
                      : "/placeholder-game.png"

                  return (
                    <tr
                      key={pedido.id}
                      className="hover:bg-[#242426]/60 transition-colors"
                    >
                      {/* Imagem */}
                      <td className="px-6 py-4">
                        <div className="w-16 h-16 bg-[#2C2C2E] rounded-lg border border-[#C89B3C]/30 p-1 flex items-center justify-center overflow-hidden">
                          <img
                            src={fotoExibicao}
                            alt={pedido.produto?.titulo || "Produto"}
                            className="max-w-full max-h-full object-contain"
                            onError={(e) => {
                              ;(e.target as HTMLImageElement).src =
                                "https://via.placeholder.com/150?text=Sem+Foto"
                            }}
                          />
                        </div>
                      </td>

                      {/* Produto */}
                      <td className="px-6 py-4 font-medium text-white">
                        <p className="text-base font-bold text-[#E5BD55]">
                          {pedido.produto?.titulo || "Produto"}
                        </p>
                        {pedido.produto?.preco && (
                          <p className="text-xs text-gray-400 mt-1">
                            R${" "}
                            {Number(pedido.produto.preco).toLocaleString("pt-BR", {
                              minimumFractionDigits: 2,
                            })}
                          </p>
                        )}
                        {pedido.createdAt && (
                          <p className="text-[11px] text-gray-500 mt-1">
                            Data: {formatarData(pedido.createdAt)}
                          </p>
                        )}
                      </td>

                      {/* Observações do Cliente */}
                      <td className="px-6 py-4">
                        <p className="text-gray-300 max-w-xs text-sm line-clamp-3">
                          {pedido.descricao || "Sem observações."}
                        </p>
                      </td>

                      {/* Resposta do Admin/Loja */}
                      <td className="px-6 py-4">
                        <p className="text-gray-300 max-w-xs text-sm italic">
                          {pedido.resposta || (
                            <span className="text-gray-500">
                              Aguardando análise...
                            </span>
                          )}
                        </p>
                      </td>

                      {/* Status do Pedido */}
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-block px-3 py-1 text-xs font-semibold rounded-full border ${
                            pedido.status === "CONCLUIDO"
                              ? "bg-green-900/30 text-green-400 border-green-500/40"
                              : pedido.status === "CANCELADO"
                              ? "bg-red-900/30 text-red-400 border-red-500/40"
                              : "bg-[#C89B3C]/20 text-[#E5BD55] border-[#C89B3C]/40"
                          }`}
                        >
                          {rotuloStatus(pedido.status)}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}