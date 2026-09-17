import type { ProdutoType } from "./ProdutoType"

export type FotoType = {
  id: number
  url: string
  produtoId: number
  produto?: ProdutoType
}