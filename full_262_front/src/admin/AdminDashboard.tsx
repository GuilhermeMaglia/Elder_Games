import { useState, useEffect } from "react"

export default function AdminDashboard() {
  const [totalClientes, setTotalClientes] = useState(0)
  const [totalProdutos, setTotalProdutos] = useState(0)
  const [totalPedidos, setTotalPedidos] = useState(0)

  useEffect(() => {
    async function carregarTotais() {
      try {
        // 1. Buscar total de Produtos / Games
        const resProd = await fetch("http://localhost:3000/produtos")
        if (resProd.ok) {
          const prods = await resProd.json()
          setTotalProdutos(prods.length)
        }

        // 2. Buscar total de Clientes (se a rota existir)
        const resCli = await fetch("http://localhost:3000/clientes")
        if (resCli.ok) {
          const clis = await resCli.json()
          setTotalClientes(clis.length)
        } else {
          setTotalClientes(0)
        }

        // 3. Buscar total de Pedidos / Propostas (se a rota existir)
        const resPed = await fetch("http://localhost:3000/propostas")
        if (resPed.ok) {
          const peds = await resPed.json()
          setTotalPedidos(peds.length)
        } else {
          setTotalPedidos(0)
        }
      } catch (err) {
        console.error("Erro ao carregar dados do dashboard:", err)
        // Define os valores padrão em caso de erro na conexão
        setTotalClientes(0)
        setTotalPedidos(0)
      }
    }

    carregarTotais()
  }, [])

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-4">Visão Geral do Sistema</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
        {/* Card 1: Clientes */}
        <div className="bg-[#242426] border border-blue-600/40 p-6 rounded-xl text-center shadow-lg">
          <div className="h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mb-3">
            <span className="text-blue-400 font-bold text-xl">{totalClientes}</span>
          </div>
          <p className="text-gray-300 font-medium">Nº Clientes</p>
        </div>

        {/* Card 2: Produtos / Games */}
        <div className="bg-[#242426] border border-[#E5BD55]/40 p-6 rounded-xl text-center shadow-lg">
          <div className="h-12 bg-[#E5BD55]/20 rounded-lg flex items-center justify-center mb-3">
            <span className="text-[#E5BD55] font-bold text-xl">{totalProdutos}</span>
          </div>
          <p className="text-gray-300 font-medium">Nº Produtos / Games</p>
        </div>

        {/* Card 3: Pedidos */}
        <div className="bg-[#242426] border border-emerald-600/40 p-6 rounded-xl text-center shadow-lg">
          <div className="h-12 bg-emerald-600/20 rounded-lg flex items-center justify-center mb-3">
            <span className="text-emerald-400 font-bold text-xl">{totalPedidos}</span>
          </div>
          <p className="text-gray-300 font-medium">Nº Pedidos</p>
        </div>
      </div>
    </div>
  )
}