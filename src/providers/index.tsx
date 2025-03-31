'use client'

import React from 'react'
import { QueryProvider } from './query-provider'
import { ThemeProvider } from './theme-provider'
import { ToastProvider } from './toast-provider'

interface ProvidersProps {
  children: React.ReactNode
}

/**
 * Providers: Componente que combina todos os providers da aplicação
 */
export function Providers({ children }: ProvidersProps) {
  return (
    <QueryProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <ToastProvider>{children}</ToastProvider>
      </ThemeProvider>
    </QueryProvider>
  )
}
