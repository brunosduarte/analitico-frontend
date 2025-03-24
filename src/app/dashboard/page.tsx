"use client";

import { useState } from "react";
import { useDashboardData } from "@/hooks/use-dashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, generateChartColors, getMonthName } from "@/lib/utils";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  AreaChart,
  Area
} from "recharts";
import { TrendingUp, TrendingDown, Users, Briefcase, Building, CreditCard, Activity, FileText } from "lucide-react";

export default function DashboardPage() {
  const [periodo, setPeriodo] = useState<string>("");
  
  // Extrair mês e ano do período selecionado
  let mesSelecionado: string | undefined;
  let anoSelecionado: string | undefined;
  
  if (periodo) {
    const [mes, ano] = periodo.split('-');
    mesSelecionado = mes;
    anoSelecionado = ano;
  }
  
  // Buscar dados para o dashboard
  const { 
    isLoading, 
    extratos, 
    periodos, 
    categoriasTotais, 
    mensaisData, 
    tomadoresAnalytics 
  } = useDashboardData(mesSelecionado, anoSelecionado);
  
  // Calcular totais para cards
  const totalExtratos = extratos.length;
  const totalRendimentos = extratos.reduce((sum, extrato) => sum + extrato.valorTotal, 0);
  const mediaRendimentos = totalExtratos > 0 ? totalRendimentos / totalExtratos : 0;
  
  // Usando o método size diretamente no Set em vez do operador spread
  const matriculasSet = new Set(extratos.map(e => e.matricula));
  const totalTrabalhadores = matriculasSet.size;
  
  // Cores para gráficos
  const COLORS = ['var(--color-1)', 'var(--color-2)', 'var(--color-3)', 'var(--color-4)', 'var(--color-5)'];
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Visualização analítica dos dados de extratos portuários
          </p>
        </div>
        
        <div className="w-full md:w-64">
          <Select
            value={periodo || "all"}
            onValueChange={setPeriodo}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione um período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os períodos</SelectItem>
              {periodos.map((p) => (
                <SelectItem key={`${p.mes}-${p.ano}`} value={`${p.mes}-${p.ano}`}>
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Cards de resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard 
          title="Total de Extratos" 
          value={isLoading ? undefined : totalExtratos.toString()}
          description="Quantidade total de extratos"
          icon={<FileText className="h-5 w-5" />}
          trend="up"
        />
        
        <DashboardCard 
          title="Rendimentos Totais" 
          value={isLoading ? undefined : formatCurrency(totalRendimentos)}
          description="Soma de todos os rendimentos"
          icon={<CreditCard className="h-5 w-5" />}
          trend="up"
        />
        
        <DashboardCard 
          title="Média por Extrato" 
          value={isLoading ? undefined : formatCurrency(mediaRendimentos)}
          description="Valor médio por extrato"
          icon={<Activity className="h-5 w-5" />}
          trend="neutral"
        />
        
        <DashboardCard 
          title="Trabalhadores" 
          value={isLoading ? undefined : totalTrabalhadores.toString()}
          description="Número de trabalhadores distintos"
          icon={<Users className="h-5 w-5" />}
          trend="neutral"
        />
      </div>
      
      <Tabs defaultValue="geral">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="geral">Visão Geral</TabsTrigger>
          <TabsTrigger value="categorias">Por Categoria</TabsTrigger>
          <TabsTrigger value="tomadores">Por Tomador</TabsTrigger>
        </TabsList>
        
        <TabsContent value="geral" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Evolução Mensal de Rendimentos</CardTitle>
                <CardDescription>
                  Valores totais por período
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                {isLoading ? (
                  <Skeleton className="w-full h-full" />
                ) : mensaisData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={mensaisData}
                      margin={{ top: 10, right: 30, left: 20, bottom: 40 }}
                    >
                      <defs>
                        <linearGradient id="colorRendimentos" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--color-1)" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="var(--color-1)" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis 
                        dataKey="periodo" 
                        tick={{ fontSize: 12 }}
                        angle={-45}
                        textAnchor="end"
                      />
                      <YAxis 
                        tickFormatter={(value) => formatCurrency(value).split(',')[0]}
                      />
                      <Tooltip 
                        formatter={(value: number) => formatCurrency(value)}
                        labelFormatter={(label) => `Período: ${label}`}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="valor" 
                        stroke="var(--color-1)" 
                        fillOpacity={1} 
                        fill="url(#colorRendimentos)" 
                        name="Rendimento Total"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">Não há dados suficientes para exibir o gráfico</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Categoria</CardTitle>
                <CardDescription>
                  Quantidade de extratos por categoria
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                {isLoading ? (
                  <Skeleton className="w-full h-full" />
                ) : categoriasTotais.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoriasTotais}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={90}
                        fill="#8884d8"
                        dataKey="count"
                        nameKey="categoria"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {categoriasTotais.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => value}
                        labelFormatter={(label) => `Categoria: ${label}`}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">Não há dados suficientes para exibir o gráfico</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="categorias" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Comparativo de Valores por Categoria</CardTitle>
              <CardDescription>
                Valores totais por categoria
              </CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              {isLoading ? (
                <Skeleton className="w-full h-full" />
              ) : categoriasTotais.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={categoriasTotais}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="categoria" />
                    <YAxis 
                      tickFormatter={(value) => formatCurrency(value).split(',')[0]}
                    />
                    <Tooltip 
                      formatter={(value: number) => formatCurrency(value)}
                      labelFormatter={(label) => `Categoria: ${label}`}
                    />
                    <Legend />
                    <Bar 
                      dataKey="valorTotal" 
                      name="Valor Total" 
                      fill="var(--color-1)" 
                    />
                    <Bar 
                      dataKey="count" 
                      name="Quantidade" 
                      fill="var(--color-2)" 
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">Não há dados suficientes para exibir o gráfico</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="tomadores" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Principais Tomadores</CardTitle>
              <CardDescription>
                Tomadores com maior volume de rendimentos
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="w-full h-12" />
                  ))}
                </div>
              ) : tomadoresAnalytics.length > 0 ? (
                <div className="space-y-6">
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={tomadoresAnalytics.slice(0, 10)} // Top 10 tomadores
                        layout="vertical"
                        margin={{ top: 20, right: 30, left: 150, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                        <XAxis 
                          type="number"
                          tickFormatter={(value) => formatCurrency(value).split(',')[0]}
                        />
                        <YAxis 
                          dataKey="tomador" 
                          type="category" 
                          tick={{ fontSize: 12 }}
                          width={120}
                        />
                        <Tooltip 
                          formatter={(value: number) => formatCurrency(value)}
                          labelFormatter={(label) => `Tomador: ${label}`}
                        />
                        <Legend />
                        <Bar 
                          dataKey="valorTotal" 
                          name="Valor Total" 
                          fill="var(--color-3)"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {tomadoresAnalytics.slice(0, 6).map((tomador, index) => (
                      <Card key={tomador.tomador} className="border-l-4" style={{ borderLeftColor: COLORS[index % COLORS.length] }}>
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{tomador.tomador}</p>
                              <p className="text-sm text-muted-foreground">
                                {tomador.totalTrabalhos} trabalhos
                              </p>
                            </div>
                            <p className="font-semibold">{formatCurrency(tomador.valorTotal)}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-36">
                  <p className="text-muted-foreground">Não há dados suficientes para exibir tomadores</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Componente Card do Dashboard
interface DashboardCardProps {
  title: string;
  value?: string;
  description: string;
  icon: React.ReactNode;
  trend?: "up" | "down" | "neutral";
}

function DashboardCard({ title, value, description, icon, trend = "neutral" }: DashboardCardProps) {
  return (
    <Card className="dashboard-card">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10">
            {icon}
          </div>
          
          {trend !== "neutral" && (
            <div className={`flex items-center ${trend === "up" ? "text-green-500" : "text-red-500"}`}>
              {trend === "up" ? (
                <TrendingUp className="h-4 w-4 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 mr-1" />
              )}
            </div>
          )}
        </div>
        
        <div className="mt-4">
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          {value ? (
            <p className="text-2xl font-bold">{value}</p>
          ) : (
            <Skeleton className="h-8 w-3/4 mt-1" />
          )}
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}