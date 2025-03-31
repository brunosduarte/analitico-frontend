import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Providers } from '@/providers'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    template: '%s | PnT',
    default: 'PnT',
  },
  description:
    'Sistema de visualização e gestão de extratos de trabalhadores portuários',
  keywords: ['extratos', 'portuários', 'trabalhadores', 'tpa', 'análise'],
  authors: [{ name: 'PnT' }],
}

// Configuração de viewport separada (nova API do Next.js 14)
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      {/* suppressHydrationWarning */}
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* className="min-h-screen bg-background font-sans antialiased" */}
        <Providers>
          <div className="flex min-h-screen flex-col bg-background">
            <Header />
            <main className="flex-1 container py-6">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
    // <html lang="en">
    //   <body
    //     className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    //   >
    //     {children}
    //   </body>
    // </html>
  )
}
