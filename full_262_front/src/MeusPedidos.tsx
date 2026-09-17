import { useEffect, useState } from "react";
import { useClienteStore } from "./context/ClienteContext";
import type { PedidoType } from "./utils/PedidoType";

const apiUrl = import.meta.env.VITE_API_URL

export default function MeusPedidos() {
  const [pedidos, setPedidos] = useState<PedidoType[]>([])
  const { cliente } = useClienteStore()

  useEffect(() => {
    async function buscaDados() {
      if (cliente.id) {
        const response = await fetch(`${apiUrl}/pedidos/${cliente.id}`)
        const dados = await response.json()
        setPedidos(dados)
      }
    }
    buscaDados()
  }, [cliente.id])

  function dataDMA(data: string) {
    if (!data) return ""
    const ano = data.substring(0, 4)
    const mes = data.substring(5, 7)
    const dia = data.substring(8, 10)
    return dia + "/" + mes + "/" + ano
  }

  const pedidosTable = pedidos.map(pedido => {
    const imagemExibicao = pedido.produto?.fotos && pedido.produto.fotos.length > 0
      ? pedido.produto.fotos[0].url
      : "/placeholder-game.png"

    return (
      <tr key={pedido.id} className="bg-[#1C1C1E] border-b border-[#C89B3C]/20 hover:bg-[#242426] transition-colors">
        <th scope="row" className="px-6 py-4 font-medium text-white whitespace-nowrap">
          <p className="text-base font-bold text-[#E5BD55]">
            {pedido.produto?.marca?.nome} {pedido.produto?.nome}
          </p>
          <p className="mt-1 text-sm text-gray-400">
            Categoria: {pedido.produto?.categoria?.nome || "Geral"} — 
            Preço: R$: {Number(pedido.produto?.preco || 0).toLocaleString("pt-br", { minimumFractionDigits: 2 })}
          </p>
        </th>
        <td className="px-6 py-4">
          <img 
            src={imagemExibicao} 
            className="w-20 h-16 object-cover rounded-lg border border-[#C89B3C]/30" 
            alt={pedido.produto?.nome || "Produto"} 
          />
        </td>
        <td className="px-6 py-4">
          <p className="text-gray-200 font-medium">{pedido.descricao}</p>
          <p className="text-xs text-gray-400 mt-1">
            <i>Enviado em: {dataDMA(pedido.createdAt)}</i>
          </p>
        </td>
        <td className="px-6 py-4">
          <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-[#C89B3C]/20 text-[#E5BD55] border border-[#C89B3C]/40">
            {pedido.status || "Em Processamento"}
          </span>
          {pedido.updatedAt && (
            <p className="text-xs text-gray-400 mt-1">
              <i>Atualizado em: {dataDMA(pedido.updatedAt)}</i>
            </p>
          )}
        </td>
      </tr>
    )
  })

  return (
    <section className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="mb-6 mt-4 text-3xl font-extrabold leading-none tracking-tight text-white md:text-4xl lg:text-5xl">
        Listagem de{" "}
        <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#E5BD55] via-[#C89B3C] to-[#8C6820]">
          Meus Pedidos
        </span>
      </h1>

      {pedidos.length === 0 ? (
        <h2 className="mb-4 mt-10 text-xl font-medium text-gray-400">
          Ah... Você ainda não realizou pedidos de jogos ou produtos. 🙄
        </h2>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[#C89B3C]/30 shadow-lg">
          <table className="w-full text-sm text-left text-gray-300">
            <thead className="text-xs uppercase bg-[#242426] text-[#E5BD55] border-b border-[#C89B3C]/30">
              <tr>
                <th scope="col" className="px-6 py-4">Produto</th>
                <th scope="col" className="px-6 py-4">Imagem</th>
                <th scope="col" className="px-6 py-4">Observações</th>
                <th scope="col" className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {pedidosTable}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}