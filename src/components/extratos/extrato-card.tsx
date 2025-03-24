"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ExtratoResumo } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, ChevronRight } from "lucide-react";
import { formatCurrency, getCategoryColor, getMonthName } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface ExtratoCardProps {
  extrato: ExtratoResumo;
}

export function ExtratoCard({ extrato }: ExtratoCardProps) {
  const { id, matricula, nome, mes, ano, categoria, totalTrabalhos, valorTotal } = extrato;
  const categoryColor = getCategoryColor(categoria);
  const monthName = getMonthName(mes);
  
  return (
    <Card className="extrato-card overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-bold">{nome}</CardTitle>
          <Badge 
            className={cn(
              `bg-${categoryColor}-100 text-${categoryColor}-800 dark:bg-${categoryColor}-900 dark:text-${categoryColor}-300`,
              `categoria-${categoria.toLowerCase()}`
            )}
          >
            {categoria}
          </Badge>
        </div>
        <CardDescription>
          Matrícula: {matricula}
        </CardDescription>
      </CardHeader>
      <CardContent className="text-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-medium">Período:</span>
          <span>{monthName}/{ano}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-medium">Total de Trabalhos:</span>
          <span>{totalTrabalhos}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-medium">Valor Total:</span>
          <span className="font-semibold">{formatCurrency(valorTotal)}</span>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button variant="outline" className="w-full" asChild>
          <Link href={`/extratos/${id}`} className="flex items-center justify-between">
            <span className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Ver Detalhes
            </span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}