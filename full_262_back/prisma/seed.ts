import { PrismaClient } from '../generated/prisma'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Limpando banco e rodando a seed...')

  await prisma.pedido.deleteMany()
  await prisma.produto.deleteMany()
  await prisma.marca.deleteMany()
  await prisma.categoria.deleteMany()

  // Criar Marcas
  const nintendo = await prisma.marca.create({ data: { nome: 'Nintendo' } })
  const sony = await prisma.marca.create({ data: { nome: 'PlayStation / Sony' } })
  const squareEnix = await prisma.marca.create({ data: { nome: 'Square Enix' } })
  const pureArts = await prisma.marca.create({ data: { nome: 'PureArts' } })
  const darkHorse = await prisma.marca.create({ data: { nome: 'Dark Horse Books' } })
  const cdProjekt = await prisma.marca.create({ data: { nome: 'CD Projekt Red' } })

  // Criar Categorias
  const estatuas = await prisma.categoria.create({ data: { nome: 'Estátuas & Action Figures' } })
  const edicoesEspeciais = await prisma.categoria.create({ data: { nome: 'Edições Limitadas de Jogos' } })
  const retroConsoles = await prisma.categoria.create({ data: { nome: 'Consoles & Hardware Raridades' } })
  const livrosArtbooks = await prisma.categoria.create({ data: { nome: 'Artbooks & Guias de Luxo' } })

  // Criar Produtos
  await prisma.produto.createMany({
    data: [
      {
        titulo: "Estátua Geralt de Rívia (Grandmaster Ursine) 1/4 - PureArts",
        descricao: "Estátua em resina de altíssima fidelidade com iluminação LED na base. Edição numerada com apenas 1.000 unidades no mundo.",
        ano: 2023,
        preco: 4250.00,
        foto: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQl_j7wk_yIqtHStboco3A_5KZNkwT_OaCtPwThK3IaHgxY2pzv9zdoYhc&s=10",
        quant: 2,
        destaque: true,
        marcaId: pureArts.id,
        categoriaId: estatuas.id
      },
      {
        titulo: "The Legend of Zelda: Tears of the Kingdom - Collector's Edition",
        descricao: "Inclui o jogo em mídia física, Artbook de capa dura, SteelBook oficial, pôster de metal ICONART e conjunto de 4 pins banhados.",
        ano: 2023,
        preco: 1499.90,
        foto: "https://m.media-amazon.com/images/I/51tVyzqhy5L._AC_UF1000,1000_QL80_.jpg",
        quant: 4,
        destaque: true,
        marcaId: nintendo.id,
        categoriaId: edicoesEspeciais.id
      },
      {
        titulo: "Console Game Boy Color - Edição Limitada Pokémon Pikachu Yellow (Graduado VGA 85)",
        descricao: "Item raro de colecionador. Console Game Boy Color original em estado impecável na caixa com selo de autenticidade.",
        ano: 1998,
        preco: 8900.00,
        foto: "https://http2.mlstatic.com/D_NQ_NP_889400-MLB97684423467_112025-O.webp",
        quant: 1,
        destaque: true,
        marcaId: nintendo.id,
        categoriaId: retroConsoles.id
      },
      {
        titulo: "Livro The Art of Cyberpunk 2077 - Deluxe Hardcover Edition",
        descricao: "Livro de arte em capa dura acolchoada, acompanha capa protetora estilizada, réplica de mapa de Night City e adesivos temporários de tatuagem.",
        ano: 2020,
        preco: 389.90,
        foto: "https://i.ebayimg.com/images/g/nS4AAeSwvsRp~bgX/s-l300.jpg",
        quant: 8,
        destaque: false,
        marcaId: darkHorse.id,
        categoriaId: livrosArtbooks.id
      },
      {
        titulo: "Final Fantasy VII Remake - Play Arts Kai: Sephiroth (Edição Limitada)",
        descricao: "Action figure articulada de 30cm com a asa negra, espada Masamune e múltiplos pares de mãos trocáveis.",
        ano: 2022,
        preco: 1850.00,
        foto: "https://www.1999.co.jp/itbig69/10693910a.jpg",
        quant: 3,
        destaque: true,
        marcaId: squareEnix.id,
        categoriaId: estatuas.id
      },
      {
        titulo: "Console PlayStation 5 - Edição Comemorativa 30º Aniversário (Limitada)",
        descricao: "Console numerado na cor clássica do PS1 original de 1994. Acompanha controle DualSense com cabo retro estilo clássico.",
        ano: 2024,
        preco: 9999.00,
        foto: "https://cdn.awsli.com.br/800x800/1919/1919257/produto/306784008/6456456-glmmeui9ha.jpg",
        quant: 1,
        destaque: true,
        marcaId: sony.id,
        categoriaId: retroConsoles.id
      },
      {
        titulo: "Elden Ring - Shadow of the Erdtree Collector's Edition",
        descricao: "Inclui estátua de 46cm do Messmer o Empalador, livro de arte em capa dura com 40 páginas e código da expansão.",
        ano: 2024,
        preco: 2890.00,
        foto: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ412KMGjl9B1B9NMbgvQbvNFtI6kA4mDawU4wj6RCbTw&s=10",
        quant: 0,
        destaque: false,
        marcaId: cdProjekt.id,
        categoriaId: edicoesEspeciais.id
      }
    ]
  })

  console.log('✅ Seed executada e produtos criados com sucesso!')
}

main()
  .catch((e) => {
    console.error('❌ Erro durante a execução do seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })