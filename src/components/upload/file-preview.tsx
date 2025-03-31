'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { File, X } from 'lucide-react'
import { LoadingState } from '@/components/common/loading-state'

interface FilePreviewProps {
  file: File | null
  isOpen: boolean
  onClose: () => void
}

/**
 * Componente FilePreview: Visualização de arquivo PDF em um modal
 */
export function FilePreview({ file, isOpen, onClose }: FilePreviewProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Limpar URL ao fechar ou mudar o arquivo
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  useEffect(() => {
    if (file && isOpen) {
      setIsLoading(true)
      setError(null)

      try {
        // Criar URL para o arquivo
        const url = URL.createObjectURL(file)
        setPreviewUrl(url)
        setIsLoading(false)
      } catch (error) {
        console.error('Erro ao criar preview:', error)
        setError('Não foi possível visualizar este arquivo.')
        setIsLoading(false)
      }
    } else {
      // Limpar preview quando o modal fechar
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
        setPreviewUrl(null)
      }
    }
  }, [file, isOpen, previewUrl])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <File className="h-5 w-5 mr-2" />
            {file ? file.name : 'Visualização do Arquivo'}
          </DialogTitle>
          <DialogDescription>
            {file
              ? `${(file.size / 1024 / 1024).toFixed(2)} MB - PDF`
              : 'Prévia do conteúdo do PDF'}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-auto min-h-[60vh] bg-muted/20 rounded border">
          {isLoading ? (
            <LoadingState message="Carregando documento..." />
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full text-destructive">
              <X className="h-12 w-12 mb-2" />
              <p>{error}</p>
            </div>
          ) : previewUrl ? (
            <iframe
              src={previewUrl}
              className="w-full h-full border-0"
              title="PDF Preview"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Nenhum arquivo selecionado para visualização
            </div>
          )}
        </div>

        <DialogFooter className="mt-4">
          <Button onClick={onClose}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
