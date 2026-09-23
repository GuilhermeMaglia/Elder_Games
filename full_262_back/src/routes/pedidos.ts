import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../../lib/prisma'

const router = Router()

const pedidoSchema = z.object({
  clienteId: z.string().uuid({ message: "ID de cliente inválido" }),
  produtoId: z.number().int({ message: "ID do produto deve ser um número inteiro" }),
  descricao: z.string().min(3, { message: "Descrição deve ter no mínimo 3 caracteres" }),
  resposta: z.string().optional().nullable(),
})

// Listar todos os pedidos
router.get('/', async (req, res) => {
  try {
    const pedidos = await prisma.pedido.findMany({
      include: {
        cliente: true,
        produto: {
          include: {
            marca: true,
            categoria: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    res.status(200).json(pedidos)
  } catch (error) {
    res.status(500).json({ erro: error })
  }
})

// Listar pedidos de um cliente específico
router.get('/cliente/:clienteId', async (req, res) => {
  const { clienteId } = req.params

  try {
    const pedidos = await prisma.pedido.findMany({
      where: { clienteId },
      include: {
        produto: {
          include: {
            marca: true,
            categoria: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    res.status(200).json(pedidos)
  } catch (error) {
    res.status(500).json({ erro: error })
  }
})

// Criar um novo pedido
router.post('/', async (req, res) => {
  const valida = pedidoSchema.safeParse(req.body)
  if (!valida.success) {
    res.status(400).json({ erro: valida.error })
    return
  }

  const { clienteId, produtoId, descricao, resposta } = valida.data

  try {
    const pedido = await prisma.pedido.create({
      data: {
        clienteId,
        produtoId,
        descricao,
        resposta: resposta || null
      },
      include: {
        cliente: true,
        produto: true
      }
    })
    res.status(201).json(pedido)
  } catch (error) {
    res.status(400).json({ erro: error })
  }
})

// Atualizar a resposta ou status de um pedido
router.patch('/:id', async (req, res) => {
  const { id } = req.params
  const { resposta, status } = req.body

  try {
    const pedido = await prisma.pedido.update({
      where: { id: Number(id) },
      data: {
        resposta,
        status
      }
    })
    res.status(200).json(pedido)
  } catch (error) {
    res.status(400).json({ erro: error })
  }
})

// Deletar um pedido
router.delete('/:id', async (req, res) => {
  const { id } = req.params

  try {
    const pedido = await prisma.pedido.delete({
      where: { id: Number(id) }
    })
    res.status(200).json(pedido)
  } catch (error) {
    res.status(400).json({ erro: error })
  }
})

export default router