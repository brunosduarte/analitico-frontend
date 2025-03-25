import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldXIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "Acesso Negado - Extratos Portuários",
  description: "Você não tem permissão para acessar esta página",
};

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
      <div className="text-center">
        <ShieldXIcon className="h-20 w-20 text-destructive mx-auto mb-6" />
        <h1 className="text-3xl font-bold mb-2">Acesso Negado</h1>
        <p className="text-muted-foreground mb-6">
          Você não tem permissão para acessar esta página.
        </p>
        <div className="flex justify-center gap-4">
          <Button asChild>
            <Link href="/dashboard">Ir para o Dashboard</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">Voltar para Página Inicial</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}