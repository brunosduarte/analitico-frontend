'use client'

import React, { useEffect } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useLocalStorage } from '@/hooks/use-local-storage'
import { Palette } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CHART_THEMES } from '@/lib/constants'

type ChartColorTheme = keyof typeof CHART_THEMES

interface ChartThemeSelectorProps {
  onThemeChange: (theme: ChartColorTheme) => void
  className?: string
}

/**
 * Componente ChartThemeSelector: Seletor de tema de cores para gráficos
 */
export function ChartThemeSelector({
  onThemeChange,
  className,
}: ChartThemeSelectorProps) {
  // Use local storage to persist the theme preference
  const [theme, setTheme] = useLocalStorage<ChartColorTheme>(
    'chart-color-theme',
    'classic',
  )

  // Sync with parent component on mount and when theme changes
  useEffect(() => {
    if (theme) {
      onThemeChange(theme)
    }
  }, [theme, onThemeChange])

  const handleThemeChange = (value: string) => {
    setTheme(value as ChartColorTheme)
  }

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <Palette className="h-4 w-4 text-muted-foreground" />
      <Select value={theme} onValueChange={handleThemeChange}>
        <SelectTrigger className="w-32 md:w-[180px]">
          <SelectValue placeholder="Tema de cores" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="classic">Clássico</SelectItem>
          <SelectItem value="wheel">Roda de cores</SelectItem>
          <SelectItem value="sepia">Sépia</SelectItem>
          <SelectItem value="vivid">Vívido</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
