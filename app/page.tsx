'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const features = [
  { icon: '🔍', title: 'Diagnóstico do Mercado', desc: 'Score real do perfil + top 25 palavras-chave + análise da concorrência.' },
  { icon: '✨', title: 'Otimização do LinkedIn', desc: 'Headlines magnéticas, resumo com storytelling e top 50 skills.' },
  { icon: '🎯', title: 'Vagas Ocultas', desc: '20 empresas-alvo e scripts prontos para acessar os 80% das vagas não publicadas.' },
  { icon: '📱', title: 'Calendário de Conteúdo', desc: '30 posts prontos para posicionar você como autoridade no LinkedIn.' },
  { icon: '🛠️', title: 'Ferramentas', desc: 'Guia de 30+ ferramentas gratuitas e pagas para acelerar sua busca.' },
  { icon: '📄', title: 'Currículo ATS', desc: 'Currículo completo otimizado para passar pelos filtros automáticos.' },
  { icon: '🎤', title: 'Entrevistas', desc: '30 perguntas + respostas modelo e scripts de negociação salarial.' },
  { icon: '🗓️', title: 'Plano 90 Dias', desc: 'Cronograma semana a semana personalizado com KPIs e metas.' },
]

export default function LandingPage() {
  const [count, setCount] = useState(12400)

  useEffect(() => {
    const target = 12847 + Math.floor(Math.random() * 150)
    const timer = setInterval(() => {
      setCount(c => { if (c >= target) { clearInterval(timer); return target } return c + Math.ceil((target - c) / 8) })
    }, 80)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-border/50 bg-surface/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center text-lg">💼</div>
            <span className="font-bold text-lg">LinkedIn <span className="text-brand">Career Agent</span></span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="btn-ghost text-sm py-2 px-4">Entrar</Link>
            <Link href="/signup" className="btn-primary text-sm py-2 px-4">Começar Grátis</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center fade-in">
        <div className="badge-gold mb-6 mx-auto">🚀 Powered by Groq AI · 100% Gratuito</div>
        <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tight mb-6">
          Conquiste seu emprego<br />com <span className="gradient-text">Inteligência Artificial</span>
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          8 módulos de IA que otimizam seu LinkedIn, revelam vagas ocultas e preparam você para entrevistas — tudo gratuito.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
          <Link href="/signup" className="btn-gold text-base py-3.5 px-8 inline-flex items-center gap-2 justify-center">
            🎯 Criar minha estratégia grátis
          </Link>
          <Link href="#como-funciona" className="btn-ghost text-base py-3.5 px-8 inline-flex items-center gap-2 justify-center">
            Como funciona ↓
          </Link>
        </div>
        <p className="text-slate-500 text-sm">
          <span className="text-amber-400 font-bold">{count.toLocaleString('pt-BR')}</span> profissionais usando · Sem cartão de crédito
        </p>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-20" id="como-funciona">
        <h2 className="text-3xl font-bold text-center mb-3">8 módulos de IA para sua carreira</h2>
        <p className="text-slate-400 text-center mb-12">Tudo que você precisa para ser contratado, em um só lugar</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f) => (
            <div key={f.title} className="card p-5 hover:border-brand/50 hover:-translate-y-1 transition-all duration-200 group cursor-default">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-semibold mb-1.5 group-hover:text-brand transition-colors">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Steps */}
      <section className="max-w-3xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Como funciona</h2>
        <div className="space-y-8">
          {[
            ['1', 'Crie sua conta gratuita', 'Cadastro em 30 segundos com email ou Google.'],
            ['2', 'Preencha seu perfil', 'Formulário de 4 etapas com suas informações profissionais.'],
            ['3', 'Gere com IA', 'Um clique por módulo — a IA cria conteúdo 100% personalizado.'],
            ['4', 'Aplique e conquiste', 'Copie, use e siga o Plano de 90 Dias para conseguir o emprego.'],
          ].map(([n, title, desc]) => (
            <div key={n} className="flex gap-5 items-start">
              <div className="w-10 h-10 rounded-full bg-brand flex items-center justify-center font-bold flex-shrink-0">{n}</div>
              <div>
                <h3 className="font-semibold text-lg mb-1">{title}</h3>
                <p className="text-slate-400">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="card mx-6 max-w-4xl md:mx-auto mb-20 p-12 text-center border-brand/30">
        <h2 className="text-3xl font-bold mb-3">Pronto para transformar sua carreira?</h2>
        <p className="text-slate-400 mb-8">Junte-se a milhares de profissionais que já aceleraram sua recolocação com IA.</p>
        <Link href="/signup" className="btn-gold text-lg py-4 px-10 inline-flex items-center gap-2">
          🚀 Começar gratuitamente agora
        </Link>
      </section>

      <footer className="border-t border-border/50 py-8 text-center text-slate-500 text-sm">
        LinkedIn Career Agent · Powered by Groq AI · Para o mercado brasileiro
      </footer>
    </div>
  )
}
