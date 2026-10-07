import { CardProduto } from "./components/CardProduto"
import { InputPesquisa } from "./components/InputPesquisa"
import type { ProdutoType } from "./utils/ProdutoType"
import { useEffect, useState } from "react"
import { useClienteStore } from "./context/ClienteContext"

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000"

export default function App() {
  const [produtos, setProdutos] = useState<ProdutoType[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const { logaCliente } = useClienteStore()  

  useEffect(() => {
    async function buscaDados() {
      try {
        const response = await fetch(`${apiUrl}/produtos/destaques`)
        if (response.ok) {
          const dados = await response.json()
          setProdutos(dados)
        }
      } catch (error) {
        console.error("Erro ao carregar produtos:", error)
      } finally {
        setLoading(false)
      }
    }
    buscaDados()

    async function buscaCliente(id: string) {
      const token = localStorage.getItem("clienteToken") || sessionStorage.getItem("clienteToken")
      if (!token) return

      try {
        const response = await fetch(`${apiUrl}/clientes/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (response.ok) {
          const dados = await response.json()
          logaCliente(dados)
        } else if (response.status === 401 || response.status === 403) {
          localStorage.removeItem("clienteKey")
          localStorage.removeItem("clienteToken")
          sessionStorage.removeItem("clienteKey")
          sessionStorage.removeItem("clienteToken")
        }
      } catch (error) {
        console.error("Erro ao recuperar sessão do cliente:", error)
      }
    }

    // Procura a chave no localStorage (Manter conectado) ou no sessionStorage (Sessão temporária)
    const idCliente = localStorage.getItem("clienteKey") || sessionStorage.getItem("clienteKey")

    if (idCliente) {
      buscaCliente(idCliente)
    }    
  }, [logaCliente])

  return (
    <div className="min-h-screen bg-[#1C1C1E] text-white py-6 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        <InputPesquisa setProdutos={setProdutos} />
        
        <div>
          <h1 className="mb-6 text-3xl font-extrabold leading-none tracking-tight md:text-4xl lg:text-5xl text-white">
            Produtos{" "}
            <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#E5BD55] via-[#C89B3C] to-[#8C6820] after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[4px] after:bg-gradient-to-r after:from-[#E5BD55] after:to-[#C89B3C] after:rounded-full">
              em destaque
            </span>
          </h1>

          {loading ? (
            <div className="text-center py-12 text-gray-400 font-medium">
              Carregando destaques...
            </div>
          ) : produtos.length === 0 ? (
            <div className="text-center py-12 text-gray-400 font-medium">
              Nenhum produto em destaque encontrado.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {produtos.map((produto) => (
                <CardProduto data={produto} key={produto.id} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}