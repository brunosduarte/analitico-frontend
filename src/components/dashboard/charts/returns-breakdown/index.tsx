'use client'

import { SalaryBreakdownItem } from '@/types'
import { PieChart } from '@/components/charts'
import { PieTooltip } from '@/components/charts/utils/tooltips'
import { CHART_THEMES } from '@/lib/constants'

interface ReturnsBreakdownProps {
  data: SalaryBreakdownItem[]
  isLoading?: boolean
  chartTheme?: keyof typeof CHART_THEMES
}

/**
 * Componente ReturnsBreakdown: Exibe gráfico de donut com a distribuição dos valores de retorno (Férias, 13º, FGTS)
 */
export function ReturnsBreakdown({
  data,
  isLoading = false,
  chartTheme = 'classic',
}: ReturnsBreakdownProps) {
  // Calcula o total para percentuais
  const total = data.reduce((sum, item) => sum + item.value, 0)

  // Prepara dados com total para percentuais
  const chartData = data.map((item) => ({
    ...item,
    total,
  }))

  return (
    <PieChart
      data={chartData}
      title="Retornos Totais (R$)"
      description="Distribuição entre Férias, 13º e FGTS"
      isLoading={isLoading}
      emptyMessage="Não há dados suficientes para exibir os retornos"
      tooltipContent={<PieTooltip />}
      height={320}
      innerRadius={60}
      outerRadius={120}
      colors={CHART_THEMES[chartTheme]}
      chartTheme={chartTheme}
    />
  )
}
