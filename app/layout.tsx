import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CareerAgent — Recolocação Profissional com IA',
  description: 'IA que analisa seu LinkedIn e currículo de verdade, encontra vagas ocultas e prepara você para entrevistas. 100% em português, para o mercado brasileiro.',
  keywords: 'recolocação profissional, LinkedIn, currículo ATS, vagas ocultas, preparação entrevista, IA carreira',
  openGraph: {
    title: 'CareerAgent — Recolocação Profissional com IA',
    description: 'Seu próximo emprego começa com a estratégia certa. IA personalizada para o mercado brasileiro.',
    type: 'website',
    locale: 'pt_BR',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  )
}
