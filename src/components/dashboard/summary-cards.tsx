'use client'

import { SummaryData } from '@/types'
import { MetricCard } from '@/components/common/data-card'
import { formatCurrency, formatNumber } from '@/lib/utils'
import { BarChart, DollarSign, Calendar, Clock } from 'lucide-react'

interface SummaryCardsProps {
  data: SummaryData
  isLoading?: boolean
}

/**
 * Componente SummaryCards: Exibe KPIs em cards para o dashboard
 */
export function SummaryCards({ data, isLoading = false }: SummaryCardsProps) {
  const items = [
    {
      title: 'Faina(s) realizada(s)',
      value: isLoading ? null : formatNumber(data.totalFainas),
      label: 'Total no período',
      icon: <BarChart className="h-4 w-4" />,
    },
    {
      title: 'Média Faina(s)/Semana',
      value: isLoading ? null : data.mediaFainasSemana.toFixed(1),
      label: 'No período selecionado',
      icon: <Clock className="h-4 w-4" />,
    },
    {
      title: 'Dom/Fer Trabalhado(s)',
      value: isLoading ? null : formatNumber(data.diasTrabalhados),
      label: 'Domingos e feriados com trabalho',
      icon: <Calendar className="h-4 w-4" />,
    },
    {
      title: 'Média Bruto/Faina',
      value: isLoading ? null : formatCurrency(data.mediaBrutoFaina),
      label: 'Valor médio bruto por trabalho',
      icon: <DollarSign className="h-4 w-4" />,
    },
    {
      title: 'Média Líquido/Faina',
      value: isLoading ? null : formatCurrency(data.mediaLiquidoFaina),
      label: 'Valor médio líquido por trabalho',
      icon: <DollarSign className="h-4 w-4" />,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      {items.map((item, index) => (
        <MetricCard
          key={index}
          title={item.title}
          value={item.value}
          label={item.label}
          icon={item.icon}
          isLoading={isLoading}
        />
      ))}
    </div>
  )
}
