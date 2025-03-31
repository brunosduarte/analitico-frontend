'use client'

import { ReactNode } from 'react'
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from 'recharts'
import { Skeleton } from '@/components/ui/skeleton'
import { generateChartColors, formatCurrency } from '@/lib/utils'
import { CHART_COLORS } from '@/lib/constants'

// Tipos de gráficos suportados
export type ChartType = 'pie' | 'bar' | 'line' | 'horizontalBar' | 'donut'

// Interface genérica para dados de gráficos
export interface ChartData {
  name: string
  value: number
  total?: number
  [key: string]: any
}

// Propriedades para tooltip personalizado para PieCharts
export interface PieTooltipProps {
  active?: boolean
  payload?: Array<{
    name: string
    value: number
    payload: {
      name: string
      value: number
      total?: number
    }
  }>
}

// Propriedades para tooltip personalizado para BarCharts
export interface BarTooltipProps {
  active?: boolean
  payload?: Array<{
    name?: string
    value?: any
    payload?: any
  }>
  label?: string
}

// Props para o componente Chart
export interface ChartProps {
  type: ChartType
  data: ChartData[]
  height?: number | string
  width?: string
  isLoading?: boolean
  colors?: string[]
  dataKey?: string
  nameKey?: string
  xAxisKey?: string
  yAxisKey?: string
  valueFormatter?: (value: number) => string
  labelFormatter?: (label: string) => string
  showLabels?: boolean
  innerRadius?: number
  outerRadius?: number
  emptyMessage?: string
  hasCustomTooltip?: boolean
  customTooltip?: ReactNode
  tooltip?: PieTooltipProps | BarTooltipProps
  barSeries?: {
    key: string
    name: string
    color?: string
  }[]
}

/**
 * Componente personalizado para tooltip de gráfico de pizza
 */
const CustomPieTooltip = ({ active, payload }: PieTooltipProps) => {
  if (active && payload && payload.length) {
    const item = payload[0]
    const total = item.payload.total
    const percentage = total ? ((item.value / total) * 100).toFixed(0) : null

    return (
      <div className="bg-background border rounded-md shadow-md p-3">
        <p className="font-medium">{item.name}</p>
        <p className="text-sm text-muted-foreground">
          {formatCurrency(item.value)}
        </p>
        {percentage && (
          <p className="text-sm text-muted-foreground">{`(${percentage}%)`}</p>
        )}
      </div>
    )
  }
  return null
}

/**
 * Componente personalizado para tooltip de gráfico de barras
 */
