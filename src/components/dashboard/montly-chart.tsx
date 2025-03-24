// components/dashboard/monthly-chart.tsx
'use client';

import { useExtratos } from '@/hooks/use-extratos';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { formatCurrency } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface MonthlyChartProps {
  ano: string;
}

const MESES_ORDEM = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
const MESES_NOME = {
  'JAN': 'Jan',
  'FEV': 'Fev',
  'MAR': 'Mar',
  'ABR': 'Abr',
  'MAI': 'Mai',
  'JUN': 'Jun',
  'JUL': 'Jul',
  'AGO': 'Ago',
  'SET': 'Set',
  'OUT': 'Out',
  'NOV': 'Nov',
  'DEZ': 'Dez'
};

export function MonthlyChart({ ano }: MonthlyChartProps) {
  const { data: extratos, isLoading } = useExtratos({ ano });

  // Se não temos dados, mostrar um skeleton
  if (isLoading) {
    return <Skeleton className="h-[400px] w-full" />;
  }

  if (!extratos?.length) {
    return (
      <div className="h-[400px] w-full flex items-center justify-center text-muted-foreground">
        Nenhum dado disponível para o ano selecionado.
      </div>
    );
  }

  // Agrupar dados por mês
  const dadosPorMes = MESES_ORDEM.map(mes => {
    const extratosMes = extratos.filter(e => e.mes === mes);
    const valorTotal = extratosMes.reduce((total, extrato) => total + extrato.valorTotal, 0);
    const totalTrabalhos = extratosMes.reduce((total, extrato) => total + extrato.totalTrabalhos, 0);
    
    return {
      nome: MESES_NOME[mes as keyof typeof MESES_NOME],
      valorTotal,
      totalTrabalhos,
    };
  }).filter(data => data.valorTotal > 0 || data.totalTrabalhos > 0);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-md shadow-md p-3">
          <p className="font-medium">{label}</p>
          <p className="text-sm text-muted-foreground">
            Valor Total: {formatCurrency(payload[0].value)}
          </p>
          <p className="text-sm text-muted-foreground">
            Trabalhos: {payload[1].value}
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
          data={dadosPorMes}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis dataKey="nome" />
          <YAxis yAxisId="left" orientation="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar 
            yAxisId="left" 
            dataKey="valorTotal" 
            name="Valor Total (R$)" 
            fill="#6366f1" 
            radius={[4, 4, 0, 0]}
          />
          <Bar 
            yAxisId="right" 
            dataKey="totalTrabalhos" 
            name="Número de Trabalhos" 
            fill="#10b981" 
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}