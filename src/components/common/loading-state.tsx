'use client'

import { ReactNode } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LoadingStateProps {
  message?: string
  className?: string
  size?: 'sm' | 'default' | 'lg'
  variant?: 'default' | 'spinner' | 'skeleton'
  children?: ReactNode
}

/**
 * Componente LoadingState: Mostra indicador de carregamento
 */
export function LoadingState({
  message = 'Carregando...',
  className,
  size = 'default',
  variant = 'default',
  children,
}: LoadingStateProps) {
  const sizeClasses = {
    sm: 'h-6 w-6 text-sm py-6',
    default: 'h-8 w-8 text-base py-12',
    lg: 'h-10 w-10 text-lg py-24',
  }

  // Renderiza apenas o spinner
  if (variant === 'spinner') {
    return (
      <div
        className={cn(
          'flex items-center justify-center text-muted-foreground',
          className,
        )}
      >
        <Loader2
          className={cn('animate-spin', sizeClasses[size])}
          aria-hidden="true"
        />
        <span className="sr-only">{message}</span>
      </div>
    )
  }

  // Renderiza o estado de carregamento completo com mensagem
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center w-full',
        {
          'py-6': size === 'sm',
          'py-12': size === 'default',
          'py-24': size === 'lg',
        },
        className,
      )}
    >
      <div className="flex flex-col items-center space-y-4">
        <Loader2
          className={cn('animate-spin text-primary', sizeClasses[size])}
          aria-hidden="true"
        />
        <p className="text-muted-foreground font-medium">{message}</p>
        {children}
      </div>
    </div>
  )
}
