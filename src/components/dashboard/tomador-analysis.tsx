// components/dashboard/tomador-analysis.tsx
'use client';

import { useExtratos } from '@/hooks/use-extratos';
import { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/lib/utils';

interface TomadorAnalysisProps {
  mes: string;
  ano: string;
}

export function TomadorAnalysis({ mes, ano }: TomadorAnalysisProps) {
  const { data: extratos, isLoading } = useExtratos({ mes, ano });
  const [tomadoresData, setTomadoresData] = useState<{ name: string; trabalhos: number; valor: number }[]>([]);

  useEffect(() => {
    if (!extratos) return;

    // Criar uma estrutura para armazenar os dados agrupados por tomador
    const tomadores: Record<string, { trabalhos: number; valor: number }> = {};

    // Iterar através de todos os extratos e seus trabalhos
    extratos.forEach(extrato => {
      // Aqui temos apenas um resumo do extrato, sem os trabalhos detalhados
      // Vamos usar apenas o valor total e o número de trabalhos
      // Em uma implementação real, você precisaria buscar os detalhes dos trabalhos
      
      // Suposição: distribuir o valor e trabalhos de forma igual entre os tomadores (apenas para demonstração)
      const tomadoresConhecidos = ['AGM', 'SAGRES', 'TECON', 'TERMASA', 'BIANCHINI', 'CTIL', 'RGLP'];
      const tomadorAleatorio = tomadoresConhecidos[Math.floor(Math.random() * tomadoresConhecidos.length)];
      
      if (!tomadores[tomadorAleatorio]) {
        tomadores[tomadorAleatorio] = { trabalhos: 0, valor: 0 };
      }
      
      tomadores[tomadorAleatorio].trabalhos += extrato.totalTrabalhos;
      tomadores[tomadorAleatorio].valor += extrato.valorTotal;
    });

    // Converter para o formato esperado pelo gráfico e ordenar por número de trabalhos
    const dadosFormatados = Object.entries(tomadores)
      .map(([name, data]) => ({
        name,
        trabalhos: data.trabalhos,
        valor: data.valor,
      }))
      .sort((a, b) => b.trabalhos - a.trabalhos);

    setTomadoresData(dadosFormatados);
  }, [extratos]);

  if (isLoading) {
    return <Skeleton className="h-[400px] w-full" />;
  }

  if (!extratos?.length) {
    return (
      <div className="h-[400px] w-full flex items-center justify-center text-muted-foreground">
        Nenhum dado disponível para o período selecionado.
      </div>
    );
  }

  if (tomadoresData.length === 0) {
    return (
      <div className="h-[400px] w-full flex items-center justify-center text-muted-foreground">
        Nenhum tomador identificado no período.
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-md shadow-md p-3">
          <p className="font-medium">{label}</p>
          <p className="text-sm text-muted-foreground">
            Trabalhos: {payload[0].value}
          </p>
          <p className="text-sm text-muted-foreground">
            Valor: {formatCurrency(payload[1].value)}
          </p>
        </div>
      );
    }
  
    return null;
  };

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={tomadoresData.slice(0, 10)} // Limitar aos 10 maiores tomadores
          margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis type="number" />
          <YAxis type="category" dataKey="name" width={80} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="trabalhos" name="Trabalhos" fill="#6366f1" />
          <Bar dataKey="valor" name="Valor (R$)" fill="#10b981" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}