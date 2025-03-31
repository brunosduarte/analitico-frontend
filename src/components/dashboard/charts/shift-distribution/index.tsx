'use client'

import { useMemo } from 'react'
import { PieChart } from '@/components/charts'
import { ShiftTooltip } from '@/components/charts/utils/tooltips'
import { CHART_THEMES } from '@/lib/constants'

interface ShiftDistributionProps {
  trabalhos: any[] // Trabalhos com campos adicionados
  isLoading?: boolean
  chartTheme?: keyof typeof CHART_THEMES
}

/**
 * Componente ShiftDistribution: Exibe gráfico de pizza com a distribuição de trabalhos por turno
 */
export function ShiftDistribution({
  trabalhos,
  isLoading = false,
  chartTheme = 'classic',
}: ShiftDistributionProps) {
  // Processar dados para o gráfico de turnos
  const turnosData = useMemo(() => {
    if (!trabalhos || trabalhos.length === 0) {
      return []
    }

    // Agrupar trabalhos por turno (A, B, C, D)
    const turnos: Record<string, number> = {}

    trabalhos.forEach((trabalho) => {
      const turno = trabalho.tur || 'N/A'
      if (!turnos[turno]) {
        turnos[turno] = 0
      }
      turnos[turno]++
    })

    // Calcular o total para percentuais
    const total = Object.values(turnos).reduce((sum, value) => sum + value, 0)

    // Converter para formato adequado para o gráfico
    const data = Object.entries(turnos).map(([turno, quantidade]) => ({
      name: turno,
      value: quantidade,
      total,
    }))

    // Ordenar alfabeticamente para garantir que sempre apareça A, B, C, D
    return data.sort((a, b) => a.name.localeCompare(b.name))
  }, [trabalhos])

  return (
    <PieChart
      data={turnosData}
      title="Turnos Trabalhados"
      description="Distribuição de trabalhos por período (A, B, C, D)"
      isLoading={isLoading}
      emptyMessage="Não há dados de turnos disponíveis"
      tooltipContent={<ShiftTooltip />}
      height={320}
      labelFormatter={(name, percent) => `${(percent * 100).toFixed(0)}%`}
      colors={CHART_THEMES[chartTheme]}
    />
  )
}
