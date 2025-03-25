import { Metadata } from "next";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Registro - Extratos Portuários",
  description: "Registre-se para acessar os extratos portuários",
};

export default function RegisterPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
      <RegisterForm />
    </div>
  );
}