import { Router } from "express"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { prisma } from "../../lib/prisma"

const router = Router()

router.post("/", async (req, res) => {
  const { email, senha } = req.body
  const mensaPadrao = "E-mail ou senha de administrador incorretos"

  if (!email || !senha) {
    res.status(400).json({ erro: mensaPadrao })
    return
  }

  try {
    const admin = await prisma.admin.findUnique({
      where: { email }
    })

    if (!admin) {
      res.status(400).json({ erro: mensaPadrao })
      return
    }

    const senhaValida = await bcrypt.compare(senha, admin.senha)

    if (!senhaValida) {
      res.status(400).json({ erro: mensaPadrao })
      return
    }

    const jwtSecret = process.env.JWT_KEY || "sua_chave_secreta_admin"

    const token = jwt.sign(
      {
        adminLogadoId: admin.id,
        adminLogadoNome: admin.nome,
        adminLogadoEmail: admin.email
      },
      jwtSecret,
      { expiresIn: "8h" }
    )

    res.status(200).json({
      id: admin.id,
      nome: admin.nome,
      email: admin.email,
      token
    })
  } catch (error) {
    res.status(500).json({ erro: "Erro interno no servidor ao realizar login do admin" })
  }
})

export default router