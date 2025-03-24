// Definindo os tipos baseados no backend

export type ResumoExtrato = {
  baseDeCalculo: number;
  inss: number;
  impostoDeRenda: number;
  descontoJudicial: number;
  das: number;
  mensal: number;
  impostoSindical: number;
  descontosEpiCracha: number;
  liquido: number;
  ferias: number;
  decimoTerceiro: number;
  encargosDecimo: number;
  fgts: number;
};

export type Trabalho = {
  dia: string;
  folha: string;
  tomador: string;
  tomadorNome?: string;
  pasta: string;
  fun: string;
  tur: string;
  ter: string;
  pagto: string;
  baseDeCalculo: number;
  inss: number;
  impostoDeRenda: number;
  descontoJudicial: number;
  das: number;
  mensal: number;
  impostoSindical: number;
  descontosEpiCracha: number;
  liquido: number;
  ferias: number;
  decimoTerceiro: number;
  encargosDecimo: number;
  fgts: number;
};

export type Extrato = {
  id?: string;
  matricula: string;
  nome: string;
  mes: string;
  ano: string;
  categoria: string;
  trabalhos: Trabalho[];
  folhasComplementos: ResumoExtrato;
  revisadas: ResumoExtrato;
};

export type ExtratoResumo = {
  id: string;
  matricula: string;
  nome: string;
  mes: string;
  ano: string;
  categoria: string;
  totalTrabalhos: number;
  valorTotal: number;
};

export type ResumoMensal = {
  _id: {
    mes: string;
    ano: string;
  };
  totalBaseCalculo: number;
  totalLiquido: number;
  totalFGTS: number;
  totalTrabalhos: number;
  totalTrabalhadores: number;
};

export type TomadorAnalise = {
  tomador: string;
  tomadorNome?: string;
  totalTrabalhos: number;
  valorTotal: number;
};

export type CategoriaTotais = {
  categoria: string;
  count: number;
  valorTotal: number;
};

export type MesAnoOptions = {
  mes: string;
  ano: string;
  label: string;
};

// Função utilitária para converter mês de abreviação para número
export const mesParaNumero = (mes: string): string => {
  const meses: { [key: string]: string } = {
    'JAN': '01',
    'FEV': '02',
    'MAR': '03',
    'ABR': '04',
    'MAI': '05',
    'JUN': '06',
    'JUL': '07',
    'AGO': '08',
    'SET': '09',
    'OUT': '10',
    'NOV': '11',
    'DEZ': '12'
  };
  return meses[mes] || '01';
};

// Função utilitária para converter número para nome do mês
export const numeroParaMes = (numero: string): string => {
  const meses: { [key: string]: string } = {
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
    '12': 'Dezembro'
  };
  return meses[numero] || 'Janeiro';
};

// Função para formatar valor monetário
export const formatarMoeda = (valor: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor);
};