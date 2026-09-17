import type { MarcaType } from "./MarcaType";
import type { CategoriaType } from "./CategoriaType";
import type { FotoType } from "./FotoType";

export type ProdutoType = {
  id: number;
  nome: string;
  descricao: string;
  ano: number;
  preco: number;
  quant: number;
  fotos: FotoType[];
  destaque: boolean;
  createdAt: Date;
  updatedAt: Date;
  marcaId: number;
  marca: MarcaType;
  categoriaId: number;
  categoria: CategoriaType;
};