import { create } from 'zustand'
import type { AdminType } from '../../utils/AdminType.ts'

type AdminStore = {
  admin: AdminType
  logaAdmin: (adminLogado: AdminType) => void
  deslogaAdmin: () => void
}

export const useAdminStore = create<AdminStore>((set) => ({
  admin: localStorage.getItem("adminKey") 
    ? JSON.parse(localStorage.getItem("adminKey") as string) 
    : {} as AdminType,

  logaAdmin: (adminLogado) => {
    localStorage.setItem("adminKey", JSON.stringify(adminLogado))
    set({ admin: adminLogado })
  },

  deslogaAdmin: () => {
    localStorage.removeItem("adminKey")
    set({ admin: {} as AdminType })
  }
}))