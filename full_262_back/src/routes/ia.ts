import { Router } from "express"
import { gerarDescricaoProduto } from "../../services/iaServices"
import { autenticarAdmin } from "../middleware/autenticarAdmin"

const router = Router()

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
    console.error("Erro detalhado na rota /descricao-produto:", error)
    return res.status(500).json({
      erro: error.message || "Falha ao gerar descrição com IA.",
    })
  }
})

export default router