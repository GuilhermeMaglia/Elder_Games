import { Router } from "express"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { prisma } from "../lib/prisma"
import { obterJwtSecret } from "../lib/jwtSecret"

const router = Router()

router.post("/", async (req, res) => {
  const { email, senha } = req.body

  // Mensagem genérica para evitar enumeração de usuários
  const mensaPadrao = "Login ou senha incorretos"

  if (!email || !senha) {
    res.status(400).json({ erro: mensaPadrao })
    return
  }

  try {
    const jwtSecret = obterJwtSecret()
    if (!jwtSecret) {
      res.status(503).json({ erro: "Autenticação indisponível: configure JWT_KEY com pelo menos 32 caracteres no backend." })
      return
    }

    const cliente = await prisma.cliente.findUnique({
      where: { email }
    })

    if (!cliente) {
      res.status(400).json({ erro: mensaPadrao })
      return
    }

    // Comparação segura de hashes com bcrypt
    const senhaValida = await bcrypt.compare(senha, cliente.senha)

    if (!senhaValida) {
      res.status(400).json({ erro: mensaPadrao })
      return
    }

    // Geração do token JWT
    const token = jwt.sign(
      {
        clienteLogadoId: cliente.id,
        clienteLogadoNome: cliente.nome,
        clienteLogadoEmail: cliente.email,
      },
      jwtSecret,
      { expiresIn: "1h" }
    )

    res.status(200).json({
      id: cliente.id,
      nome: cliente.nome,
      email: cliente.email,
      cidade: cliente.cidade,
      token
    })
  } catch (error) {
    res.status(500).json({ erro: "Erro interno no servidor ao realizar login" })
  }
})

export default router