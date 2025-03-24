"use client";

import { useExtrato } from "@/hooks/use-extratos";
import { ExtratoSummary } from "@/components/extratos/extrato-summary";
import { TrabalhoTable } from "@/components/extratos/trabalho-table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency, getMonthName } from "@/lib/utils";
import Link from "next/link";
import { ChevronLeft, Download, Printer, FileText } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ExtratoDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const { data: extrato, isLoading, error } = useExtrato(id);
  
  const handlePrint = () => {
    window.print();
  };
  
  // Função para baixar os dados como JSON
  const handleDownload = () => {
    if (!extrato) return;
    
    const fileName = `extrato_${extrato.matricula}_${extrato.mes}_${extrato.ano}.json`;
    const data = JSON.stringify(extrato, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    
    URL.revokeObjectURL(url);
  };
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive">Erro ao carregar extrato</h1>
          <p className="text-muted-foreground mt-2">Não foi possível carregar os dados do extrato.</p>
          <Button asChild className="mt-4">
            <Link href="/extratos">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Voltar para lista
            </Link>
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center">
          <Button variant="outline" size="sm" className="mr-4" asChild>
            <Link href="/extratos">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Voltar
            </Link>
          </Button>
          
          {isLoading ? (
            <div>
              <Skeleton className="h-8 w-48 mb-1" />
              <Skeleton className="h-4 w-32" />
            </div>
          ) : extrato ? (
            <div>
              <h1 className="text-2xl font-bold flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Extrato de {extrato.nome}
              </h1>
              <p className="text-muted-foreground">
                {getMonthName(extrato.mes)}/{extrato.ano} - {extrato.categoria}
              </p>
            </div>
          ) : null}
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handlePrint}
            disabled={isLoading || !extrato}
            className="print:hidden"
          >
            <Printer className="mr-2 h-4 w-4" />
            Imprimir
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            disabled={isLoading || !extrato}
            className="print:hidden"
          >
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i}>
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-6 w-32" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Skeleton className="h-10 w-full" />
          
          <Card>
            <CardContent className="pt-6">
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        </div>
      ) : extrato ? (
        <div className="space-y-6">
          <ExtratoSummary extrato={extrato} />
          
          <Tabs defaultValue="trabalhos">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="trabalhos">Trabalhos ({extrato.trabalhos.length})</TabsTrigger>
              <TabsTrigger value="chart">Gráfico</TabsTrigger>
            </TabsList>
            <TabsContent value="trabalhos">
              <TrabalhoTable trabalhos={extrato.trabalhos} />
            </TabsContent>
            <TabsContent value="chart">
              <Card>
                <CardHeader>
                  <CardTitle>Distribuição de Trabalhos</CardTitle>
                </CardHeader>
                <CardContent className="h-96">
                  <TrabalhoChart trabalhos={extrato.trabalhos} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      ) : null}
    </div>
  );
}

// Componente para mostrar o gráfico de trabalhos
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { Trabalho } from "@/types";
import { generateChartColors } from "@/lib/utils";

function TrabalhoChart({ trabalhos }: { trabalhos: Trabalho[] }) {
  // Agrupar trabalhos por tomador
  const tomadoresData = trabalhos.reduce((acc: Record<string, number>, trabalho) => {
    if (!acc[trabalho.tomador]) {
      acc[trabalho.tomador] = 0;
    }
    acc[trabalho.tomador] += trabalho.liquido;
    return acc;
  }, {});
  
  // Converter para array para o gráfico
  const pieData = Object.entries(tomadoresData).map(([tomador, valor]) => ({
    name: tomador,
    value: valor
  }));
  
  // Ordenar por valor
  pieData.sort((a, b) => b.value - a.value);
  
  // Gerar cores para o gráfico
  const COLORS = generateChartColors(pieData.length);
  
  // Agrupar trabalhos por dia para o gráfico de barras
  const diasData = trabalhos.reduce((acc: Record<string, number>, trabalho) => {
    if (!acc[trabalho.dia]) {
      acc[trabalho.dia] = 0;
    }
    acc[trabalho.dia] += trabalho.liquido;
    return acc;
  }, {});
  
  // Converter para array para o gráfico
  const barData = Object.entries(diasData)
    .map(([dia, valor]) => ({
      dia,
      valor
    }))
    .sort((a, b) => parseInt(a.dia) - parseInt(b.dia));
  
  if (trabalhos.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-muted-foreground">Não há trabalhos para visualizar</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
      <div>
        <h3 className="font-medium mb-2 text-center">Distribuição por Tomador</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => formatCurrency(value)} 
              labelFormatter={(label) => `Tomador: ${label}`}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <div>
        <h3 className="font-medium mb-2 text-center">Rendimentos por Dia</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={barData}
            margin={{
              top: 5, right: 10, left: 10, bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="dia" />
            <YAxis tickFormatter={(value) => formatCurrency(value).split(',')[0]} />
            <Tooltip formatter={(value: number) => formatCurrency(value)} labelFormatter={(label) => `Dia: ${label}`} />
            <Bar dataKey="valor" fill="var(--color-1)" name="Valor" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}