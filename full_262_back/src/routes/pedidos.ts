import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { autenticarAdmin } from '../middleware/autenticarAdmin'
import { autenticarCliente } from '../middleware/autenticarCliente'

const router = Router()

const pedidoSchema = z.object({
  produtoId: z.number().int({ message: "ID do produto deve ser um número inteiro" }),
  descricao: z.string().trim().min(3, { message: "Descrição deve ter no mínimo 3 caracteres" }).max(255),
  resposta: z.string().trim().max(255).optional().nullable(),
})

const atualizacaoPedidoSchema = z.object({
  resposta: z.string().trim().max(255).nullable().optional(),
  status: z.enum(['PENDENTE', 'EM_ANDAMENTO', 'CONCLUIDO', 'CANCELADO']).optional(),
}).refine((dados) => dados.resposta !== undefined || dados.status !== undefined, {
  message: 'Informe a resposta ou o status para atualizar.',
})

// Listar todos os pedidos
router.get('/', autenticarAdmin, async (req, res) => {
  try {
    const pedidos = await prisma.pedido.findMany({
      include: {
        cliente: { select: { nome: true } },
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
router.get('/cliente/:clienteId', autenticarCliente, async (req, res) => {
  const clienteId = Array.isArray(req.params.clienteId)
    ? req.params.clienteId[0]
    : req.params.clienteId

  if (!clienteId) {
    res.status(400).json({ erro: 'ID de cliente inválido.' })
    return
  }

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
router.post('/', autenticarCliente, async (req, res) => {
  const valida = pedidoSchema.safeParse(req.body)
  if (!valida.success) {
    res.status(400).json({ erro: valida.error })
    return
  }

  const { produtoId, descricao, resposta } = valida.data
  const clienteId = String(res.locals.clienteId)

  try {
    const pedido = await prisma.pedido.create({
      data: {
        clienteId,
        produtoId,
        descricao,
        resposta: resposta || null
      },
      include: {
        cliente: { select: { nome: true } },
        produto: true
      }
    })
    res.status(201).json(pedido)
  } catch (error) {
    res.status(400).json({ erro: error })
  }
})

// Atualizar a resposta ou status de um pedido
router.patch('/:id', autenticarAdmin, async (req, res) => {
  const idPedido = Number(req.params.id)
  const valida = atualizacaoPedidoSchema.safeParse(req.body)

  if (!Number.isInteger(idPedido) || idPedido < 1) {
    res.status(400).json({ erro: 'ID de pedido inválido.' })
    return
  }
  if (!valida.success) {
    res.status(400).json({ erro: valida.error.issues[0]?.message || 'Dados de atualização inválidos.' })
    return
  }

  try {
    const pedido = await prisma.pedido.update({
      where: { id: idPedido },
      data: valida.data,
      include: {
        cliente: { select: { nome: true } },
        produto: true,
      },
    })
    res.status(200).json(pedido)
  } catch (error) {
    console.error('Erro ao atualizar pedido:', error)
    res.status(404).json({ erro: 'Pedido não encontrado ou não foi possível atualizar.' })
  }
})

// Deletar um pedido
router.delete('/:id', autenticarAdmin, async (req, res) => {
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