/**
 * Constantes utilizadas em toda a aplicação
 */

// Mapeamento de meses abreviados para nomes completos
export const MESES_NOME: Record<string, string> = {
  JAN: 'Janeiro',
  FEV: 'Fevereiro',
  MAR: 'Março',
  ABR: 'Abril',
  MAI: 'Maio',
  JUN: 'Junho',
  JUL: 'Julho',
  AGO: 'Agosto',
  SET: 'Setembro',
  OUT: 'Outubro',
  NOV: 'Novembro',
  DEZ: 'Dezembro',
}

// Mapeamento de meses abreviados para números
export const MESES_NUMERO: Record<string, string> = {
  JAN: '01',
  FEV: '02',
  MAR: '03',
  ABR: '04',
  MAI: '05',
  JUN: '06',
  JUL: '07',
  AGO: '08',
  SET: '09',
  OUT: '10',
  NOV: '11',
  DEZ: '12',
}

// Mapeamento de números para meses
export const NUMERO_MESES: Record<string, string> = {
  '01': 'Janeiro',
  '02': 'Fevereiro',
  '03': 'Março',
  '04': 'Abril',
  '05': 'Maio',
  '06': 'Junho',
  '07': 'Julho',
  '08': 'Agosto',
  '09': 'Setembro',
  '10': 'Outubro',
  '11': 'Novembro',
  '12': 'Dezembro',
}

// Ordem dos meses para ordenação
export const MESES_ORDEM = [
  'JAN',
  'FEV',
  'MAR',
  'ABR',
  'MAI',
  'JUN',
  'JUL',
  'AGO',
  'SET',
  'OUT',
  'NOV',
  'DEZ',
]

// Mapeamento de nomes curtos de meses
export const MESES_ABREV = {
  JAN: 'Jan',
  FEV: 'Fev',
  MAR: 'Mar',
  ABR: 'Abr',
  MAI: 'Mai',
  JUN: 'Jun',
  JUL: 'Jul',
  AGO: 'Ago',
  SET: 'Set',
  OUT: 'Out',
  NOV: 'Nov',
  DEZ: 'Dez',
}

// Mapeamento de categorias para cores
export const CATEGORIAS_CORES: Record<string, string> = {
  ESTIVADOR: 'blue',
  ARRUMADOR: 'orange',
  VIGIA: 'brown',
  CONFERENTE: 'gray',
}

// Limites para uploads
export const UPLOAD_LIMITS = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ACCEPTED_FORMATS: ['application/pdf'],
}

// Rotas da aplicação
export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  EXTRATOS: '/extratos',
  EXTRATO_DETAIL: (id: string) => `/extratos/${id}`,
  UPLOAD: '/upload',
}

// Configurações de API
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  TIMEOUT: 30000, // 30 segundos
  RETRY_ATTEMPTS: 3,
}

export const FUNCTION_NAMES: Record<string, string> = {
  '101': 'CM Geral',
  '103': 'CM Porão',
  '104': 'CM Conexo',
  '431': 'Motorista VL',
  '521': 'Operador PC',
  '527': 'Operador EH',
  '801': 'Soldado',
  '802': 'Sinaleiro',
  '803': 'Conexo',
}

export const FERIADOS_NACIONAIS_FIXOS = [
  '01/01', // Confraternização Universal
  '21/04', // Tiradentes
  '01/05', // Dia do Trabalho
  '07/09', // Independência
  '12/10', // Nossa Senhora Aparecida
  '02/11', // Finados
  '15/11', // Proclamação da República
  '20/11', // Consciência Negra
  '25/12', // Natal
]

export interface FeriadosAnuais {
  [ano: string]: string[]
}

export const FERIADOS_NACIONAIS_MOVEIS: FeriadosAnuais = {
  '2022': [
    '01/03', // Carnaval
    '15/04', // Sexta-feira Santa
    '17/04', // Páscoa
    '08/05', // Dia das Mães
    '16/06', // Corpus Christi
    '14/08', // Dia dos Pais
  ],
  '2023': ['21/02', '07/04', '09/04', '14/05', '08/06', '13/08'],
  '2024': ['13/02', '29/03', '31/03', '12/05', '30/05', '11/08'],
  '2025': ['04/03', '18/04', '20/04', '11/05', '19/06', '10/08'],
  '2026': ['17/02', '03/04', '05/04', '10/05', '04/06', '09/08'],
  '2027': ['09/02', '26/00', '28/03', '27/05', '09/05', '08/08'],
}

// Cores para gráficos
export const CHART_THEMES = {
  classic: [
    '#4046CA',
    '#0FB5AE',
    '#F68512',
    '#DE3D82',
    '#7E84FA',
    '#72E06A',
    '#147AF4',
    '#7327D3',
    '#E8C600',
    '#CB5E00',
    '#008F5D',
    '#BCE930',
  ],
  wheel: [
    '#F3E339',
    '#FDC434',
    '#F18C2F',
    '#E8602B',
    '#E22028',
    '#C40B7B',
    '#6C3C88',
    '#445096',
    '#2B73AC',
    '#1197B9',
    '#0F8E5D',
    '#8EBA3A',
  ],
  sepia: [
    '#7BBC9A',
    '#478DB8',
    '#E9BA5C',
    '#E46E53',
    '#9C71C6',
    '#6CBDDF',
    '#757595',
    '#B07C4F',
    '#A59F9C',
    '#B0D364',
    '#9D5373',
    '#DF7172',
  ],
  vivid: [
    '#2563eb', // blue-600
    '#10b981', // emerald-500
    '#8b5cf6', // violet-500
    '#f59e0b', // amber-500
    '#ef4444', // red-500
    '#06b6d4', // cyan-500
    '#ec4899', // pink-500
    '#6366f1', // indigo-500
    '#14b8a6', // teal-500
    '#84cc16', // lime-500
    '#0ea5e9', // sky-500
    '#f97316', // orange-500
  ],
}

// Default color scheme for backwards compatibility
export const CHART_COLORS = CHART_THEMES.classic
