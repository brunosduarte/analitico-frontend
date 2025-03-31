'use client'

import { TomadorCardData } from '@/types'
import { DataCard } from '@/components/common/data-card'
import { TomadorList } from '@/components/dashboard/tomador/tomador-card'
import { Skeleton } from '@/components/ui/skeleton'

interface DashboardTomadorSectionProps {
  tomadoresData: TomadorCardData[]
  trabalhos: any[] // Utilizamos any aqui pois são trabalhos com campos adicionais
}

/**
 * Componente DashboardTomadorSection: Seção de tomadores do dashboard
 * Nota: Os gráficos de turnos, valor bruto por faina e top fainas foram movidos para a aba "Visão Geral"
 */
export function DashboardTomadorSection({
  tomadoresData,
  trabalhos,
}: DashboardTomadorSectionProps) {
  if (tomadoresData.length === 0 || trabalhos.length === 0) {
    return (
      <DataCard
        title="Rendimentos por Operador"
        description="Resumo de valores por operador portuário"
        isLoading={true}
      >
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="w-full h-24" />
          ))}
        </div>
      </DataCard>
    )
  }

  return (
    <>
      <DataCard
        title="Rendimentos por Operador"
        description="Resumo de valores por operador portuário"
      >
        <TomadorList tomadores={tomadoresData} limit={10} />
      </DataCard>
    </>
  )
}
