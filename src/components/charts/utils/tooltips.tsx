'use client'

import { formatCurrency, formatNumber } from '@/lib/utils'

interface TooltipProps {
  active?: boolean
  payload?: Array<{
    name: string
    value: any
    payload?: any
    dataKey?: string
    [key: string]: any
  }>
  label?: string
}

/**
 * Tooltip padrão para gráficos de pizza
 */
export function PieTooltip({ active, payload }: TooltipProps) {
  if (active && payload && payload.length) {
    const item = payload[0]
    const value = item.value
    const name = item.name
    const total = item.payload?.total
    const percentage = total ? ((value / total) * 100).toFixed(1) : null

    return (
      <div className="bg-background border rounded-md shadow-md p-3">
        <p className="font-medium">{name}</p>
        <p className="text-sm text-muted-foreground">
          {typeof value === 'number' ? formatCurrency(value) : value}
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
 * Tooltip padrão para gráficos de barras
 */
export function BarTooltip({ active, payload, label }: TooltipProps) {
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
 * Tooltip para gráficos de turno
 */
export function ShiftTooltip({ active, payload }: TooltipProps) {
  if (active && payload && payload.length) {
    const item = payload[0].payload
    const percentage = ((item.value / item.total) * 100).toFixed(1)

    return (
      <div className="bg-background border rounded-md shadow-md p-3">
        <p className="font-medium">Turno: {item.name}</p>
        <p className="text-sm text-muted-foreground">
          Quantidade: {formatNumber(item.value)}
        </p>
        <p className="text-sm text-muted-foreground">{`${percentage}%`}</p>
      </div>
    )
  }
  return null
}

/**
 * Tooltip para gráficos de trabalhos
 */
export function WorkTooltip({ active, payload, label }: TooltipProps) {
  if (active && payload && payload.length) {
    const item = payload[0].payload

    return (
      <div className="bg-background border rounded-md shadow-md p-3">
        <p className="font-medium">{item.pasta || label}</p>
        <p className="text-sm text-muted-foreground">
          Data: {item.dataCompleta || 'N/A'}
        </p>
        <p className="text-sm text-muted-foreground">
          Turno: {item.turno || 'N/A'}
        </p>
        <p className="text-sm text-muted-foreground">
          Valor: {formatCurrency(payload[0].value)}
        </p>
      </div>
    )
  }
  return null
}

/**
 * Tooltip para gráficos de distribuição por dia
 */
export function DayDistributionTooltip({
  active,
  payload,
  label,
}: TooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border rounded-md shadow-md p-3">
        <p className="font-medium">Dia: {label}</p>
        <p className="text-sm text-muted-foreground">
          Trabalhos: {formatNumber(payload[0].value)}
        </p>
        <p className="text-sm text-muted-foreground">
          Valor: {formatCurrency(payload[1].value)}
        </p>
      </div>
    )
  }
  return null
}

/**
 * Tooltip para gráficos de categoria
 */
export function CategoryTooltip({ active, payload }: TooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border rounded-md shadow-md p-3">
        <p className="font-medium">{payload[0].payload.name}</p>
        <p className="text-sm text-muted-foreground">
          Valor Total: {formatCurrency(payload[0].value)}
        </p>
        <p className="text-sm text-muted-foreground">
          Quantidade: {formatNumber(payload[1].value)}
        </p>
      </div>
    )
  }
  return null
}
