import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ItemProduto from "./components/ItemProduto";
import type { ProdutoType } from "../utils/ProdutoType";

const apiUrl = import.meta.env.VITE_API_URL;

export default function AdminProdutos() {
  const [produtos, setProdutos] = useState<ProdutoType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function getProdutos() {
      try {
        const response = await fetch(`${apiUrl}/produtos`);
        if (!response.ok) throw new Error("Erro ao buscar produtos");
        const dados = await response.json();
        setProdutos(dados);
      } catch (error) {
        console.error("Falha na requisição:", error);
      } finally {
        setLoading(false);
      }
    }
    getProdutos();
  }, []);

  return (
    <div className="m-4 mt-24 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold leading-none tracking-tight text-white md:text-3xl lg:text-4xl">
          Cadastro de{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E5BD55] via-[#C89B3C] to-[#8C6820]">
            Produtos & Games
          </span>
        </h1>
        <Link 
          to="/admin/produtos/novo" 
          className="px-5 py-2.5 font-bold text-black bg-gradient-to-r from-[#E5BD55] via-[#C89B3C] to-[#8C6820] hover:brightness-110 rounded-xl transition-all shadow-lg text-sm"
        >
          + Novo Produto
        </Link>
      </div>

      <div className="relative overflow-x-auto rounded-xl border border-[#C89B3C]/30 shadow-xl bg-[#1C1C1E]">
        <table className="w-full text-sm text-left text-gray-300">
          <thead className="text-xs uppercase bg-[#242426] text-[#E5BD55] border-b border-[#C89B3C]/30">
            <tr>
              <th scope="col" className="px-6 py-4">Foto</th>
              <th scope="col" className="px-6 py-4">Nome do Produto</th>
              <th scope="col" className="px-6 py-4">Marca / Fabricante</th>
              <th scope="col" className="px-6 py-4">Categoria</th>
              <th scope="col" className="px-6 py-4">Preço R$</th>
              <th scope="col" className="px-6 py-4">Estoque</th>
              <th scope="col" className="px-6 py-4">Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center py-6 text-gray-400">Carregando catálogo...</td>
              </tr>
            ) : produtos.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-6 text-gray-400">Nenhum produto cadastrado.</td>
              </tr>
            ) : (
              produtos.map(produto => (
                <ItemProduto 
                  key={produto.id} 
                  produto={produto} 
                  produtos={produtos} 
                  setProdutos={setProdutos} 
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}