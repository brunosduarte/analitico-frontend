// components/dashboard/category-distribution.tsx
'use client';

import { useExtratos } from '@/hooks/use-extratos';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

interface CategoryDistributionProps {
  mes: string;
  ano: string;
}

export function CategoryDistribution({ mes, ano }: CategoryDistributionProps) {
  const { data: extratos, isLoading } = useExtratos({ mes, ano });

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

  // Agrupar trabalhos por categoria
  const categorias = extratos.reduce<Record<string, number>>((acc, extrato) => {
    if (!acc[extrato.categoria]) {
      acc[extrato.categoria] = 0;
    }
    acc[extrato.categoria] += extrato.totalTrabalhos;
    return acc;
  }, {});

  const data = Object.entries(categorias).map(([name, value]) => ({
    name,
    value,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-md shadow-md p-3">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-sm text-muted-foreground">
            Trabalhos: {payload[0].value}
          </p>
          <p className="text-sm text-muted-foreground">
            ({((payload[0].value / total) * 100).toFixed(1)}%)
          </p>
        </div>
      );
    }
  
    return null;
  };

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={150}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}