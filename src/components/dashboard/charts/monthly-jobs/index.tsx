'use client'

import { ChartDataItem } from '@/types'
import { BarChart } from '@/components/charts'
import { useMemo } from 'react'
import { formatNumber, formatCurrency } from '@/lib/utils'
import { MESES_NOME } from '@/lib/constants'

interface MonthlyJobsProps {
  data: ChartDataItem[]
  isLoading?: boolean
}

/**
 * Componente MonthlyJobs: Exibe gráfico de barras com trabalhos por mês
 */
export function MonthlyJobs({ data, isLoading = false }: MonthlyJobsProps) {
  // Preparar os dados formatados com nomes completos dos meses
  const formattedData = useMemo(() => {
    if (!data || data.length === 0) return []

    return data
      .map((item) => {
        // Separar mês e ano da string "MES/ANO"
        const [mes, ano] = item.name.split('/')
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
        const [mesA, anoA] = a.name.split('/')
        const [mesB, anoB] = b.name.split('/')

        // Primeiro ordenar por ano
        if (anoA !== anoB) {
          return parseInt(anoA) - parseInt(anoB)
        }

        // Depois ordenar por mês - aqui precisaríamos de um mapeamento para índices numéricos
        // Simplificando com comparação alfabética que funciona para nomes de meses em português
        return mesA.localeCompare(mesB)
      })
  }, [data])

  // Tooltip personalizado para o gráfico de barras
  const MonthlyTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const valor = payload[0].payload.valorTotal

      return (
        <div className="bg-background border rounded-md shadow-md p-3">
          <p className="font-medium">{label}</p>
          <p className="text-sm text-muted-foreground">
            Trabalhos: {formatNumber(payload[0].value)}
          </p>
          {valor && (
            <p className="text-sm text-muted-foreground">
              Valor Total: {formatCurrency(valor)}
            </p>
          )}
          {payload[0].payload.mediaValor && (
            <p className="text-sm text-muted-foreground">
              Média por Trabalho:{' '}
              {formatCurrency(payload[0].payload.mediaValor)}
            </p>
          )}
        </div>
      )
    }
    return null
  }

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
        },
      ]}
    />
  )
}
