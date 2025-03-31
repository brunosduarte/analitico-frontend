'use client'

import { useState, useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { SearchIcon, XIcon } from 'lucide-react'
import { ExtratoFiltros } from '@/types/api'
import { MesAnoOptions } from '@/types'
import { debounce } from '@/lib/utils'

interface FilterPanelProps {
  onFilterChange: (filtros: ExtratoFiltros) => void
  periodos: MesAnoOptions[]
  categorias: string[]
  initialFiltros?: ExtratoFiltros
}

/**
 * Componente FilterPanel: Painel de filtros para extratos
 */
export function FilterPanel({
  onFilterChange,
  periodos,
  categorias,
  initialFiltros = {},
}: FilterPanelProps) {
  // Estado para armazenar os filtros
  const [filtros, setFiltros] = useState<ExtratoFiltros>(initialFiltros)
  // Estado separado para o valor de busca (para controle de UI)
  const [busca, setBusca] = useState('')

  // Atualizar o filtro após um delay (debounce)
  const debouncedFilterChange = useCallback(
    debounce((newFiltros: ExtratoFiltros) => {
      onFilterChange(newFiltros)
    }, 300),
    [onFilterChange],
  )

  // Função para atualizar os filtros
  const updateFiltros = useCallback(
    (newFiltros: ExtratoFiltros) => {
      setFiltros(newFiltros)
      debouncedFilterChange(newFiltros)
    },
    [debouncedFilterChange],
  )

  // Processar mudança no campo de busca
  const handleBuscaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value
    setBusca(valor)

    // Decidir se a busca é por matrícula ou nome
    if (valor.match(/^\d{3}-\d+$/)) {
      // Parece ser uma matrícula
      updateFiltros({ ...filtros, matricula: valor, nome: undefined })
    } else if (valor.length > 0) {
      // Provavelmente um nome
      updateFiltros({ ...filtros, nome: valor, matricula: undefined })
    } else {
      // Busca vazia, remover filtros de nome e matrícula
      const newFiltros = { ...filtros }
      delete newFiltros.nome
      delete newFiltros.matricula
      updateFiltros(newFiltros)
    }
  }

  // Lidar com mudanças nos select fields
  const handleSelectChange = (field: keyof ExtratoFiltros, value: string) => {
    if (value === 'all') {
      // Se o valor for "all", remover este filtro
      const newFiltros = { ...filtros }
      delete newFiltros[field]
      updateFiltros(newFiltros)
    } else {
      // Definir o novo valor do filtro
      updateFiltros({ ...filtros, [field]: value })
    }
  }

  // Lidar com mudanças no select de período (mês/ano)
  const handlePeriodoChange = (value: string) => {
    if (value && value !== 'all') {
      const [mes, ano] = value.split('-')
      const newFiltros = { ...filtros, mes, ano }
      updateFiltros(newFiltros)
    } else {
      const newFiltros = { ...filtros }
      delete newFiltros.mes
      delete newFiltros.ano
      updateFiltros(newFiltros)
    }
  }

  // Limpar todos os filtros
  const limparFiltros = () => {
    setBusca('')
    setFiltros({})
    onFilterChange({})
  }

  // Verificar se há filtros ativos
  const hasActiveFilters = Object.keys(filtros).length > 0

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Filtros</CardTitle>
        <CardDescription>
          Refine sua busca por extratos específicos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="col-span-1 md:col-span-2">
            <div className="relative">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por matrícula ou nome..."
                className="pl-8"
                value={busca}
                onChange={handleBuscaChange}
              />
            </div>
          </div>

          <Select
            value={filtros.categoria || 'all'}
            onValueChange={(value) => handleSelectChange('categoria', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas categorias</SelectItem>
              {categorias.map((categoria) => (
                <SelectItem key={categoria} value={categoria}>
                  {categoria}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={
              filtros.mes && filtros.ano
                ? `${filtros.mes}-${filtros.ano}`
                : 'all'
            }
            onValueChange={handlePeriodoChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos períodos</SelectItem>
              {periodos.map((periodo) => (
                <SelectItem
                  key={`${periodo.mes}-${periodo.ano}`}
                  value={`${periodo.mes}-${periodo.ano}`}
                >
                  {periodo.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-end mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={limparFiltros}
            disabled={!hasActiveFilters}
          >
            <XIcon className="mr-2 h-4 w-4" />
            Limpar Filtros
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
