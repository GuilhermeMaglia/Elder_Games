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
    console.error("Erro ao listar marcas:", error)
    res.status(500).json({ erro: "Erro ao listar marcas." })
  }
})

// Cadastrar nova marca
router.post("/", autenticarAdmin, async (req, res) => {
  const valida = marcaSchema.safeParse(req.body)
  if (!valida.success) {
    res.status(400).json({ erro: valida.error.issues[0]?.message || "Dados de marca inválidos." })
    return
  }

  const { nome } = valida.data

  try {
    const marca = await prisma.marca.create({
      data: { nome }
    })
    res.status(201).json(marca)
  } catch (error) {
    console.error("Erro ao cadastrar marca:", error)
    res.status(400).json({ erro: "Erro ao cadastrar marca." })
  }
})

// Atualizar marca existente
router.put("/:id", autenticarAdmin, async (req, res) => {
  const { id } = req.params
  const idMarca = Number(id)

  if (!Number.isInteger(idMarca) || idMarca < 1) {
    res.status(400).json({ erro: "ID de marca inválido." })
    return
  }

  const valida = marcaSchema.safeParse(req.body)
  if (!valida.success) {
    res.status(400).json({ erro: valida.error.issues[0]?.message || "Dados de marca inválidos." })
    return
  }

  const { nome } = valida.data

  try {
    const marca = await prisma.marca.update({
      where: { id: idMarca },
      data: { nome }
    })
    res.status(200).json(marca)
  } catch (error) {
    console.error("Erro ao atualizar marca:", error)
    res.status(400).json({ erro: "Erro ao atualizar marca." })
  }
})

// Deletar marca
router.delete("/:id", autenticarAdmin, async (req, res) => {
  const { id } = req.params
  const idMarca = Number(id)

  if (!Number.isInteger(idMarca) || idMarca < 1) {
    res.status(400).json({ erro: "ID de marca inválido." })
    return
  }

  try {
    const produtosVinculados = await prisma.produto.count({
      where: { marcaId: idMarca }
    })

    if (produtosVinculados > 0) {
      res.status(400).json({
        erro: `Não é possível remover a marca pois existem ${produtosVinculados} produto(s) associado(s) a ela.`
      })
      return
    }

    const marca = await prisma.marca.delete({
      where: { id: idMarca }
    })
    res.status(200).json({ mensagem: "Marca removida com sucesso.", marca })
  } catch (error) {
    console.error("Erro ao excluir marca:", error)
    res.status(400).json({ erro: "Erro ao excluir marca." })
  }
})

export default router