import axios, {
  AxiosError,
  AxiosInstance,
  // AxiosRequestConfig,
  AxiosResponse,
} from 'axios'
import { API_CONFIG } from './constants'
import {
  ApiResponse,
  DashboardFiltros,
  ExtratoFiltros,
  // ExtratoFormData,
} from '@/types/api'
import { Extrato, ExtratoResumo, ResumoMensal, TomadorAnalise } from '@/types'

/**
 * Cliente axios configurado para a API
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: API_CONFIG.TIMEOUT,
})

/**
 * Interceptor para tratamento de erros
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Tratamento de erros comuns
    if (error.response) {
      console.error(
        'Erro na resposta da API:',
        error.response.status,
        error.response?.data,
      )
    } else if (error.request) {
      console.error('Sem resposta da API:', error.request)
    } else {
      console.error('Erro ao configurar requisição:', error.message)
    }

    return Promise.reject(error)
  },
)

/**
 * Buscar lista de extratos com filtros opcionais
 */
export const getExtratos = async (
  filtros?: ExtratoFiltros,
): Promise<ExtratoResumo[]> => {
  try {
    const params = { ...filtros }
    const response: AxiosResponse<ApiResponse<ExtratoResumo[]>> =
      await apiClient.get('/analitico', { params })
    return response.data.data
  } catch (error) {
    console.error('Erro ao buscar extratos:', error)
    throw error
  }
}

/**
 * Buscar um extrato específico por ID
 */
export const getExtratoById = async (id: string): Promise<Extrato> => {
  try {
    const response: AxiosResponse<ApiResponse<Extrato>> = await apiClient.get(
      `/analitico/${id}`,
    )
    return response.data.data
  } catch (error) {
    console.error(`Erro ao buscar extrato ID ${id}:`, error)
    throw error
  }
}

// Tipos para os trabalhos por tomador
export interface TrabalhoTomador {
  dia: string
  folha: string
  baseDeCalculo: number
  liquido: number
  [key: string]: string | number | undefined
}

/**
 * Buscar trabalhos por tomador
 */
export const getTrabalhosPorTomador = async (
  tomador: string,
): Promise<TrabalhoTomador[]> => {
  try {
    const response: AxiosResponse<ApiResponse<TrabalhoTomador[]>> =
      await apiClient.get(`/trabalhos/tomador/${tomador}`)
    return response.data.data
  } catch (error) {
    console.error(`Erro ao buscar trabalhos do tomador ${tomador}:`, error)
    throw error
  }
}

/**
 * Buscar resumo mensal
 */
export const getResumoMensal = async (
  mes: string,
  ano: string,
): Promise<ResumoMensal> => {
  try {
    const response: AxiosResponse<ApiResponse<ResumoMensal>> =
      await apiClient.get(`/resumo/${mes}/${ano}`)
    return response.data.data
  } catch (error) {
    console.error(`Erro ao buscar resumo mensal ${mes}/${ano}:`, error)
    throw error
  }
}

// Tipo para resposta do upload de extrato
export interface UploadExtratoResponse {
  id: string
  status: 'success' | 'error' | 'processing'
  message?: string
  [key: string]: string | undefined
}

/**
 * Upload de extrato PDF
 */
