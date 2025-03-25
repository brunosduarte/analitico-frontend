"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(6, { message: "Senha deve ter pelo menos 6 caracteres" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      setError(null);
      setIsPending(true);

      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Credenciais inválidas");
        return;
      }

      // Verificar se exige verificação 2FA
      if (result?.url?.includes("verify")) {
        router.push("/auth/verify");
        return;
      }

      router.push(callbackUrl);
    } catch (error) {
      setError("Ocorreu um erro durante o login");
      console.log(error)
    } finally {
      setIsPending(false);
    }
  };

  const socialLogin = async (provider: string) => {
    try {
      setIsPending(true);
      await signIn(provider, { callbackUrl });
    } catch (error) {
      setError(`Erro ao fazer login com ${provider}`);
      console.log(error)
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>
          Entre com suas credenciais para acessar sua conta
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="seu@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="******" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={isPending}
            >
              {isPending ? "Autenticando..." : "Entrar"}
            </Button>
          </form>
        </Form>

        <div className="mt-4 text-center">
          <Separator className="my-4" />
          <p className="text-sm text-muted-foreground mb-4">Ou entre com</p>
          <div className="flex space-x-2 justify-center">
            <Button 
              variant="outline" 
              onClick={() => socialLogin("google")}
              disabled={isPending}
            >
              Google
            </Button>
            <Button 
              variant="outline" 
              onClick={() => socialLogin("facebook")}
              disabled={isPending}
            >
              Facebook
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Não tem uma conta?{" "}
          <Button 
            variant="link" 
            className="p-0" 
            onClick={() => router.push("/auth/register")}
          >
            Registre-se
          </Button>
        </p>
      </CardFooter>
    </Card>
  );
}