import { useForm } from "react-hook-form"
import type { ProdutoType } from "../utils/ProdutoType"

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000"

interface Inputs {
  termo: string
}

interface InputPesquisaProps {
  setProdutos: React.Dispatch<React.SetStateAction<ProdutoType[]>>
}

export function InputPesquisa({ setProdutos }: InputPesquisaProps) {
  const { register, handleSubmit, reset } = useForm<Inputs>()

  async function enviaPesquisa(data: Inputs) {
    try {
      const termo = data.termo.trim()
      const url = termo.length < 2
        ? `${apiUrl}/produtos/destaques`
        : `${apiUrl}/produtos?${new URLSearchParams({ termo })}`
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`A busca falhou (${response.status}).`)
      }

      const dados: unknown = await response.json()
      if (!Array.isArray(dados)) {
        throw new Error("A resposta da busca possui formato inválido.")
      }

      setProdutos(dados)
      if (termo.length >= 2 && dados.length === 0) {
        alert("Nenhum produto encontrado com essa palavra-chave.")
      }
    } catch (error) {
      console.error("Erro ao buscar produtos:", error)
      alert("Não foi possível buscar produtos. Tente novamente.")
    }
  }

  async function mostraTodos() {
    reset()
    try {
      const response = await fetch(`${apiUrl}/produtos`)
      if (!response.ok) {
        throw new Error(`Não foi possível carregar os produtos (${response.status}).`)
      }
      const dados: unknown = await response.json()
      if (!Array.isArray(dados)) {
        throw new Error("A resposta dos produtos possui formato inválido.")
      }
      setProdutos(dados)
    } catch (error) {
      console.error("Erro ao carregar todos os produtos:", error)
      alert("Não foi possível carregar os produtos. Tente novamente.")
    }
  }

  return (
    <form onSubmit={handleSubmit(enviaPesquisa)} className="flex gap-3 max-w-2xl">
      <input
        type="text"
        {...register("termo")}
        placeholder="O que você está procurando? (Ex: Goku, Batman...)"
        className="w-full px-4 py-2.5 bg-[#2C2C2E] border border-[#C89B3C]/40 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#E5BD55] transition-colors"
      />
      <button
        type="submit"
        className="px-5 py-2.5 bg-gradient-to-r from-[#E5BD55] via-[#C89B3C] to-[#8C6820] text-black font-semibold rounded-lg hover:brightness-110 transition-all cursor-pointer"
      >
        Buscar
      </button>
      <button
        type="button"
        onClick={mostraTodos}
        className="px-4 py-2.5 bg-[#2C2C2E] text-[#D2AC67] border border-[#C89B3C]/30 font-semibold rounded-lg hover:bg-[#3A3A3C] transition-all cursor-pointer"
      >
        Todos
      </button>
    </form>
  )
}