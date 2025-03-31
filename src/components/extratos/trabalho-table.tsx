'use client'

import { useState, useMemo } from 'react'
import { Trabalho } from '@/types'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { ArrowDown, ArrowUp, BotIcon } from 'lucide-react'
import { formatCurrency, truncateText } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { EmptyState, EmptyTypes } from '@/components/common/empty-state'

type SortField =
  | 'dia'
  | 'folha'
  | 'tomador'
  | 'tur'
  | 'baseDeCalculo'
  | 'liquido'
type SortDirection = 'asc' | 'desc'

interface TrabalhoTableProps {
  trabalhos: Trabalho[]
  className?: string
}

/**
 * Componente TrabalhoTable: Tabela de trabalhos com ordenação e filtragem
 */
export function TrabalhoTable({ trabalhos }: TrabalhoTableProps) {
  const [sortField, setSortField] = useState<SortField>('dia')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [filter, setFilter] = useState('')

  // Função para alternar ordenação ao clicar em um header
  const toggleSort = (field: SortField) => {
    if (field === sortField) {
      // Inverte a direção se o campo for o mesmo
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      // Novo campo, começa com ascendente
      setSortField(field)
      setSortDirection('asc')
    }
  }

  // Renderizar ícone de ordenação
  const renderSortIcon = (field: SortField) => {
    if (field !== sortField) {
      return <BotIcon className="h-4 w-4 ml-1 text-muted-foreground/70" />
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="h-4 w-4 ml-1" />
    ) : (
      <ArrowDown className="h-4 w-4 ml-1" />
    )
  }

  // Trabalhos filtrados e ordenados
  const filteredAndSortedTrabalhos = useMemo(() => {
    // Primeiro filtra
    let filtered = trabalhos
    if (filter) {
      const lowercaseFilter = filter.toLowerCase()
      filtered = trabalhos.filter(
        (trabalho) =>
          trabalho.tomador.toLowerCase().includes(lowercaseFilter) ||
          trabalho.pasta.toLowerCase().includes(lowercaseFilter) ||
          trabalho.dia.toLowerCase().includes(lowercaseFilter) ||
          trabalho.folha.toLowerCase().includes(lowercaseFilter),
      )
    }

    // Depois ordena
    return [...filtered].sort((a, b) => {
      const valueA = a[sortField]
      const valueB = b[sortField]

      // Comparação para strings
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        // Tenta ordenar numericamente os dias
        if (sortField === 'dia') {
          const numA = parseInt(valueA)
          const numB = parseInt(valueB)
          if (!isNaN(numA) && !isNaN(numB)) {
            return sortDirection === 'asc' ? numA - numB : numB - numA
          }
        }

        return sortDirection === 'asc'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA)
      }

      // Comparação para números
      return sortDirection === 'asc'
        ? (valueA as number) - (valueB as number)
        : (valueB as number) - (valueA as number)
    })
  }, [trabalhos, filter, sortField, sortDirection])

  // Se não tiver trabalhos, exibir estado vazio
  if (trabalhos.length === 0) {
    return (
      <EmptyState
        title={EmptyTypes.NO_ITEMS.title}
        description="Não há trabalhos para exibir neste extrato."
        icon={EmptyTypes.NO_ITEMS.icon}
      />
    )
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Input
          placeholder="Filtrar trabalhos..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer"
                onClick={() => toggleSort('dia')}
              >
                <div className="flex items-center">
                  Dia {renderSortIcon('dia')}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => toggleSort('folha')}
              >
                <div className="flex items-center">
                  Folha {renderSortIcon('folha')}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => toggleSort('tomador')}
              >
                <div className="flex items-center">
                  Tomador {renderSortIcon('tomador')}
                </div>
              </TableHead>
              <TableHead>Pasta</TableHead>
              <TableHead>Fun</TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => toggleSort('tur')}
              >
                <div className="flex items-center">
                  Turno {renderSortIcon('tur')}
                </div>
              </TableHead>
              <TableHead>Terno</TableHead>
              <TableHead
                className="text-right cursor-pointer"
                onClick={() => toggleSort('baseDeCalculo')}
              >
                <div className="flex items-center justify-end">
                  Base de Cálculo {renderSortIcon('baseDeCalculo')}
                </div>
              </TableHead>
              <TableHead
                className="text-right cursor-pointer"
                onClick={() => toggleSort('liquido')}
              >
                <div className="flex items-center justify-end">
                  Líquido {renderSortIcon('liquido')}
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedTrabalhos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8">
                  Nenhum trabalho encontrado com os filtros atuais.
                </TableCell>
              </TableRow>
            ) : (
              filteredAndSortedTrabalhos.map((trabalho, index) => (
                <TableRow key={`${trabalho.dia}-${trabalho.folha}-${index}`}>
                  <TableCell>{trabalho.dia}</TableCell>
                  <TableCell>{trabalho.folha}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="tomador-badge">
                      {trabalho.tomador}
                    </Badge>
                  </TableCell>
                  <TableCell
                    className="max-w-[150px] truncate"
                    title={trabalho.pasta}
                  >
                    {truncateText(trabalho.pasta, 20)}
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
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="text-sm text-muted-foreground">
        Total de trabalhos: {filteredAndSortedTrabalhos.length} de{' '}
        {trabalhos.length}
      </div>
    </div>
  )
}
