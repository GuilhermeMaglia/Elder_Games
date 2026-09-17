import { CardProduto } from "./components/CardProduto"
import { InputPesquisa } from "./components/InputPesquisa"
import type { ProdutoType } from "./utils/ProdutoType"
import { useEffect, useState } from "react"
import { useClienteStore } from "./context/ClienteContext"

const apiUrl = import.meta.env.VITE_API_URL

export default function App() {
  const [produtos, setProdutos] = useState<ProdutoType[]>([])
  const { logaCliente } = useClienteStore()  

  useEffect(() => {
    async function buscaDados() {
      const response = await fetch(`${apiUrl}/produtos/destaques`)
      const dados = await response.json()
      setProdutos(dados)
    }
    buscaDados()

    async function buscaCliente(id: string) {
      const response = await fetch(`${apiUrl}/clientes/${id}`)
      const dados = await response.json()
      logaCliente(dados)
    }

    if (localStorage.getItem("clienteKey")) {
      const idCliente = localStorage.getItem("clienteKey")
      buscaCliente(idCliente as string)
    }    
  }, [])

  const listaProdutos = produtos.map(produto => (
    <CardProduto data={produto} key={produto.id} />
  ))

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

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {listaProdutos}
          </div>
        </div>
      </div>
    </div>
  )
}