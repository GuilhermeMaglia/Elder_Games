import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AdminType } from '../../utils/AdminType'

type AdminStore = {
  admin: AdminType
  logaAdmin: (adminLogado: AdminType) => void
  deslogaAdmin: () => void
}

export const useAdminStore = create<AdminStore>()(
  persist(
    (set) => ({
      admin: {} as AdminType,

      logaAdmin: (adminLogado: AdminType) => set({ admin: adminLogado }),

      deslogaAdmin: () => {
        // Apaga a sessão do admin do localStorage e sessionStorage
        localStorage.removeItem('adminKey')
        sessionStorage.removeItem('adminKey')

        // Reseta o estado global para objeto vazio
        set({ admin: {} as AdminType })
      },
    }),
    {
      name: 'admin-storage',
    }
  )
)