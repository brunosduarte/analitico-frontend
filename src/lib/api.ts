/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { Extrato, ExtratoResumo, ResumoMensal, TomadorAnalise } from '@/types';

// Criando uma instância do axios com configurações base
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interface para filtros de busca
export interface ExtratoFiltros {
  matricula?: string;
  nome?: string;
  mes?: string;
  ano?: string;
  categoria?: string;
  tomador?: string;
}

// Funções de API para interação com o backend

// Buscar lista de extratos com filtros opcionais
export const getExtratos = async (filtros?: ExtratoFiltros): Promise<ExtratoResumo[]> => {
  try {
    const params = { ...filtros };
    const response = await api.get('/analitico', { params });
    return response.data.data;
  } catch (error) {
    console.error('Erro ao buscar extratos:', error);
    throw error;
  }
};

// Buscar um extrato específico por ID
export const getExtratoById = async (id: string): Promise<Extrato> => {
  try {
    const response = await api.get(`/analitico/${id}`);
    return response.data.data;
  } catch (error) {
    console.error(`Erro ao buscar extrato ID ${id}:`, error);
    throw error;
  }
};

// Buscar trabalhos por tomador
export const getTrabalhosPorTomador = async (tomador: string): Promise<any[]> => {
  try {
    const response = await api.get(`/trabalhos/tomador/${tomador}`);
    return response.data.data;
  } catch (error) {
    console.error(`Erro ao buscar trabalhos do tomador ${tomador}:`, error);
    throw error;
  }
};

// Buscar resumo mensal
export const getResumoMensal = async (mes: string, ano: string): Promise<ResumoMensal> => {
  try {
    const response = await api.get(`/resumo/${mes}/${ano}`);
    return response.data.data;
  } catch (error) {
    console.error(`Erro ao buscar resumo mensal ${mes}/${ano}:`, error);
    throw error;
  }
};

// Upload de extrato PDF
export const uploadExtratoPDF = async (formData: FormData): Promise<any> => {
  try {
    const response = await api.post('/analitico', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao fazer upload do extrato:', error);
    throw error;
  }
};

// Obter análise de tomadores (esta é uma função de frontend que processa os dados)
export const getAnaliseTomadores = async (extratos: ExtratoResumo[]): Promise<TomadorAnalise[]> => {
  // Para uma análise completa, precisaríamos buscar os dados detalhados de cada extrato
  // Aqui estamos simulando com base nos dados disponíveis
  const tomadores: Record<string, TomadorAnalise> = {};

  // Buscar dados detalhados de cada extrato para análise
  await Promise.all(
    extratos.map(async (extratoResumo) => {
      try {
        const detalhes = await getExtratoById(extratoResumo.id);
        
        // Analisar trabalhos por tomador
        detalhes.trabalhos.forEach(trabalho => {
          const { tomador, liquido } = trabalho;
          
          if (!tomadores[tomador]) {
            tomadores[tomador] = {
              tomador,
              tomadorNome: trabalho.tomadorNome || tomador,
              totalTrabalhos: 0,
              valorTotal: 0
            };
          }
          
          tomadores[tomador].totalTrabalhos += 1;
          tomadores[tomador].valorTotal += liquido;
        });
      } catch (error) {
        console.error(`Erro ao processar extrato ${extratoResumo.id}:`, error);
      }
    })
  );

  // Converter para array e ordenar por valor total
  return Object.values(tomadores).sort((a, b) => b.valorTotal - a.valorTotal);
};

export default api;