import PrismaPkg from '@prisma/client'
import bcrypt from 'bcrypt'

// Compatibilidade para carregar o PrismaClient em projetos ES Modules
const PrismaClient = (PrismaPkg as any).PrismaClient || (PrismaPkg as any).default?.PrismaClient
const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Limpando dados antigos...')

  await prisma.pedido.deleteMany()
  await prisma.produto.deleteMany()
  await prisma.categoria.deleteMany()
  await prisma.marca.deleteMany()
  await prisma.admin.deleteMany()

  console.log('🚀 Inserindo Administrador...')
  const senhaAdminHash = await bcrypt.hash('admin123', 10)
  
  await prisma.admin.create({
    data: {
      nome: 'Administrador Collector Store',
      email: 'admin@games.com',
      senha: senhaAdminHash,
    },
  })

  console.log('🚀 Inserindo Fabricantes/Marcas de Colecionáveis...')
  const prime1 = await prisma.marca.create({ data: { nome: 'Prime 1 Studio' } })
  const hotToys = await prisma.marca.create({ data: { nome: 'Hot Toys' } })
  const pureArts = await prisma.marca.create({ data: { nome: 'PureArts' } })
  const first4 = await prisma.marca.create({ data: { nome: 'First 4 Figures' } })
  const goodSmile = await prisma.marca.create({ data: { nome: 'Good Smile Company' } })

  console.log('🚀 Inserindo Categorias de Colecionáveis...')
  const estatuas = await prisma.categoria.create({ data: { nome: 'Estátuas High-End (1/4)' } })
  const actionFigures = await prisma.categoria.create({ data: { nome: 'Action Figures (1/6)' } })
  const replicas = await prisma.categoria.create({ data: { nome: 'Réplicas & Adereços' } })
  const edicoesLimitadas = await prisma.categoria.create({ data: { nome: 'Edições de Colecionador' } })

  console.log('🚀 Inserindo Produtos Colecionáveis...')
  await prisma.produto.createMany({
    data: [
      {
        titulo: 'Estátua Geralt de Rívia - The Witcher 3 (Prime 1)',
        descricao: 'Estátua em resina de alta precisão em escala 1/4 (26 polegadas) retratando Geralt em combate com iluminação LED integrada na base.',
        preco: 5499.90,
        foto: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=800&auto=format&fit=crop',
        destaque: true,
        marcaId: prime1.id,
        categoriaId: estatuas.id,
      },
      {
        titulo: 'Action Figure Ellie - The Last of Us Part II (PureArts)',
        descricao: 'Figura articulada em escala 1/6 com roupas em tecido real, mochila detalhada, arco, flechas e armas trocáveis.',
        preco: 1899.00,
        foto: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop',
        destaque: true,
        marcaId: pureArts.id,
        categoriaId: actionFigures.id,
      },
      {
        titulo: 'Réplica Mjölnir - God of War Ragnarök',
        descricao: 'Réplica em tamanho real (1:1) de alta densidade e acabamento metálico envelhecido, acompanhada de base expositora com runas iluminadas.',
        preco: 2299.50,
        foto: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=800&auto=format&fit=crop',
        destaque: true,
        marcaId: first4.id,
        categoriaId: replicas.id,
      },
      {
        titulo: 'Nendoroid Link: Breath of the Wild Ver.',
        descricao: 'Figura colecionável articulada no estilo chibi com acessórios como a Master Sword, Hylian Shield, arco e Sheikah Slate.',
        preco: 489.90,
        foto: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop',
        destaque: false,
        marcaId: goodSmile.id,
        categoriaId: actionFigures.id,
      },
      {
        titulo: 'Lâmina Oculta de Basim - Assassin’s Creed Mirage',
        descricao: 'Réplica vestível e totalmente funcional da lendária Hidden Blade com mecanismo de mola e detalhes gravados à mão.',
        preco: 899.90,
        foto: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
        destaque: true,
        marcaId: pureArts.id,
        categoriaId: replicas.id,
      },
      {
        titulo: 'Edição de Colecionador Elden Ring - Malenia Statue',
        descricao: 'Caixa de colecionador oficial contendo o jogo, Steelbook exclusivo, livro de arte de capa dura e a estátua de 23cm de Malenia - Blade of Miquella.',
        preco: 3290.00,
        foto: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=800&auto=format&fit=crop',
        destaque: true,
        marcaId: hotToys.id,
        categoriaId: edicoesLimitadas.id,
      },
    ],
  })

  console.log('✅ Seed de itens colecionáveis executada com sucesso!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e: any) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })