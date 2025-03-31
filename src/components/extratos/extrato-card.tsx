'use client'

import Link from 'next/link'
import { ExtratoResumo } from '@/types'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FileText, ChevronRight } from 'lucide-react'
import { formatCurrency, getCategoryColor, getMonthName, cn } from '@/lib/utils'
import { ROUTES } from '@/lib/constants'

interface ExtratoCardProps {
  extrato: ExtratoResumo
  className?: string
}

/**
 * Componente ExtratoCard: Card para exibir resumo de um extrato
 */
export function ExtratoCard({ extrato, className }: ExtratoCardProps) {
  const {
    id,
    matricula,
    nome,
    mes,
    ano,
    categoria,
    totalTrabalhos,
    valorTotal,
  } = extrato

  const categoryColor = getCategoryColor(categoria)
  const monthName = getMonthName(mes)

  return (
    <Card className={cn('extrato-card overflow-hidden', className)}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-bold">{nome}</CardTitle>
          <Badge
            className={cn(
              `bg-${categoryColor}-100 text-${categoryColor}-800 dark:bg-${categoryColor}-900 dark:text-${categoryColor}-300`,
              `categoria-${categoria.toLowerCase()}`,
            )}
          >
            {categoria}
          </Badge>
        </div>
        <CardDescription>Matrícula: {matricula}</CardDescription>
      </CardHeader>
      <CardContent className="text-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-medium">Período:</span>
          <span>
            {monthName}/{ano}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-medium">Total de Trabalhos:</span>
          <span>{totalTrabalhos}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-medium">Valor Total:</span>
          <span className="font-semibold">{formatCurrency(valorTotal)}</span>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button variant="outline" className="w-full" asChild>
          <Link
            href={ROUTES.EXTRATO_DETAIL(id)}
            className="flex items-center justify-between"
          >
            <span className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Ver Detalhes
            </span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

/**
 * Componente ExtratoCardSkeleton: Card de carregamento para extratos
 */
export function ExtratoCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <div className="h-6 w-3/4 bg-muted rounded-md animate-pulse" />
          <div className="h-6 w-1/4 bg-muted rounded-full animate-pulse" />
        </div>
        <div className="h-4 w-1/2 bg-muted rounded-md animate-pulse mt-2" />
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between">
          <div className="h-4 w-1/3 bg-muted rounded-md animate-pulse" />
          <div className="h-4 w-1/3 bg-muted rounded-md animate-pulse" />
        </div>
        <div className="flex justify-between">
          <div className="h-4 w-1/2 bg-muted rounded-md animate-pulse" />
          <div className="h-4 w-1/6 bg-muted rounded-md animate-pulse" />
        </div>
        <div className="flex justify-between">
          <div className="h-4 w-1/3 bg-muted rounded-md animate-pulse" />
          <div className="h-4 w-1/4 bg-muted rounded-md animate-pulse" />
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <div className="h-9 w-full bg-muted rounded-md animate-pulse" />
      </CardFooter>
    </Card>
  )
}

interface ExtratoCardGridProps {
  extratos: ExtratoResumo[]
  isLoading?: boolean
  emptyComponent?: React.ReactNode
}

/**
 * Componente ExtratoCardGrid: Grid de cards de extratos
 */
export function ExtratoCardGrid({
  extratos,
  isLoading = false,
  emptyComponent,
}: ExtratoCardGridProps) {
  if (isLoading) {
    // Exibir skeleton cards quando estiver carregando
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <ExtratoCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (extratos.length === 0) {
    // Componente vazio personalizado ou mensagem padrão
    return (
      emptyComponent || (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium mb-2">
            Nenhum extrato encontrado
          </h3>
          <p className="text-muted-foreground">
            Tente ajustar os filtros ou fazer upload de novos extratos.
          </p>
        </div>
      )
    )
  }

  // Exibir grid de extratos
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {extratos.map((extrato) => (
        <ExtratoCard key={extrato.id} extrato={extrato} />
      ))}
    </div>
  )
}
