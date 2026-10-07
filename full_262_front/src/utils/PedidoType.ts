import type { ProdutoType } from "./ProdutoType"

export type PedidoType = {
  id: number
  clienteId: string
  produtoId: number
  produto: ProdutoType
  descricao: string
  resposta?: string
  status: "PENDENTE" | "EM_ANDAMENTO" | "CONCLUIDO" | "CANCELADO"
  createdAt: string
  updatedAt: string | null
}