import { useQuery } from '@tanstack/react-query'
import {
  getExtratos,
  getExtratoById,
  getSalaryBreakdown,
  getShiftDistribution,
  getWeeklyWorkDistribution,
  getTopJobs,
  getReturnsData,
  getFunctionDistribution,
} from '@/lib/api'
import {
  CategoriaTotais,
  Extrato,
  ExtratoResumo,
  SalaryBreakdownItem,
  SummaryData,
  TomadorCardData,
  WeeklyWorkItem,
  ChartDataItem,
  FunctionDistributionItem, // Novo tipo
} from '@/types'
import { DashboardFiltros } from '@/types/api'
import { useExtratoPeriodos } from './use-extratos'
import { generateChartColors } from '@/lib/utils'
import { MESES_ORDEM } from '@/lib/constants'

/**
 * Interface de retorno do hook useDashboardData
 */
interface DashboardData {
  extratos: ExtratoResumo[]
  detailedData: Extrato[]
  trabalhos: any[] // Trabalhos com campos adicionados
  periodos: { mes: string; ano: string; label: string }[]
  categoriasTotais: CategoriaTotais[]
  tomadoresData: TomadorCardData[]
  summaryData: SummaryData
  salaryBreakdown: SalaryBreakdownItem[]
  shiftDistribution: SalaryBreakdownItem[]
  weeklyDistribution: WeeklyWorkItem[]
  topJobs: ChartDataItem[]
  monthlyJobsData: ChartDataItem[]
  returnsData: SalaryBreakdownItem[]
  functionDistribution: FunctionDistributionItem[] // Nova propriedade
  chartColors: string[]
  isLoading: boolean
  error: Error | null
  refetch: () => Promise<any> // Função para recarregar dados
  allExtratos: ExtratoResumo[] // Todos os extratos disponíveis sem filtro
}

/**
 * Hook para obter dados do dashboard
 */
