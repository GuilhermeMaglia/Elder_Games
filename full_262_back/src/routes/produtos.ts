import { Router } from 'express'
import { z } from 'zod'
import { prisma } from "../../lib/prisma"

const router = Router()

const produtoSchema = z.object({
  titulo: z.string().min(2, { message: "O título deve possuir, no mínimo, 2 caracteres" }),
  descricao: z.string().optional().nullable(),
  preco: z.number().positive({ message: "O preço deve ser um valor positivo" }),
  foto: z.string().url({ message: "A foto deve ser uma URL válida" }),
  destaque: z.boolean().optional(),
  marcaId: z.number(),
  categoriaId: z.number(),
})

// Listar todos os produtos
router.get("/", async (req, res) => {
  try {
    const produtos = await prisma.produto.findMany({
      include: {
        marca: true,
        categoria: true,
      }
    })
    res.status(200).json(produtos)
  } catch (error) {
    res.status(500).json({ erro: error })
  }
})

// Listar produtos em destaque
router.get("/destaques", async (req, res) => {
  try {
    const produtos = await prisma.produto.findMany({
      where: {
        destaque: true
      },
      include: {
        marca: true,
        categoria: true,
      }
    })
    res.status(200).json(produtos)
  } catch (error) {
    res.status(500).json({ erro: error })
  }
})

// Obter detalhes de um produto por ID
router.get("/:id", async (req, res) => {
  const { id } = req.params

  try {
    const produto = await prisma.produto.findFirst({
      where: { id: Number(id) },
      include: {
        marca: true,
        categoria: true,
      }
    })

    if (!produto) {
      res.status(404).json({ erro: "Produto não encontrado." })
      return
    }

    res.status(200).json(produto)
  } catch (error) {
    res.status(500).json({ erro: error })
  }
})

// Cadastrar novo produto
router.post("/", async (req, res) => {
  const valida = produtoSchema.safeParse(req.body)
  if (!valida.success) {
    res.status(400).json({ erro: valida.error })
    return
  }

  const { titulo, descricao, preco, foto, destaque = true, marcaId, categoriaId } = valida.data

  try {
    const produto = await prisma.produto.create({
      data: {
        titulo,
        descricao,
        preco,
        foto,
        destaque,
        marcaId,
        categoriaId
      },
      include: {
        marca: true,
        categoria: true
      }
    })

    res.status(201).json(produto)
  } catch (error) {
    res.status(400).json({ erro: error })
  }
})

// Deletar um produto
router.delete("/:id", async (req, res) => {
  const { id } = req.params

  try {
    const produto = await prisma.produto.delete({
      where: { id: Number(id) }
    })
    res.status(200).json(produto)
  } catch (error) {
    res.status(400).json({ erro: error })
  }
})

// Atualizar um produto
router.put("/:id", async (req, res) => {
  const { id } = req.params

  const valida = produtoSchema.safeParse(req.body)
  if (!valida.success) {
    res.status(400).json({ erro: valida.error })
    return
  }

  const { titulo, descricao, preco, foto, destaque, marcaId, categoriaId } = valida.data

  try {
    const produto = await prisma.produto.update({
      where: { id: Number(id) },
      data: {
        titulo,
        descricao,
        preco,
        foto,
        destaque,
        marcaId,
        categoriaId
      }
    })
    res.status(200).json(produto)
  } catch (error) {
    res.status(400).json({ erro: error })
  }
})

// Pesquisar produtos por termo (título, marca ou preço máximo)
router.get("/pesquisa/:termo", async (req, res) => {
  const { termo } = req.params
  const termoNumero = Number(termo)

  if (isNaN(termoNumero)) {
    try {
      const produtos = await prisma.produto.findMany({
        include: {
          marca: true,
          categoria: true,
        },
        where: {
          OR: [
            { titulo: { contains: termo, mode: "insensitive" } },
            { marca: { nome: { contains: termo, mode: "insensitive" } } },
            { categoria: { nome: { contains: termo, mode: "insensitive" } } }
          ]
        }
      })
      res.status(200).json(produtos)
    } catch (error) {
      res.status(500).json({ erro: error })
    }
  } else {
    try {
      const produtos = await prisma.produto.findMany({
        include: {
          marca: true,
          categoria: true,
        },
        where: { preco: { lte: termoNumero } }
      })
      res.status(200).json(produtos)
    } catch (error) {
      res.status(500).json({ erro: error })
    }
  }
})

export default router