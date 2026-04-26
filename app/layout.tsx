import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'LinkedIn Career Agent — Conquiste seu emprego com IA',
  description: 'Ferramenta SaaS com IA gratuita para otimizar seu LinkedIn, encontrar vagas ocultas e conseguir emprego.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
