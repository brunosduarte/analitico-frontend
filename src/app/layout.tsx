import type { Metadata, Viewport } from 'next'
import { Inter, Roboto_Mono as RobotoMono } from 'next/font/google'
import './globals.css'

import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Providers } from '@/providers'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const robotoMono = RobotoMono({
  subsets: ['latin'],
  variable: '--font-roboto-mono',
  display: 'swap',
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
    <html
      lang="pt-BR"
      className={`${inter.variable} ${robotoMono.variable}`}
      // suppressHydrationWarning
    >
      <body>
        <Providers>
          <div className="flex min-h-screen flex-col bg-background antialiased">
            <Header />
            <main className="flex-1 container py-6">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  )
}
