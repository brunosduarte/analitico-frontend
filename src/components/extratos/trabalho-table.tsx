"use client";

import { Trabalho } from "@/types";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface TrabalhoTableProps {
  trabalhos: Trabalho[];
}

export function TrabalhoTable({ trabalhos }: TrabalhoTableProps) {
  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Dia</TableHead>
            <TableHead>Folha</TableHead>
            <TableHead>Tomador</TableHead>
            <TableHead>Pasta</TableHead>
            <TableHead>Fun</TableHead>
            <TableHead>Turno</TableHead>
            <TableHead>Terno</TableHead>
            <TableHead className="text-right">Base de Cálculo</TableHead>
            <TableHead className="text-right">Líquido</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {trabalhos.map((trabalho, index) => (
            <TableRow key={`${trabalho.dia}-${trabalho.folha}-${index}`}>
              <TableCell>{trabalho.dia}</TableCell>
              <TableCell>{trabalho.folha}</TableCell>
              <TableCell>
                <Badge variant="outline" className="tomador-badge">
                  {trabalho.tomador}
                </Badge>
              </TableCell>
              <TableCell className="max-w-[150px] truncate" title={trabalho.pasta}>
                {trabalho.pasta}
              </TableCell>
              <TableCell>{trabalho.fun}</TableCell>
              <TableCell>{trabalho.tur}</TableCell>
              <TableCell>{trabalho.ter}</TableCell>
              <TableCell className="text-right font-mono">
                {formatCurrency(trabalho.baseDeCalculo)}
              </TableCell>
              <TableCell className="text-right font-mono font-semibold">
                {formatCurrency(trabalho.liquido)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}