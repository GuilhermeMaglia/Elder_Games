import type { RequestHandler } from 'express'
import jwt from 'jsonwebtoken'
import { obterJwtSecret } from '../lib/jwtSecret'

export const autenticarAdmin: RequestHandler = (req, res, next) => {
  const authorization = req.headers.authorization
  const token = authorization?.startsWith('Bearer ')
    ? authorization.slice('Bearer '.length)
    : undefined

  if (!token) {
    res.status(401).json({ erro: 'Autenticação de administrador necessária.' })
    return
  }

  const secret = obterJwtSecret()
  if (!secret) {
    res.status(503).json({ erro: 'Autenticação indisponível: configure JWT_KEY com pelo menos 32 caracteres no backend.' })
    return
  }

  try {
    const payload = jwt.verify(token, secret)
    if (typeof payload === 'string' || !payload.adminLogadoId) {
      res.status(401).json({ erro: 'Token de administrador inválido.' })
      return
    }
    next()
  } catch {
    res.status(401).json({ erro: 'Token de administrador inválido ou expirado.' })
  }
}