export function useDashboardData(filtros?: DashboardFiltros): DashboardData {
  // Buscar todos os extratos sem filtro para ter uma lista completa disponível
  const { data: allExtratos = [], isLoading: isLoadingAllExtratos } = useQuery<
    ExtratoResumo[],
    Error
  >({
    queryKey: ['extratos-all'],
    queryFn: () => getExtratos(), // Chamada sem filtros para obter todos
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
  })

  // Buscar todos os extratos para análise com os filtros fornecidos
  const {
    data: extratos = [],
    isLoading: isLoadingExtratos,
    error: extratosError,
    refetch: refetchExtratos,
  } = useQuery<ExtratoResumo[], Error>({
    queryKey: ['extratos', filtros],
    queryFn: () => getExtratos(filtros),
    staleTime: 0, // Considera os dados sempre desatualizados
    refetchOnWindowFocus: false,
  })

  // Obter períodos disponíveis
  const periodos = useExtratoPeriodos(extratos)

  // Buscar detalhes completos para todos os extratos relevantes
  const {
    data: detailedData = [],
    isLoading: isLoadingDetails,
    refetch: refetchDetails,
  } = useQuery<Extrato[], Error>({
    queryKey: ['extratos-details', extratos.map((e) => e.id)],
    queryFn: async () => {
      if (!extratos || extratos.length === 0) {
        return []
      }

      // Buscar dados detalhados de cada extrato, processando em lotes para não sobrecarregar
      const extractIds = extratos.map((e) => e.id)
      const batchSize = 5
      const batches = []

      for (let i = 0; i < extractIds.length; i += batchSize) {
        const batch = extractIds.slice(i, i + batchSize)
        batches.push(batch)
      }

      const allDetails = []
      for (const batch of batches) {
        const batchDetails = await Promise.all(
          batch.map((id) => getExtratoById(id)),
        )
        allDetails.push(...batchDetails)
      }

      return allDetails
    },
    enabled: extratos.length > 0, // Só busca se tivermos extratos
    staleTime: 0,
    refetchOnWindowFocus: false,
  })

  // Extrair todos os trabalhos de todos os extratos
  const trabalhos = detailedData.flatMap((extrato) =>
    extrato.trabalhos.map((trabalho) => ({
      ...trabalho,
      extratoId: extrato.id,
      extratoNome: extrato.nome,
      extratoCategoria: extrato.categoria,
    })),
  )

  // Dados de quebra de salário bruto
  const {
    data: salaryBreakdown = [],
    isLoading: isLoadingSalary,
    refetch: refetchSalary,
  } = useQuery<SalaryBreakdownItem[], Error>({
    queryKey: ['salary-breakdown', filtros],
    queryFn: () => getSalaryBreakdown(filtros),
    enabled: !!filtros && extratos.length > 0,
    staleTime: 0,
    refetchOnWindowFocus: false,
  })

  // Distribuição de turnos
  const {
    data: shiftDistribution = [],
    isLoading: isLoadingShifts,
    refetch: refetchShifts,
  } = useQuery<SalaryBreakdownItem[], Error>({
    queryKey: ['shift-distribution', filtros],
    queryFn: () => getShiftDistribution(filtros),
    enabled: !!filtros && extratos.length > 0,
    staleTime: 0,
    refetchOnWindowFocus: false,
  })

  // Distribuição semanal de trabalhos
  const {
    data: weeklyDistribution = [],
    isLoading: isLoadingWeekly,
    refetch: refetchWeekly,
  } = useQuery<WeeklyWorkItem[], Error>({
    queryKey: ['weekly-distribution', filtros],
    queryFn: () => getWeeklyWorkDistribution(filtros),
    enabled: !!filtros && extratos.length > 0,
    staleTime: 0,
    refetchOnWindowFocus: false,
  })

  // Top trabalhos
  const {
    data: topJobs = [],
    isLoading: isLoadingTopJobs,
    refetch: refetchTopJobs,
  } = useQuery<ChartDataItem[], Error>({
    queryKey: ['top-jobs', filtros],
    queryFn: () => getTopJobs(filtros, 10),
    enabled: !!filtros && extratos.length > 0,
    staleTime: 0,
    refetchOnWindowFocus: false,
  })

  // Dados de retornos
  const {
    data: returnsData = [],
    isLoading: isLoadingReturns,
    refetch: refetchReturns,
  } = useQuery<SalaryBreakdownItem[], Error>({
    queryKey: ['returns-data', filtros],
    queryFn: () => getReturnsData(filtros),
    enabled: !!filtros && extratos.length > 0,
    staleTime: 0,
    refetchOnWindowFocus: false,
  })

  // Nova query: Distribuição por função
  const {
    data: functionDistribution = [],
    isLoading: isLoadingFunctions,
    refetch: refetchFunctions,
  } = useQuery<FunctionDistributionItem[], Error>({
    queryKey: ['function-distribution', filtros],
    queryFn: () => getFunctionDistribution(filtros),
    enabled: !!filtros && extratos.length > 0,
    staleTime: 0,
    refetchOnWindowFocus: false,
  })

  // Calcular dados processados localmente

  // Totais por categoria
  const categoriasTotais: CategoriaTotais[] = extratos.reduce(
    (acc: CategoriaTotais[], extrato) => {
      // Verificar se já temos esta categoria
      const existente = acc.find((item) => item.categoria === extrato.categoria)

      if (existente) {
        existente.count += 1
        existente.valorTotal += extrato.valorTotal
      } else {
        acc.push({
          categoria: extrato.categoria,
          count: 1,
          valorTotal: extrato.valorTotal,
        })
      }

      return acc
    },
    [],
  )

  // Cálculo de dados para tomadores
  const tomadoresData: TomadorCardData[] =
    trabalhos.length > 0 ? processOperatorData(trabalhos) : []

  // Dados mensais
  const monthlyJobsData: ChartDataItem[] = processMonthlyData(extratos)

  // Cálculo dos dados de resumo (KPIs)
  const summaryData: SummaryData =
    trabalhos.length > 0
      ? prepareSummaryData(trabalhos)
      : {
          totalFainas: 0,
          mediaFainasSemana: 0,
          diasTrabalhados: 0,
          mediaBrutoFaina: 0,
          mediaLiquidoFaina: 0,
        }

  // Final isLoading state
  const isLoading =
    isLoadingAllExtratos ||
    isLoadingExtratos ||
    isLoadingDetails ||
    isLoadingSalary ||
    isLoadingShifts ||
    isLoadingWeekly ||
    isLoadingTopJobs ||
    isLoadingReturns ||
    isLoadingFunctions

  // Função para refazer todas as consultas
  const refetch = async () => {
    console.log('Executando refetch de dados do dashboard')

    // Primeiro refetch extratos, que é a base para as outras consultas
    await refetchExtratos()

    // Se houver extratos, refetch dos detalhes
    if (extratos.length > 0) {
      await Promise.all([
        refetchDetails(),
        refetchSalary(),
        refetchShifts(),
        refetchWeekly(),
        refetchTopJobs(),
        refetchReturns(),
        refetchFunctions(), // Nova função de refetch
      ])
    }
  }

  // Preparar dados de chart colors
  const chartColors = generateChartColors(10)

  return {
    extratos,
    allExtratos,
    detailedData,
    trabalhos,
    periodos,
    categoriasTotais,
    tomadoresData,
    summaryData,
    salaryBreakdown,
    shiftDistribution,
    weeklyDistribution,
    topJobs,
    monthlyJobsData,
    returnsData,
    functionDistribution, // Novos dados
    chartColors,
    isLoading,
    error: extratosError || null,
    refetch,
  }
}

