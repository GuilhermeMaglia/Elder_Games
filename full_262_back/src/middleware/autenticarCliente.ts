import type { RequestHandler } from 'express'
import jwt from 'jsonwebtoken'
import { obterJwtSecret } from '../lib/jwtSecret'

export const autenticarCliente: RequestHandler = (req, res, next) => {
  const authorization = req.headers.authorization
  const token = authorization?.startsWith('Bearer ')
    ? authorization.slice('Bearer '.length)
    : undefined

  if (!token) {
    res.status(401).json({ erro: 'Autenticação de cliente necessária.' })
    return
  }

  const secret = obterJwtSecret()
  if (!secret) {
    res.status(503).json({ erro: 'Autenticação indisponível: configure JWT_KEY com pelo menos 32 caracteres no backend.' })
    return
  }

  try {
    const payload = jwt.verify(token, secret)
    if (typeof payload === 'string' || typeof payload.clienteLogadoId !== 'string') {
      res.status(401).json({ erro: 'Token de cliente inválido.' })
      return
    }

    const idRequisitado = req.params.clienteId || req.params.id
    if (idRequisitado && idRequisitado !== payload.clienteLogadoId) {
      res.status(403).json({ erro: 'Acesso não autorizado a este cliente.' })
      return
    }

    res.locals.clienteId = payload.clienteLogadoId
    next()
  } catch {
    res.status(401).json({ erro: 'Token de cliente inválido ou expirado.' })
  }
}
