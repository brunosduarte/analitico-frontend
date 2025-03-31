'use client'

import { Trabalho } from '@/types'
import { formatCurrency, generateChartColors } from '@/lib/utils'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts'
import { DataCard } from '@/components/common/data-card'
import { useMemo } from 'react'

interface TrabalhoChartProps {
  trabalhos: Trabalho[]
  title?: string
  description?: string
  className?: string
}

/**
 * Componente TrabalhoChart: Exibe gráficos de distribuição de trabalhos
 * Reutilizável em diferentes partes da aplicação
 */
export function TrabalhoChart({
  trabalhos,
  title = 'Distribuição de Trabalhos',
  description = 'Visualização de trabalhos por tomador e por dia',
  className,
}: TrabalhoChartProps) {
  // Agrupar trabalhos por tomador
  const tomadoresData = useMemo(() => {
    const grouped = trabalhos.reduce(
      (acc: Record<string, number>, trabalho) => {
        if (!acc[trabalho.tomador]) {
          acc[trabalho.tomador] = 0
        }
        acc[trabalho.tomador] += trabalho.liquido
        return acc
      },
      {},
    )

    // Converter para array para o gráfico
    const pieData = Object.entries(grouped).map(([tomador, valor]) => ({
      name: tomador,
      value: valor,
    }))

    // Ordenar por valor
    pieData.sort((a, b) => b.value - a.value)

    return pieData
  }, [trabalhos])

  // Agrupar trabalhos por dia para o gráfico de barras
  const diasData = useMemo(() => {
    const grouped = trabalhos.reduce(
      (acc: Record<string, number>, trabalho) => {
        if (!acc[trabalho.dia]) {
          acc[trabalho.dia] = 0
        }
        acc[trabalho.dia] += trabalho.liquido
        return acc
      },
      {},
    )

    // Converter para array para o gráfico
    const barData = Object.entries(grouped)
      .map(([dia, valor]) => ({
        dia,
        valor,
      }))
      .sort((a, b) => parseInt(a.dia) - parseInt(b.dia))

    return barData
  }, [trabalhos])

  // Gerar cores para o gráfico
  const COLORS = useMemo(
    () => generateChartColors(tomadoresData.length),
    [tomadoresData.length],
  )

  // Componente para tooltip personalizado do gráfico de pizza
  const PieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-md shadow-md p-3">
          <p className="font-medium">Tomador: {payload[0].name}</p>
          <p className="text-sm text-muted-foreground">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      )
    }
    return null
  }

  // Componente para tooltip personalizado do gráfico de barras
  const BarTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-md shadow-md p-3">
          <p className="font-medium">Dia: {label}</p>
          <p className="text-sm text-muted-foreground">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      )
    }
    return null
  }

  if (trabalhos.length === 0) {
    return (
      <DataCard title={title} description={description} className={className}>
        <div className="h-full flex items-center justify-center">
          <p className="text-muted-foreground">
            Não há trabalhos para visualizar
          </p>
        </div>
      </DataCard>
    )
  }

  return (
    <DataCard title={title} description={description} className={className}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
        <div>
          <h3 className="font-medium mb-2 text-center">
            Distribuição por Tomador
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={tomadoresData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} (${(percent * 100).toFixed(0)}%)`
                }
              >
                {tomadoresData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip content={<PieTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h3 className="font-medium mb-2 text-center">Rendimentos por Dia</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={diasData}
              margin={{
                top: 5,
                right: 10,
                left: 10,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="dia" />
              <YAxis
                tickFormatter={(value) => formatCurrency(value).split(',')[0]}
              />
              <Tooltip content={<BarTooltip />} />
              <Bar dataKey="valor" fill="var(--color-1)" name="Valor" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </DataCard>
  )
}
