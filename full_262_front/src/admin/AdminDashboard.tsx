import { useEffect, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts"

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000"

interface DashboardData {
  totais: {
    produtos: number
    pedidos: number
    clientes: number
    marcas: number
  }
  ultimosPedidos: Array<{
    id: number
    createdAt: string
    cliente: { nome: string }
    produto: { titulo: string; preco: number | string }
  }>
  produtosMaisVendidos: Array<{
    id: number
    titulo: string
    foto: string
    preco: number | string
    totalVendas: number
  }>
}

export default function AdminDashboard() {
  const [dados, setDados] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function carregarDashboard() {
      const token = localStorage.getItem("adminKey") || sessionStorage.getItem("adminKey")
      
      try {
        const response = await fetch(`${apiUrl}/dashboard/geral`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const result = await response.json()
          setDados(result)
        }
      } catch (err) {
        console.error("Erro ao buscar dados do dashboard:", err)
      } finally {
        setLoading(false)
      }
    }

    carregarDashboard()
  }, [])

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-400">
        A carregar métricas do dashboard...
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 text-white">
      <h1 className="text-3xl font-bold">
        Dashboard <span className="text-[#E5BD55]">Gamer</span>
      </h1>

      {/* Cards de Totais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#242426] border border-[#C89B3C]/30 p-5 rounded-2xl">
          <p className="text-sm text-gray-400">Total de Produtos</p>
          <p className="text-3xl font-bold text-[#E5BD55] mt-1">{dados?.totais.produtos || 0}</p>
        </div>
        <div className="bg-[#242426] border border-[#C89B3C]/30 p-5 rounded-2xl">
          <p className="text-sm text-gray-400">Total de Pedidos</p>
          <p className="text-3xl font-bold text-[#E5BD55] mt-1">{dados?.totais.pedidos || 0}</p>
        </div>
        <div className="bg-[#242426] border border-[#C89B3C]/30 p-5 rounded-2xl">
          <p className="text-sm text-gray-400">Clientes Registados</p>
          <p className="text-3xl font-bold text-[#E5BD55] mt-1">{dados?.totais.clientes || 0}</p>
        </div>
        <div className="bg-[#242426] border border-[#C89B3C]/30 p-5 rounded-2xl">
          <p className="text-sm text-gray-400">Marcas Parceiras</p>
          <p className="text-3xl font-bold text-[#E5BD55] mt-1">{dados?.totais.marcas || 0}</p>
        </div>
      </div>

      {/* Gráfico de Produtos Mais Vendidos */}
      <div className="bg-[#242426] border border-[#C89B3C]/30 p-6 rounded-2xl">
        <h2 className="text-xl font-bold text-white mb-4">🏆 Top Produtos Mais Vendidos</h2>
        
        {dados?.produtosMaisVendidos && dados.produtosMaisVendidos.length > 0 ? (
          <div className="h-72 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dados.produtosMaisVendidos} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis 
                  dataKey="titulo" 
                  stroke="#9CA3AF" 
                  tick={{ fill: "#9CA3AF", fontSize: 12 }} 
                  tickFormatter={(value) => value.length > 15 ? `${value.substring(0, 15)}...` : value}
                />
                <YAxis stroke="#9CA3AF" tick={{ fill: "#9CA3AF", fontSize: 12 }} allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#1C1C1E", borderColor: "#C89B3C", color: "#fff", borderRadius: "8px" }}
                  formatter={(value: any) => [`${value} vendas`, "Quantidade"]}
                />
                <Bar dataKey="totalVendas" radius={[6, 6, 0, 0]}>
                  {dados.produtosMaisVendidos.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? "#E5BD55" : "#C89B3C"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-gray-400 text-sm">Nenhuma venda registada até ao momento.</p>
        )}
      </div>

      {/* Tabela dos Últimos Pedidos */}
      <div className="bg-[#242426] border border-[#C89B3C]/30 p-6 rounded-2xl">
        <h2 className="text-xl font-bold text-white mb-4">🛒 Últimos Pedidos</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="border-b border-[#C89B3C]/20 text-[#E5BD55]">
              <tr>
                <th className="py-2 px-3">ID</th>
                <th className="py-2 px-3">Cliente</th>
                <th className="py-2 px-3">Produto</th>
                <th className="py-2 px-3">Preço</th>
              </tr>
            </thead>
            <tbody>
              {dados?.ultimosPedidos.map((pedido) => (
                <tr key={pedido.id} className="border-b border-[#C89B3C]/10 hover:bg-[#1C1C1E]/50 transition-all">
                  <td className="py-3 px-3 font-mono">#{pedido.id}</td>
                  <td className="py-3 px-3">{pedido.cliente?.nome || "Cliente"}</td>
                  <td className="py-3 px-3">{pedido.produto?.titulo || "Produto"}</td>
                  <td className="py-3 px-3 text-[#E5BD55]">
                    R$ {Number(pedido.produto?.preco || 0).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}