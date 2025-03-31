'use client'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { CalendarIcon } from 'lucide-react'
import { useState, useCallback, useEffect } from 'react'
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  subMonths,
  subWeeks,
  subDays,
  isValid,
  isSameDay,
  endOfDay,
} from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { DateRange as CalendarDateRange } from 'react-day-picker'

export interface DateRange {
  from: Date
  to: Date
}

export interface PeriodOption {
  label: string
  getValue: () => DateRange
}

interface PeriodSelectorProps {
  onChange: (range: DateRange) => void
  initialRange?: DateRange
  className?: string
}

/**
 * Componente PeriodSelector: Seletor de período com presets
 */
export function PeriodSelector({
  onChange,
  initialRange,
}: PeriodSelectorProps) {
  // Estado para o período selecionado
  const [dateRange, setDateRange] = useState<DateRange | null>(null)

  // Estado para controlar o popover
  const [open, setOpen] = useState(false)
  // Estado para rastrear se o componente foi montado
  const [mounted, setMounted] = useState(false)

  // Use useEffect para definir a data inicial após a montagem para evitar erros de hidratação
  useEffect(() => {
    setMounted(true)

    // Only set the date range after component has mounted to avoid hydration errors
    setDateRange(
      initialRange || {
        from: startOfMonth(new Date()),
        to: endOfMonth(new Date()),
      },
    )
  }, [initialRange])

  // Selected period display string - only render on client
  const selectedPeriodText =
    mounted && dateRange && isValid(dateRange.from) && isValid(dateRange.to)
      ? `${format(dateRange.from, 'dd/MM/yy')} - ${format(dateRange.to, 'dd/MM/yy')}`
      : 'Selecionar período'

  // Calcula o número de dias no período - only render on client
  const daysDifference =
    mounted && dateRange && isValid(dateRange.from) && isValid(dateRange.to)
      ? Math.round(
          (dateRange.to.getTime() - dateRange.from.getTime()) /
            (1000 * 60 * 60 * 24),
        ) + 1
      : 0

  // Função para atualizar o período selecionado
  const updateDateRange = useCallback(
    (from: Date, to: Date) => {
      const newRange = { from, to: endOfDay(to) }
      setDateRange(newRange)
      onChange(newRange)
    },
    [onChange],
  )

  // Função para tratar a seleção de datas no calendário
  const handleSelect = useCallback(
    (range: CalendarDateRange | undefined) => {
      if (!range) return

      // Se apenas a data "from" estiver selecionada
      if (range.from && !range.to) {
        // Definir a mesma data como início e fim temporariamente
        setDateRange({
          from: range.from,
          to: range.from,
        })
      }
      // Se ambas as datas estiverem selecionadas
      else if (range.from && range.to) {
        // Se as datas são iguais, mantenha-as (para seleção de um único dia)
        if (isSameDay(range.from, range.to)) {
          updateDateRange(range.from, range.to)
        } else {
          // Caso contrário, atualize normalmente
          updateDateRange(range.from, range.to)
        }
      }
    },
    [updateDateRange],
  )

  // Definição dos presets de período
  const periodPresets: PeriodOption[] = [
    {
      label: 'Esse mês',
      getValue: () => {
        const now = new Date()
        return {
          from: startOfMonth(now),
          to: endOfMonth(now),
        }
      },
    },
    {
      label: 'Essa semana',
      getValue: () => {
        const now = new Date()
        return {
          from: startOfWeek(now, { weekStartsOn: 0 }),
          to: endOfWeek(now, { weekStartsOn: 0 }),
        }
      },
    },
    {
      label: 'Semana passada',
      getValue: () => {
        const now = subWeeks(new Date(), 1)
        return {
          from: startOfWeek(now, { weekStartsOn: 0 }),
          to: endOfWeek(now, { weekStartsOn: 0 }),
        }
      },
    },
    {
      label: 'Mês passado',
      getValue: () => {
        const now = subMonths(new Date(), 1)
        return {
          from: startOfMonth(now),
          to: endOfMonth(now),
        }
      },
    },
    {
      label: 'Últimos 30 dias',
      getValue: () => {
        const now = new Date()
        return {
          from: subDays(now, 29),
          to: now,
        }
      },
    },
    {
      label: 'Últimos 3 meses',
      getValue: () => {
        const now = new Date()
        return {
          from: startOfMonth(subMonths(now, 2)),
          to: endOfMonth(now),
        }
      },
    },
    {
      label: 'Últimos 6 meses',
      getValue: () => {
        const now = new Date()
        return {
          from: startOfMonth(subMonths(now, 5)),
          to: endOfMonth(now),
        }
      },
    },
    {
      label: 'Últimos 12 meses',
      getValue: () => {
        const now = new Date()
        return {
          from: startOfMonth(subMonths(now, 11)),
          to: endOfMonth(now),
        }
      },
    },
  ]

  // Função para selecionar um preset
  const handlePresetSelect = (preset: PeriodOption) => {
    const range = preset.getValue()
    updateDateRange(range.from, range.to)
    // Fechar o popover após selecionar um preset
    setOpen(false)
  }

  // Don't render date-related content until component is mounted on client
  if (!mounted) {
    return (
      <Button
        variant="outline"
        className="w-full justify-start text-left font-normal md:w-[300px]"
      >
        <CalendarIcon className="mr-2 h-4 w-4" />
        Carregando...
      </Button>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start text-left font-normal md:w-[300px]"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selectedPeriodText}
          {daysDifference > 0 && (
            <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium">
              {daysDifference} dias
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        <div className="p-3 border-b">
          <div className="grid grid-cols-2 gap-2">
            {periodPresets.map((preset, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handlePresetSelect(preset)}
              >
                {preset.label}
              </Button>
            ))}
          </div>
        </div>
        {dateRange && (
          <Calendar
            mode="range"
            selected={dateRange}
            onSelect={handleSelect}
            numberOfMonths={2}
            locale={ptBR}
            disabled={(date) =>
              date > new Date() || date < new Date('2025-01-01')
            }
            initialFocus
          />
        )}
      </PopoverContent>
    </Popover>
  )
}
