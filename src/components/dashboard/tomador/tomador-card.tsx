'use client'

import { TomadorCardData } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

interface TomadorCardProps {
  tomador: TomadorCardData
  isLoading?: boolean
}

/**
 * Componente TomadorCard: Exibe card com informações de um tomador
 */
export function TomadorCard({ tomador, isLoading = false }: TomadorCardProps) {
  if (isLoading) {
    return <TomadorCardSkeleton />
  }

  return (
    <Card className="bg-muted/10">
      <CardContent className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-semibold">
            {tomador.tomadorNome || tomador.tomador}
          </h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Fainas</p>
            <p className="text-lg font-medium">{tomador.fainas}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Média</p>
            <p className="text-lg font-medium">
              {formatCurrency(tomador.mediaValor || 0)}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Maior Bruto</p>
            <p className="text-lg font-medium">
              {formatCurrency(tomador.maiorBruto)}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">% do Total</p>
            <p className="text-lg font-medium">{tomador.porcentagemTotal}%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Componente TomadorCardSkeleton: Estado de carregamento para o card de tomador
 */
function TomadorCardSkeleton() {
  return (
    <Card className="bg-muted/10">
      <CardContent className="p-6">
        <div className="mb-4">
          <Skeleton className="h-7 w-48" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i}>
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-6 w-24" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

interface TomadorListProps {
  tomadores: TomadorCardData[]
  isLoading?: boolean
  limit?: number
}

/**
 * Componente TomadorList: Exibe lista de cards de tomadores
 */
export function TomadorList({
  tomadores,
  isLoading = false,
  limit = 5,
}: TomadorListProps) {
  const displayTomadores = isLoading
    ? [...Array(limit)] // Array vazio para skeletons
    : tomadores.slice(0, limit)

  return (
    <div className="space-y-4">
      {displayTomadores.map((tomador, index) => (
        <TomadorCard
          key={tomador?.tomador || index}
          tomador={tomador as TomadorCardData}
          isLoading={isLoading}
        />
      ))}
    </div>
  )
}
