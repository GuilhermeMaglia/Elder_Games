import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import type { MarcaType } from "../utils/MarcaType";
import type { CategoriaType } from "../utils/CategoriaType";
import { useAdminStore } from "./context/AdminContext";

const apiUrl = import.meta.env.VITE_API_URL;

type Inputs = {
  nome: string;
  preco: number;
  quant: number;
  ano: number;
  descricao: string;
  marcaId: number;
  categoriaId: number;
  foto1: string;
  foto2?: string;
  foto3?: string;
};

export default function AdminNovoProduto() {
  const [marcas, setMarcas] = useState<MarcaType[]>([]);
  const [categorias, setCategorias] = useState<CategoriaType[]>([]);
  const { admin } = useAdminStore();
  const navigate = useNavigate();

  const { register, handleSubmit, reset } = useForm<Inputs>();

  useEffect(() => {
    async function buscaSelects() {
      const resMarcas = await fetch(`${apiUrl}/marcas`);
      const dadosMarcas = await resMarcas.json();
      setMarcas(dadosMarcas);

      const resCategorias = await fetch(`${apiUrl}/categorias`);
      const dadosCategorias = await resCategorias.json();
      setCategorias(dadosCategorias);
    }
    buscaSelects();
  }, []);

  async function cadastraProduto(data: Inputs) {
    try {
      // 1. Cadastra o produto
      const responseProduto = await fetch(`${apiUrl}/produtos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${admin.token}`
        },
        body: JSON.stringify({
          nome: data.nome,
          preco: Number(data.preco),
          quant: Number(data.quant),
          ano: Number(data.ano),
          descricao: data.descricao,
          marcaId: Number(data.marcaId),
          categoriaId: Number(data.categoriaId)
        })
      });

      if (!responseProduto.ok) {
        toast.error("Erro ao cadastrar produto.");
        return;
      }

      const produtoCriado = await responseProduto.json();

      // 2. Cadastra as fotos associadas ao produto
      const fotos = [data.foto1, data.foto2, data.foto3].filter(Boolean);

      for (const url of fotos) {
        if (url) {
          await fetch(`${apiUrl}/fotos`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${admin.token}`
            },
            body: JSON.stringify({
              url,
              produtoId: produtoCriado.id
            })
          });
        }
      }

      toast.success("Produto e fotos cadastrados com sucesso!");
      reset();
      navigate("/admin/produtos");
    } catch (error) {
      toast.error("Falha na comunicação com o servidor.");
    }
  }

  return (
    <div className="max-w-4xl mx-auto m-4 mt-24 p-6 bg-[#1C1C1E] rounded-2xl border border-[#C89B3C]/30 shadow-xl text-white">
      <h1 className="text-3xl font-extrabold mb-6">
        Cadastrar{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E5BD55] via-[#C89B3C] to-[#8C6820]">
          Novo Produto
        </span>
      </h1>

      <form onSubmit={handleSubmit(cadastraProduto)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#E5BD55]">Nome do Produto / Jogo</label>
          <input
            type="text"
            {...register("nome")}
            required
            className="w-full p-3 mt-1 bg-[#242426] border border-[#C89B3C]/40 rounded-xl focus:outline-none focus:border-[#E5BD55] text-white"
            placeholder="Ex: Play Station 5 / Elden Ring"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#E5BD55]">Preço (R$)</label>
            <input
              type="number"
              step="0.01"
              {...register("preco")}
              required
              className="w-full p-3 mt-1 bg-[#242426] border border-[#C89B3C]/40 rounded-xl focus:outline-none focus:border-[#E5BD55] text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#E5BD55]">Quantidade em Estoque</label>
            <input
              type="number"
              {...register("quant")}
              required
              className="w-full p-3 mt-1 bg-[#242426] border border-[#C89B3C]/40 rounded-xl focus:outline-none focus:border-[#E5BD55] text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#E5BD55]">Ano de Lançamento</label>
            <input
              type="number"
              {...register("ano")}
              required
              className="w-full p-3 mt-1 bg-[#242426] border border-[#C89B3C]/40 rounded-xl focus:outline-none focus:border-[#E5BD55] text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#E5BD55]">Marca / Desenvolvedora</label>
            <select
              {...register("marcaId")}
              required
              className="w-full p-3 mt-1 bg-[#242426] border border-[#C89B3C]/40 rounded-xl focus:outline-none focus:border-[#E5BD55] text-white"
            >
              <option value="">Selecione a marca...</option>
              {marcas.map(m => (
                <option key={m.id} value={m.id}>{m.nome}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#E5BD55]">Categoria</label>
            <select
              {...register("categoriaId")}
              required
              className="w-full p-3 mt-1 bg-[#242426] border border-[#C89B3C]/40 rounded-xl focus:outline-none focus:border-[#E5BD55] text-white"
            >
              <option value="">Selecione a categoria...</option>
              {categorias.map(c => (
                <option key={c.id} value={c.id}>{c.nome}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#E5BD55]">Descrição detalhada</label>
          <textarea
            {...register("descricao")}
            rows={3}
            required
            className="w-full p-3 mt-1 bg-[#242426] border border-[#C89B3C]/40 rounded-xl focus:outline-none focus:border-[#E5BD55] text-white"
          ></textarea>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-[#E5BD55]">URLs das Fotos</label>
          <input
            type="url"
            {...register("foto1")}
            required
            placeholder="URL da foto principal"
            className="w-full p-3 bg-[#242426] border border-[#C89B3C]/40 rounded-xl focus:outline-none focus:border-[#E5BD55] text-white"
          />
          <input
            type="url"
            {...register("foto2")}
            placeholder="URL da foto 2 (Opcional)"
            className="w-full p-3 bg-[#242426] border border-[#C89B3C]/40 rounded-xl focus:outline-none focus:border-[#E5BD55] text-white"
          />
          <input
            type="url"
            {...register("foto3")}
            placeholder="URL da foto 3 (Opcional)"
            className="w-full p-3 bg-[#242426] border border-[#C89B3C]/40 rounded-xl focus:outline-none focus:border-[#E5BD55] text-white"
          />
        </div>

        <div className="flex gap-4 pt-4">
          <Link
            to="/admin/produtos"
            className="flex-1 py-3 text-center text-sm font-semibold text-[#E5BD55] border border-[#C89B3C]/50 rounded-xl hover:bg-[#C89B3C]/20 transition-all"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            className="flex-1 py-3 text-sm font-bold text-black bg-gradient-to-r from-[#E5BD55] via-[#C89B3C] to-[#8C6820] hover:brightness-110 rounded-xl transition-all shadow-lg"
          >
            Salvar Produto
          </button>
        </div>
      </form>
    </div>
  );
}