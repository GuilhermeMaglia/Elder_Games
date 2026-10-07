import { Router } from "express"
import { gerarDescricaoProduto } from "../../services/iaServices"
import { autenticarAdmin } from "../middleware/autenticarAdmin"

const router = Router()

// Mapeia o endpoint POST /descricao-produto
router.post("/descricao-produto", autenticarAdmin, async (req, res) => {
  try {
    const { titulo, marca, categoria, ano, descricaoAtual } = req.body

    if (!titulo || !marca || !categoria || !ano) {
      return res.status(400).json({
        erro: "É necessário fornecer título, marca, categoria e ano.",
      })
    }

    const descricao = await gerarDescricaoProduto({
      titulo,
      marca,
      categoria,
      ano: Number(ano),
      descricaoAtual,
    })

    return res.json({ descricao })
  } catch (error: any) {
    console.error("Erro ao gerar descrição com IA:", error)

    // Formata a mensagem de erro para o frontend de forma amigável
    let mensagemErro = "Falha ao gerar descrição com IA."

    if (error?.message?.includes("503") || error?.message?.includes("UNAVAILABLE") || error?.message?.includes("high demand")) {
      mensagemErro = "Os servidores do Gemini estão temporariamente sobrecarregados. Por favor, aguarde alguns segundos e tente novamente."
    } else if (error?.message) {
      mensagemErro = error.message
    }

    return res.status(500).json({
      erro: mensagemErro,
    })
  }
})

export default router