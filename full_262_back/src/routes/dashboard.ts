import { Router } from 'express'
import { prisma } from "../lib/prisma"
import { autenticarAdmin } from "../middleware/autenticarAdmin"

const router = Router()

router.get("/geral", autenticarAdmin, async (req, res) => {
  try {
    const totalProdutos = await prisma.produto.count()
    const totalPedidos = await prisma.pedido.count()
    const totalClientes = await prisma.cliente.count()
    const totalMarcas = await prisma.marca.count()

    const ultimosPedidos = await prisma.pedido.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        cliente: { select: { nome: true } },
        produto: { select: { titulo: true, preco: true } }
      }
    })

    res.status(200).json({
      totais: {
        produtos: totalProdutos,
        pedidos: totalPedidos,
        clientes: totalClientes,
        marcas: totalMarcas
      },
      ultimosPedidos
    })
  } catch (error) {
    res.status(500).json({ erro: error })
  }
})

export default router