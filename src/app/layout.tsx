import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Providers } from "@/components/provider";
import { AuthProvider } from "@/components/auth/auth-provider"; // Importar Provider do Auth

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Extratos Portuários",
  description: "Sistema de visualização e gestão de extratos de trabalhadores portuários",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className} vsc-initialized="true">
        <AuthProvider> {/* Adicionar o AuthProvider */}
          <Providers>
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1 container py-6">{children}</main>
              <Footer />
            </div>
          </Providers>
        </AuthProvider>
      </body>
    </html>
  );
}