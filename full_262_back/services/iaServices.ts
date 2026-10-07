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

  // Nomes oficiais e suportados pela API @google/genai
  const modelos = ['gemini-2.5-flash', 'gemini-2.5-flash-lite', 'gemini-flash-latest']
  let ultimoErro: any = null

  for (const model of modelos) {
    for (let tentativa = 1; tentativa <= 2; tentativa++) {
      try {
        const resposta = await ai.models.generateContent({
          model,
          contents: prompt,
        })

        const descricao = resposta.text?.trim()
        if (descricao) {
          return descricao
        }
      } catch (error: any) {
        ultimoErro = error
        const ehErroIndisponivel =
          error?.status === 'UNAVAILABLE' ||
          error?.message?.includes('503') ||
          error?.message?.includes('high demand')

        // Se for erro de servidor sobrecarregado (503), aguarda 1 segundo e tenta novamente
        if (ehErroIndisponivel && tentativa < 2) {
          await new Promise((resolve) => setTimeout(resolve, 1000))
          continue
        }
        // Se for 404 (modelo não existe nessa API) pula para o próximo modelo da lista
        break
      }
    }
  }

  throw new Error(
    ultimoErro?.message || 'O serviço de IA está temporariamente indisponível. Tente novamente em alguns instantes.'
  )
}