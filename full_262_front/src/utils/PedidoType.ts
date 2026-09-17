import type { ProdutoType } from "./ProdutoType"

export type PedidoType = {
  id: number
  clienteId: string
  produtoId: number
  produto: ProdutoType
  descricao: string
  status: string
  createdAt: string
  updatedAt: string | null
}