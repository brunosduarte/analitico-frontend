'use client'

import { DataCard } from '@/components/common/data-card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  LineChart as ReChartsLine,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps,
} from 'recharts'
import { CHART_COLORS } from '@/lib/constants'

interface LineChartProps {
  data: Array<{
    name: string
    value?: number
    [key: string]: any
  }>
  title: string
  description?: string
  isLoading?: boolean
  emptyMessage?: string
  height?: number
  tooltipContent?: React.ReactElement<TooltipProps<any, any>>
  colors?: string[]
  dataKey?: string
  nameKey?: string
  xAxisFormatter?: (value: any) => string
  yAxisFormatter?: (value: any) => string
  className?: string
  series?: Array<{
    key: string
    name: string
    color?: string
  }>
  showDots?: boolean
  showGrid?: boolean
}

/**
 * Componente LineChart: Componente reutilizável para gráficos de linha
 */
export function LineChart({
  data,
  title,
  description,
  isLoading = false,
  emptyMessage = 'Não há dados suficientes para exibir o gráfico',
  height = 300,
  tooltipContent,
  colors = CHART_COLORS,
  dataKey = 'value',
  nameKey = 'name',
  xAxisFormatter,
  yAxisFormatter,
  className,
  series,
  showDots = true,
  showGrid = true,
}: LineChartProps) {
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
          <ReChartsLine
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            {showGrid && <CartesianGrid strokeDasharray="3 3" />}
            <XAxis dataKey={nameKey} tickFormatter={xAxisFormatter} />
            <YAxis tickFormatter={yAxisFormatter} />
            {tooltipContent ? (
              <Tooltip content={tooltipContent} />
            ) : (
              <Tooltip />
            )}
            <Legend />
            {series && series.length > 0 ? (
              // Renderizar múltiplas séries quando fornecidas
              series.map((s, index) => (
                <Line
                  key={`line-${s.key}`}
                  type="monotone"
                  dataKey={s.key}
                  name={s.name}
                  stroke={s.color || colors[index % colors.length]}
                  activeDot={showDots ? { r: 8 } : false}
                  dot={showDots}
                />
              ))
            ) : (
              // Renderizar uma única série usando dataKey
              <Line
                type="monotone"
                dataKey={dataKey}
                name="Valor"
                stroke={colors[0]}
                activeDot={showDots ? { r: 8 } : false}
                dot={showDots}
              />
            )}
          </ReChartsLine>
        </ResponsiveContainer>
      </div>
    </DataCard>
  )
}
