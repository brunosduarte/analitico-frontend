import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Função para combinar classes do Tailwind
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Função para formatar data
export function formatDate(dateString: string) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("pt-BR").format(date);
}

// Formatação de valores monetários
export function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

// Função para obter a cor da categoria
export function getCategoryColor(categoria: string) {
  const categorias: Record<string, string> = {
    "ESTIVADOR": "blue",
    "ARRUMADOR": "green",
    "VIGIA": "purple",
    "CONFERENTE": "amber"
  };
  
  return categorias[categoria] || "gray";
}

// Função para obter nome do mês a partir da abreviação
export function getMonthName(monthAbbr: string) {
  const months: Record<string, string> = {
    "JAN": "Janeiro",
    "FEV": "Fevereiro",
    "MAR": "Março",
    "ABR": "Abril",
    "MAI": "Maio",
    "JUN": "Junho",
    "JUL": "Julho",
    "AGO": "Agosto",
    "SET": "Setembro",
    "OUT": "Outubro",
    "NOV": "Novembro",
    "DEZ": "Dezembro"
  };
  
  return months[monthAbbr] || monthAbbr;
}

// Função para gerar cores para gráficos
export function generateChartColors(count: number) {
  const baseColors = [
    "hsl(214, 60%, 60%)",
    "hsl(162, 48%, 50%)",
    "hsl(291, 48%, 60%)",
    "hsl(45, 70%, 50%)",
    "hsl(0, 65%, 60%)",
    "hsl(180, 50%, 50%)",
    "hsl(270, 50%, 60%)",
    "hsl(30, 70%, 50%)",
    "hsl(120, 40%, 55%)",
    "hsl(330, 60%, 55%)"
  ];
  
  if (count <= baseColors.length) {
    return baseColors.slice(0, count);
  }
  
  // Se precisarmos de mais cores, gerar cores adicionais
  const colors = [...baseColors];
  
  for (let i = baseColors.length; i < count; i++) {
    const hue = (i * 137) % 360; // Distribuição uniforme de cores
    colors.push(`hsl(${hue}, 55%, 55%)`);
  }
  
  return colors;
}

// Funções para facilitar o agrupamento e análise de dados
export function groupBy<T>(array: T[], key: keyof T) {
  return array.reduce((result, item) => {
    const groupKey = String(item[key]);
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {} as Record<string, T[]>);
}

// Função para gerar nome de arquivo formatado
export function formatFileName(name: string, extension: string) {
  const now = new Date();
  const timestamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;
  const safeName = name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  
  return `${safeName}_${timestamp}.${extension}`;
}