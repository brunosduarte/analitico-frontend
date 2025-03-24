import { useQuery } from "@tanstack/react-query";
import { getExtratos, getResumoMensal, getAnaliseTomadores } from "@/lib/api";
import { ExtratoResumo, CategoriaTotais, MesAnoOptions } from "@/types";
import { useExtratoPeriodos } from "./use-extratos";

// Hook para obter dados do resumo mensal
export function useResumoMensal(mes: string, ano: string) {
  return useQuery({
    queryKey: ["resumoMensal", mes, ano],
    queryFn: () => getResumoMensal(mes, ano),
    enabled: !!mes && !!ano // Só executa se mês e ano forem válidos
  });
}

// Hook para obter análise de dados para dashboard
export function useDashboardData(mes?: string, ano?: string) {
  // Buscar todos os extratos para análise
  const { data: extratos = [], isLoading } = useQuery<ExtratoResumo[], Error>({
    queryKey: ["extratos", { mes, ano }],
    queryFn: () => getExtratos({ mes, ano }),
  });
  
  // Obter períodos disponíveis
  const periodos = useExtratoPeriodos(extratos);
  
  // Calcular totais por categoria
  const categoriasTotais = extratos.reduce((acc: CategoriaTotais[], extrato) => {
    // Verificar se já temos esta categoria
    const existente = acc.find(item => item.categoria === extrato.categoria);
    
    if (existente) {
      existente.count += 1;
      existente.valorTotal += extrato.valorTotal;
    } else {
      acc.push({
        categoria: extrato.categoria,
        count: 1,
        valorTotal: extrato.valorTotal
      });
    }
    
    return acc;
  }, []);
  
  // Calcular comparativos mensais
  const mensaisTotais = extratos.reduce((acc: Record<string, number>, extrato) => {
    const key = `${extrato.mes}-${extrato.ano}`;
    
    if (!acc[key]) {
      acc[key] = 0;
    }
    
    acc[key] += extrato.valorTotal;
    
    return acc;
  }, {});
  
  // Converter para array para gráficos
  const mensaisData = Object.entries(mensaisTotais).map(([key, valor]) => {
    const [mes, ano] = key.split('-');
    return {
      periodo: `${mes}/${ano}`,
      valor
    };
  });
  
  // Obter análise de tomadores usando o hook específico
  const tomadoresAnalytics = useQuery({
    queryKey: ["tomadoresAnalise", extratos],
    queryFn: () => getAnaliseTomadores(extratos),
    enabled: extratos.length > 0
  });
  
  return {
    isLoading,
    extratos,
    periodos,
    categoriasTotais,
    mensaisData,
    tomadoresAnalytics: tomadoresAnalytics.data || []
  };
}