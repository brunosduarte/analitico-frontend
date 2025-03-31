'use client'

import { DataCard } from '@/components/common/data-card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  ComposedChart as ReChartsComposed,
  Bar,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps,
} from 'recharts'
import { CHART_COLORS } from '@/lib/constants'

type SeriesType = 'bar' | 'line' | 'area'

interface ComposableChartProps {
  data: Array<{
    name: string
    [key: string]: any
  }>
  title: string
  description?: string
  isLoading?: boolean
  emptyMessage?: string
  height?: number
  tooltipContent?: React.ReactElement<TooltipProps<any, any>>
  colors?: string[]
  nameKey?: string
  xAxisFormatter?: (value: any) => string
  yAxisFormatter?: (value: any, props?: any) => string
  className?: string
  series: Array<{
    key: string
    name: string
    type: SeriesType
    color?: string
    yAxisId?: string
  }>
  multipleYAxis?: boolean
  showGrid?: boolean
}

/**
 * Componente ComposableChart: Componente reutilizável para gráficos compostos
 * que podem combinar barras, linhas e áreas no mesmo gráfico
 */
export function ComposableChart({
  data,
  title,
  description,
  isLoading = false,
  emptyMessage = 'Não há dados suficientes para exibir o gráfico',
  height = 300,
  tooltipContent,
  colors = CHART_COLORS,
  nameKey = 'name',
  xAxisFormatter,
  yAxisFormatter,
  className,
  series,
  multipleYAxis = false,
  showGrid = true,
}: ComposableChartProps) {
  if (isLoading) {
    return (
      <DataCard title={title} description={description} className={className}>
        <div style={{ height: `${height}px` }}>
          <Skeleton className="w-full h-full" />
        </div>
      </DataCard>
    )
  }

  if (!data || data.length === 0 || !series || series.length === 0) {
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

  // Determinar quais yAxis mostrar (left, right ou ambos)
  const hasLeftAxis =
    !multipleYAxis || series.some((s) => !s.yAxisId || s.yAxisId === 'left')
  const hasRightAxis =
    multipleYAxis && series.some((s) => s.yAxisId === 'right')

  // Criar uma função de formatação que lida com os props extras
  const formatYAxis = (value: any) => {
    if (yAxisFormatter) {
      return yAxisFormatter(value)
    }
    return value
  }

  return (
    <DataCard title={title} description={description} className={className}>
      <div style={{ height: `${height}px` }}>
        <ResponsiveContainer width="100%" height="100%">
          <ReChartsComposed
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            {showGrid && <CartesianGrid strokeDasharray="3 3" />}
            <XAxis dataKey={nameKey} tickFormatter={xAxisFormatter} />
            {hasLeftAxis && (
              <YAxis
                yAxisId="left"
                orientation="left"
                tickFormatter={formatYAxis}
              />
            )}
            {hasRightAxis && (
              <YAxis
                yAxisId="right"
                orientation="right"
                tickFormatter={formatYAxis}
              />
            )}
            {tooltipContent ? (
              <Tooltip content={tooltipContent} />
            ) : (
              <Tooltip />
            )}
            <Legend />

            {series.map((s, index) => {
              const props = {
                key: `series-${s.key}`,
                dataKey: s.key,
                name: s.name,
                fill: s.color || colors[index % colors.length],
                stroke: s.color || colors[index % colors.length],
                yAxisId: multipleYAxis ? s.yAxisId || 'left' : undefined,
              }

              switch (s.type) {
                case 'bar':
                  return <Bar {...props} />
                case 'line':
                  return <Line type="monotone" {...props} />
                case 'area':
                  return <Area type="monotone" {...props} />
                default:
                  return <Bar {...props} />
              }
            })}
          </ReChartsComposed>
        </ResponsiveContainer>
      </div>
    </DataCard>
  )
}
