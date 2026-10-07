import { useEffect, useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { useClienteStore } from "./context/ClienteContext"
import type { ProdutoType } from "./utils/ProdutoType"

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000"

export default function Detalhes() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { cliente } = useClienteStore()

  const [produto, setProduto] = useState<ProdutoType | null>(null)
  const [descricao, setDescricao] = useState<string>("")
  const [enviando, setEnviando] = useState<boolean>(false)
  const [carregandoProduto, setCarregandoProduto] = useState(true)
  const [erroProduto, setErroProduto] = useState("")

  useEffect(() => {
    async function buscaProduto() {
      try {
        const response = await fetch(`${apiUrl}/produtos/${id}`)
        if (response.ok) {
          const dados = await response.json()
          setProduto(dados)
        } else {
          setErroProduto("Não foi possível encontrar este produto.")
        }
      } catch (error) {
        console.error("Erro ao buscar detalhes do produto:", error)
        setErroProduto("Não foi possível conectar à loja. Tente novamente.")
      } finally {
        setCarregandoProduto(false)
      }
    }

    if (id) {
      buscaProduto()
    }
  }, [id])

  async function enviaPedido(e: React.FormEvent) {
  e.preventDefault()

  // Procura a chave de ID do cliente guardada durante o login
  const idCliente =
    cliente?.id ||
    localStorage.getItem("clienteKey") ||
    sessionStorage.getItem("clienteKey") ||
    localStorage.getItem("clienteId")
  const tokenCliente =
    localStorage.getItem("clienteToken") ||
    sessionStorage.getItem("clienteToken")

  if (!idCliente || !tokenCliente) {
    alert("Por favor, faça login para realizar um pedido.")
    navigate("/login")
    return
  }

  if (!produto) return

  setEnviando(true)

  const bodyData = {
    produtoId: produto.id,
    descricao: descricao,
  }

  try {
    const response = await fetch(`${apiUrl}/pedidos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenCliente}`,
      },
      body: JSON.stringify(bodyData),
    })

    if (response.ok) {
      alert("Pedido enviado para análise da loja!")
      navigate("/meusPedidos")
    } else {
      const erroDados = await response.json().catch(() => null)
      console.error("Erro da API ao criar pedido:", response.status, erroDados)
      
      const mensagemErro =
        erroDados?.erro ||
        erroDados?.message ||
        `Erro ${response.status} ao processar o pedido no servidor.`
        
      alert(`Falha no envio: ${mensagemErro}`)
    }
  } catch (error) {
    console.error("Erro de rede/conexão:", error)
    alert("Erro ao conectar com o servidor. Verifica se a tua API backend está a correr.")
  } finally {
    setEnviando(false)
  }
}

  if (carregandoProduto) {
    return (
      <div className="min-h-screen bg-[#1C1C1E] text-white flex items-center justify-center">
        <p className="text-xl font-semibold text-[#E5BD55] animate-pulse">
          A carregar detalhes do produto... 🎮
        </p>
      </div>
    )
  }

  if (!produto) {
    return (
      <div className="min-h-screen bg-[#1C1C1E] text-white flex flex-col items-center justify-center gap-4 px-4">
        <p className="text-center text-lg text-gray-300">
          {erroProduto || "Produto não encontrado."}
        </p>
        <Link to="/" className="text-[#E5BD55] hover:underline">
          Voltar para a loja
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#1C1C1E] text-white py-10 px-4">
      <div className="max-w-4xl mx-auto bg-[#242426] border border-[#C89B3C]/30 rounded-2xl p-6 md:p-8 shadow-2xl">
        
        <Link
          to="/"
          className="inline-block text-sm text-[#E5BD55] hover:underline mb-6"
        >
          ← Voltar para a loja
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Imagem do Produto */}
          <div className="bg-[#1C1C1E] p-4 rounded-xl border border-[#C89B3C]/20 flex items-center justify-center">
            <img
              src={produto.foto || "/placeholder-game.png"}
              alt={produto.titulo}
              className="max-h-80 object-contain rounded-lg"
            />
          </div>

          {/* Informações e Formulário */}
          <div>
            <h1 className="text-3xl font-extrabold text-[#E5BD55] mb-2">
              {produto.titulo}
            </h1>
            <p className="text-[#C89B3C] font-semibold text-2xl mb-4">
              R${" "}
              {Number(produto.preco).toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </p>

            <p className="text-gray-300 text-sm mb-6">
              {produto.descricao || "Sem descrição disponível."}
            </p>

            {/* Form de envio de pedido para análise da loja */}
            <form onSubmit={enviaPedido} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Mensagem para a loja *
                </label>
                <textarea
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Escreva uma mensagem para a loja..."
                  required
                  minLength={3}
                  maxLength={255}
                  className="w-full bg-[#1C1C1E] border border-[#C89B3C]/40 rounded-lg p-3 text-white text-sm focus:outline-none focus:border-[#E5BD55]"
                  rows={3}
                />
              </div>

              <button
                type="submit"
                disabled={enviando}
                className="w-full py-3 bg-gradient-to-r from-[#E5BD55] via-[#C89B3C] to-[#8C6820] text-black font-bold rounded-lg hover:brightness-110 transition-all shadow-md disabled:opacity-50"
              >
                {enviando ? "A enviar..." : "Enviar pedido"}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  )
}