import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000"

// Interface atualizada para bater com o Prisma Schema e as relações (include)
interface Produto {
  id: number
  titulo: string
  preco: number | string
  foto: string
  quant: number
  destaque?: boolean
  marca?: { nome: string }
  categoria?: { nome: string }
}

export default function AdminProdutos() {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [loading, setLoading] = useState(true)

  async function carregarProdutos() {
    try {
      const response = await fetch(`${apiUrl}/produtos`)
      if (response.ok) {
        const data = await response.json()
        setProdutos(data)
      }
    } catch (error) {
      console.error("Erro ao carregar produtos:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregarProdutos()
  }, [])

  async function handleExcluir(id: number) {
    if (!confirm("Tem certeza que deseja excluir este produto?")) return

    const token = localStorage.getItem("adminKey") || sessionStorage.getItem("adminKey")
    if (!token) {
      alert("Faça login novamente como administrador para excluir produtos.")
      return
    }

    try {
      const response = await fetch(`${apiUrl}/produtos/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        alert("Produto excluído com sucesso!")
        setProdutos((prev) => prev.filter((p) => p.id !== id))
      } else {
        const erro = await response.json().catch(() => ({}))
        alert(erro.erro || "Erro ao excluir produto.")
      }
    } catch (error) {
      console.error("Erro ao excluir:", error)
      alert("Erro ao conectar ao servidor.")
    }
  }

  if (loading) {
    return <div className="p-8 text-center text-white">A carregar produtos...</div>
  }

  return (
    <div className="m-4 mt-8 max-w-7xl mx-auto text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold md:text-3xl">
          Gestão de{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E5BD55] via-[#C89B3C] to-[#8C6820]">
            Produtos
          </span>
        </h1>
        <Link
          to="/admin/produtos/novo"
          className="px-4 py-2 bg-gradient-to-r from-[#E5BD55] to-[#8C6820] text-black font-semibold rounded-lg hover:brightness-110 transition-all"
        >
          + Novo Produto
        </Link>
      </div>

      <div className="bg-[#1C1C1E] border border-[#C89B3C]/30 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#C89B3C]/30 text-[#E5BD55] text-xs uppercase tracking-wider bg-[#242426]">
                <th className="p-4">Foto</th>
                <th className="p-4">Nome do Produto</th>
                <th className="p-4">Marca / Fabricante</th>
                <th className="p-4">Categoria</th>
                <th className="p-4">Preço R$</th>
                <th className="p-4">Estoque</th>
                <th className="p-4 text-center">Destaque</th>
                <th className="p-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 text-sm">
              {produtos.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-gray-400">
                    Nenhum produto cadastrado.
                  </td>
                </tr>
              ) : (
                produtos.map((produto) => (
                  <tr key={produto.id} className="hover:bg-[#242426]/50 transition-colors">
                    {/* FOTO */}
                    <td className="p-4">
                      <img
                        src={produto.foto}
                        alt={produto.titulo}
                        className="w-14 h-14 object-cover rounded-lg border border-[#C89B3C]/40 bg-black/40"
                        onError={(e) => {
                          // Imagem padrão de fallback se a URL falhar
                          ;(e.target as HTMLImageElement).src =
                            "https://via.placeholder.com/80?text=Sem+Foto"
                        }}
                      />
                    </td>

                    {/* NOME DO PRODUTO (titulo) */}
                    <td className="p-4 font-medium text-gray-200">
                      {produto.titulo || "Sem título"}
                    </td>

                    {/* MARCA */}
                    <td className="p-4 text-gray-400">
                      {produto.marca?.nome || "—"}
                    </td>

                    {/* CATEGORIA */}
                    <td className="p-4 text-gray-400">
                      {produto.categoria?.nome || "—"}
                    </td>

                    {/* PREÇO */}
                    <td className="p-4 font-bold text-[#E5BD55]">
                      R$: {Number(produto.preco).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>

                    {/* ESTOQUE (quant) */}
                    <td className="p-4 text-gray-300">
                      {produto.quant ?? 0} un.
                    </td>

                    {/* DESTAQUE */}
                    <td className="p-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full border ${
                          produto.destaque
                            ? "bg-[#C89B3C]/20 text-[#E5BD55] border-[#C89B3C]/40"
                            : "bg-gray-800 text-gray-400 border-gray-700"
                        }`}
                      >
                        {produto.destaque ? "Sim" : "Não"}
                      </span>
                    </td>

                    {/* AÇÕES */}
                    <td className="p-4 text-center space-x-3">
                      <Link
                        to={`/admin/produtos/editar/${produto.id}`}
                        className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => handleExcluir(produto.id)}
                        className="text-red-500 hover:text-red-400 font-medium cursor-pointer transition-colors"
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}