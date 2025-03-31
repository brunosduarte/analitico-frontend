'use client'

import { useState, useRef } from 'react'
import { useUploadExtrato } from '@/hooks/use-extratos'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { AlertCircle, Check, FileText, Upload, X } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export default function UploadPage() {
  const [files, setFiles] = useState<File[]>([])
  const [uploadStatus, setUploadStatus] = useState<
    Record<string, 'pending' | 'success' | 'error'>
  >({})
  const [uploading, setUploading] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [previewFile, setPreviewFile] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const { mutateAsync: uploadExtrato, isPending } = useUploadExtrato()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    // Filtrar apenas arquivos PDF
    const pdfFiles = selectedFiles.filter(
      (file) => file.type === 'application/pdf',
    )

    // Atualizar status para os novos arquivos
    const newStatus: Record<string, 'pending' | 'success' | 'error'> = {
      ...uploadStatus,
    }
    pdfFiles.forEach((file) => {
      newStatus[file.name] = 'pending'
    })

    setFiles((prevFiles) => [...prevFiles, ...pdfFiles])
    setUploadStatus(newStatus)

    // Limpar o input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()

    const droppedFiles = Array.from(e.dataTransfer.files || [])
    // Filtrar apenas arquivos PDF
    const pdfFiles = droppedFiles.filter(
      (file) => file.type === 'application/pdf',
    )

    // Atualizar status para os novos arquivos
    const newStatus: Record<string, 'pending' | 'success' | 'error'> = {
      ...uploadStatus,
    }
    pdfFiles.forEach((file) => {
      newStatus[file.name] = 'pending'
    })

    setFiles((prevFiles) => [...prevFiles, ...pdfFiles])
    setUploadStatus(newStatus)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const removeFile = (fileName: string) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName))

    // Remover do status
    const newStatus = { ...uploadStatus }
    delete newStatus[fileName]
    setUploadStatus(newStatus)
  }

  const previewFileContent = (file: File) => {
    const fileReader = new FileReader()
    fileReader.onload = () => {
      setPreviewFile(fileReader.result as string)
      setIsPreviewOpen(true)
    }
    fileReader.readAsDataURL(file)
  }

  const uploadFiles = async () => {
    if (files.length === 0) return

    setUploading(true)

    const newStatus = { ...uploadStatus }

    // Processar cada arquivo
    for (const file of files) {
      try {
        const formData = new FormData()
        formData.append('arquivo', file)

        await uploadExtrato(formData)

        newStatus[file.name] = 'success'
        setUploadStatus({ ...newStatus })
      } catch (error) {
        console.error('Erro ao fazer upload:', error)
        newStatus[file.name] = 'error'
        setUploadStatus({ ...newStatus })
      }
    }

    setUploading(false)

    // Verificar se todos os uploads tiveram sucesso
    const allSuccess = Object.values(newStatus).every(
      (status) => status === 'success',
    )
    const hasErrors = Object.values(newStatus).some(
      (status) => status === 'error',
    )

    if (allSuccess) {
      toast({
        title: 'Upload concluído',
        description: `${files.length} arquivo(s) processado(s) com sucesso.`,
      })

      // Limpar após upload com sucesso
      setFiles([])
      setUploadStatus({})
    } else if (hasErrors) {
      toast({
        title: 'Upload parcial',
        description:
          'Alguns arquivos não puderam ser processados. Verifique os detalhes.',
        variant: 'destructive',
      })
    }
  }

  const getStatusIcon = (status: 'pending' | 'success' | 'error') => {
    switch (status) {
      case 'success':
        return <Check className="h-5 w-5 text-green-500" />
      case 'error':
        return <X className="h-5 w-5 text-red-500" />
      default:
        return <FileText className="h-5 w-5 text-muted-foreground" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Upload de Extratos</h1>
          <p className="text-muted-foreground">
            Faça upload dos PDFs de extratos para processamento
          </p>
        </div>
      </div>

      <Tabs defaultValue="upload">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">Upload de Arquivos</TabsTrigger>
          <TabsTrigger value="instrucoes">Instruções</TabsTrigger>
        </TabsList>

        <TabsContent value="upload">
          <Card>
            <CardHeader>
              <CardTitle>Upload de Extratos Analíticos</CardTitle>
              <CardDescription>
                Selecione os arquivos PDF de extratos para processamento
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Área de arrastar e soltar */}
              <div
                className="border-2 border-dashed border-muted rounded-lg p-10 text-center cursor-pointer"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium mb-1">
                  Arraste e solte os arquivos aqui
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  ou clique para selecionar os arquivos
                </p>
                <Button
                  variant="outline"
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    fileInputRef.current?.click()
                  }}
                >
                  Selecionar Arquivos
                </Button>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf"
                  multiple
                />
              </div>

              {/* Lista de arquivos selecionados */}
              {files.length > 0 && (
                <div className="border rounded-lg">
                  <div className="p-3 border-b bg-muted/50">
                    <h3 className="font-medium">
                      Arquivos Selecionados ({files.length})
                    </h3>
                  </div>
                  <ul className="divide-y">
                    {files.map((file, index) => (
                      <li
                        key={index}
                        className="p-3 flex items-center justify-between"
                      >
                        <div className="flex items-center">
                          {getStatusIcon(uploadStatus[file.name] || 'pending')}
                          <span className="ml-2">{file.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => previewFileContent(file)}
                          >
                            Visualizar
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(file.name)}
                          >
                            Remover
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Alertas de validação */}
              {files.length === 0 && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Nenhum arquivo selecionado</AlertTitle>
                  <AlertDescription>
                    Selecione pelo menos um arquivo PDF para fazer upload.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => {
                  setFiles([])
                  setUploadStatus({})
                }}
              >
                Limpar Tudo
              </Button>
              <Button
                onClick={uploadFiles}
                disabled={files.length === 0 || uploading || isPending}
              >
                {uploading || isPending
                  ? 'Processando...'
                  : 'Processar Arquivos'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="instrucoes">
          <Card>
            <CardHeader>
              <CardTitle>Instruções para Upload</CardTitle>
              <CardDescription>
                Como preparar e carregar os extratos corretamente
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Formato Aceito</AlertTitle>
                <AlertDescription>
                  Apenas arquivos PDF de extratos analíticos são aceitos pelo
                  sistema.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <h3 className="font-medium text-lg">Preparação dos Extratos</h3>
                <p>Antes de fazer upload, certifique-se de que:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Os arquivos PDF estão desprotegidos (sem senha)</li>
                  <li>Cada arquivo contém apenas um extrato</li>
                  <li>Os PDFs estão legíveis e não estão corrompidos</li>
                  <li>Os extratos seguem o formato padrão</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium text-lg">Processo de Upload</h3>
                <ol className="list-decimal pl-6 space-y-2">
                  <li>
                    Selecione os arquivos arrastando para a área de upload ou
                    clicando em &quot;Selecionar Arquivos&quot;
                  </li>
                  <li>
                    Verifique se todos os arquivos estão corretamente listados
                  </li>
                  <li>
                    Clique em &quot;Processar Arquivos&quot; para iniciar o
                    upload e processamento
                  </li>
                  <li>Aguarde até que todos os arquivos sejam processados</li>
                  <li>
                    Verifique o status de cada arquivo após o processamento
                  </li>
                </ol>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium text-lg">Resolução de Problemas</h3>
                <p>Se o processamento falhar:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Verifique se o arquivo PDF está no formato correto</li>
                  <li>
                    Certifique-se de que o extrato possui todos os dados
                    obrigatórios
                  </li>
                  <li>Tente converter o PDF novamente se estiver corrompido</li>
                  <li>
                    Entre em contato com o suporte caso o problema persista
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Diálogo de visualização de arquivo */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Visualização do Arquivo</DialogTitle>
            <DialogDescription>Prévia do conteúdo do PDF</DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-auto min-h-[60vh]">
            {previewFile && (
              <iframe
                src={previewFile}
                className="w-full h-full border-0"
                title="PDF Preview"
              />
            )}
          </div>

          <DialogFooter className="mt-4">
            <Button onClick={() => setIsPreviewOpen(false)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
