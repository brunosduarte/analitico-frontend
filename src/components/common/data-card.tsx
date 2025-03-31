'use client'

import { ReactNode } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

export interface DataCardProps {
  title: string
  description?: string
  children: ReactNode
  isLoading?: boolean
  footer?: ReactNode
  className?: string
  headerClassName?: string
  contentClassName?: string
  footerClassName?: string
  minHeight?: string | number
  action?: ReactNode
}

/**
 * Componente DataCard: Card padronizado para exibição de dados
 * Com suporte para estados de carregamento
 */
export function DataCard({
  title,
  description,
  children,
  isLoading = false,
  footer,
  className,
  headerClassName,
  contentClassName,
  footerClassName,
  minHeight,
  action,
}: DataCardProps) {
  return (
    <Card className={cn('overflow-hidden', className)} style={{ minHeight }}>
      <CardHeader className={cn('pb-2', headerClassName)}>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          {action && <div className="ml-4">{action}</div>}
        </div>
      </CardHeader>
      <CardContent className={cn(contentClassName)}>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ) : (
          children
        )}
      </CardContent>
      {footer && (
        <CardFooter className={cn('pt-0', footerClassName)}>
          {footer}
        </CardFooter>
      )}
    </Card>
  )
}

/**
 * Componente para Card de KPIs e métricas
 */
export interface MetricCardProps {
  title: string
  value: ReactNode
  label?: string
  icon?: ReactNode
  className?: string
  isLoading?: boolean
}

export function MetricCard({
  title,
  value,
  label,
  icon,
  className,
  isLoading = false,
}: MetricCardProps) {
  return (
    <div className={cn('bg-background border rounded-md p-4', className)}>
      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-4 w-1/3" />
        </div>
      ) : (
        <>
          <div className="flex items-start justify-between">
            <p className="text-sm text-muted-foreground">{title}</p>
            {icon && <span className="text-muted-foreground">{icon}</span>}
          </div>
          <p className="text-2xl font-semibold mt-1">{value}</p>
          {label && (
            <p className="text-xs text-muted-foreground mt-1">{label}</p>
          )}
        </>
      )}
    </div>
  )
}
