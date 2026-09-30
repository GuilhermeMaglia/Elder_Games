import { Router } from "express"
import { z } from "zod"
import { prisma } from "../lib/prisma"

const router = Router()

// Schema de validação Zod atualizado com 'ano' e 'quant'
const produtoSchema = z.object({
  titulo: z.string().min(3, "O título deve ter no mínimo 3 caracteres"),
  descricao: z.string().optional(),
  ano: z.number().int().min(1900, "Ano inválido"),
  preco: z.number().positive("O preço deve ser maior que zero"),
  foto: z.string().url("A foto deve ser uma URL válida"),
  quant: z.number().int().min(0, "A quantidade deve ser zero ou maior").default(0),
  destaque: z.boolean().default(true),
  marcaId: z.number().int("ID de marca inválido"),
  categoriaId: z.number().int("ID de categoria inválido"),
})

// 1. GET /produtos/destaques - Produtos em destaque para a Home
router.get("/destaques", async (req, res) => {
  try {
    const produtos = await prisma.produto.findMany({
      where: { destaque: true },
      include: {
        marca: { select: { id: true, nome: true } },
        categoria: { select: { id: true, nome: true } },
      },
      orderBy: { id: "desc" }, // Ordenado por ID decrescente (do mais recente para o mais antigo)
    })

    res.status(200).json(produtos)
  } catch (error) {
    console.error("Erro em GET /produtos/destaques:", error)
    res.status(500).json({ erro: "Erro ao buscar produtos em destaque" })
  }
})

// 2. GET /produtos - Listar todos com filtros opcionais (busca por nome, categoria, marca)
router.get("/", async (req, res) => {
  const { termo, categoriaId, marcaId } = req.query

  const where: any = {}

  if (termo) {
    where.OR = [
      { titulo: { contains: String(termo), mode: "insensitive" } },
      { descricao: { contains: String(termo), mode: "insensitive" } },
    ]
  }

  if (categoriaId) {
    where.categoriaId = Number(categoriaId)
  }

  if (marcaId) {
    where.marcaId = Number(marcaId)
  }

  try {
    const produtos = await prisma.produto.findMany({
      where,
      include: {
        marca: { select: { id: true, nome: true } },
        categoria: { select: { id: true, nome: true } },
      },
      orderBy: { id: "desc" }, // Ordenado por ID decrescente
    })

    res.status(200).json(produtos)
  } catch (error) {
    console.error("Erro em GET /produtos:", error)
    res.status(500).json({ erro: "Erro ao listar produtos" })
  }
})

// 3. GET /produtos/:id - Detalhes do produto
router.get("/:id", async (req, res) => {
  const { id } = req.params

  try {
    const produto = await prisma.produto.findUnique({
      where: { id: Number(id) },
      include: {
        marca: { select: { id: true, nome: true } },
        categoria: { select: { id: true, nome: true } },
      },
    })

    if (!produto) {
      res.status(404).json({ erro: "Produto não encontrado" })
      return
    }

    res.status(200).json(produto)
  } catch (error) {
    console.error("Erro em GET /produtos/:id:", error)
    res.status(500).json({ erro: "Erro ao buscar detalhes do produto" })
  }
})

// 4. POST /produtos - Cadastrar produto
router.post("/", async (req, res) => {
  try {
    const valida = produtoSchema.safeParse(req.body)

    if (!valida.success) {
      res.status(400).json({ erros: valida.error.issues.map((i) => i.message) })
      return
    }

    const produto = await prisma.produto.create({
      data: valida.data,
      include: {
        marca: true,
        categoria: true,
      },
    })

    res.status(201).json(produto)
  } catch (error) {
    console.error("Erro em POST /produtos:", error)
    res.status(500).json({ erro: "Erro interno ao cadastrar produto" })
  }
})

export default router