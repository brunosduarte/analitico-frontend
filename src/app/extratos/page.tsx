'use client'

import { useState } from 'react'
import {
  useExtratos,
  useExtratoCategorias,
  useExtratoPeriodos,
} from '@/hooks/use-extratos'
import { ExtratoCard } from '@/components/extratos/extrato-card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ExtratoFiltros } from '@/lib/api'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { SearchIcon, XIcon } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

export default function ExtratosPage() {
  const [filtros, setFiltros] = useState<ExtratoFiltros>({})
  const [busca, setBusca] = useState('')

  // Atualizar o filtro após um pequeno delay
  const handleBuscaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBusca(e.target.value)

    // Decidir se a busca é por matrícula ou nome
    const valor = e.target.value.trim()

    if (valor.match(/^\d{3}-\d+$/)) {
      // Parece ser uma matrícula
      setFiltros((prev) => ({ ...prev, matricula: valor, nome: undefined }))
    } else if (valor.length > 0) {
      // Provavelmente um nome
      setFiltros((prev) => ({ ...prev, nome: valor, matricula: undefined }))
    } else {
      // Busca vazia, remover filtros de nome e matrícula
      setFiltros((prev) => {
        const { ...rest } = prev
        return rest
      })
    }
  }

  // Lidar com mudanças nos select fields
  const handleSelectChange = (field: keyof ExtratoFiltros, value: string) => {
    if (value === 'all') {
      // Se o valor for "all", remover este filtro
      setFiltros((prev) => {
        const newFiltros = { ...prev }
        delete newFiltros[field]
        return newFiltros
      })
    } else {
      // Definir o novo valor do filtro
      setFiltros((prev) => ({ ...prev, [field]: value }))
    }
  }

  // Limpar todos os filtros
  const limparFiltros = () => {
    setBusca('')
    setFiltros({})
  }

  // Buscar extratos com os filtros aplicados
  const { data: extratos = [], isLoading } = useExtratos(filtros)

  // Extrair períodos e categorias para os filtros de select
  const periodos = useExtratoPeriodos(extratos)
  const categorias = useExtratoCategorias(extratos)

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Extratos Analíticos</h1>
          <p className="text-muted-foreground">
            Visualize e filtre os extratos de trabalhadores portuários
          </p>
        </div>
      </div>

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
              onValueChange={(value) => {
                if (value && value !== 'all') {
                  const [mes, ano] = value.split('-')
                  handleSelectChange('mes', mes)
                  handleSelectChange('ano', ano)
                } else {
                  handleSelectChange('mes', 'all')
                  handleSelectChange('ano', 'all')
                }
              }}
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
              disabled={Object.keys(filtros).length === 0}
            >
              <XIcon className="mr-2 h-4 w-4" />
              Limpar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2 mt-2" />
              </CardHeader>
              <CardContent className="text-sm space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </CardContent>
              <div className="px-6 pb-6">
                <Skeleton className="h-9 w-full" />
              </div>
            </Card>
          ))}
        </div>
      ) : extratos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {extratos.map((extrato) => (
            <ExtratoCard key={extrato.id} extrato={extrato} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium mb-2">
            Nenhum extrato encontrado
          </h3>
          <p className="text-muted-foreground">
            Tente ajustar os filtros ou fazer upload de novos extratos.
          </p>
        </div>
      )}
    </div>
  )
}
