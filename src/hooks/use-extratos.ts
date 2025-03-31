import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getExtratos,
  getExtratoById,
  uploadExtratoPDF,
  getAnaliseTomadores,
} from '@/lib/api'
import { Extrato, ExtratoResumo, MesAnoOptions } from '@/types'
import { ExtratoFiltros } from '@/types/api'
import { MESES_ORDEM } from '@/lib/constants'

/**
 * Hook para buscar lista de extratos com filtros opcionais
 */
export function useExtratos(filtros?: ExtratoFiltros) {
  return useQuery<ExtratoResumo[], Error>({
    queryKey: ['extratos', filtros],
    queryFn: () => getExtratos(filtros),
  })
}

/**
 * Hook para buscar um extrato específico por ID
 */
export function useExtrato(id: string) {
  return useQuery<Extrato, Error>({
    queryKey: ['extrato', id],
    queryFn: () => getExtratoById(id),
    enabled: !!id, // Só executa se ID for válido
  })
}

/**
 * Hook para fazer upload de extratos em PDF
 */
export function useUploadExtrato() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (formData: FormData) => uploadExtratoPDF(formData),
    onSuccess: () => {
      // Invalidar cache de extratos para forçar nova busca
      queryClient.invalidateQueries({ queryKey: ['extratos'] })
    },
  })
}

/**
 * Hook para obter análise de tomadores
 */
export function useAnaliseTomadores(extratos: ExtratoResumo[]) {
  return useQuery({
    queryKey: ['tomadores-analise', extratos.map((e) => e.id)],
    queryFn: () => getAnaliseTomadores(extratos),
    enabled: extratos.length > 0,
  })
}

/**
 * Hook para obter valores únicos de mês/ano para filtros
 */
export function useExtratoPeriodos(extratos: ExtratoResumo[]) {
  // Extrair mês/ano únicos dos extratos
  const periodos = extratos.reduce((acc, extrato) => {
    if (!acc.some((p) => p.mes === extrato.mes && p.ano === extrato.ano)) {
      acc.push({
        mes: extrato.mes,
        ano: extrato.ano,
        label: `${extrato.mes}/${extrato.ano}`,
      })
    }

    return acc
  }, [] as MesAnoOptions[])

  // Ordenar por ano e mês
  return periodos.sort((a, b) => {
    if (a.ano !== b.ano) {
      return a.ano.localeCompare(b.ano)
    }

    // Usar o índice no array MESES_ORDEM para ordenação
    const indexA = MESES_ORDEM.indexOf(a.mes)
    const indexB = MESES_ORDEM.indexOf(b.mes)
    return indexA - indexB
  })
}

/**
 * Hook para obter categorias únicas para filtros
 */
export function useExtratoCategorias(extratos: ExtratoResumo[]) {
  // Extrair categorias únicas
  return Array.from(
    new Set(extratos.map((extrato) => extrato.categoria)),
  ).sort()
}

/**
 * Hook que combina os dados de extratos com seus períodos e categorias
 */
export function useExtratosComFiltros(filtros?: ExtratoFiltros) {
  const { data: extratos = [], isLoading, error } = useExtratos(filtros)
  const periodos = useExtratoPeriodos(extratos)
  const categorias = useExtratoCategorias(extratos)

  return {
    extratos,
    periodos,
    categorias,
    isLoading,
    error,
  }
}
