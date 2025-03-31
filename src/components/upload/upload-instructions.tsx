'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, FileWarning, FileText, CheckCircle } from 'lucide-react'
import { UPLOAD_LIMITS } from '@/lib/constants'

/**
 * Componente UploadInstructions: Instruções para upload de extratos
 */
export function UploadInstructions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Instruções para Upload</CardTitle>
        <CardDescription>
          Como preparar e carregar os extratos corretamente
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Formato Aceito</AlertTitle>
          <AlertDescription>
            Apenas arquivos PDF de extratos analíticos são aceitos pelo sistema.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <h3 className="font-medium text-lg flex items-center">
            <FileWarning className="h-5 w-5 mr-2 text-amber-500" />
            Preparação dos Extratos
          </h3>
          <p>Antes de fazer upload, certifique-se de que:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Os arquivos PDF estão desprotegidos (sem senha)</li>
            <li>Cada arquivo contém apenas um extrato</li>
            <li>Os PDFs estão legíveis e não estão corrompidos</li>
            <li>Os extratos seguem o formato padrão</li>
            <li>
              O tamanho máximo permitido é{' '}
              {UPLOAD_LIMITS.MAX_FILE_SIZE / (1024 * 1024)}MB
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium text-lg flex items-center">
            <FileText className="h-5 w-5 mr-2 text-blue-500" />
            Processo de Upload
          </h3>
          <ol className="list-decimal pl-6 space-y-2">
            <li>
              Selecione os arquivos arrastando para a área de upload ou clicando
              em "Selecionar Arquivos"
            </li>
            <li>Verifique se todos os arquivos estão corretamente listados</li>
            <li>
              Clique em "Processar Arquivos" para iniciar o upload e
              processamento
            </li>
            <li>Aguarde até que todos os arquivos sejam processados</li>
            <li>Verifique o status de cada arquivo após o processamento</li>
          </ol>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium text-lg flex items-center">
            <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
            Resolução de Problemas
          </h3>
          <p>Se o processamento falhar:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Verifique se o arquivo PDF está no formato correto</li>
            <li>
              Certifique-se de que o extrato possui todos os dados obrigatórios
            </li>
            <li>Tente converter o PDF novamente se estiver corrompido</li>
            <li>Entre em contato com o suporte caso o problema persista</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