/**
 * Processa dados para análise de operadores/tomadores
 */
function processOperatorData(trabalhos: any[]): TomadorCardData[] {
  // Group by 'tomador'
  const operatorData: Record<string, TomadorCardData> = trabalhos.reduce(
    (acc: Record<string, TomadorCardData>, trabalho) => {
      const tomador = trabalho.tomador
      if (!acc[tomador]) {
        acc[tomador] = {
          tomador,
          tomadorNome: trabalho.tomadorNome,
          fainas: 0,
          totalValor: 0,
          maiorBruto: 0,
          porcentagemTotal: 0,
        }
      }

      acc[tomador].fainas += 1
      acc[tomador].totalValor += trabalho.baseDeCalculo
      acc[tomador].maiorBruto = Math.max(
        acc[tomador].maiorBruto,
        trabalho.baseDeCalculo,
      )

      return acc
    },
    {},
  )

  // Calculate total value for percentage
  const totalValue = Object.values(operatorData).reduce(
    (sum, op) => sum + op.totalValor,
    0,
  )

  // Calculate percentages and averages
  return Object.values(operatorData)
    .map((op) => ({
      ...op,
      porcentagemTotal: ((op.totalValor / totalValue) * 100).toFixed(2),
      mediaValor: op.fainas > 0 ? op.totalValor / op.fainas : 0,
    }))
    .sort((a, b) => b.totalValor - a.totalValor)
}

/**
 * Processar dados mensais para gráficos
 */
/**
 * Processar dados mensais para gráficos
 * Corrigida para ordenar corretamente por mês/ano
 */
function processMonthlyData(extratos: ExtratoResumo[]): ChartDataItem[] {
  if (!extratos || extratos.length === 0) {
    return []
  }

  // Definir interface para o objeto de contagem mensal
  interface MonthCount {
    count: number
    valorTotal: number
    month: string
    mes: string
    ano: string
  }

  // Agrupar por mês/ano
  const monthCounts: Record<string, MonthCount> = {}

  extratos.forEach((extrato) => {
    const key = `${extrato.mes}/${extrato.ano}`

    if (!monthCounts[key]) {
      monthCounts[key] = {
        month: key,
        mes: extrato.mes,
        ano: extrato.ano,
        count: 0,
        valorTotal: 0,
      }
    }

    monthCounts[key].count += extrato.totalTrabalhos
    monthCounts[key].valorTotal += extrato.valorTotal
  })

  // Converter para array
  const result = Object.values(monthCounts).map((item) => ({
    name: item.month,
    value: item.count,
    valorTotal: item.valorTotal,
    mes: item.mes,
    ano: item.ano,
    // Adicionar média por trabalho
    mediaValor: item.count > 0 ? item.valorTotal / item.count : 0,
  }))

  // Ordenar adequadamente: primeiro por ano, depois por mês usando o índice em MESES_ORDEM
  return result.sort((a, b) => {
    // Primeiro comparar por ano
    if (a.ano !== b.ano) {
      return parseInt(a.ano) - parseInt(b.ano)
    }

    // Depois comparar por mês usando a ordem definida em MESES_ORDEM
    const mesAIndex = MESES_ORDEM.indexOf(a.mes)
    const mesBIndex = MESES_ORDEM.indexOf(b.mes)

    return mesAIndex - mesBIndex
  })
}

