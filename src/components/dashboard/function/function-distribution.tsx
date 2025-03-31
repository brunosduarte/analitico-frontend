'use client'

import { FunctionDistributionItem } from '@/types'
import { DataCard } from '@/components/common/data-card'
import { formatCurrency, formatNumber } from '@/lib/utils'
import { useMemo } from 'react'
import { BarChart, PieChart, ComposableChart } from '@/components/charts'
import { FUNCTION_NAMES } from '@/lib/constants'

interface FunctionDistributionProps {
  functionData: FunctionDistributionItem[]
  trabalhos: any[] // Trabalhos com campos adicionados
  isLoading?: boolean
}

/**
 * Componente FunctionDistribution: Exibe gráficos e análises por função
 */
export function FunctionDistribution({
  functionData,
  trabalhos,
  isLoading = false,
}: FunctionDistributionProps) {
  // Preparar dados para os gráficos
  const pieChartData = useMemo(() => {
    if (!functionData || functionData.length === 0) return []

    // Calcular total para percentuais
    const total = functionData.reduce((sum, item) => sum + item.value, 0)

    return functionData.map((item) => ({
      name: FUNCTION_NAMES[item.code] || `Função ${item.code}`,
      value: item.value,
      // Adicionar campos extras para tooltip
      code: item.code,
      total,
      totalValue: item.totalValue,
      percentage: ((item.value / total) * 100).toFixed(1),
    }))
  }, [functionData])

  // Dados para gráfico de barras com valores
  const barChartData = useMemo(() => {
    if (!functionData || functionData.length === 0) return []

    return functionData.map((item) => ({
      name: FUNCTION_NAMES[item.code] || `Função ${item.code}`,
      value: item.totalValue,
      count: item.value,
      code: item.code,
      avgValue: item.value > 0 ? item.totalValue / item.value : 0,
    }))
  }, [functionData])

  // Processar trabalhos por função para análise detalhada
  const functionDetails = useMemo(() => {
    if (!trabalhos || trabalhos.length === 0) return null

    // Agrupar trabalhos por função
    const functionGroups: Record<string, any[]> = {}

    trabalhos.forEach((trabalho) => {
      const fun = trabalho.fun
      if (!functionGroups[fun]) {
        functionGroups[fun] = []
      }
      functionGroups[fun].push(trabalho)
    })

    // Calcular estatísticas para cada função
    return Object.entries(functionGroups)
      .map(([code, items]) => {
        const totalBaseCalculo = items.reduce(
          (sum, t) => sum + t.baseDeCalculo,
          0,
        )
        const totalLiquido = items.reduce((sum, t) => sum + t.liquido, 0)
        const avgBaseCalculo = totalBaseCalculo / items.length
        const avgLiquido = totalLiquido / items.length

        return {
          code,
          name: FUNCTION_NAMES[code] || `Função ${code}`,
          count: items.length,
          totalBaseCalculo,
          totalLiquido,
          avgBaseCalculo,
          avgLiquido,
          totalFerias: items.reduce((sum, t) => sum + t.ferias, 0),
          totalDecimo: items.reduce((sum, t) => sum + t.decimoTerceiro, 0),
          totalFGTS: items.reduce((sum, t) => sum + t.fgts, 0),
        }
      })
      .sort((a, b) => b.count - a.count)
  }, [trabalhos])

  // Dados para gráfico composto de comparação
  const comparisonData = useMemo(() => {
    if (!functionDetails) return []

    return functionDetails.map((detail) => ({
      name: detail.name,
      trabalhos: detail.count,
      bruto: detail.totalBaseCalculo,
      liquido: detail.totalLiquido,
      mediaValor: detail.avgBaseCalculo,
    }))
  }, [functionDetails])

  // Configuração para o gráfico composto
  const comparisonSeries = [
    {
      key: 'trabalhos',
      name: 'Quantidade',
      type: 'bar' as const,
      yAxisId: 'left',
    },
    {
      key: 'mediaValor',
      name: 'Média (R$)',
      type: 'line' as const,
      yAxisId: 'right',
    },
  ]

  // Tooltip personalizado para o gráfico de pizza
  const FunctionPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload
      return (
        <div className="bg-background border rounded-md shadow-md p-3">
          <p className="font-medium">
            {item.name} ({item.code})
          </p>
          <p className="text-sm text-muted-foreground">
            Quantidade: {formatNumber(item.value)}
          </p>
          <p className="text-sm text-muted-foreground">
            Valor Total: {formatCurrency(item.totalValue)}
          </p>
          <p className="text-sm text-muted-foreground">
            {item.percentage}% dos trabalhos
          </p>
        </div>
      )
    }
    return null
  }

  // Tooltip personalizado para o gráfico de barras
  const FunctionBarTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload
      return (
        <div className="bg-background border rounded-md shadow-md p-3">
          <p className="font-medium">
            {item.name} ({item.code})
          </p>
          <p className="text-sm text-muted-foreground">
            Valor Total: {formatCurrency(item.value)}
          </p>
          <p className="text-sm text-muted-foreground">
            Quantidade: {formatNumber(item.count)}
          </p>
          <p className="text-sm text-muted-foreground">
            Média por Trabalho: {formatCurrency(item.avgValue)}
          </p>
        </div>
      )
    }
    return null
  }

  // Tooltip personalizado para o gráfico composto
  const ComparisonTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-md shadow-md p-3">
          <p className="font-medium">{payload[0].payload.name}</p>
          {payload.map((entry: any, index: number) => (
            <p
              key={`tooltip-${index}`}
              className="text-sm text-muted-foreground"
            >
              {entry.name}:{' '}
              {entry.name.includes('R$')
                ? formatCurrency(entry.value)
                : formatNumber(entry.value)}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  // Se não há dados, mostrar estado vazio
  if (!functionData || functionData.length === 0) {
    return (
      <DataCard
        title="Análise por Função"
        description="Não há dados de funções disponíveis para o período selecionado"
        isLoading={isLoading}
      >
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">
            Selecione outro período ou faça upload de novos extratos
          </p>
        </div>
      </DataCard>
    )
  }

  return (
    <div className="space-y-6">
      <DataCard
        title="Distribuição de Trabalhos por Função"
        description="Análise da distribuição de trabalhos por função no período selecionado"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-4 text-center">
              Quantidade de Trabalhos
            </h3>
            <div className="h-80">
              <PieChart
                data={pieChartData}
                title=""
                tooltipContent={<FunctionPieTooltip />}
                showLabels={true}
                height={300}
              />
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-4 text-center">Valor por Função</h3>
            <div className="h-80">
              <BarChart
                data={barChartData}
                title=""
                tooltipContent={<FunctionBarTooltip />}
                layout="horizontal"
                yAxisFormatter={(value) => formatCurrency(value).split(',')[0]}
                height={300}
              />
            </div>
          </div>
        </div>
      </DataCard>

      <DataCard
        title="Comparação entre Funções"
        description="Comparação de quantidade de trabalhos e valor médio por trabalho"
      >
        <div className="h-80">
          <ComposableChart
            data={comparisonData}
            title=""
            series={comparisonSeries}
            multipleYAxis={true}
            yAxisFormatter={(value, props) => {
              if (props?.yAxisId === 'right') {
                return formatCurrency(value).split(',')[0]
              }
              return formatNumber(value)
            }}
            tooltipContent={<ComparisonTooltip />}
            height={300}
          />
        </div>
      </DataCard>

      {functionDetails && (
        <DataCard
          title="Detalhamento por Função"
          description="Análise detalhada dos valores por função"
        >
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Função</th>
                  <th className="text-right p-2">Quantidade</th>
                  <th className="text-right p-2">Total Bruto</th>
                  <th className="text-right p-2">Total Líquido</th>
                  <th className="text-right p-2">Média Bruto</th>
                  <th className="text-right p-2">Média Líquido</th>
                </tr>
              </thead>
              <tbody>
                {functionDetails.map((func) => (
                  <tr key={func.code} className="border-b hover:bg-muted/50">
                    <td className="p-2 font-medium">{func.name}</td>
                    <td className="text-right p-2">
                      {formatNumber(func.count)}
                    </td>
                    <td className="text-right p-2">
                      {formatCurrency(func.totalBaseCalculo)}
                    </td>
                    <td className="text-right p-2">
                      {formatCurrency(func.totalLiquido)}
                    </td>
                    <td className="text-right p-2">
                      {formatCurrency(func.avgBaseCalculo)}
                    </td>
                    <td className="text-right p-2">
                      {formatCurrency(func.avgLiquido)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DataCard>
      )}
    </div>
  )
}
