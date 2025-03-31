'use client'

import { Trabalho } from '@/types'
import { formatCurrency, generateChartColors } from '@/lib/utils'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts'
import { DataCard } from '@/components/common/data-card'
import { useMemo } from 'react'
import { CHART_THEMES } from '@/lib/constants'

// Definição de tipos para os dados do gráfico
type TooltipData = {
  active?: boolean
  payload?: Array<{
    name: string
    value: number
    payload?: Record<string, unknown>
  }>
}

interface TrabalhoChartProps {
  trabalhos: Trabalho[]
  title?: string
  description?: string
  className?: string
  chartTheme?: keyof typeof CHART_THEMES
}

/**
 * Componente TrabalhoChart: Exibe gráfico de distribuição de trabalhos por tomador
 * Reutilizável em diferentes partes da aplicação
 */
export function TrabalhoChart({
  trabalhos,
  title = 'Distribuição de Trabalhos',
  description = 'Visualização de trabalhos por tomador',
  className,
  chartTheme = 'classic',
}: TrabalhoChartProps) {
  // Agrupar trabalhos por tomador
  const tomadoresData = useMemo(() => {
    const grouped = trabalhos.reduce<Record<string, number>>(
      (acc, trabalho) => {
        if (!acc[trabalho.tomador]) {
          acc[trabalho.tomador] = 0
        }
        acc[trabalho.tomador] += trabalho.liquido
        return acc
      },
      {},
    )

    // Converter para array para o gráfico
    const pieData = Object.entries(grouped).map(([tomador, valor]) => ({
      name: tomador,
      value: valor,
    }))

    // Ordenar por valor
    pieData.sort((a, b) => b.value - a.value)

    return pieData
  }, [trabalhos])

  // Gerar cores para o gráfico
  const COLORS = useMemo(
    () => generateChartColors(tomadoresData.length, chartTheme),
    [tomadoresData.length, chartTheme],
  )

  // Componente para tooltip personalizado do gráfico de pizza
  const PieTooltip = ({ active, payload }: TooltipData) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-md shadow-md p-3">
          <p className="font-medium">Tomador: {payload[0].name}</p>
          <p className="text-sm text-muted-foreground">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      )
    }
    return null
  }

  if (trabalhos.length === 0) {
    return (
      <DataCard title={title} description={description} className={className}>
        <div className="h-full flex items-center justify-center">
          <p className="text-muted-foreground">
            Não há trabalhos para visualizar
          </p>
        </div>
      </DataCard>
    )
  }

  return (
    <DataCard title={title} description={description} className={className}>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={tomadoresData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) =>
                `${name} (${(percent * 100).toFixed(0)}%)`
              }
            >
              {tomadoresData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip content={PieTooltip} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </DataCard>
  )
}
