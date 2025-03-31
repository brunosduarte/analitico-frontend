'use client'

import { ChartDataItem } from '@/types'
import { BarChart } from '@/components/charts'
import { useMemo } from 'react'
import { formatNumber, formatCurrency } from '@/lib/utils'
import { MESES_NOME, CHART_THEMES } from '@/lib/constants'

// Tipagem para tooltip
interface MonthlyTooltipProps {
  active?: boolean
  payload?: Array<{
    value: number
    payload?: {
      valorTotal?: number
      mediaValor?: number
      [key: string]: unknown
    }
    [key: string]: unknown
  }>
  label?: string
}

interface MonthlyJobsProps {
  data: ChartDataItem[]
  isLoading?: boolean
  chartTheme?: keyof typeof CHART_THEMES
}

/**
 * Componente MonthlyJobs: Exibe gráfico de barras com trabalhos por mês
 */
export function MonthlyJobs({
  data,
  isLoading = false,
  chartTheme = 'classic',
}: MonthlyJobsProps) {
  // Preparar os dados formatados com nomes completos dos meses
  const formattedData = useMemo(() => {
    if (!data || data.length === 0) return []

    return data
      .map((item) => {
        // Separar mês e ano da string "MES/ANO"
        const [mes, ano] = (item.name as string).split('/')
        // Obter o nome completo do mês
        const mesNome = MESES_NOME[mes] || mes

        return {
          ...item,
          name: `${mesNome}/${ano}`,
          // Adicionar campo para valor do trabalho (se disponível)
          displayName: `${mesNome}/${ano}`,
        }
      })
      .sort((a, b) => {
        // Ordenar cronologicamente
        const [mesA, anoA] = (a.name as string).split('/')
        const [mesB, anoB] = (b.name as string).split('/')

        // Primeiro ordenar por ano (decrescente)
        if (anoA !== anoB) return Number(anoA) - Number(anoB)

        // Depois ordenar por mês - aqui precisaríamos de um mapeamento para índices numéricos
        // Simplificando com comparação alfabética que funciona para nomes de meses em português
        return mesA.localeCompare(mesB)
      })
  }, [data])

  // Tooltip personalizado para o gráfico de barras
  const MonthlyTooltip = ({ active, payload, label }: MonthlyTooltipProps) => {
    if (active && payload && payload.length) {
      const itemData = payload[0].payload
      const valor = itemData?.valorTotal

      return (
        <div className="bg-background border rounded-md shadow-md p-3">
          <p className="font-medium">{label}</p>
          <p className="text-sm text-muted-foreground">
            Trabalhos: {formatNumber(payload[0].value)}
          </p>
          {valor && (
            <p className="text-sm text-muted-foreground">
              Valor Total: {formatCurrency(Number(valor))}
            </p>
          )}
          {itemData?.mediaValor && (
            <p className="text-sm text-muted-foreground">
              Média por Trabalho: {formatCurrency(Number(itemData.mediaValor))}
            </p>
          )}
        </div>
      )
    }
    return null
  }

  // Configurar cores do tema
  const barColors = CHART_THEMES[chartTheme]

  return (
    <BarChart
      data={formattedData}
      title="Trabalhos por Mês"
      description="Quantidade de trabalhos realizados em cada mês do período selecionado"
      isLoading={isLoading}
      emptyMessage="Não há dados suficientes para exibir os trabalhos mensais"
      tooltipContent={<MonthlyTooltip />}
      height={320}
      yAxisFormatter={(value) => formatNumber(value)}
      series={[
        {
          key: 'value',
          name: 'Quantidade de Trabalhos',
          color: barColors[0],
        },
      ]}
      colors={barColors}
      chartTheme={chartTheme}
    />
  )
}
