import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { ProdutoType } from "../utils/ProdutoType";

const apiUrl = import.meta.env.VITE_API_URL;

type Inputs = {
  termo: string;
};

type InputPesquisaProps = {
  setProdutos: React.Dispatch<React.SetStateAction<ProdutoType[]>>;
};

export function InputPesquisa({ setProdutos }: InputPesquisaProps) {
  const { register, handleSubmit, reset } = useForm<Inputs>();

  async function enviaPesquisa(data: Inputs) {
    if (data.termo.length < 2) {
      toast.error("Informe, no mínimo, 2 caracteres");
      return;
    }

    const response = await fetch(`${apiUrl}/produtos/pesquisa/${data.termo}`);
    const dados = await response.json();
    setProdutos(dados);
  }

  async function mostraDestaques() {
    const response = await fetch(`${apiUrl}/produtos/destaques`);
    const dados = await response.json();
    reset({ termo: "" });
    setProdutos(dados);
  }

  return (
    <div className="flex mx-auto max-w-5xl mt-3 px-2 gap-3 items-center">
      <form className="flex-1" onSubmit={handleSubmit(enviaPesquisa)}>
        <label htmlFor="default-search" className="sr-only">Search</label>
        
        {/* Moldura Dourada */}
        <div className="relative p-[2px] bg-gradient-to-r from-[#E5BD55] via-[#C89B3C] to-[#8C6820] rounded-xl shadow-lg flex items-center">
          <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none">
            <svg className="w-4 h-4 text-[#C89B3C]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
            </svg>
          </div>

          <input 
            type="search" 
            id="default-search" 
            className="block w-full p-3.5 ps-11 text-sm text-[#D2AC67] placeholder-[#C89B3C]/70 bg-[#1C1C1E] rounded-lg focus:outline-none"
            placeholder="Informe nome do jogo, marca, categoria ou preço máximo" 
            required 
            {...register('termo')} 
          />

          <button 
            type="submit" 
            className="me-1 px-5 py-2.5 font-bold text-black bg-gradient-to-r from-[#E5BD55] to-[#C89B3C] hover:from-[#C89B3C] hover:to-[#8C6820] focus:ring-2 focus:outline-none focus:ring-[#E5BD55] rounded-lg text-sm transition-all duration-200"
          >
            Pesquisar
          </button>
        </div>
      </form>

      <button 
        type="button" 
        className="px-5 py-3.5 text-sm font-semibold text-[#E5BD55] bg-[#242426] border border-[#C89B3C]/50 hover:bg-[#C89B3C]/20 hover:text-white focus:ring-2 focus:outline-none focus:ring-[#E5BD55] rounded-xl transition-all duration-200 whitespace-nowrap"
        onClick={mostraDestaques}
      >
        Exibir Destaques
      </button>
    </div>
  );
}