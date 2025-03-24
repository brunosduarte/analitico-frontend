"use client";

import { Extrato, ResumoExtrato } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ExtratoSummaryProps {
  extrato: Extrato;
}

export function ExtratoSummary({ extrato }: ExtratoSummaryProps) {
  const { nome, matricula, mes, ano, categoria, folhasComplementos, revisadas } = extrato;
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Resumo do Extrato</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Nome</h3>
              <p className="text-lg font-semibold">{nome}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Matrícula</h3>
              <p className="text-lg font-semibold">{matricula}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Período</h3>
              <p className="text-lg font-semibold">{mes}/{ano}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Categoria</h3>
              <p className="text-lg font-semibold">{categoria}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Total de Trabalhos</h3>
              <p className="text-lg font-semibold">{extrato.trabalhos.length}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Valor Total</h3>
              <p className="text-lg font-semibold">{formatCurrency(folhasComplementos.liquido)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="folhas">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="folhas">Folhas/Complementos</TabsTrigger>
          <TabsTrigger value="revisadas">Revisadas</TabsTrigger>
        </TabsList>
        <TabsContent value="folhas">
          <Card>
            <CardContent className="pt-6">
              <SummaryTable resumo={folhasComplementos} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="revisadas">
          <Card>
            <CardContent className="pt-6">
              <SummaryTable resumo={revisadas} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface SummaryTableProps {
  resumo: ResumoExtrato;
}

function SummaryTable({ resumo }: SummaryTableProps) {
  const items = [
    { label: "Base de Cálculo", value: resumo.baseDeCalculo },
    { label: "INSS", value: resumo.inss },
    { label: "Imposto de Renda", value: resumo.impostoDeRenda },
    { label: "Desconto Judicial", value: resumo.descontoJudicial },
    { label: "DAS", value: resumo.das },
    { label: "Mensal", value: resumo.mensal },
    { label: "Imposto Sindical", value: resumo.impostoSindical },
    { label: "Descontos EPI/Crachá", value: resumo.descontosEpiCracha },
    { label: "Líquido", value: resumo.liquido, highlight: true },
    { label: "Férias", value: resumo.ferias },
    { label: "13º Salário", value: resumo.decimoTerceiro },
    { label: "Encargos 13º", value: resumo.encargosDecimo },
    { label: "FGTS", value: resumo.fgts }
  ];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {items.map((item) => (
        <div key={item.label} className="flex justify-between items-center p-2 rounded-md border">
          <span className="text-sm font-medium">{item.label}</span>
          <span 
            className={`font-mono ${item.highlight ? "font-bold text-primary" : ""}`}
          >
            {formatCurrency(item.value)}
          </span>
        </div>
      ))}
    </div>
  );
}