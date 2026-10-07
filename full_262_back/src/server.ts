import 'dotenv/config'
import express from 'express'
import cors from 'cors'

import routesMarcas from './routes/marcas'
import routesCategorias from './routes/categorias'
import routesProdutos from './routes/produtos'
import routesClientes from './routes/clientes'
import routesLogin from './routes/login'
import routesPedidos from './routes/pedidos'
import routesAdminLogin from './routes/adminLogin'
import routesDashboard from './routes/dashboard'
import routesAdmins from './routes/admins' 
import routesIa from './routes/ia'

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(cors())

// Rotas do Cliente e Loja
app.use("/marcas", routesMarcas)
app.use("/categorias", routesCategorias)
app.use("/produtos", routesProdutos)
app.use("/clientes", routesClientes)
app.use("/clientes/login", routesLogin)
app.use("/pedidos", routesPedidos)
app.use("/ia", routesIa)

// Rotas Administrativas
app.use("/admins", routesAdmins) // <-- Adicionado
app.use("/admin/login", routesAdminLogin)
app.use("/dashboard", routesDashboard)

app.get('/', (req, res) => {
  res.send('API: Loja de Games')
})

app.listen(port, () => {
  console.log(`Servidor rodando na porta: ${port}`)
})