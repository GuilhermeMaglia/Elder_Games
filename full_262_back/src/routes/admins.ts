import { Router } from "express"
import bcrypt from "bcrypt"
import { z } from "zod"
import { prisma } from "../lib/prisma"
import { autenticarAdmin } from "../middleware/autenticarAdmin"

const router = Router()

// Schema de validação dos dados de entrada
const adminSchema = z.object({
  nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("E-mail inválido"),
  senha: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
})

// POST /admins - Cadastrar novo administrador
router.post("/", async (req, res, next) => {
  try {
    const quantidadeAdmins = await prisma.admin.count()
    if (quantidadeAdmins > 0) {
      autenticarAdmin(req, res, next)
      return
    }
    next()
  } catch (error) {
    console.error("Erro ao verificar o cadastro inicial de administrador:", error)
    res.status(500).json({ erro: "Não foi possível verificar o acesso administrativo." })
  }
}, async (req, res) => {
  try {
    const valida = adminSchema.safeParse(req.body)

    if (!valida.success) {
      res.status(400).json({ erros: valida.error.issues.map((i) => i.message) })
      return
    }

    const { nome, email, senha } = valida.data

    // Verifica se o e-mail já existe
    const adminExistente = await prisma.admin.findUnique({
      where: { email },
    })

    if (adminExistente) {
      res.status(400).json({ erro: "E-mail já cadastrado no sistema." })
      return
    }

    // Gera o hash da senha
    const senhaHash = await bcrypt.hash(senha, 10)

    // Cria o novo admin no banco
    const admin = await prisma.admin.create({
      data: {
        nome,
        email,
        senha: senhaHash,
      },
      select: {
        id: true,
        nome: true,
        email: true,
        createdAt: true,
      },
    })

    res.status(201).json(admin)
  } catch (error) {
    res.status(500).json({ erro: "Erro interno no servidor ao cadastrar administrador" })
  }
})

// GET /admins - Listar administradores (ocultando senha)
router.get("/", autenticarAdmin, async (req, res) => {
  try {
    const admins = await prisma.admin.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        createdAt: true,
      },
    })

    res.status(200).json(admins)
  } catch (error) {
    res.status(500).json({ erro: "Erro interno no servidor ao listar administradores" })
  }
})

export default router