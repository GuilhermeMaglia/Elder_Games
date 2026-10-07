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

    // Busca os pedidos para calcular os produtos mais vendidos
    const todosPedidos = await prisma.pedido.findMany({
      select: { produtoId: true }
    })

    // Conta a frequência de cada produtoId nos pedidos
    const contagemVendas: Record<number, number> = {}
    for (const p of todosPedidos) {
      if (p.produtoId) {
        contagemVendas[p.produtoId] = (contagemVendas[p.produtoId] || 0) + 1
      }
    }

    // Ordena do produto mais vendido para o menos vendido e pega o Top 5
    const topProdutosIds = Object.entries(contagemVendas)
      .map(([produtoId, totalVendas]) => ({
        produtoId: Number(produtoId),
        totalVendas,
      }))
      .sort((a, b) => b.totalVendas - a.totalVendas)
      .slice(0, 5)

    // Busca as informações dos produtos correspondentes
    const produtosMaisVendidos = await Promise.all(
      topProdutosIds.map(async (item) => {
        const produto = await prisma.produto.findUnique({
          where: { id: item.produtoId },
          select: { id: true, titulo: true, foto: true, preco: true },
        })

        return {
          id: item.produtoId,
          titulo: produto?.titulo || "Produto Desconhecido",
          foto: produto?.foto || "",
          preco: produto?.preco || 0,
          totalVendas: item.totalVendas,
        }
      })
    )

    res.status(200).json({
      totais: {
        produtos: totalProdutos,
        pedidos: totalPedidos,
        clientes: totalClientes,
        marcas: totalMarcas
      },
      ultimosPedidos,
      produtosMaisVendidos
    })
  } catch (error) {
    console.error("Erro no dashboard:", error)
    res.status(500).json({ erro: "Erro ao carregar dados do dashboard." })
  }
})

export default router