/**
 * Prepara dados de resumo (KPIs) para o dashboard
 * Com cálculo correto de média de fainas por semana
 */
function prepareSummaryData(trabalhos: any[]): SummaryData {
  if (!trabalhos || trabalhos.length === 0) {
    return {
      totalFainas: 0,
      mediaFainasSemana: 0,
      diasTrabalhados: 0,
      mediaBrutoFaina: 0,
      mediaLiquidoFaina: 0,
    }
  }

  const totalFainas = trabalhos.length

  // Identificar dias únicos de trabalho
  const diasUnicos = new Set<string>()
  const datasUnicas = new Map<string, Date>()

  // Extrair informações de data para cada trabalho
  trabalhos.forEach((trabalho) => {
    if (trabalho.dia && trabalho.pagto) {
      const diaChave = `${trabalho.dia}-${trabalho.pagto}`
      diasUnicos.add(diaChave)

      // Extrair mês e ano da string de pagto (formato mes/ano)
      const [mes, ano]: [string, string] = trabalho.pagto
        .split('/')
        .map((s: string) => s.trim())

      if (mes && ano) {
        try {
          // Converter para data JavaScript (ano com 4 dígitos)
          const anoCompleto = ano.length === 2 ? `20${ano}` : ano
          const data = new Date(
            parseInt(anoCompleto),
            parseInt(mes) - 1,
            parseInt(trabalho.dia),
          )

          // Verificar se a data é válida antes de adicionar
          if (!isNaN(data.getTime())) {
            const dataStr = data.toISOString().split('T')[0]
            datasUnicas.set(dataStr, data)
          }
        } catch (e) {
          console.error('Erro ao processar data:', e)
        }
      }
    }
  })

  // Calcular o número correto de semanas no mês
  // Primeiro, identificar o mês/ano predominante nos dados
  let mesAnoFrequente: string | null = null
  const contadorMesAno: Record<string, number> = {}

  trabalhos.forEach((trabalho) => {
    if (trabalho.pagto) {
      const mesAno = trabalho.pagto
      contadorMesAno[mesAno] = (contadorMesAno[mesAno] || 0) + 1

      if (
        !mesAnoFrequente ||
        contadorMesAno[mesAno] > contadorMesAno[mesAnoFrequente]
      ) {
        mesAnoFrequente = mesAno
      }
    }
  })

  // Calcular número de semanas no mês predominante
  let semanas = 4 // Valor padrão (considerando 4 semanas por mês)

  if (mesAnoFrequente) {
    const [mes, ano] = (mesAnoFrequente as string).split('/')
    if (mes && ano) {
      // Calcular o número de semanas no mês
      const anoCompleto = ano.length === 2 ? `20${ano}` : ano
      const ultimoDia = new Date(parseInt(anoCompleto), parseInt(mes), 0)

      // Número de dias no mês
      const diasNoMes = ultimoDia.getDate()

      // Número de semanas (aproximado para um número inteiro)
      semanas = Math.ceil(diasNoMes / 7)
    }
  }

  // Domingos/Feriados trabalhados (estimativa)
  const diasTrabalhados =
    diasUnicos.size > 0 ? Math.ceil(diasUnicos.size / 6) : 0

  // Calcular médias
  const mediaBrutoFaina =
    trabalhos.reduce((sum, t) => sum + (t.baseDeCalculo || 0), 0) / totalFainas
  const mediaLiquidoFaina =
    trabalhos.reduce((sum, t) => sum + (t.liquido || 0), 0) / totalFainas

  // Calcular a média de fainas por semana
  const mediaFainasSemana = totalFainas / semanas

  return {
    totalFainas,
    mediaFainasSemana: parseFloat(mediaFainasSemana.toFixed(1)), // Arredondamento para 1 casa decimal
    diasTrabalhados,
    mediaBrutoFaina,
    mediaLiquidoFaina,
  }
}
