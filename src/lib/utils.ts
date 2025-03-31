import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { CATEGORIAS_CORES, CHART_COLORS, MESES_NOME } from './constants'

/**
 * Função para combinar classes do Tailwind
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Função para formatar data
 */
export function formatDate(
  dateString: string,
  options?: Intl.DateTimeFormatOptions,
) {
  try {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('pt-BR', options).format(date)
  } catch (error) {
    console.error('Error formatting date:', error)
    return dateString
  }
}

/**
 * Formatação de valores monetários
 */
export function formatCurrency(value: number) {
  if (value === null || value === undefined) return 'R$ 0,00'

  try {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  } catch (error) {
    console.error('Error formatting currency:', error)
    return `R$ ${value.toFixed(2).replace('.', ',')}`
  }
}

/**
 * Função para obter a cor da categoria
 */
export function getCategoryColor(categoria: string) {
  return CATEGORIAS_CORES[categoria] || 'gray'
}

/**
 * Função para obter nome do mês a partir da abreviação
 */
export function getMonthName(monthAbbr: string) {
  return MESES_NOME[monthAbbr] || monthAbbr
}

/**
 * Função para gerar cores para gráficos
 */
export function generateChartColors(count: number) {
  if (count <= CHART_COLORS.length) {
    return CHART_COLORS.slice(0, count)
  }

  // Se precisarmos de mais cores, gerar cores adicionais
  const colors = [...CHART_COLORS]

  for (let i = CHART_COLORS.length; i < count; i++) {
    const hue = (i * 137) % 360 // Distribuição uniforme de cores
    colors.push(`hsl(${hue}, 55%, 55%)`)
  }

  return colors
}

/**
 * Funções para facilitar o agrupamento e análise de dados
 */
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce(
    (result, item) => {
      const groupKey = String(item[key])
      if (!result[groupKey]) {
        result[groupKey] = []
      }
      result[groupKey].push(item)
      return result
    },
    {} as Record<string, T[]>,
  )
}

/**
 * Função para ordenar por propriedade
 */
export function sortBy<T>(
  array: T[],
  key: keyof T,
  direction: 'asc' | 'desc' = 'asc',
): T[] {
  return [...array].sort((a, b) => {
    if (a[key] === b[key]) return 0

    const valueA = a[key]
    const valueB = b[key]

    // Ordenação para strings
    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return direction === 'asc'
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA)
    }

    // Ordenação para números
    if (typeof valueA === 'number' && typeof valueB === 'number') {
      return direction === 'asc' ? valueA - valueB : valueB - valueA
    }

    // Caso default
    return direction === 'asc'
      ? String(valueA).localeCompare(String(valueB))
      : String(valueB).localeCompare(String(valueA))
  })
}

/**
 * Função para gerar nome de arquivo formatado
 */
export function formatFileName(name: string, extension: string) {
  const now = new Date()
  const timestamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`
  const safeName = name.replace(/[^a-z0-9]/gi, '_').toLowerCase()

  return `${safeName}_${timestamp}.${extension}`
}

/**
 * Função para truncar texto com reticências
 */
export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text
  return `${text.slice(0, maxLength)}...`
}

/**
 * Função para validar arquivo PDF antes do upload
 */
export function validatePdfFile(file: File): {
  valid: boolean
  message?: string
} {
  // Verifica o tipo do arquivo
  if (file.type !== 'application/pdf') {
    return { valid: false, message: 'Apenas arquivos PDF são permitidos.' }
  }

  // Verifica o tamanho do arquivo (10MB)
  if (file.size > 10 * 1024 * 1024) {
    return { valid: false, message: 'O arquivo não pode ser maior que 10MB.' }
  }

  return { valid: true }
}

/**
 * Função para debounce de função
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout

  return function (...args: Parameters<T>) {
    clearTimeout(timeout)
    timeout = setTimeout(() => fn(...args), delay)
  }
}

/**
 * Função para cálculos comuns de percentuais
 */
export function calculatePercentage(value: number, total: number): string {
  if (!total) return '0%'
  return `${((value / total) * 100).toFixed(1)}%`
}

/**
 * Formata um número com separador de milhares
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('pt-BR').format(num)
}
