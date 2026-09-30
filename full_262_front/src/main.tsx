import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'

import Layout from './Layout.tsx'
import App from './App.tsx'
import Login from './Login.tsx'
import Detalhes from './Detalhes.tsx'
import MeusPedidos from './MeusPedidos.tsx'
import CadCliente from './CadCliente.tsx'

// Rotas e Páginas do Admin
import AdminLayout from './admin/AdminLayout.tsx'
import AdminLogin from './admin/AdminLogin.tsx'
import AdminDashboard from './admin/AdminDashboard.tsx'
import AdminProdutos from './admin/AdminProdutos.tsx'
import AdminNovoProduto from './admin/AdminNovoProduto.tsx'
import AdminPedidos from './admin/AdminPedidos.tsx'

const rotas = createBrowserRouter([
  // Rota Pública de Autenticação do Admin
  {
    path: "/admin/login",
    element: <AdminLogin />,
  },
  
  // Painel Administrativo Protegido
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: "produtos", element: <AdminProdutos /> },
      { path: "produtos/novo", element: <AdminNovoProduto /> },
      { path: "pedidos", element: <AdminPedidos /> },
    ],
  },

  // Área Pública e do Cliente
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <App /> },
      { path: 'login', element: <Login /> },
      { path: 'detalhes/:id', element: <Detalhes /> },
      { path: 'meusPedidos', element: <MeusPedidos /> },
      { path: 'cadCliente', element: <CadCliente /> },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={rotas} />
  </StrictMode>,
)