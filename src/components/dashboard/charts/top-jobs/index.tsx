'use client'

import { useMemo } from 'react'
import { BarChart } from '@/components/charts'
import { formatCurrency } from '@/lib/utils'
import { CHART_THEMES } from '@/lib/constants'

interface TopJobsProps {
  trabalhos: any[] // Trabalhos com campos adicionados
  isLoading?: boolean
  limit?: number
  chartTheme?: keyof typeof CHART_THEMES
}

/**
 * Componente TopJobs: Exibe gráfico de barras horizontais com os trabalhos de maior valor
 */
export function TopJobs({
  trabalhos,
  isLoading = false,
  limit = 10,
  chartTheme = 'classic',
}: TopJobsProps) {
  // Calcular dados para o top de fainas
  const topJobsData = useMemo(() => {
    if (!trabalhos || trabalhos.length === 0) return []

    return trabalhos
      .map((trabalho) => {
        // Formatar o dia corretamente com dois dígitos
        const dia = trabalho.dia ? String(trabalho.dia).padStart(2, '0') : ''

        // Extrair e formatar mês e ano corretamente
        const pagtoSplit = trabalho.pagto?.split('/') || []
        const mes = pagtoSplit[0] ? String(pagtoSplit[0]).padStart(2, '0') : ''
        const ano = pagtoSplit[1] ? String(pagtoSplit[1]).slice(-2) : ''

        // Formatar a data completa no padrão dd/mm/aa
        const dataFormatada = `${dia}/${mes}/${ano}`

        // Criar uma legenda completa para o item
        const legendaCompleta = `${trabalho.pasta} ${dataFormatada} ${trabalho.tur || ''}`

        return {
          name: legendaCompleta, // Nome completo para o gráfico com data formatada
          value: trabalho.baseDeCalculo,
          // Dados adicionais para o tooltip
          pasta: trabalho.pasta,
          dia,
          mes,
          ano,
          dataFormatada,
          turno: trabalho.tur || '',
        }
      })
      .sort((a, b) => b.value - a.value)
      .slice(0, limit)
  }, [trabalhos, limit])

  // Tooltip personalizado com informações completas e data correta
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload

      return (
        <div className="bg-background border rounded-md shadow-md p-3">
          <p className="font-medium">{item.pasta}</p>
          <p className="text-sm text-muted-foreground">
            Data: {item.dataFormatada}
          </p>
          <p className="text-sm text-muted-foreground">Turno: {item.turno}</p>
          <p className="text-sm text-muted-foreground">
            Valor: {formatCurrency(item.value)}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <BarChart
      data={topJobsData}
      title="Top Fainas (R$)"
      description="Trabalhos com maior valor bruto"
      isLoading={isLoading}
      emptyMessage="Não há dados suficientes para exibir o gráfico"
      tooltipContent={<CustomTooltip />}
      height={320}
      layout="vertical"
      yAxisFormatter={(name) => name} // Mostrar a legenda completa no eixo Y
      xAxisFormatter={(value) => formatCurrency(value).split(',')[0]}
      colors={CHART_THEMES[chartTheme]}
      chartTheme={chartTheme}
    />
  )
}
