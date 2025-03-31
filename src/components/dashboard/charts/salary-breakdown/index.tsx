'use client'

import { SalaryBreakdownItem } from '@/types'
import { PieChart } from '@/components/charts'
import { PieTooltip } from '@/components/charts/utils/tooltips'
import { CHART_THEMES } from '@/lib/constants'

interface SalaryBreakdownProps {
  data: SalaryBreakdownItem[]
  isLoading?: boolean
  chartTheme?: keyof typeof CHART_THEMES
}

/**
 * Componente SalaryBreakdown: Exibe gráfico de pizza com a distribuição dos valores de salário
 */
export function SalaryBreakdown({
  data,
  isLoading = false,
  chartTheme = 'classic',
}: SalaryBreakdownProps) {
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
      title="Salário Bruto (R$)"
      description="Distribuição das deduções e valor líquido"
      isLoading={isLoading}
      emptyMessage="Não há dados suficientes para exibir a distribuição salarial"
      tooltipContent={<PieTooltip />}
      height={320}
      colors={CHART_THEMES[chartTheme]}
      chartTheme={chartTheme}
    />
  )
}
