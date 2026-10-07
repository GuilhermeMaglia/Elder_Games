import { useEffect, useState } from "react"

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000"

interface TotaisDashboard {
  clientes: number
  produtos: number
  pedidos: number
}

export default function AdminDashboard() {
  const [totais, setTotais] = useState<TotaisDashboard | null>(null)
  const [erro, setErro] = useState("")

  useEffect(() => {
    async function carregarTotais() {
      try {
        const token = localStorage.getItem("adminKey") || sessionStorage.getItem("adminKey")
        const response = await fetch(`${apiUrl}/dashboard/geral`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        })
        if (!response.ok) {
          const resposta = await response.json().catch(() => ({}))
          throw new Error(
            resposta.erro || `Falha ao carregar o painel (${response.status}).`
          )
        }

        const dados = await response.json()
        setTotais(dados.totais)
      } catch (error) {
        console.error("Erro ao carregar dados do dashboard:", error)
        setErro(
          error instanceof Error
            ? error.message
            : "Não foi possível carregar os dados do painel."
        )
      }
    }

    carregarTotais()
  }, [])

  const cards = [
    { label: "Nº Clientes", value: totais?.clientes, color: "blue" },
    { label: "Nº Produtos", value: totais?.produtos, color: "gold" },
    { label: "Nº Pedidos", value: totais?.pedidos, color: "green" },
  ]

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-4">Visão Geral do Sistema</h2>

      {erro && (
        <p role="alert" className="text-center text-red-400 my-4">
          {erro}
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
        {cards.map((card) => (
          <div
            key={card.label}
            className={`bg-[#242426] border ${
              card.color === "blue"
                ? "border-blue-600/40"
                : card.color === "gold"
                  ? "border-[#E5BD55]/40"
                  : "border-emerald-600/40"
            } p-6 rounded-xl text-center shadow-lg`}
          >
            <div
              className={`h-12 ${
                card.color === "blue"
                  ? "bg-blue-600/20"
                  : card.color === "gold"
                    ? "bg-[#E5BD55]/20"
                    : "bg-emerald-600/20"
              } rounded-lg flex items-center justify-center mb-3`}
            >
              <span
                className={`font-bold text-xl ${
                  card.color === "blue"
                    ? "text-blue-400"
                    : card.color === "gold"
                      ? "text-[#E5BD55]"
                      : "text-emerald-400"
                }`}
              >
                {card.value ?? "—"}
              </span>
            </div>
            <p className="text-gray-300 font-medium">{card.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
