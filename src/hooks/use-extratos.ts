import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getExtratos, getExtratoById, uploadExtratoPDF, ExtratoFiltros } from "@/lib/api";
import { Extrato, ExtratoResumo } from "@/types";

// Hook para buscar lista de extratos com filtros opcionais
export function useExtratos(filtros?: ExtratoFiltros) {
  return useQuery<ExtratoResumo[], Error>({
    queryKey: ["extratos", filtros],
    queryFn: () => getExtratos(filtros),
  });
}

// Hook para buscar um extrato específico por ID
export function useExtrato(id: string) {
  return useQuery<Extrato, Error>({
    queryKey: ["extrato", id],
    queryFn: () => getExtratoById(id),
    enabled: !!id, // Só executa se ID for válido
  });
}

// Hook para fazer upload de extratos em PDF
export function useUploadExtrato() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => uploadExtratoPDF(formData),
    onSuccess: () => {
      // Invalidar cache de extratos para forçar nova busca
      queryClient.invalidateQueries({ queryKey: ["extratos"] });
    },
  });
}

// Hook para obter valores únicos de mês/ano para filtros
export function useExtratoPeriodos(extratos: ExtratoResumo[]) {
  // Extrair mês/ano únicos dos extratos
  const periodos = extratos.reduce((acc, extrato) => {
    const key = `${extrato.mes}-${extrato.ano}`;
    
    if (!acc.some(p => p.mes === extrato.mes && p.ano === extrato.ano)) {
      acc.push({
        mes: extrato.mes,
        ano: extrato.ano,
        label: `${extrato.mes}/${extrato.ano}`
      });
    }
    
    return acc;
  }, [] as { mes: string; ano: string; label: string }[]);
  
  // Ordenar por ano e mês
  return periodos.sort((a, b) => {
    if (a.ano !== b.ano) {
      return a.ano.localeCompare(b.ano);
    }
    
    // Mapeamento de abreviações de meses para valores numéricos para ordenação
    const mesesOrdem: Record<string, number> = {
      'JAN': 1, 'FEV': 2, 'MAR': 3, 'ABR': 4, 'MAI': 5, 'JUN': 6,
      'JUL': 7, 'AGO': 8, 'SET': 9, 'OUT': 10, 'NOV': 11, 'DEZ': 12
    };
    
    return mesesOrdem[a.mes] - mesesOrdem[b.mes];
  });
}

// Hook para obter categorias únicas para filtros
export function useExtratoCategorias(extratos: ExtratoResumo[]) {
  // Extrair categorias únicas
  return Array.from(new Set(extratos.map(extrato => extrato.categoria))).sort();
}