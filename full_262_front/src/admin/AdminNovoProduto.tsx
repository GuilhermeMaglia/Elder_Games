import { useState, useEffect } from "react"
import { useNavigate, useParams, Link } from "react-router-dom"

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000"

export default function AdminNovoProduto() {
  const [nome, setNome] = useState("")
  const [marcaId, setMarcaId] = useState("")
  const [preco, setPreco] = useState("")
  const [foto, setFoto] = useState("")
  const [quantidade, setQuantidade] = useState("")
  const [categoriaId, setCategoriaId] = useState("")
  const [descricao, setDescricao] = useState("")
  const [ano, setAno] = useState(new Date().getFullYear().toString())
  const [destaque, setDestaque] = useState(true)

  const [categorias, setCategorias] = useState<{ id: number; nome: string }[]>([])
  const [marcas, setMarcas] = useState<{ id: number; nome: string }[]>([])
  const [loading, setLoading] = useState(false)
  const [gerandoDescricao, setGerandoDescricao] = useState(false)

  const { id } = useParams()
  const navigate = useNavigate()
  const isEdicao = Boolean(id)

  async function gerarDescricao() {
    const marca = marcas.find((item) => String(item.id) === marcaId)?.nome
    const categoria = categorias.find((item) => String(item.id) === categoriaId)?.nome

    if (!nome.trim() || !marca || !categoria || !ano) {
      alert("Informe o título, a marca, a categoria e o ano antes de gerar a descrição.")
      return
    }

    const token = localStorage.getItem("adminKey") || sessionStorage.getItem("adminKey")
    if (!token) {
      alert("Faça login novamente como administrador para usar o serviço de IA.")
      return
    }

    setGerandoDescricao(true)
    try {
      const response = await fetch(`${apiUrl}/ia/descricao-produto`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          titulo: nome.trim(),
          marca,
          categoria,
          ano: Number(ano),
          descricaoAtual: descricao.trim() || undefined,
        }),
      })
      const dados = await response.json().catch(() => ({}))

      if (!response.ok) {
        alert(dados.erro || "Não foi possível gerar a descrição.")
        return
      }

      setDescricao(dados.descricao)
    } catch (error) {
      console.error("Erro ao gerar descrição com IA:", error)
      alert("Erro ao conectar com o serviço de IA.")
    } finally {
      setGerandoDescricao(false)
    }
  }

  useEffect(() => {
    async function carregarDados() {
      try {
        // Carrega Categorias
        const resCat = await fetch(`${apiUrl}/categorias`)
        if (resCat.ok) {
          const dadosCat = await resCat.json()
          setCategorias(dadosCat)
        }

        // Carrega Marcas
        const resMarcas = await fetch(`${apiUrl}/marcas`)
        if (resMarcas.ok) {
          const dadosMarcas = await resMarcas.json()
          setMarcas(dadosMarcas)
        }

        // Se for edição, carrega os dados do produto
        if (id) {
          const resProd = await fetch(`${apiUrl}/produtos/${id}`)
          if (resProd.ok) {
            const prod = await resProd.json()
            setNome(prod.titulo || prod.nome || "")
            setMarcaId(String(prod.marcaId || ""))
            setPreco(String(prod.preco || ""))
            setFoto(prod.foto || "")
            setQuantidade(String(prod.quant ?? prod.quantidade ?? ""))
            setCategoriaId(String(prod.categoriaId || ""))
            setDescricao(prod.descricao || "")
            setAno(String(prod.ano || new Date().getFullYear()))
            setDestaque(Boolean(prod.destaque))
          }
        }
      } catch (err) {
        console.error("Erro ao carregar dados:", err)
      }
    }
    carregarDados()
  }, [id])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!nome.trim() || !preco || !foto.trim() || !categoriaId || !marcaId || !ano) {
      alert("Por favor, preencha todos os campos obrigatórios (Título, Preço, Foto, Marca, Categoria e Ano).")
      return
    }

    setLoading(true)

    // Payload idêntico ao exigido pelo schema.prisma
    const payload = {
      titulo: nome.trim(),
      descricao: descricao.trim() || null,
      ano: Number(ano),
      preco: Number(preco),
      foto: foto.trim(),
      quant: quantidade ? Number(quantidade) : 0,
      destaque: Boolean(destaque),
      marcaId: Number(marcaId),
      categoriaId: Number(categoriaId),
    }

    const url = isEdicao ? `${apiUrl}/produtos/${id}` : `${apiUrl}/produtos`
    const method = isEdicao ? "PUT" : "POST"
    const token = localStorage.getItem("adminKey") || sessionStorage.getItem("adminKey")

    if (!token) {
      alert("Faça login novamente como administrador para salvar produtos.")
      setLoading(false)
      return
    }

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        alert(isEdicao ? "Produto atualizado com sucesso!" : "Produto cadastrado com sucesso!")
        navigate("/admin/produtos")
      } else {
        const erroBackend = await response.json().catch(() => null)
        console.error("Erro do servidor:", erroBackend)
        const msgErro = erroBackend?.erros
          ? (Array.isArray(erroBackend.erros) ? erroBackend.erros.join("\n") : erroBackend.erros)
          : (erroBackend?.erro || erroBackend?.message || "Erro: Dados recusados pelo servidor.")
        alert(msgErro)
      }
    } catch (error) {
      console.error(error)
      alert("Erro ao conectar ao servidor.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="m-4 mt-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white md:text-3xl">
          {isEdicao ? "Alterar" : "Cadastrar"}{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E5BD55] via-[#C89B3C] to-[#8C6820]">
            Produto / Jogo
          </span>
        </h1>
        <Link to="/admin/produtos" className="text-sm text-gray-400 hover:text-[#E5BD55]">
          ← Voltar à lista
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="bg-[#242426] border border-[#C89B3C]/30 p-6 rounded-2xl space-y-4 text-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1 text-gray-300">Título do Produto *</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              minLength={3}
              maxLength={100}
              className="w-full bg-[#1C1C1E] border border-[#C89B3C]/40 rounded-lg p-3 text-sm focus:outline-none focus:border-[#E5BD55]"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-300">Marca / Estúdio *</label>
            <select
              value={marcaId}
              onChange={(e) => setMarcaId(e.target.value)}
              required
              className="w-full bg-[#1C1C1E] border border-[#C89B3C]/40 rounded-lg p-3 text-sm focus:outline-none focus:border-[#E5BD55]"
            >
              <option value="">Selecione uma marca...</option>
              {marcas.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nome}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-300">Preço (R$) *</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={preco}
              onChange={(e) => setPreco(e.target.value)}
              required
              className="w-full bg-[#1C1C1E] border border-[#C89B3C]/40 rounded-lg p-3 text-sm focus:outline-none focus:border-[#E5BD55]"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-300">Ano de Lançamento *</label>
            <input
              type="number"
              min="1900"
              value={ano}
              onChange={(e) => setAno(e.target.value)}
              required
              className="w-full bg-[#1C1C1E] border border-[#C89B3C]/40 rounded-lg p-3 text-sm focus:outline-none focus:border-[#E5BD55]"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-300">Quantidade em Estoque</label>
            <input
              type="number"
              min="0"
              value={quantidade}
              onChange={(e) => setQuantidade(e.target.value)}
              className="w-full bg-[#1C1C1E] border border-[#C89B3C]/40 rounded-lg p-3 text-sm focus:outline-none focus:border-[#E5BD55]"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-300">Categoria *</label>
            <select
              value={categoriaId}
              onChange={(e) => setCategoriaId(e.target.value)}
              required
              className="w-full bg-[#1C1C1E] border border-[#C89B3C]/40 rounded-lg p-3 text-sm focus:outline-none focus:border-[#E5BD55]"
            >
              <option value="">Selecione uma categoria...</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm mb-1 text-gray-300">URL da Imagem / Capa *</label>
            <input
              type="url"
              value={foto}
              onChange={(e) => setFoto(e.target.value)}
              required
              className="w-full bg-[#1C1C1E] border border-[#C89B3C]/40 rounded-lg p-3 text-sm focus:outline-none focus:border-[#E5BD55]"
            />
          </div>

          <div className="md:col-span-2">
            <div className="flex items-center justify-between gap-3 mb-1">
              <label className="block text-sm text-gray-300">Descrição</label>
              <button
                type="button"
                onClick={gerarDescricao}
                disabled={gerandoDescricao}
                className="text-sm font-semibold text-[#E5BD55] hover:text-white disabled:opacity-50 disabled:cursor-wait"
              >
                {gerandoDescricao ? "Gerando..." : "Gerar com IA"}
              </button>
            </div>
            <textarea
              rows={3}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="w-full bg-[#1C1C1E] border border-[#C89B3C]/40 rounded-lg p-3 text-sm focus:outline-none focus:border-[#E5BD55]"
            />
          </div>

          <div className="md:col-span-2 flex items-center space-x-2 pt-1">
            <input
              type="checkbox"
              id="destaque"
              checked={destaque}
              onChange={(e) => setDestaque(e.target.checked)}
              className="w-4 h-4 accent-[#E5BD55] bg-[#1C1C1E] border-gray-600 rounded cursor-pointer"
            />
            <label htmlFor="destaque" className="text-sm text-gray-300 cursor-pointer select-none">
              Exibir este produto na seção de <strong className="text-[#E5BD55]">Destaques</strong> da página inicial
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-[#E5BD55] via-[#C89B3C] to-[#8C6820] text-black font-bold rounded-lg hover:brightness-110 transition-all cursor-pointer"
        >
          {loading ? "A guardar..." : isEdicao ? "Atualizar Produto" : "Cadastrar Produto"}
        </button>
      </form>
    </div>
  )
}