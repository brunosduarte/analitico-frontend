'use client'

import { CategoriaTotais } from '@/types'
import { DataCard } from '@/components/common/data-card'
import { formatCurrency, formatNumber } from '@/lib/utils'
import { useMemo } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { CHART_COLORS } from '@/lib/constants'
import { Skeleton } from '@/components/ui/skeleton'

interface DashboardCategorySectionProps {
  categoriasTotais: CategoriaTotais[]
  shiftDistribution: any[] // Usamos any para acessar campos como tur
}

/**
 * Componente DashboardCategorySection: Seção de categorias do dashboard
 * Nota: O gráfico principal de distribuição por categoria foi movido para a aba "Visão Geral"
 */
export function DashboardCategorySection({
  categoriasTotais,
}: DashboardCategorySectionProps) {
  // Formatar dados de categorias para o gráfico
  const categoryChartData = useMemo(() => {
    return categoriasTotais.map((item) => ({
      name: item.categoria,
      value: item.valorTotal,
      count: item.count,
      // Adicionar total para percentuais
      total: categoriasTotais.reduce((sum, cat) => sum + cat.valorTotal, 0),
    }))
  }, [categoriasTotais])

  // Tooltip para o gráfico de categorias
  const CategoryTooltip = ({ active, payload }: any) => {
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

  // Se estiver sem dados
  if (categoriasTotais.length === 0) {
    return (
      <DataCard
        title="Análise Detalhada por Categoria"
        description="Comparação detalhada entre as diferentes categorias profissionais"
        isLoading={true}
      >
        <div className="h-96">
          <Skeleton className="w-full h-full" />
        </div>
      </DataCard>
    )
  }

  return (
    <DataCard
      title="Análise Detalhada por Categoria"
      description="Comparação detalhada entre as diferentes categorias profissionais"
    >
      <div className="h-96">
        {categoryChartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={categoryChartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis
                yAxisId="left"
                orientation="left"
                tickFormatter={(value) => formatCurrency(value).split(',')[0]}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tickFormatter={(value) => formatNumber(value)}
              />
              <Tooltip content={<CategoryTooltip />} />
              <Legend />
              <Bar
                yAxisId="left"
                dataKey="value"
                name="Valor Total"
                fill={CHART_COLORS[0]}
              />
              <Bar
                yAxisId="right"
                dataKey="count"
                name="Quantidade"
                fill={CHART_COLORS[1]}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">
              Não há dados suficientes para exibir o gráfico
            </p>
          </div>
        )}
      </div>
    </DataCard>
  )
}
