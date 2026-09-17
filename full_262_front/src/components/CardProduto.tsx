import { Link } from "react-router-dom"
import type { ProdutoType } from "../utils/ProdutoType"

export function CardProduto({ data }: { data: ProdutoType }) {
  const imagemExibicao = data.fotos && data.fotos.length > 0 
    ? data.fotos[0].url 
    : "/placeholder-game.png"

  return (
    <div className="max-w-sm bg-[#1C1C1E] border border-[#C89B3C]/40 rounded-xl shadow-lg hover:border-[#E5BD55] transition-all duration-300 overflow-hidden flex flex-col justify-between">
      {/* Área da Imagem do Jogo/Produto */}
      <div className="w-full h-52 bg-[#E3E3E3] flex items-center justify-center overflow-hidden relative">
        <img 
          className="w-full h-full object-cover" 
          src={imagemExibicao} 
          alt={data.nome} 
        />
        {/* Badge de Marca/Fabricante */}
        {data.marca?.nome && (
          <span className="absolute top-2 right-2 bg-[#1C1C1E]/80 text-[#E5BD55] text-xs font-bold px-2.5 py-1 rounded border border-[#C89B3C]/30 backdrop-blur-sm">
            {data.marca.nome}
          </span>
        )}
      </div>

      {/* Conteúdo do Card */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Nome do Jogo / Produto */}
          <h5 className="mb-2 text-xl font-bold tracking-tight bg-gradient-to-r from-[#E5BD55] via-[#C89B3C] to-[#D2AC67] bg-clip-text text-transparent line-clamp-1">
            {data.nome}
          </h5>
          
          {/* Preço do Produto */}
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
            <span className={Number(data.quant) > 0 ? "text-emerald-400" : "text-red-400"}>
              {Number(data.quant) > 0 ? `Estoque: ${data.quant}` : "Esgotado"}
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