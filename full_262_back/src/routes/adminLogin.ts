import { Router } from "express"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { prisma } from "../lib/prisma"
import { obterJwtSecret } from "../lib/jwtSecret"

const router = Router()

// POST /admin/login - Autenticação do Administrador
router.post("/", async (req, res) => {
  const { email, senha } = req.body

  // 1. Validação de recebimento dos dados
  if (!email || !senha) {
    res.status(400).json({ erro: "Erro 1: E-mail e senha são obrigatórios" })
    return
  }

  try {
    const jwtSecret = obterJwtSecret()
    if (!jwtSecret) {
      res.status(503).json({ erro: "Autenticação indisponível: configure JWT_KEY com pelo menos 32 caracteres no backend." })
      return
    }

    // 2. Busca do administrador no banco
    const admin = await prisma.admin.findUnique({
      where: { email },
    })

    if (!admin) {
      res.status(400).json({ erro: "Erro 2: Administrador não encontrado com este e-mail" })
      return
    }

    // 3. Comparação de senha via Bcrypt
    const senhaValida = await bcrypt.compare(senha, admin.senha)

    if (!senhaValida) {
      res.status(400).json({ erro: "Erro 3: Senha incorreta (ou armazenada sem hash Bcrypt no banco)" })
      return
    }

    // Gerar Token JWT
    const token = jwt.sign(
      {
        adminLogadoId: admin.id,
        adminLogadoNome: admin.nome,
        adminLogadoEmail: admin.email,
      },
      jwtSecret,
      { expiresIn: "8h" }
    )

    res.status(200).json({
      id: admin.id,
      nome: admin.nome,
      email: admin.email,
      token,
    })
  } catch (error) {
    console.error("Erro no login:", error)
    res.status(500).json({ erro: "Erro interno no servidor ao realizar login do admin" })
  }
})

export default router