const CustomBarTooltip = ({ active, payload, label }: BarTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border rounded-md shadow-md p-3">
        <p className="font-medium">{label}</p>
        {payload.map((entry, index) => (
          <p key={`tooltip-${index}`} className="text-sm text-muted-foreground">
            {entry.name}:{' '}
            {typeof entry.value === 'number'
              ? formatCurrency(entry.value)
              : entry.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}

/**
 * Componente Chart: Wrapper para gráficos Recharts com estilos padronizados
 */
export function Chart({
  type,
  data,
  height = 300,
  width = '100%',
  isLoading = false,
  colors = CHART_COLORS,
  dataKey = 'value',
  nameKey = 'name',
  xAxisKey,
  yAxisKey,
  valueFormatter = formatCurrency,
  labelFormatter = (label) => label,
  showLabels = true,
  innerRadius = 0,
  outerRadius = 120,
  emptyMessage = 'Não há dados suficientes para exibir o gráfico',
  hasCustomTooltip = false,
  customTooltip,
  barSeries = [],
}: ChartProps) {
  if (isLoading) {
    return (
      <Skeleton
        className={`w-full h-[${typeof height === 'number' ? `${height}px` : height}]`}
      />
    )
  }

  if (!data || data.length === 0) {
    return (
      <div
        className={`flex items-center justify-center w-full h-[${typeof height === 'number' ? `${height}px` : height}]`}
      >
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    )
  }

  // Use colors fornecidos ou gere cores baseadas no tamanho dos dados
  const chartColors = colors || generateChartColors(data.length)

  // Define o tooltip baseado no tipo de gráfico ou um personalizado
  const tooltipComponent = () => {
    if (hasCustomTooltip && customTooltip) {
      return customTooltip
    }

    switch (type) {
      case 'pie':
      case 'donut':
        return <CustomPieTooltip />
      case 'bar':
      case 'horizontalBar':
        return <CustomBarTooltip />
      default:
        return <Tooltip />
    }
  }

  // Renderizar o gráfico adequado baseado no tipo
  const renderChart = () => {
    switch (type) {
      case 'pie':
        return (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={showLabels}
              outerRadius={outerRadius}
              fill="#8884d8"
              dataKey={dataKey}
              nameKey={nameKey}
              label={
                showLabels
                  ? ({ name, percent }) =>
                      `${name} (${(percent * 100).toFixed(0)}%)`
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
            {tooltipComponent()}
            <Legend />
          </PieChart>
        )
      case 'donut':
        return (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={innerRadius || 60}
              outerRadius={outerRadius}
              fill="#8884d8"
              dataKey={dataKey}
              nameKey={nameKey}
              label={
                showLabels
                  ? ({ name, percent }) =>
                      `${name} (${(percent * 100).toFixed(0)}%)`
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
            {tooltipComponent()}
            <Legend />
          </PieChart>
        )
      case 'bar':
        return (
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey={xAxisKey || nameKey}
              tickFormatter={labelFormatter}
            />
            <YAxis
              tickFormatter={(value) =>
                typeof value === 'number'
                  ? valueFormatter(value).split(',')[0]
                  : value
              }
            />
            {tooltipComponent()}
            <Legend />
            {barSeries.length > 0 ? (
              // Renderizar múltiplas séries quando fornecidas
              barSeries.map((series, index) => (
                <Bar
                  key={`bar-${series.key}`}
                  dataKey={series.key}
                  name={series.name}
                  fill={series.color || chartColors[index % chartColors.length]}
                />
              ))
            ) : (
              // Renderizar uma única série usando dataKey
              <Bar dataKey={dataKey} name="Valor" fill={chartColors[0]} />
            )}
          </BarChart>
        )
      case 'horizontalBar':
        return (
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 20, right: 30, left: 60, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              horizontal={true}
              vertical={false}
            />
            <XAxis
              type="number"
              tickFormatter={(value) =>
                typeof value === 'number'
                  ? valueFormatter(value).split(',')[0]
                  : value
              }
            />
            <YAxis
              type="category"
              dataKey={yAxisKey || nameKey}
              width={60}
              tickFormatter={labelFormatter}
            />
            {tooltipComponent()}
            <Legend />
            {barSeries.length > 0 ? (
              // Renderizar múltiplas séries quando fornecidas
              barSeries.map((series, index) => (
                <Bar
                  key={`bar-${series.key}`}
                  dataKey={series.key}
                  name={series.name}
                  fill={series.color || chartColors[index % chartColors.length]}
                />
              ))
            ) : (
              // Renderizar uma única série usando dataKey
              <Bar dataKey={dataKey} name="Valor" fill={chartColors[0]} />
            )}
          </BarChart>
        )
      case 'line':
        return (
          <LineChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey={xAxisKey || nameKey}
              tickFormatter={labelFormatter}
            />
            <YAxis
              tickFormatter={(value) =>
                typeof value === 'number'
                  ? valueFormatter(value).split(',')[0]
                  : value
              }
            />
            {tooltipComponent()}
            <Legend />
            {barSeries.length > 0 ? (
              // Renderizar múltiplas séries quando fornecidas
              barSeries.map((series, index) => (
                <Line
                  key={`line-${series.key}`}
                  type="monotone"
                  dataKey={series.key}
                  name={series.name}
                  stroke={
                    series.color || chartColors[index % chartColors.length]
                  }
                  activeDot={{ r: 8 }}
                />
              ))
            ) : (
              // Renderizar uma única série usando dataKey
              <Line
                type="monotone"
                dataKey={dataKey}
                name="Valor"
                stroke={chartColors[0]}
                activeDot={{ r: 8 }}
              />
            )}
          </LineChart>
        )
      default:
        return <div>Tipo de gráfico não suportado: {type}</div>
    }
  }

  return (
    <ResponsiveContainer width={width} height={height}>
      {renderChart()}
    </ResponsiveContainer>
  )
}
