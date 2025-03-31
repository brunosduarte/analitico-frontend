'use client'

import { useMemo } from 'react'
import { DataCard } from '@/components/common/data-card'
import { formatCurrency } from '@/lib/utils'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { CHART_THEMES } from '@/lib/constants'

// Definição de tipos para os trabalhos
interface TrabalhoExtendido {
  dia: string
  liquido: number
  [key: string]: unknown
}

// Definição de tipos para o tooltip
interface AreaTooltipProps {
  active?: boolean
  payload?: Array<{
    value: number
    [key: string]: unknown
  }>
  label?: string
}

interface DailyIncomeProps {
  trabalhos: TrabalhoExtendido[]
  isLoading?: boolean
  chartTheme?: keyof typeof CHART_THEMES
}

/**
 * Componente DailyIncome: Exibe gráfico de área com rendimentos por dia
 */
export function DailyIncome({
  trabalhos,
  isLoading = false,
  chartTheme = 'classic',
}: DailyIncomeProps) {
  // Agrupar trabalhos por dia para o gráfico de área
  const diasData = useMemo(() => {
    if (!trabalhos || trabalhos.length === 0) return []

    const grouped = trabalhos.reduce<Record<string, number>>(
      (acc, trabalho) => {
        if (!acc[trabalho.dia]) {
          acc[trabalho.dia] = 0
        }
        acc[trabalho.dia] += trabalho.liquido
        return acc
      },
      {},
    )

    // Converter para array para o gráfico
    const areaData = Object.entries(grouped)
      .map(([dia, valor]) => ({
        dia,
        valor,
      }))
      .sort((a, b) => Number(a.dia) - Number(b.dia))

    return areaData
  }, [trabalhos])

  // Obter cor do tema
  const chartColor = CHART_THEMES[chartTheme][0]

  // Componente para tooltip personalizado do gráfico de área
  const AreaTooltip = ({ active, payload, label }: AreaTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-md shadow-md p-3">
          <p className="font-medium">Dia: {label}</p>
          <p className="text-sm text-muted-foreground">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      )
    }
    return null
  }

  if (isLoading) {
    return (
      <DataCard
        title="Rendimentos por Dia"
        description="Valores recebidos em cada dia do mês"
        isLoading={true}
      >
        <div className="h-80"></div>
      </DataCard>
    )
  }

  if (trabalhos.length === 0) {
    return (
      <DataCard
        title="Rendimentos por Dia"
        description="Valores recebidos em cada dia do mês"
      >
        <div className="h-80 flex items-center justify-center">
          <p className="text-muted-foreground">
            Não há dados de rendimentos para visualizar
          </p>
        </div>
      </DataCard>
    )
  }

  return (
    <DataCard
      title="Rendimentos por Dia"
      description="Valores recebidos em cada dia do mês"
    >
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={diasData}
            margin={{
              top: 10,
              right: 10,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="dia" />
            <YAxis
              tickFormatter={(value) =>
                formatCurrency(Number(value)).split(',')[0]
              }
            />
            <Tooltip content={AreaTooltip} />
            <Area
              type="monotone"
              dataKey="valor"
              name="Valor"
              stroke={chartColor}
              fill={chartColor}
              fillOpacity={0.6}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </DataCard>
  )
}
