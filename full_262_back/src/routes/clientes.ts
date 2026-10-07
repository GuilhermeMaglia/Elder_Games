import { Router } from 'express'
import { z } from 'zod'
import bcrypt from 'bcrypt'
import { prisma } from "../lib/prisma"
import { autenticarAdmin } from "../middleware/autenticarAdmin"
import { autenticarCliente } from "../middleware/autenticarCliente"

const router = Router()

const clienteSchema = z.object({
  nome: z.string().min(6, { message: "O nome deve ter no mínimo 6 caracteres" }),
  email: z.string().email({ message: "E-mail inválido" }),
  senha: z.string().min(8, { message: "A senha deve ter no mínimo 8 caracteres" }),
  cidade: z.string().min(3, { message: "A cidade deve ter no mínimo 3 caracteres" }),
})

// Listar todos os clientes
router.get("/", autenticarAdmin, async (req, res) => {
  try {
    const clientes = await prisma.cliente.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        cidade: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { nome: 'asc' }
    })
    res.status(200).json(clientes)
  } catch (error) {
    res.status(500).json({ erro: error })
  }
})

// Cadastrar novo cliente
router.post("/", async (req, res) => {
  const valida = clienteSchema.safeParse(req.body)
  if (!valida.success) {
    res.status(400).json({ erro: valida.error.issues[0]?.message || "Dados de cadastro inválidos." })
    return
  }

  const { nome, email, senha, cidade } = valida.data

  try {
    // Verifica se o e-mail já está cadastrado
    const clienteExistente = await prisma.cliente.findUnique({
      where: { email }
    })

    if (clienteExistente) {
      res.status(400).json({ erro: "E-mail já cadastrado." })
      return
    }

    // Hash da senha
    const salt = await bcrypt.genSalt(10)
    const senhaHash = await bcrypt.hash(senha, salt)

    const cliente = await prisma.cliente.create({
      data: {
        nome,
        email,
        senha: senhaHash,
        cidade
      },
      select: {
        id: true,
        nome: true,
        email: true,
        cidade: true,
        createdAt: true
      }
    })

    res.status(201).json(cliente)
  } catch (error) {
    console.error("Erro ao cadastrar cliente:", error)
    res.status(400).json({ erro: "Erro ao cadastrar cliente no banco de dados." })
  }
})

// Obter detalhes de um cliente por ID
router.get("/:id", autenticarCliente, async (req, res) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
  if (!id) {
    res.status(400).json({ erro: "ID de cliente inválido." })
    return
  }

  try {
    const cliente = await prisma.cliente.findUnique({
      where: { id },
      select: {
        id: true,
        nome: true,
        email: true,
        cidade: true,
        createdAt: true
      }
    })

    if (!cliente) {
      res.status(404).json({ erro: "Cliente não encontrado." })
      return
    }

    res.status(200).json(cliente)
  } catch (error) {
    console.error("Erro ao buscar cliente:", error)
    res.status(500).json({ erro: "Erro ao consultar dados do cliente." })
  }
})

// Deletar cliente
router.delete("/:id", autenticarAdmin, async (req, res) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
  if (!id) {
    res.status(400).json({ erro: "ID de cliente inválido." })
    return
  }

  try {
    const pedidosCliente = await prisma.pedido.count({
      where: { clienteId: id }
    })

    if (pedidosCliente > 0) {
      res.status(400).json({
        erro: `Não é possível remover o cliente pois existem ${pedidosCliente} pedido(s) associado(s) a ele.`
      })
      return
    }

    const cliente = await prisma.cliente.delete({
      where: { id }
    })
    res.status(200).json({ mensagem: "Cliente removido com sucesso", id: cliente.id })
  } catch (error) {
    console.error("Erro ao deletar cliente:", error)
    res.status(400).json({ erro: "Não foi possível remover o cliente." })
  }
})

export default router