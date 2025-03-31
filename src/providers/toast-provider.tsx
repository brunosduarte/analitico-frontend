'use client'

import {
  ToastProvider as ToastProviderPrimitive,
  ToastViewport,
} from '@/components/ui/toast'
import { Toaster } from '@/components/ui/toaster'

interface ToastProviderProps {
  children: React.ReactNode
}

/**
 * ToastProvider: Provider para sistema de notificações
 */
export function ToastProvider({ children }: ToastProviderProps) {
  return (
    <ToastProviderPrimitive>
      {children}
      <Toaster />
      <ToastViewport />
    </ToastProviderPrimitive>
  )
}
