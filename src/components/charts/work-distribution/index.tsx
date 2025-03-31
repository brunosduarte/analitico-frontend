'use client'

import { Trabalho } from '@/types'
import { ComposableChart } from '@/components/charts'
import { DayDistributionTooltip } from '@/components/charts/utils/tooltips'
import { formatCurrency, formatNumber } from '@/lib/utils'
import { useMemo } from 'react'
import { CHART_COLORS } from '@/lib/constants'

interface WorkDistributionProps {
  trabalhos: Trabalho[]
  title?: string
  description?: string
  isLoading?: boolean
  className?: string
}

/**
 * Componente WorkDistribution: Exibe gráfico de barras com a distribuição de trabalhos por dia do mês
 */
export function WorkDistribution({
  trabalhos,
  title = 'Distribuição por Dia',
  description = 'Quantidade e valor dos trabalhos por dia do mês',
  isLoading = false,
  className,
}: WorkDistributionProps) {
  // Processar dados para o gráfico de distribuição por dia
  const distributionData = useMemo(() => {
    if (!trabalhos || trabalhos.length === 0) return []

    // Agrupar trabalhos por dia do mês
    const diasData: Record<string, { count: number; valor: number }> = {}

    trabalhos.forEach((trabalho) => {
      const dia = trabalho.dia || 'N/A'

      if (!diasData[dia]) {
        diasData[dia] = { count: 0, valor: 0 }
      }

      diasData[dia].count += 1
      diasData[dia].valor += trabalho.liquido
    })

    // Converter para formato de gráfico e ordenar por dia
    return Object.entries(diasData)
      .map(([dia, data]) => ({
        name: dia,
        count: data.count,
        valor: data.valor,
      }))
      .sort((a, b) => parseInt(a.name) - parseInt(b.name))
  }, [trabalhos])

  // Definir séries para o gráfico composto
  const chartSeries = [
    {
      key: 'count',
      name: 'Quantidade',
      type: 'bar' as const,
      color: CHART_COLORS[0],
      yAxisId: 'left',
    },
    {
      key: 'valor',
      name: 'Valor (R$)',
      type: 'bar' as const,
      color: CHART_COLORS[1],
      yAxisId: 'right',
    },
  ]

  // Criar uma função de formatação baseada em yAxisId
  const formatYAxisValue = (value: any, props?: any) => {
    if (props?.yAxisId === 'right') {
      return formatCurrency(value).split(',')[0]
    }
    return formatNumber(value)
  }

  return (
    <ComposableChart
      data={distributionData}
      title={title}
      description={description}
      isLoading={isLoading}
      emptyMessage="Não há dados suficientes para exibir a distribuição por dia"
      tooltipContent={<DayDistributionTooltip />}
      height={320}
      series={chartSeries}
      multipleYAxis={true}
      className={className}
      yAxisFormatter={formatYAxisValue}
    />
  )
}
