export interface Marca {
  id: number
  nome: string
}

export interface Categoria {
  id: number
  nome: string
}

export interface ProdutoType {
  id: number
  titulo: string
  descricao?: string
  ano?: number
  preco: number
  foto: string
  quant?: number
  destaque?: boolean
  marca?: Marca
  categoria?: Categoria
}