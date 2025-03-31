'use client'

import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ThemeProvider } from './theme-provider'
import { Toaster } from '@/components/ui/toaster'
import { ToastProvider } from '@/components/ui/toast'

// Criar um cliente do React Query com memoização para evitar recriação durante re-renders
const QueryClientProviderWithMemo = React.memo(
  ({ children }: { children: React.ReactNode }) => {
    const [queryClient] = React.useState(
      () =>
        new QueryClient({
          defaultOptions: {
            queries: {
              refetchOnWindowFocus: false,
              retry: 1,
              staleTime: 5 * 60 * 1000, // 5 minutos
            },
          },
        }),
    )

    return (
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    )
  },
)
QueryClientProviderWithMemo.displayName = 'QueryClientProviderWithMemo'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProviderWithMemo>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <ToastProvider>
          {children}
          <Toaster />
        </ToastProvider>
      </ThemeProvider>
    </QueryClientProviderWithMemo>
  )
}
