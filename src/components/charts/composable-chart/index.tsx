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
import { CHART_THEMES } from '@/lib/constants'

type SeriesType = 'bar' | 'line' | 'area'

// Tipo genérico para dados de gráfico
type ChartDataItem = {
  name: string
  [key: string]: unknown
}

// Definição de tipos específicos para valores de gráficos
type ValueType = string | number | Array<string | number>
type NameType = string | number

// Tipagem melhorada para formatters
type AxisFormatter = (value: ValueType) => string
type YAxisFormatterWithProps = (
  value: ValueType,
  props?: { yAxisId?: string },
) => string

interface ComposableChartProps {
  data: ChartDataItem[]
  title: string
  description?: string
  isLoading?: boolean
  emptyMessage?: string
  height?: number
  tooltipContent?: React.ReactElement<TooltipProps<ValueType, NameType>>
  colors?: string[]
  nameKey?: string
  xAxisFormatter?: AxisFormatter
  yAxisFormatter?: YAxisFormatterWithProps
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
  chartTheme?: keyof typeof CHART_THEMES
}

// Tipos específicos para os props de cada componente de gráfico
type BarProps = {
  dataKey: string
  name: string
  fill: string
  stroke: string
  yAxisId?: string
}

type LineProps = {
  type: 'monotone'
  dataKey: string
  name: string
  stroke: string
  fill: string
  yAxisId?: string
}

type AreaProps = {
  type: 'monotone'
  dataKey: string
  name: string
  stroke: string
  fill: string
  yAxisId?: string
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
  colors,
  nameKey = 'name',
  xAxisFormatter,
  yAxisFormatter,
  className,
  series,
  multipleYAxis = false,
  showGrid = true,
  chartTheme = 'classic',
}: ComposableChartProps) {
  // Use provided colors or get them from the theme
  const chartColors = colors || CHART_THEMES[chartTheme] || CHART_THEMES.classic

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
  const formatYAxis = (value: ValueType, props?: { yAxisId?: string }) => {
    if (yAxisFormatter) {
      return yAxisFormatter(value, props)
    }
    return String(value)
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
                tickFormatter={(value) =>
                  formatYAxis(value, { yAxisId: 'left' })
                }
              />
            )}
            {hasRightAxis && (
              <YAxis
                yAxisId="right"
                orientation="right"
                tickFormatter={(value) =>
                  formatYAxis(value, { yAxisId: 'right' })
                }
              />
            )}
            {tooltipContent ? (
              <Tooltip content={tooltipContent} />
            ) : (
              <Tooltip />
            )}
            <Legend />

            {series.map((s, index) => {
              // Configurar props comuns para todos os tipos de gráficos
              const color = s.color || chartColors[index % chartColors.length]
              const yAxisId = multipleYAxis ? s.yAxisId || 'left' : undefined

              switch (s.type) {
                case 'bar': {
                  const barProps: BarProps = {
                    dataKey: s.key,
                    name: s.name,
                    fill: color,
                    stroke: color,
                    yAxisId,
                  }
                  return <Bar key={`series-${s.key}`} {...barProps} />
                }
                case 'line': {
                  const lineProps: LineProps = {
                    type: 'monotone',
                    dataKey: s.key,
                    name: s.name,
                    stroke: color,
                    fill: color,
                    yAxisId,
                  }
                  return <Line key={`series-${s.key}`} {...lineProps} />
                }
                case 'area': {
                  const areaProps: AreaProps = {
                    type: 'monotone',
                    dataKey: s.key,
                    name: s.name,
                    stroke: color,
                    fill: color,
                    yAxisId,
                  }
                  return <Area key={`series-${s.key}`} {...areaProps} />
                }
                default: {
                  // Caso padrão como fallback (Bar)
                  const barProps: BarProps = {
                    dataKey: s.key,
                    name: s.name,
                    fill: color,
                    stroke: color,
                    yAxisId,
                  }
                  return <Bar key={`series-${s.key}`} {...barProps} />
                }
              }
            })}
          </ReChartsComposed>
        </ResponsiveContainer>
      </div>
    </DataCard>
  )
}