export const uploadExtratoPDF = async (
  formData: FormData,
): Promise<ApiResponse<UploadExtratoResponse>> => {
  try {
    const response: AxiosResponse<ApiResponse<UploadExtratoResponse>> =
      await apiClient.post('/analitico', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    return response.data
  } catch (error) {
    console.error('Erro ao fazer upload do extrato:', error)
    throw error
  }
}

/**
 * Obter análise de tomadores
 */
export const getAnaliseTomadores = async (
  extratos: ExtratoResumo[],
): Promise<TomadorAnalise[]> => {
  try {
    const response: AxiosResponse<ApiResponse<TomadorAnalise[]>> =
      await apiClient.get('/analise/tomadores', {
        params: {
          extratoIds: extratos.map((e) => e.id).join(','),
        },
      })
    return response.data.data
  } catch (error) {
    console.error('Erro ao obter análise de tomadores:', error)

    // Fallback para processamento no frontend se a API falhar
    return processAnaliseTomadoresFallback(extratos)
  }
}

// Tipo para os dados de salary breakdown
export interface SalaryBreakdownItem {
  name: string
  value: number
  total?: number
  [key: string]: string | number | undefined
}

/**
 * Função para obter os dados de salário bruto (distribuição)
 */
export const getSalaryBreakdown = async (
  filtros?: DashboardFiltros,
): Promise<SalaryBreakdownItem[]> => {
  try {
    const response: AxiosResponse<ApiResponse<SalaryBreakdownItem[]>> =
      await apiClient.get('/analise/salario-breakdown', {
        params: filtros,
      })
    return response.data.data
  } catch (error) {
    console.error('Erro ao buscar dados de distribuição salarial:', error)
    throw error
  }
}

// Tipo para distribuição de turnos
export interface ShiftDistributionItem {
  name: string
  value: number
  total?: number
  [key: string]: string | number | undefined
}

/**
 * Função para obter distribuição de turnos
 */
export const getShiftDistribution = async (
  filtros?: DashboardFiltros,
): Promise<ShiftDistributionItem[]> => {
  try {
    const response: AxiosResponse<ApiResponse<ShiftDistributionItem[]>> =
      await apiClient.get('/analise/turnos', {
        params: filtros,
      })
    return response.data.data
  } catch (error) {
    console.error('Erro ao buscar distribuição de turnos:', error)
    throw error
  }
}

// Tipo para distribuição semanal
export interface WeeklyWorkItem {
  week: string
  [key: string]: string | number
}

/**
 * Função para obter distribuição semanal de trabalhos
 */
export const getWeeklyWorkDistribution = async (
  filtros?: DashboardFiltros,
): Promise<WeeklyWorkItem[]> => {
  try {
    const response: AxiosResponse<ApiResponse<WeeklyWorkItem[]>> =
      await apiClient.get('/analise/trabalhos-semanais', {
        params: filtros,
      })
    return response.data.data
  } catch (error) {
    console.error('Erro ao buscar distribuição semanal de trabalhos:', error)
    throw error
  }
}

// Tipo para top jobs
export interface TopJobItem {
  name: string
  value: number
  [key: string]: string | number | undefined
}

/**
 * Função para obter top trabalhos (fainas)
 */
export const getTopJobs = async (
  filtros?: DashboardFiltros,
  limit: number = 10,
): Promise<TopJobItem[]> => {
  try {
    const response: AxiosResponse<ApiResponse<TopJobItem[]>> =
      await apiClient.get('/analise/top-trabalhos', {
        params: { ...filtros, limit },
      })
    return response.data.data
  } catch (error) {
    console.error('Erro ao buscar top trabalhos:', error)
    throw error
  }
}

// Tipo para dados de retornos
export interface ReturnsDataItem {
  name: string
  value: number
  [key: string]: string | number | undefined
}

/**
 * Função para obter dados de retornos (férias, 13º, FGTS)
 */
export const getReturnsData = async (
  filtros?: DashboardFiltros,
): Promise<ReturnsDataItem[]> => {
  try {
    const response: AxiosResponse<ApiResponse<ReturnsDataItem[]>> =
      await apiClient.get('/analise/retornos', {
        params: filtros,
      })
    return response.data.data
  } catch (error) {
    console.error('Erro ao buscar dados de retornos:', error)
    throw error
  }
}

// Tipo para resumo do dashboard
export interface DashboardSummaryData {
  totalFainas: number
  mediaFainasSemana: number
  diasTrabalhados: number
  mediaBrutoFaina: number
  mediaLiquidoFaina: number
  [key: string]: string | number | undefined
}

/**
 * Função para obter resumo completo do dashboard
 */
export const getDashboardSummary = async (
  filtros?: DashboardFiltros,
): Promise<DashboardSummaryData> => {
  try {
    const response: AxiosResponse<ApiResponse<DashboardSummaryData>> =
      await apiClient.get('/analise/dashboard-resumo', {
        params: filtros,
      })
    return response.data.data
  } catch (error) {
    console.error('Erro ao buscar resumo do dashboard:', error)
    throw error
  }
}

// Exportar cliente de API para uso em casos específicos
export default apiClient

/**
 * Função auxiliar para processar tomadores no frontend
 * caso a API falhe
 */
const processAnaliseTomadoresFallback = async (
  extratos: ExtratoResumo[],
): Promise<TomadorAnalise[]> => {
  const tomadores: Record<string, TomadorAnalise> = {}

  // Processar extratos para obter totais básicos por tomador
  for (const extrato of extratos) {
    try {
      const detalhes = await getExtratoById(extrato.id)

      detalhes.trabalhos.forEach((trabalho) => {
        const { tomador, baseDeCalculo } = trabalho

        if (!tomadores[tomador]) {
          tomadores[tomador] = {
            tomador,
            tomadorNome: trabalho.tomadorNome || tomador,
            totalTrabalhos: 0,
            valorTotal: 0,
          }
        }

        tomadores[tomador].totalTrabalhos += 1
        tomadores[tomador].valorTotal += baseDeCalculo
      })
    } catch (err) {
      console.error(`Erro ao processar detalhes do extrato ${extrato.id}:`, err)
    }
  }

  // Retornar como array ordenado
  return Object.values(tomadores).sort((a, b) => b.valorTotal - a.valorTotal)
}

// Tipo para distribuição por função
export interface FunctionDistributionItem {
  name: string
  code: string
  value: number
  totalValue: number
  [key: string]: string | number | undefined
}

/**
 * Função para obter distribuição por função
 */
export const getFunctionDistribution = async (
  filtros?: DashboardFiltros,
): Promise<FunctionDistributionItem[]> => {
  try {
    const response: AxiosResponse<ApiResponse<FunctionDistributionItem[]>> =
      await apiClient.get('/analise/funcoes', {
        params: filtros,
      })
    return response.data.data
  } catch (error) {
    console.error('Erro ao buscar distribuição por função:', error)
    throw error
  }
}
