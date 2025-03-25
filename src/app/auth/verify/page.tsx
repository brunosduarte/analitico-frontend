import { Metadata } from "next";
import { VerifyForm } from "@/components/auth/verify-form";

export const metadata: Metadata = {
  title: "Verificação 2FA - Extratos Portuários",
  description: "Verifique sua identidade para continuar",
};

export default function VerifyPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
      <VerifyForm />
    </div>
  );
}