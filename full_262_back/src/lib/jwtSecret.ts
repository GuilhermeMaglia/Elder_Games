export function obterJwtSecret(): string | undefined {
  const secret = process.env.JWT_KEY
  return secret && secret.length >= 32 ? secret : undefined
}
