// components/dashboard/summary-cards.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ResumoMensal } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  BanknoteIcon, 
  BarChartIcon, 
  CircleDollarSignIcon, 
  UsersIcon 
} from 'lucide-react';

interface SummaryCardsProps {
  resumoMensal?: ResumoMensal;
  mes: string;
  ano: string;
}

export function SummaryCards({ resumoMensal, mes, ano }: SummaryCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
          <BarChartIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {resumoMensal ? (
            <>
              <div className="text-2xl font-bold">
                {formatCurrency(resumoMensal.totalLiquido)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Valor líquido pago em {mes}/{ano}
              </p>
            </>
          ) : (
            <>
              <Skeleton className="h-8 w-3/4 mb-2" />
              <Skeleton className="h-3 w-1/2" />
            </>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Base de Cálculo</CardTitle>
          <CircleDollarSignIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {resumoMensal ? (
            <>
              <div className="text-2xl font-bold">
                {formatCurrency(resumoMensal.totalBaseCalculo)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Base de cálculo total do período
              </p>
            </>
          ) : (
            <>
              <Skeleton className="h-8 w-3/4 mb-2" />
              <Skeleton className="h-3 w-1/2" />
            </>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Trabalhos</CardTitle>
          <BanknoteIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {resumoMensal ? (
            <>
              <div className="text-2xl font-bold">
                {resumoMensal.totalTrabalhos.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Total de trabalhos realizados
              </p>
            </>
          ) : (
            <>
              <Skeleton className="h-8 w-3/4 mb-2" />
              <Skeleton className="h-3 w-1/2" />
            </>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Trabalhadores</CardTitle>
          <UsersIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {resumoMensal ? (
            <>
              <div className="text-2xl font-bold">
                {resumoMensal.totalTrabalhadores.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Trabalhadores com registros no período
              </p>
            </>
          ) : (
            <>
              <Skeleton className="h-8 w-3/4 mb-2" />
              <Skeleton className="h-3 w-1/2" />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}