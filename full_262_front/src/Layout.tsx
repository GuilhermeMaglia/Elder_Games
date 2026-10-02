import Titulo from './components/Titulo.tsx'
import { Outlet } from 'react-router-dom'

import { Toaster } from 'sonner'

export default function Layout() {
  return (
    <>
      <Titulo />
      <main className="flex-1 bg-[#1C1C1E] min-h-screen">
        <Outlet />
      </main>
      <Toaster richColors position="top-center" />
    </>
  )
}
