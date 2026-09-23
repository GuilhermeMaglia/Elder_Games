import { Router } from 'express'
import { z } from 'zod'
import bcrypt from 'bcrypt'
import { prisma } from "../../lib/prisma"

const router = Router()

const clienteSchema = z.object({
  nome: z.string().min(6, { message: "O nome deve ter no mínimo 6 caracteres" }),
  email: z.string().email({ message: "E-mail inválido" }),
  senha: z.string().min(8, { message: "A senha deve ter no mínimo 8 caracteres" }),
  cidade: z.string().min(3, { message: "A cidade deve ter no mínimo 3 caracteres" }),
})

// Listar todos os clientes
router.get("/", async (req, res) => {
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
    res.status(400).json({ erro: valida.error })
    return
  }

  const { nome, email, senha, cidade } = valida.data

  try {
    // Verifica se o e-mail já está cadastrado
    const clienteExistente = await prisma.cliente.findUnique({
      where: { email }
    })

    if (clienteExistente) {
      res.status(400).json({ erro: "E-mail já cadastrado" })
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
    res.status(400).json({ erro: error })
  }
})

// Obter detalhes de um cliente por ID
router.get("/:id", async (req, res) => {
  const { id } = req.params

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
      res.status(404).json({ erro: "Cliente não encontrado" })
      return
    }

    res.status(200).json(cliente)
  } catch (error) {
    res.status(500).json({ erro: error })
  }
})

// Deletar cliente
router.delete("/:id", async (req, res) => {
  const { id } = req.params

  try {
    const cliente = await prisma.cliente.delete({
      where: { id }
    })
    res.status(200).json({ mensagem: "Cliente removido com sucesso", id: cliente.id })
  } catch (error) {
    res.status(400).json({ erro: error })
  }
})

export default router