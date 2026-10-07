import { GoogleGenAI } from '@google/genai'

interface DadosProduto {
  titulo: string
  marca: string
  categoria: string
  ano: number
  descricaoAtual?: string
}

export async function gerarDescricaoProduto(dados: DadosProduto): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY não configurada no arquivo .env')
  }

  const ai = new GoogleGenAI({ apiKey })

  const prompt = `Escreva uma descrição comercial curta, em português brasileiro, para um produto de uma loja de colecionáveis de games.

Use exclusivamente os fatos fornecidos abaixo. Não invente materiais, estado de conservação, autenticidade, raridade, conteúdo da embalagem, dimensões ou outros detalhes. Se os dados forem limitados, faça uma apresentação breve e genérica sem acrescentar afirmações.
Retorne somente um parágrafo de 2 ou 3 frases, sem título, lista ou markdown.

Título: ${dados.titulo}
Marca/estúdio: ${dados.marca}
Categoria: ${dados.categoria}
Ano: ${dados.ano}
${dados.descricaoAtual ? `Descrição ou informações fornecidas pelo administrador: ${dados.descricaoAtual}` : ''}`

  // Modelos suportados pela API Gemini com cota ativa e fallback
  const modelos = [
    'gemini-flash-lite-latest',
    'gemini-3.8-flash-lite',
    'gemini-pro-latest'
  ]
  let ultimoErro: any = null

  for (const model of modelos) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
      })

      const texto = response.text || (response as any).candidates?.[0]?.content?.parts?.[0]?.text

      if (texto && texto.trim().length > 0) {
        return texto.trim()
      }
    } catch (error: any) {
      console.warn(`Erro ao tentar o modelo ${model}:`, error?.message || error)
      ultimoErro = error
    }
  }

  throw new Error(
    ultimoErro?.message || 'O serviço de IA está temporariamente indisponível. Tente novamente em alguns instantes.'
  )
}