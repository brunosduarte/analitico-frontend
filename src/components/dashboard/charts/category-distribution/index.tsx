'use client'

import { CategoriaTotais } from '@/types'
import { PieChart } from '@/components/charts'
import { formatNumber, formatCurrency } from '@/lib/utils'

interface CategoryDistributionProps {
  data: CategoriaTotais[]
  isLoading?: boolean
}

/**
 * Componente CategoryDistribution: Exibe gráfico de pizza com a distribuição de trabalhos por categoria
 */
export function CategoryDistribution({
  data,
  isLoading = false,
}: CategoryDistributionProps) {
  // Calcular total para percentuais
  const total = data.reduce((sum, item) => sum + item.valorTotal, 0)
  const totalCount = data.reduce((sum, item) => sum + item.count, 0)

  // Formatar dados para o gráfico
  const chartData = data.map((item) => ({
    name: item.categoria,
    value: item.count,
    totalValue: item.valorTotal,
    percentage: ((item.count / totalCount) * 100).toFixed(1),
    valuePercentage: ((item.valorTotal / total) * 100).toFixed(1),
  }))

  // Componente para tooltip personalizado
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload

      return (
        <div className="bg-background border rounded-md shadow-md p-3">
          <p className="font-medium">{item.name}</p>
          <p className="text-sm text-muted-foreground">
            Trabalhos: {formatNumber(item.value)} ({item.percentage}%)
          </p>
          <p className="text-sm text-muted-foreground">
            Valor: {formatCurrency(item.totalValue)} ({item.valuePercentage}%)
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <PieChart
      data={chartData}
      title="Distribuição por Categoria"
      description="Distribuição de trabalhos por categoria profissional"
      isLoading={isLoading}
      emptyMessage="Não há dados suficientes para exibir a distribuição por categoria"
      tooltipContent={<CustomTooltip />}
      height={320}
    />
  )
}
