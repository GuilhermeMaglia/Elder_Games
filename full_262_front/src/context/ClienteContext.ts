import type { ClienteType } from '../utils/ClienteType'
import { create } from 'zustand'

type ClienteStore = {
  cliente: ClienteType
  logaCliente: (clienteLogado: ClienteType) => void
  deslogaCliente: () => void
}

export const useClienteStore = create<ClienteStore>((set) => ({
  cliente: {} as ClienteType,
  logaCliente: (clienteLogado) => set({ cliente: clienteLogado }),
  deslogaCliente: () => {
    // Limpa a chave em ambos os storages
    localStorage.removeItem('clienteKey')
    sessionStorage.removeItem('clienteKey')
    
    // Reseta o estado global
    set({ cliente: {} as ClienteType })
  },
}))