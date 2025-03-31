'use client'

import { DataCard } from '@/components/common/data-card'
import { Skeleton } from '@/components/ui/skeleton'
import { ReactNode } from 'react'
import {
  PieChart as ReChartsPie,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  TooltipProps,
} from 'recharts'
import { CHART_THEMES } from '@/lib/constants'

// Definição de tipos específicos para valores de gráficos
type ValueType = string | number | Array<string | number>
type NameType = string | number

interface PieChartProps {
  data: Array<{
    name: string
    value: number
    [key: string]: unknown
  }>
  title: string
  description?: string
  isLoading?: boolean
  emptyMessage?: string
  height?: number
  innerRadius?: number
  outerRadius?: number
  tooltipContent?: React.ReactElement<TooltipProps<ValueType, NameType>>
  legendFormatter?: (value: string, entry: Record<string, unknown>) => ReactNode
  colors?: string[]
  dataKey?: string
  nameKey?: string
  showLabels?: boolean
  labelFormatter?: (name: string, percent: number) => string
  className?: string
  chartTheme?: keyof typeof CHART_THEMES
}

/**
 * Componente PieChart: Componente reutilizável para gráficos de pizza
 */
export function PieChart({
  data,
  title,
  description,
  isLoading = false,
  emptyMessage = 'Não há dados suficientes para exibir o gráfico',
  height = 300,
  innerRadius = 0,
  outerRadius = 120,
  tooltipContent,
  legendFormatter,
  colors,
  dataKey = 'value',
  nameKey = 'name',
  showLabels = true,
  labelFormatter = (name, percent) =>
    `${name} (${(percent * 100).toFixed(0)}%)`,
  className,
  chartTheme = 'classic',
}: PieChartProps) {
  // Use provided colors or get them from the theme
  const chartColors = colors || CHART_THEMES[chartTheme] || CHART_THEMES.classic

  // Renderizador de legenda personalizado
  const renderLegend = legendFormatter
    ? (props: { payload?: Array<Record<string, unknown>> }) => {
        const { payload } = props
        if (!payload) return null

        return (
          <ul className="flex flex-wrap justify-center gap-4 pt-2">
            {payload.map((entry, index) => (
              <li key={`item-${index}`} className="flex items-center gap-1">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.color as string }}
                />
                <span>{legendFormatter(entry.value as string, entry)}</span>
              </li>
            ))}
          </ul>
        )
      }
    : undefined

  if (isLoading) {
    return (
      <DataCard title={title} description={description} className={className}>
        <div style={{ height: `${height}px` }}>
          <Skeleton className="w-full h-full" />
        </div>
      </DataCard>
    )
  }

  if (!data || data.length === 0) {
    return (
      <DataCard title={title} description={description} className={className}>
        <div
          style={{ height: `${height}px` }}
          className="flex items-center justify-center"
        >
          <p className="text-muted-foreground">{emptyMessage}</p>
        </div>
      </DataCard>
    )
  }

  return (
    <DataCard title={title} description={description} className={className}>
      <div style={{ height: `${height}px` }}>
        <ResponsiveContainer width="100%" height="100%">
          <ReChartsPie>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={showLabels}
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              fill="#8884d8"
              dataKey={dataKey}
              nameKey={nameKey}
              label={
                showLabels
                  ? ({ name, percent }) =>
                      labelFormatter(name as string, percent as number)
                  : undefined
              }
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={chartColors[index % chartColors.length]}
                />
              ))}
            </Pie>
            {tooltipContent ? (
              <Tooltip content={tooltipContent} />
            ) : (
              <Tooltip />
            )}
            <Legend content={renderLegend} />
          </ReChartsPie>
        </ResponsiveContainer>
      </div>
    </DataCard>
  )
}
