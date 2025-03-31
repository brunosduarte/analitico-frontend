'use client'

import { Extrato, ResumoExtrato } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency, getMonthName } from '@/lib/utils'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import {
  CalendarIcon,
  CreditCardIcon,
  UserIcon,
  BriefcaseIcon,
} from 'lucide-react'

interface ExtratoSummaryProps {
  extrato: Extrato
  isLoading?: boolean
}

/**
 * Componente ExtratoSummary: Exibe resumo de um extrato com abas
 */
export function ExtratoSummary({
  extrato,
  isLoading = false,
}: ExtratoSummaryProps) {
  if (isLoading) {
    return <ExtratoSummarySkeleton />
  }

  const {
    nome,
    matricula,
    mes,
    ano,
    categoria,
    folhasComplementos,
    revisadas,
  } = extrato

  const mesExtenso = getMonthName(mes)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Resumo do Extrato</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start space-x-3">
              <UserIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Nome
                </h3>
                <p className="text-lg font-semibold">{nome}</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <BriefcaseIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Matrícula
                </h3>
                <p className="text-lg font-semibold">{matricula}</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CalendarIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Período
                </h3>
                <p className="text-lg font-semibold">
                  {mesExtenso}/{ano}
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Badge
                variant="outline"
                className={`categoria-${categoria.toLowerCase()}`}
              >
                {categoria}
              </Badge>
            </div>
            <div className="flex items-start space-x-3">
              <BriefcaseIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Total de Trabalhos
                </h3>
                <p className="text-lg font-semibold">
                  {extrato.trabalhos.length}
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CreditCardIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Valor Total
                </h3>
                <p className="text-lg font-semibold">
                  {formatCurrency(folhasComplementos.liquido)}
                </p>
              </div>
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
  )
}

interface SummaryTableProps {
  resumo: ResumoExtrato
}

/**
 * Componente SummaryTable: Tabela de valores financeiros
 */
function SummaryTable({ resumo }: SummaryTableProps) {
  const items = [
    { label: 'Base de Cálculo', value: resumo.baseDeCalculo },
    { label: 'INSS', value: resumo.inss },
    { label: 'Imposto de Renda', value: resumo.impostoDeRenda },
    { label: 'Desconto Judicial', value: resumo.descontoJudicial },
    { label: 'DAS', value: resumo.das },
    { label: 'Mensal', value: resumo.mensal },
    { label: 'Imposto Sindical', value: resumo.impostoSindical },
    { label: 'Descontos EPI/Crachá', value: resumo.descontosEpiCracha },
    { label: 'Líquido', value: resumo.liquido, highlight: true },
    { label: 'Férias', value: resumo.ferias },
    { label: '13º Salário', value: resumo.decimoTerceiro },
    { label: 'Encargos 13º', value: resumo.encargosDecimo },
    { label: 'FGTS', value: resumo.fgts },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex justify-between items-center p-3 rounded-md border"
        >
          <span className="text-sm font-medium">{item.label}</span>
          <span
            className={`font-mono ${item.highlight ? 'font-bold text-primary' : ''}`}
          >
            {formatCurrency(item.value)}
          </span>
        </div>
      ))}
    </div>
  )
}

/**
 * Componente ExtratoSummarySkeleton: Versão skeleton do resumo de extrato
 */
function ExtratoSummarySkeleton() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="h-6 w-48 bg-muted rounded-md animate-pulse" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-24 bg-muted rounded-md animate-pulse" />
                <div className="h-6 w-32 bg-muted rounded-md animate-pulse" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="h-10 w-full bg-muted rounded-md animate-pulse" />

      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="flex justify-between items-center p-3 rounded-md border"
              >
                <div className="h-4 w-24 bg-muted rounded-md animate-pulse" />
                <div className="h-4 w-16 bg-muted rounded-md animate-pulse" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
