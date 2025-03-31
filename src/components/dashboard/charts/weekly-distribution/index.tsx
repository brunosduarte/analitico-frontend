'use client'

import { WeeklyJobData } from '@/types'
import { BarChart } from '@/components/charts'
import { useMemo } from 'react'
import { CHART_COLORS, MESES_NOME } from '@/lib/constants'
import { formatNumber } from '@/lib/utils'

interface WeeklyDistributionProps {
  data: WeeklyJobData[]
  isLoading?: boolean
}

/**
 * Componente WeeklyDistribution: Exibe gráfico de barras com a distribuição semanal de trabalhos
 * Cada mês é representado com uma cor diferente
 */
export function WeeklyDistribution({
  data,
  isLoading = false,
}: WeeklyDistributionProps) {
  // Preparar séries para o gráfico a partir das chaves disponíveis
  const { barSeries, formattedData } = useMemo(() => {
    if (!data || data.length === 0) return { barSeries: [], formattedData: [] }

    // Pegar todas as chaves menos 'week'
    const sampleItem = data[0]
    const seriesKeys = Object.keys(sampleItem).filter((key) => key !== 'week')

    // Criar configuração para cada série (um mês/ano)
    const barSeries = seriesKeys.map((key, index) => {
      // Separar mês e ano
      const [mes, ano] = key.split('/')
      const mesNome = MESES_NOME[mes] || mes

      return {
        key,
        name: `${mesNome}/${ano}`,
        color: CHART_COLORS[index % CHART_COLORS.length],
      }
    })

    // Formatar dados para compatibilidade com o componente Chart
    const formattedData = data.map((item) => {
      // Nome será a semana e o restante são valores
      const chartItem: { name: string; [key: string]: any } = {
        name: item.week,
      }

      // Adicionar todas as propriedades do item original
      Object.keys(item).forEach((key) => {
        if (key !== 'week') {
          chartItem[key] = item[key]
        }
      })

      return chartItem
    })

    return { barSeries, formattedData }
  }, [data])

  // Tooltip personalizado para o gráfico de barras
  const WeeklyTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-md shadow-md p-3">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p
              key={`tooltip-${index}`}
              className="text-sm text-muted-foreground"
            >
              {entry.name}: {formatNumber(entry.value)} trabalhos
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <BarChart
      data={formattedData}
      title="Trabalhos por Semana"
      description="Distribuição de trabalhos por semana, com cores indicando diferentes meses"
      isLoading={isLoading}
      emptyMessage="Não há dados suficientes para exibir a distribuição semanal"
      tooltipContent={<WeeklyTooltip />}
      height={320}
      series={barSeries}
    />
  )
}
