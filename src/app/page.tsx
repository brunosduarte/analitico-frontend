import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { BarChart3, FileText, Upload } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex-1">
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Sistema de Extratos Portuários
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed dark:text-gray-400">
                Visualize, analise e gerencie extratos de trabalhadores
                portuários com facilidade.
              </p>
            </div>
            <div className="space-x-4">
              <Button asChild>
                <Link href="/dashboard">Ver Dashboard</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/extratos">Explorar Extratos</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
        <div className="container grid grid-cols-1 gap-8 md:grid-cols-3 px-4 md:px-6">
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <BarChart3 className="h-8 w-8" />
              <div>
                <CardTitle>Dashboard Analítico</CardTitle>
                <CardDescription>
                  Visualize dados importantes em um relance
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Gráficos e indicadores para acompanhar tendências de ganhos,
                distribuição por categoria e dados sobre os principais tomadores
                de serviço.
              </p>
              <Button asChild className="w-full mt-4">
                <Link href="/dashboard">Acessar Dashboard</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <FileText className="h-8 w-8" />
              <div>
                <CardTitle>Consulta de Extratos</CardTitle>
                <CardDescription>
                  Acesse e filtre extratos facilmente
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Consulte extratos por matrícula, nome, categoria, período e
                mais. Visualize detalhes como trabalhos realizados e
                rendimentos.
              </p>
              <Button asChild className="w-full mt-4">
                <Link href="/extratos">Ver Extratos</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <Upload className="h-8 w-8" />
              <div>
                <CardTitle>Upload de Extratos</CardTitle>
                <CardDescription>Importe novos extratos em PDF</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Faça upload de extratos em PDF e tenha-os processados
                automaticamente pelo sistema, tornando os dados disponíveis para
                consulta.
              </p>
              <Button asChild className="w-full mt-4">
                <Link href="/upload">Fazer Upload</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
