import { Navigate, Outlet } from "react-router-dom"

export function ProtectedRoute() {
  const token =
    localStorage.getItem("adminKey") || sessionStorage.getItem("adminKey")
  const estaAutenticado = Boolean(token && token.split(".").length === 3)

  if (!estaAutenticado) {
    // Redireciona para o login caso não esteja autenticado
    return <Navigate to="/admin/login" replace />
  }

  // Renderiza a rota filha (AdminLayout / páginas) se estiver autenticado
  return <Outlet />
}