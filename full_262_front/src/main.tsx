import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'

// Páginas do Cliente
import Layout from './Layout.tsx'
import App from './App.tsx'
import Login from './Login.tsx'
import Detalhes from './Detalhes.tsx'
import MeusPedidos from './MeusPedidos.tsx'
import CadCliente from './CadCliente.tsx'

// Páginas do Admin
import AdminLayout from './admin/AdminLayout.tsx'
import AdminLogin from './admin/AdminLogin.tsx'
import AdminDashboard from './admin/AdminDashboard.tsx'
import AdminProdutos from './admin/AdminProdutos.tsx'
import AdminNovoProduto from './admin/AdminNovoProduto.tsx'
import AdminPedidos from './admin/AdminPedidos.tsx'

// Guardião de Rota Protegida
import { ProtectedRoute } from './admin/components/ProtectedRouteAdmin.tsx'

const rotas = createBrowserRouter([
  // Rotas Públicas (Cliente)
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

  // Rota Pública de Login do Admin
  {
    path: '/admin/login',
    element: <AdminLogin />,
  },

  // Rotas Protegidas do Painel Administrativo
  {
    path: '/admin',
    element: <ProtectedRoute />, // Barreira de segurança
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <AdminDashboard /> },
          { path: 'produtos', element: <AdminProdutos /> },
          { path: 'produtos/novo', element: <AdminNovoProduto /> },
          { path: 'produtos/editar/:id', element: <AdminNovoProduto /> },
          { path: 'novo-produto', element: <AdminNovoProduto /> },
          { path: 'pedidos', element: <AdminPedidos /> },
        ],
      },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={rotas} />
  </StrictMode>,
)