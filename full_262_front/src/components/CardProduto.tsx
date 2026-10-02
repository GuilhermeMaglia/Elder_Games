import { Link } from "react-router-dom"
import type { ProdutoType } from "../utils/ProdutoType"

export function CardProduto({ data }: { data: ProdutoType }) {
  if (!data) return null

  return (
    <div className="w-full bg-[#1C1C1E] border border-[#C89B3C]/40 rounded-xl shadow-lg hover:border-[#E5BD55] transition-all duration-300 overflow-hidden flex flex-col justify-between">
      {/* Imagem do Produto - Aumentada de h-52 para h-64 com object-contain */}
      <div className="w-full h-64 bg-[#2C2C2E] flex items-center justify-center overflow-hidden relative p-2">
        <img 
          className="max-w-full max-h-full object-contain" 
          src={data.foto || "/placeholder-game.png"} 
          alt={data.titulo} 
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://via.placeholder.com/300x200?text=Sem+Imagem"
          }}
        />
        {/* Badge da Marca */}
        {data.marca?.nome && (
          <span className="absolute top-2 right-2 bg-[#1C1C1E]/80 text-[#E5BD55] text-xs font-bold px-2.5 py-1 rounded border border-[#C89B3C]/30 backdrop-blur-sm">
            {data.marca.nome}
          </span>
        )}
      </div>

      {/* Conteúdo do Card */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Título */}
          <h5 className="mb-2 text-xl font-bold tracking-tight bg-gradient-to-r from-[#E5BD55] via-[#C89B3C] to-[#D2AC67] bg-clip-text text-transparent line-clamp-1">
            {data.titulo}
          </h5>
          
          {/* Preço */}
          <p className="mb-2 text-lg font-extrabold text-[#E5BD55]">
            R$: {Number(data.preco).toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}
          </p>
          
          {/* Categoria e Estoque */}
          <div className="mb-4 text-sm font-medium text-[#D2AC67]/80 flex justify-between items-center">
            <span>
              Categoria: {data.categoria?.nome || "Geral"}
            </span>
            <span className={data.quant !== undefined && Number(data.quant) === 0 ? "text-red-400" : "text-emerald-400"}>
              {data.quant !== undefined ? (Number(data.quant) > 0 ? `Estoque: ${data.quant}` : "Esgotado") : "Disponível"}
            </span>
          </div>
        </div>

        {/* Botão Ver Detalhes */}
        <Link 
          to={`/detalhes/${data.id}`} 
          className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-black bg-gradient-to-r from-[#E5BD55] via-[#C89B3C] to-[#8C6820] hover:brightness-110 focus:ring-2 focus:outline-none focus:ring-[#E5BD55] rounded-lg transition-all duration-200 w-full text-center"
        >
          Ver Detalhes
          <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2 stroke-black" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
          </svg>
        </Link>
      </div>
    </div>
  )
}