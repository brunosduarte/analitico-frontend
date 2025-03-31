'use client'

import { useState, useEffect, useCallback } from 'react'
import { useDashboardData } from '@/hooks/use-dashboard'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  DateRange,
  PeriodSelector,
} from '@/components/dashboard/period-selector'
import { LoadingState } from '@/components/common/loading-state'
import {
  EmptyState,
  EmptyTypes,
  ErrorState,
} from '@/components/common/empty-state'
import { SummaryCards } from '@/components/dashboard/summary-cards'
import { format } from 'date-fns'
import { DashboardFiltros } from '@/types/api'
import { MESES_ABREV, MESES_ORDEM, CHART_THEMES } from '@/lib/constants'
import { ChartThemeSelector } from '@/components/dashboard/chart-theme-selector'

// Import chart components with dynamic imports to avoid hydration issues
import dynamic from 'next/dynamic'

// Dynamically import components that might cause hydration issues
const SalaryBreakdown = dynamic(
  () =>
    import('@/components/dashboard/charts/salary-breakdown').then(
      (mod) => mod.SalaryBreakdown,
    ),
  { ssr: false },
)
const ReturnsBreakdown = dynamic(
  () =>
    import('@/components/dashboard/charts/returns-breakdown').then(
      (mod) => mod.ReturnsBreakdown,
    ),
  { ssr: false },
)
const WeeklyDistribution = dynamic(
  () =>
    import('@/components/dashboard/charts/weekly-distribution').then(
      (mod) => mod.WeeklyDistribution,
    ),
  { ssr: false },
)
const MonthlyJobs = dynamic(
  () =>
    import('@/components/dashboard/charts/monthly-jobs').then(
      (mod) => mod.MonthlyJobs,
    ),
  { ssr: false },
)
const ShiftDistribution = dynamic(
  () =>
    import('@/components/dashboard/charts/shift-distribution').then(
      (mod) => mod.ShiftDistribution,
    ),
  { ssr: false },
)
const JobValue = dynamic(
  () =>
    import('@/components/dashboard/charts/job-value').then(
      (mod) => mod.JobValue,
    ),
  { ssr: false },
)
const TopJobs = dynamic(
  () =>
    import('@/components/dashboard/charts/top-jobs').then((mod) => mod.TopJobs),
  { ssr: false },
)
const TrabalhoChart = dynamic(
  () =>
    import('@/components/charts/trabalho-chart').then(
      (mod) => mod.TrabalhoChart,
    ),
  { ssr: false },
)
const DailyIncome = dynamic(
  () =>
    import('@/components/dashboard/charts/daily-income').then(
      (mod) => mod.DailyIncome,
    ),
  { ssr: false },
)
const FunctionDistribution = dynamic(
  () =>
    import('@/components/dashboard/function/function-distribution').then(
      (mod) => mod.FunctionDistribution,
    ),
  { ssr: false },
)
const DashboardTomadorSection = dynamic(
  () =>
    import('@/components/dashboard/tomador/tomador-section').then(
      (mod) => mod.DashboardTomadorSection,
    ),
  { ssr: false },
)

// Define chart theme type
type ChartColorTheme = keyof typeof CHART_THEMES

/**
 * Dashboard Page: Página principal do dashboard
 */
