import { Router } from 'express'
import { z } from 'zod'
import { prisma } from "../lib/prisma"
import { autenticarAdmin } from "../middleware/autenticarAdmin"

const router = Router()

const marcaSchema = z.object({
  nome: z.string().min(2, { message: "O nome da marca deve possuir, no mínimo, 2 caracteres" })
})

// Listar todas as marcas
router.get("/", async (req, res) => {
  try {
    const marcas = await prisma.marca.findMany({
      orderBy: { nome: 'asc' }
    })
    res.status(200).json(marcas)
  } catch (error) {
    res.status(500).json({ erro: error })
  }
})

// Cadastrar nova marca
router.post("/", autenticarAdmin, async (req, res) => {
  const valida = marcaSchema.safeParse(req.body)
  if (!valida.success) {
    res.status(400).json({ erro: valida.error })
    return
  }

  const { nome } = valida.data

  try {
    const marca = await prisma.marca.create({
      data: { nome }
    })
    res.status(201).json(marca)
  } catch (error) {
    res.status(400).json({ erro: error })
  }
})

// Atualizar marca existente
router.put("/:id", autenticarAdmin, async (req, res) => {
  const { id } = req.params

  const valida = marcaSchema.safeParse(req.body)
  if (!valida.success) {
    res.status(400).json({ erro: valida.error })
    return
  }

  const { nome } = valida.data

  try {
    const marca = await prisma.marca.update({
      where: { id: Number(id) },
      data: { nome }
    })
    res.status(200).json(marca)
  } catch (error) {
    res.status(400).json({ erro: error })
  }
})

// Deletar marca
router.delete("/:id", autenticarAdmin, async (req, res) => {
  const { id } = req.params

  try {
    const marca = await prisma.marca.delete({
      where: { id: Number(id) }
    })
    res.status(200).json(marca)
  } catch (error) {
    res.status(400).json({ erro: error })
  }
})

export default router