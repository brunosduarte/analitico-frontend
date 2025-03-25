import { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Login - Extratos Portuários",
  description: "Faça login para acessar os extratos portuários",
};

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
      <LoginForm />
    </div>
  );
}