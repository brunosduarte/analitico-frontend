'use client'

import { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { FileIcon, SearchX, AlertCircle, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  title: string
  description?: string
  icon?: ReactNode
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
  size?: 'default' | 'sm' | 'lg'
}

/**
 * Componente EmptyState: Mostra mensagem quando não há dados
 */
export function EmptyState({
  title,
  description,
  icon,
  action,
  className,
  size = 'default',
}: EmptyStateProps) {
  const sizeClasses = {
    sm: 'py-6',
    default: 'py-12',
    lg: 'py-24',
  }

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center w-full',
        sizeClasses[size],
        className,
      )}
    >
      <div className="flex flex-col items-center space-y-4">
        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
          {icon || <SearchX className="h-6 w-6" />}
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-medium">{title}</h3>
          {description && (
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              {description}
            </p>
          )}
        </div>
        {action && (
          <Button onClick={action.onClick} className="mt-4">
            {action.label}
          </Button>
        )}
      </div>
    </div>
  )
}

/**
 * Tipos de estados vazios pré-definidos
 */
export const EmptyTypes = {
  NO_DATA: {
    title: 'Nenhum dado encontrado',
    description: 'Não foi possível encontrar dados para exibir.',
    icon: <SearchX className="h-6 w-6" />,
  },
  NO_RESULTS: {
    title: 'Nenhum resultado encontrado',
    description: 'Tente ajustar seus filtros ou termos de busca.',
    icon: <SearchX className="h-6 w-6" />,
  },
  NO_ITEMS: {
    title: 'Nenhum item encontrado',
    description: 'Não existem itens para exibir no momento.',
    icon: <FileIcon className="h-6 w-6" />,
  },
  EMPTY_EXTRATOS: {
    title: 'Nenhum extrato encontrado',
    description: 'Tente ajustar os filtros ou fazer upload de novos extratos.',
    icon: <FileIcon className="h-6 w-6" />,
  },
}

interface ErrorStateProps {
  title?: string
  description?: string
  error?: Error | string
  onRetry?: () => void
  className?: string
}

/**
 * Componente ErrorState: Mostra mensagem de erro
 */
export function ErrorState({
  title = 'Erro ao carregar dados',
  description = 'Ocorreu um erro ao tentar carregar os dados.',
  error,
  onRetry,
  className,
}: ErrorStateProps) {
  // Obter mensagem de erro se disponível
  const errorMessage = error
    ? typeof error === 'string'
      ? error
      : error.message
    : null

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center w-full py-12',
        className,
      )}
    >
      <div className="flex flex-col items-center space-y-4">
        <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
          <AlertCircle className="h-6 w-6" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-medium">{title}</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            {description}
          </p>
          {errorMessage && (
            <p className="text-xs text-destructive max-w-md mx-auto mt-2 bg-destructive/10 p-2 rounded">
              {errorMessage}
            </p>
          )}
        </div>
        {onRetry && (
          <Button variant="outline" onClick={onRetry} className="mt-4">
            <RefreshCw className="mr-2 h-4 w-4" />
            Tentar novamente
          </Button>
        )}
      </div>
    </div>
  )
}