export default function DashboardPage() {
  // Estado para controlar o lado do cliente
  const [isMounted, setIsMounted] = useState(false)

  // Estado para o período selecionado
  const [dateRange, setDateRange] = useState<DateRange | null>(null)

  // Estado para o carregamento inicial
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  // Estado para o tema de cores dos gráficos
  const [chartColorTheme, setChartColorTheme] =
    useState<ChartColorTheme>('classic')

  // Use useEffect para inicializar as datas após a montagem
  useEffect(() => {
    // Marcar o componente como montado
    setIsMounted(true)

    // Definir o intervalo inicial - primeiro dia do mês atual até o último dia do mês
    const today = new Date()
    const initialRange = {
      from: new Date(today.getFullYear(), today.getMonth(), 1),
      to: new Date(today.getFullYear(), today.getMonth() + 1, 0),
    }

    setDateRange(initialRange)
  }, [])

  // Extrair mês abreviado em português
  const getMesAbreviado = useCallback((date: Date): string => {
    // Converte para um número de 0-11
    const mesNum = date.getMonth()
    // Mapeia para JAN, FEV, etc. conforme constantes da aplicação
    const mesesKeys = Object.keys(MESES_ABREV)
    return mesesKeys[mesNum] || 'JAN'
  }, [])

  // Preparar filtros para a API com base no período selecionado
  const filtros: DashboardFiltros = !dateRange
    ? {}
    : {
        mes: dateRange.from ? getMesAbreviado(dateRange.from) : undefined,
        ano: dateRange.from
          ? dateRange.from.getFullYear().toString()
          : undefined,
        dataInicio: dateRange.from
          ? format(dateRange.from, 'yyyy-MM-dd')
          : undefined,
        dataFim: dateRange.to ? format(dateRange.to, 'yyyy-MM-dd') : undefined,
      }

  // Hook para obter dados do dashboard com base no período selecionado
  const {
    isLoading,
    error,
    summaryData,
    salaryBreakdown,
    returnsData,
    weeklyDistribution,
    monthlyJobsData,
    tomadoresData,
    trabalhos,
    functionDistribution,
    extratos,
    refetch,
    allExtratos, // Todos os extratos disponíveis sem filtro de período
  } = useDashboardData(isMounted && dateRange ? filtros : undefined)

  // Efeito para marcar quando o carregamento inicial termina
  useEffect(() => {
    if (!isLoading && isInitialLoad && isMounted) {
      setIsInitialLoad(false)
    }
  }, [isLoading, isInitialLoad, isMounted])

  // Efeito para carregar dados no primeiro render
  useEffect(() => {
    // Tenta refetch explícito quando o componente é montado e temos um dateRange
    if (isInitialLoad && isMounted && dateRange) {
      refetch()
    }
  }, [isInitialLoad, refetch, isMounted, dateRange])

  // Efeito para verificar se há dados no período atual e ajustar conforme necessário
  useEffect(() => {
    // Se não houver dados no período selecionado, mas existirem extratos em outros períodos
    if (
      !isLoading &&
      !isInitialLoad &&
      extratos?.length === 0 &&
      allExtratos?.length > 0 &&
      isMounted
    ) {
      console.log(
        'Sem dados no período atual, mas existem extratos em outros períodos',
      )

      // Encontrar o extrato mais recente para definir o período
      const latestExtrato = [...allExtratos].sort((a, b) => {
        // Primeiro ordenar por ano (decrescente)
        if (a.ano !== b.ano) return parseInt(b.ano) - parseInt(a.ano)

        // Depois ordenar por mês (decrescente) usando a ordem dos meses no array MESES_ORDEM
        const indexA = MESES_ORDEM.indexOf(a.mes)
        const indexB = MESES_ORDEM.indexOf(b.mes)
        return indexB - indexA
      })[0]

      if (latestExtrato) {
        console.log(
          'Definindo novo período com base no extrato mais recente:',
          latestExtrato.mes,
          latestExtrato.ano,
        )

        // Obter primeiro e último dia do mês do extrato mais recente
        const mesNumerico = MESES_ORDEM.indexOf(latestExtrato.mes)
        const anoNumerico = parseInt(latestExtrato.ano)

        // Criar datas para o início e fim do mês
        const from = new Date(anoNumerico, mesNumerico, 1)
        const to = new Date(anoNumerico, mesNumerico + 1, 0) // O dia 0 do próximo mês é o último dia do mês atual

        // Atualizar o período selecionado
        const newRange = { from, to }
        handlePeriodChange(newRange)
      }
    }
  }, [isLoading, isInitialLoad, extratos, allExtratos, isMounted])

  // Função para atualizar o período selecionado
  const handlePeriodChange = (range: DateRange) => {
    console.log('Período alterado:', range)
    setDateRange(range)
    // Force um refetch explícito quando o período mudar
    setTimeout(() => refetch(), 0)
  }

  // Função para atualizar o tema de cores dos gráficos
  const handleChartThemeChange = (theme: ChartColorTheme) => {
    setChartColorTheme(theme)
  }

  // Se o componente ainda não foi montado no cliente, mostrar um estado de carregamento inicial
  if (!isMounted) {
    return <LoadingState message="Inicializando dashboard..." />
  }

  // Se estiver carregando inicialmente, mostrar estado de carregamento
  if (isInitialLoad || isLoading) {
    return <LoadingState message="Carregando dados do dashboard..." />
  }

  // Se houver erro, mostrar estado de erro
  if (error) {
    return (
      <ErrorState
        title="Erro ao carregar dashboard"
        description="Não foi possível carregar os dados do dashboard."
        error={error instanceof Error ? error : new Error('Erro desconhecido')}
        onRetry={() => {
          refetch()
        }}
      />
    )
  }

  // Verificação explícita para extratos vazios
  const hasData = extratos && extratos.length > 0
  const hasAnyData = allExtratos && allExtratos.length > 0

  // Se não houver dados, mostrar estado vazio
  if (!hasData) {
    if (hasAnyData) {
      // Se existem dados em outros períodos, mostrar mensagem específica
      return (
        <EmptyState
          title="Nenhum dado encontrado no período selecionado"
          description="Não há dados disponíveis para o período atual. Estamos ajustando para mostrar os extratos existentes."
          icon={EmptyTypes.NO_DATA.icon}
          action={{
            label: 'Carregar Todos os Dados',
            onClick: () => {
              // Buscar todos os dados sem filtro de período
              const range = {
                from: new Date(2025, 0, 1), // 1 de Janeiro de 2025
                to: new Date(), // Hoje
              }
              handlePeriodChange(range)
            },
          }}
        />
      )
    } else {
      // Se não existem dados em nenhum período
      return (
        <EmptyState
          title="Nenhum dado encontrado"
          description="Não há extratos disponíveis. Por favor, faça o upload de novos extratos."
          icon={EmptyTypes.NO_DATA.icon}
          action={{
            label: 'Ir para Upload',
            onClick: () => {
              window.location.href = '/upload'
            },
          }}
        />
      )
    }
  }

  // Se não houver trabalhos, mostrar estado vazio específico para trabalhos
  if (!trabalhos || trabalhos.length === 0) {
    return (
      <EmptyState
        title="Sem detalhes de trabalhos"
        description="Os extratos foram encontrados, mas não possuem detalhes de trabalhos para exibir no dashboard."
        icon={EmptyTypes.NO_ITEMS.icon}
        action={{
          label: 'Mudar Período',
          onClick: () => {
            // Definir para os últimos 6 meses
            const today = new Date()
            const sixMonthsAgo = new Date()
            sixMonthsAgo.setMonth(today.getMonth() - 6)

            const newRange = {
              from: new Date(
                sixMonthsAgo.getFullYear(),
                sixMonthsAgo.getMonth(),
                1,
              ),
              to: new Date(today.getFullYear(), today.getMonth() + 1, 0),
            }

            handlePeriodChange(newRange)
          },
        }}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Visualização analítica dos dados de extratos portuários
          </p>
        </div>

        <div className="flex flex-col gap-2 w-full md:w-auto">
          {dateRange && (
            <PeriodSelector
              onChange={handlePeriodChange}
              initialRange={dateRange}
            />
          )}
          <ChartThemeSelector onThemeChange={handleChartThemeChange} />
        </div>
      </div>

      {/* KPIs */}
      <SummaryCards data={summaryData} />

      {/* Tabs com diferentes visões */}
      <Tabs defaultValue="geral">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="geral">Visão Geral</TabsTrigger>
          <TabsTrigger value="funcoes">Por Função</TabsTrigger>
          <TabsTrigger value="tomadores">Por Tomador</TabsTrigger>
        </TabsList>

        {/* Tab de Visão Geral */}
        <TabsContent value="geral" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <SalaryBreakdown
              data={salaryBreakdown}
              isLoading={isLoading}
              chartTheme={chartColorTheme}
            />
            <ReturnsBreakdown
              data={returnsData}
              isLoading={isLoading}
              chartTheme={chartColorTheme}
            />
          </div>

          {/* Rendimentos por dia */}
          <DailyIncome
            trabalhos={trabalhos}
            isLoading={isLoading}
            chartTheme={chartColorTheme}
          />

          <div className="grid grid-cols-1 gap-4">
            <MonthlyJobs
              data={monthlyJobsData}
              isLoading={isLoading}
              chartTheme={chartColorTheme}
            />
            <WeeklyDistribution
              data={weeklyDistribution}
              isLoading={isLoading}
              chartTheme={chartColorTheme}
            />
          </div>

          <div className="grid grid-cols-1 gap-4">
            <ShiftDistribution
              trabalhos={trabalhos}
              isLoading={isLoading}
              chartTheme={chartColorTheme}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <JobValue
              trabalhos={trabalhos}
              isLoading={isLoading}
              chartTheme={chartColorTheme}
            />
            <TopJobs
              trabalhos={trabalhos}
              isLoading={isLoading}
              chartTheme={chartColorTheme}
            />
          </div>
        </TabsContent>

        {/* Tab de Funções */}
        <TabsContent value="funcoes" className="space-y-4">
          <FunctionDistribution
            functionData={functionDistribution}
            trabalhos={trabalhos}
            isLoading={isLoading}
            chartTheme={chartColorTheme}
          />
        </TabsContent>

        {/* Tab de Tomadores - TrabalhoChart agora fica aqui */}
        <TabsContent value="tomadores" className="space-y-4">
          <DashboardTomadorSection
            tomadoresData={tomadoresData}
            trabalhos={trabalhos}
            isLoading={isLoading}
            chartTheme={chartColorTheme}
          />

          {/* Apenas o gráfico de distribuição por tomador fica nesta aba */}
          <TrabalhoChart
            trabalhos={trabalhos}
            title="Distribuição de Trabalhos por Tomador"
            description="Visão consolidada de todos os trabalhos por tomador no período"
            chartTheme={chartColorTheme}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
