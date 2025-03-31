'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import {
  UploadCloudIcon,
  FileIcon,
  Trash2Icon,
  AlertCircleIcon,
  Loader2Icon,
} from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { validatePdfFile } from '@/lib/utils'
import { UPLOAD_LIMITS } from '@/lib/constants'

interface UploadFormProps {
  onUpload: (file: File) => Promise<void>
  isLoading: boolean
}

/**
 * Componente UploadForm: Formulário para upload de arquivos
 */
export function UploadForm({ onUpload, isLoading }: UploadFormProps) {
  const [file, setFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()

    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file: File) => {
    // Validar o arquivo
    const validation = validatePdfFile(file)
    if (!validation.valid) {
      setError(validation.message || 'Arquivo inválido')
      return
    }

    setError(null)
    setFile(file)
  }

  const handleRemoveFile = () => {
    setFile(null)
    setUploadProgress(0)
    setError(null)
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setError(null)

    // Simulação de progresso
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval)
          return prev
        }
        return prev + 5
      })
    }, 100)

    try {
      await onUpload(file)
      setUploadProgress(100)
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Ocorreu um erro ao processar o arquivo.'

      setError(errorMessage)
      setUploadProgress(0)
    } finally {
      clearInterval(interval)
    }
  }

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
          dragActive
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          {file ? (
            <div className="flex flex-col items-center space-y-2">
              <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                <FileIcon className="h-10 w-10 text-primary" />
              </div>
              <div className="text-sm font-medium">{file.name}</div>
              <div className="text-xs text-muted-foreground">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </div>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={handleRemoveFile}
              >
                <Trash2Icon className="h-4 w-4" />
                Remover
              </Button>
            </div>
          ) : (
            <>
              <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                <UploadCloudIcon className="h-10 w-10 text-primary" />
              </div>
              <div>
                <p className="font-medium">
                  Arraste e solte o arquivo PDF aqui ou
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  O arquivo deve ser menor que{' '}
                  {UPLOAD_LIMITS.MAX_FILE_SIZE / (1024 * 1024)}MB
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => inputRef.current?.click()}
              >
                Selecionar arquivo
              </Button>
              <input
                ref={inputRef}
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={handleChange}
              />
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="flex items-center text-destructive gap-2 text-sm">
          <AlertCircleIcon className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      {uploadProgress > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progresso</span>
            <span>{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} />
        </div>
      )}

      <Button
        className="w-full"
        disabled={!file || isLoading || uploadProgress === 100}
        onClick={handleUpload}
      >
        {isLoading ? (
          <>
            <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
            Processando...
          </>
        ) : (
          <>Enviar Arquivo</>
        )}
      </Button>
    </div>
  )
}
