"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KeyIcon, ShieldIcon } from "lucide-react";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return <div>Carregando...</div>;
  }

  if (!session) {
    router.push("/auth/login");
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Perfil</h1>
        <p className="text-muted-foreground">
          Gerencie suas informações e configurações de conta
        </p>
      </div>

      <Tabs defaultValue="informacoes">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="informacoes">Informações</TabsTrigger>
          <TabsTrigger value="seguranca">Segurança</TabsTrigger>
          <TabsTrigger value="preferencias">Preferências</TabsTrigger>
        </TabsList>
        
        <TabsContent value="informacoes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
              <CardDescription>
                Suas informações básicas de perfil
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Nome</p>
                  <p className="text-base">{session.user.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="text-base">{session.user.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Função</p>
                  <p className="text-base capitalize">{session.user.role}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Membro desde</p>
                  <p className="text-base">01/01/2023</p>
                </div>
              </div>
              <Button>Editar Informações</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="seguranca" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Segurança da Conta</CardTitle>
              <CardDescription>
                Atualize suas credenciais e configurações de segurança
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <KeyIcon className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Senha</p>
                      <p className="text-sm text-muted-foreground">Última atualização há 3 meses</p>
                    </div>
                  </div>
                  <Button variant="outline">Alterar</Button>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <ShieldIcon className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Autenticação em Dois Fatores</p>
                      <p className="text-sm text-muted-foreground">Ativar segurança adicional</p>
                    </div>
                  </div>
                  <Button variant="outline">Configurar</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="preferencias" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Preferências</CardTitle>
              <CardDescription>
                Personalize sua experiência no sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Configurações de preferências do usuário...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}