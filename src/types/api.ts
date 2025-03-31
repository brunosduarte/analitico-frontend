/**
 * Tipos relacionados às APIs e chamadas de servidor
 */
import { Extrato, ExtratoResumo, ResumoMensal, TomadorAnalise } from './index'

// Tipo para resposta padrão da API
export type ApiResponse<T> = {
  success: boolean
  data: T
  message?: string
  errors?: Record<string, string[]>
}

// Interfaces para filtros de busca
export interface ExtratoFiltros {
  matricula?: string
  nome?: string
  mes?: string
  ano?: string
  categoria?: string
  tomador?: string
  dataInicio?: string
  dataFim?: string
  page?: number
  limit?: number
  sort?: string
}

// Interface para filtros de dashboard
export interface DashboardFiltros {
  mes?: string
  ano?: string
  dataInicio?: string
  dataFim?: string
  categoria?: string
}

// Endpoints das APIs
export interface ApiEndpoints {
  getExtratos: (filtros?: ExtratoFiltros) => Promise<ExtratoResumo[]>
  getExtratoById: (id: string) => Promise<Extrato>
  getTrabalhosPorTomador: (tomador: string) => Promise<any[]>
  getResumoMensal: (mes: string, ano: string) => Promise<ResumoMensal>
  uploadExtratoPDF: (formData: FormData) => Promise<any>
  getAnaliseTomadores: (extratos: ExtratoResumo[]) => Promise<TomadorAnalise[]>
  getSalaryBreakdown: (filtros?: DashboardFiltros) => Promise<any>
  getShiftDistribution: (filtros?: DashboardFiltros) => Promise<any>
  getWeeklyWorkDistribution: (filtros?: DashboardFiltros) => Promise<any>
  getTopJobs: (filtros?: DashboardFiltros, limit?: number) => Promise<any>
  getReturnsData: (filtros?: DashboardFiltros) => Promise<any>
  getDashboardSummary: (filtros?: DashboardFiltros) => Promise<any>
}

// Interface para resposta de upload
export interface UploadResponse {
  id: string
  nome: string
  matricula: string
  mes: string
  ano: string
  categoria: string
  status: 'success' | 'error' | 'processing'
  message?: string
}

// Estende FormData para tipar melhor o upload
export interface ExtratoFormData extends FormData {
  append(name: 'arquivo', value: File | Blob, fileName?: string): void
  append(name: string, value: string | Blob): void
}
