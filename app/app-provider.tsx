'use client'

import { createContext, useContext } from 'react'

type AppProviderProps = {
  children: React.ReactNode
}

interface AppContextProps {}

const AppContext = createContext<AppContextProps>({})

export default function AppProvider({ children }: AppProviderProps) {
  return (
    <AppContext.Provider value={{}}>
      {children}
    </AppContext.Provider>
  )
}

export const useAppProvider = () => {
  return useContext(AppContext)
}