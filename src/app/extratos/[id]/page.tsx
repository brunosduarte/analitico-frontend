'use client'

import { useExtrato } from '@/hooks/use-extratos'
import { ExtratoSummary } from '@/components/extratos/extrato-summary'
import { TrabalhoTable } from '@/components/extratos/trabalho-table'
import { Button } from '@/components/ui/button'
import { getMonthName } from '@/lib/utils'
import Link from 'next/link'
import { ChevronLeft, Download, Printer, FileText } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useParams } from 'next/navigation'

export default function ExtratoDetailPage() {
  // Use the useParams hook instead
  const params = useParams()
  const id = params.id as string

  const { data: extrato, isLoading, error } = useExtrato(id)

  const handlePrint = () => {
    window.print()
  }

  // Função para baixar os dados como JSON
  const handleDownload = () => {
    if (!extrato) return

    const fileName = `extrato_${extrato.matricula}_${extrato.mes}_${extrato.ano}.json`
    const data = JSON.stringify(extrato, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    link.click()

    URL.revokeObjectURL(url)
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive">
            Erro ao carregar extrato
          </h1>
          <p className="text-muted-foreground mt-2">
            Não foi possível carregar os dados do extrato.
          </p>
          <Button asChild className="mt-4">
            <Link href="/extratos">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Voltar para lista
            </Link>
          </Button>
        </div>
      </div>
    )
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
          <Card>
            <CardHeader>
              <CardTitle>Trabalhos ({extrato.trabalhos.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <TrabalhoTable trabalhos={extrato.trabalhos} />
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  )
}
