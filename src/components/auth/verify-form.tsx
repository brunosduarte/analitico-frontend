"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const verifySchema = z.object({
  code: z.string().min(6, { message: "Código deve ter pelo menos 6 dígitos" }).max(6),
});

type VerifyFormValues = z.infer<typeof verifySchema>;

export function VerifyForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const form = useForm<VerifyFormValues>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: "",
    },
  });

  const onSubmit = async (values: VerifyFormValues) => {
    try {
      setError(null);
      setIsPending(true);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-2fa`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: values.code,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Código inválido");
      }

      router.push("/dashboard");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Ocorreu um erro durante a verificação");
      }
    } finally {
      setIsPending(false);
    }
  };

  const resendCode = async () => {
    try {
      setError(null);
      setIsPending(true);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/resend-code`, {
        method: "POST",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Erro ao reenviar código");
      }

      // Mostrar mensagem de sucesso
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Ocorreu um erro ao reenviar o código");
      }
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Verificação em Dois Fatores</CardTitle>
        <CardDescription>
          Digite o código que enviamos para seu telefone ou email
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
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Código de Verificação</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="123456" 
                      {...field} 
                      maxLength={6}
                    />
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
              {isPending ? "Verificando..." : "Verificar"}
            </Button>
          </form>
        </Form>

        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">
            Não recebeu o código?{" "}
            <Button 
              variant="link" 
              className="p-0" 
              onClick={resendCode}
              disabled={isPending}
            >
              Reenviar
            </Button>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}