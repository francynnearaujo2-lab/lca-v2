'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const PROFILES = [
  { icon: '😔', label: 'Desempregado', desc: 'Precisa se recolocar rápido e não sabe por onde começar', color: 'border-red-500/30 bg-red-500/5' },
  { icon: '🔄', label: 'Em transição', desc: 'Quer mudar de área mas não sabe como posicionar o perfil', color: 'border-amber-500/30 bg-amber-500/5' },
  { icon: '🎓', label: 'Recém-formado', desc: 'Primeiro emprego — precisa se destacar sem experiência', color: 'border-blue-500/30 bg-blue-500/5' },
  { icon: '😤', label: 'Insatisfeito', desc: 'Tem emprego mas quer algo melhor — com sigilo e estratégia', color: 'border-emerald-500/30 bg-emerald-500/5' },
]

const MODULES = [
  { icon: '🔍', title: 'Diagnóstico Real', desc: 'IA lê seu LinkedIn e currículo linha por linha. Score real + o que está afastando recrutadores.' },
  { icon: '✨', title: 'Otimização LinkedIn', desc: 'Sua headline e seção "Sobre" reescritas com suas palavras reais — não templates genéricos.' },
  { icon: '🎯', title: 'Vagas Ocultas', desc: 'Boolean searches + links diretos no LinkedIn para vagas antes de todo mundo. Estratégia de abordagem a recrutadores.' },
  { icon: '📄', title: 'Currículo ATS', desc: 'Currículo reescrito e otimizado para passar pelos filtros automáticos das empresas.' },
  { icon: '🎯', title: 'Match com Vaga', desc: 'Cole a descrição de qualquer vaga → receba gap analysis, currículo adaptado e carta de apresentação.' },
  { icon: '📱', title: 'Autoridade no LinkedIn', desc: '30 posts prontos com a sua voz para atrair recrutadores organicamente — sem precisar criar do zero.' },
  { icon: '🎤', title: 'Preparação de Entrevistas', desc: '30 perguntas + respostas usando seus casos reais + scripts de negociação salarial para o seu setor.' },
]

const FAQS = [
  { q: 'É realmente grátis para começar?', a: 'Sim. O diagnóstico do perfil é 100% gratuito, sem cartão de crédito. Você vê o valor antes de pagar qualquer coisa.' },
  { q: 'O conteúdo gerado é genérico?', a: 'Não. A IA usa o texto real do seu LinkedIn e currículo para dar feedback específico. Nada de templates.' },
  { q: 'Funciona para qualquer área?', a: 'Sim — Marketing, TI, Finanças, RH, Saúde, Direito, Engenharia, Vendas e mais. Você pode cadastrar até 3 áreas ao mesmo tempo.' },
  { q: 'Posso cancelar quando quiser?', a: 'Sim. Sem contrato, sem multa. Cancele a qualquer momento pelo painel.' },
  { q: 'Em quanto tempo vejo resultado?', a: 'A maioria dos usuários relata mais visualizações no LinkedIn na primeira semana e primeiras entrevistas em 2-4 semanas.' },
  { q: 'Tenho um emprego mas quero mudar. Funciona com sigilo?', a: 'Sim. A estratégia de vagas ocultas é feita para quem está empregado — sem alertar o empregador atual.' },
]

export default function LandingPage() {
  const [count, setCount] = useState(12400)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  useEffect(() => {
    const target = 12847 + Math.floor(Math.random() * 200)
    const timer = setInterval(() => {
      setCount(c => { if (c >= target) { clearInterval(timer); return target }; return c + Math.ceil((target - c) / 8) })
    }, 80)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen">
      {/* NAV */}
      <nav className="sticky top-0 z-50 border-b border-border/50 bg-surface/90 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center text-lg">💼</div>
            <span className="font-bold text-lg">Career<span className="text-brand">Agent</span></span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="#pricing" className="text-slate-400 hover:text-white text-sm transition-colors hidden sm:block px-3">Preços</Link>
            <Link href="/login" className="btn-ghost text-sm py-2 px-4">Entrar</Link>
            <Link href="/signup" className="btn-primary text-sm py-2 px-4">Começar grátis</Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="max-w-5xl mx-auto px-5 pt-20 pb-16 text-center fade-in">
        <div className="inline-flex items-center gap-2 badge-gold mb-6">
          🇧🇷 Feito para o mercado brasileiro · IA Gratuita
        </div>
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black leading-[1.05] tracking-tight mb-6">
          Seu próximo emprego<br />começa com a <span className="gradient-text">estratégia certa</span>
        </h1>
        <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          IA que analisa seu LinkedIn e currículo de verdade, encontra vagas ocultas e prepara você para entrevistas — tudo em português, tudo personalizado para você.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
          <Link href="/signup" className="btn-gold text-base py-3.5 px-8 inline-flex items-center gap-2 justify-center">
            🚀 Começar gratuitamente agora
          </Link>
          <Link href="#como-funciona" className="btn-ghost text-base py-3.5 px-8 inline-flex items-center gap-2 justify-center">
            Como funciona →
          </Link>
        </div>
        <p className="text-slate-500 text-sm">
          <span className="text-amber-400 font-bold">{count.toLocaleString('pt-BR')}</span> profissionais usando · Sem cartão de crédito · Cancele quando quiser
        </p>
      </section>

      {/* PARA QUEM É */}
      <section className="max-w-5xl mx-auto px-5 py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-3">Para quem é o CareerAgent?</h2>
        <p className="text-slate-400 text-center mb-10">Qualquer profissional que quer mudar de situação — independente do estágio</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PROFILES.map(p => (
            <div key={p.label} className={`rounded-xl border p-5 ${p.color} transition-all hover:-translate-y-1`}>
              <div className="text-3xl mb-3">{p.icon}</div>
              <h3 className="font-bold mb-1.5">{p.label}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="py-16 border-y border-border/50" id="como-funciona">
        <div className="max-w-4xl mx-auto px-5">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-3">Como funciona</h2>
          <p className="text-slate-400 text-center mb-12">Do cadastro ao emprego em 3 passos</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { n: '1', icon: '📝', title: 'Preencha seu perfil real', desc: 'Cole sua headline do LinkedIn, seção "Sobre" e o texto do seu currículo. A IA analisa o conteúdo real — não um formulário genérico.' },
              { n: '2', icon: '🤖', title: 'Gere seus módulos com IA', desc: 'Cada módulo entrega um output personalizado: desde diagnóstico linha por linha até vagas ocultas e preparação para entrevistas.' },
              { n: '3', icon: '💼', title: 'Aplique e conquiste', desc: 'Copie, adapte e use. Siga o Plano de 90 Dias personalizado e acompanhe seu progresso até a oferta chegar.' },
            ].map(step => (
              <div key={step.n} className="text-center">
                <div className="w-12 h-12 rounded-full bg-brand text-white font-black text-xl flex items-center justify-center mx-auto mb-4">{step.n}</div>
                <div className="text-3xl mb-3">{step.icon}</div>
                <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MÓDULOS */}
      <section className="max-w-6xl mx-auto px-5 py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-3">7 módulos que mudam sua carreira</h2>
        <p className="text-slate-400 text-center mb-10">Tudo que você precisa para ser contratado, em um só lugar</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {MODULES.map(m => (
            <div key={m.title} className="card p-5 hover:border-brand/50 hover:-translate-y-1 transition-all duration-200 group">
              <div className="text-2xl mb-3">{m.icon}</div>
              <h3 className="font-semibold mb-1.5 text-sm group-hover:text-brand transition-colors">{m.title}</h3>
              <p className="text-slate-400 text-xs leading-relaxed">{m.desc}</p>
            </div>
          ))}
          <div className="card p-5 border-gold/30 bg-gold/5 flex flex-col justify-center text-center">
            <div className="text-2xl mb-2">🗓️</div>
            <h3 className="font-semibold mb-1.5 text-sm text-amber-400">Plano 90 Dias</h3>
            <p className="text-slate-400 text-xs">Cronograma semana a semana para conseguir o emprego</p>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="bg-surface-card border-y border-border py-16">
        <div className="max-w-5xl mx-auto px-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center mb-14">
            {[['12.847+', 'Profissionais atendidos'], ['87%', 'Conseguem entrevistas em 30 dias'], ['3,2x', 'Mais visualizações no LinkedIn'], ['R$0', 'Para começar']].map(([n, l]) => (
              <div key={l}>
                <div className="text-3xl sm:text-4xl font-black text-brand mb-1">{n}</div>
                <div className="text-slate-400 text-sm">{l}</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: 'Mariana S.', role: 'Analista de Marketing', result: 'Recolocada em 23 dias', text: 'O módulo de vagas ocultas foi surreal. Encontrei uma vaga que nunca teria aparecido para mim e consegui o emprego dos sonhos.' },
              { name: 'Carlos M.', role: 'Desenvolvedor → UX Designer', result: 'Mudou de área em 45 dias', text: 'Estava há 2 anos querendo mudar para UX e não sabia como posicionar minha experiência. O app me mostrou exatamente o que fazer.' },
              { name: 'Letícia R.', role: 'Recém-formada em Direito', result: '3 entrevistas na primeira semana', text: 'Primeiro emprego sem experiência é difícil. A IA me ajudou a valorizar meu estágio e projetos acadêmicos de um jeito que impressionou os recrutadores.' },
            ].map(t => (
              <div key={t.name} className="card p-5">
                <div className="flex items-center gap-1 mb-3">{'⭐⭐⭐⭐⭐'.split('').map((s, i) => <span key={i} className="text-amber-400 text-sm">{s}</span>)}</div>
                <p className="text-slate-300 text-sm leading-relaxed mb-4">"{t.text}"</p>
                <div>
                  <p className="font-semibold text-sm">{t.name}</p>
                  <p className="text-slate-500 text-xs">{t.role} · <span className="text-emerald-400">{t.result}</span></p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="max-w-5xl mx-auto px-5 py-20" id="pricing">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-3">Preços simples, sem surpresas</h2>
        <p className="text-slate-400 text-center mb-12">Comece grátis. Atualize quando quiser.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">

          {/* Free */}
          <div className="card p-6">
            <div className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Grátis</div>
            <div className="text-4xl font-black mb-1">R$0</div>
            <div className="text-slate-500 text-sm mb-6">Para sempre</div>
            <ul className="space-y-2.5 mb-8 text-sm">
              {['✅ Diagnóstico do perfil', '✅ Score do LinkedIn', '✅ Top 10 palavras-chave', '❌ Módulos completos', '❌ Currículo ATS', '❌ Vagas ocultas'].map(f => (
                <li key={f} className={`flex items-center gap-2 ${f.startsWith('❌') ? 'text-slate-500' : 'text-slate-300'}`}>{f}</li>
              ))}
            </ul>
            <Link href="/signup" className="btn-ghost w-full text-center py-2.5 block">Começar grátis</Link>
          </div>

          {/* Pro - destacado */}
          <div className="card p-6 border-brand relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand text-white text-xs font-bold px-4 py-1 rounded-full">MAIS POPULAR</div>
            <div className="text-sm font-semibold text-brand uppercase tracking-wider mb-2">Pro</div>
            <div className="text-4xl font-black mb-1">R$47<span className="text-xl font-normal text-slate-400">/mês</span></div>
            <div className="text-slate-500 text-sm mb-6">ou R$397/ano (30% off)</div>
            <ul className="space-y-2.5 mb-8 text-sm">
              {['✅ Tudo do Grátis', '✅ 7 módulos completos', '✅ Currículo ATS por área', '✅ Vagas ocultas + links', '✅ Até 3 áreas simultâneas', '✅ Plano 90 dias', '✅ Regenerações ilimitadas'].map(f => (
                <li key={f} className="text-slate-300 flex items-center gap-2">{f}</li>
              ))}
            </ul>
            <Link href="/signup" className="btn-primary w-full text-center py-2.5 block">Começar com Pro</Link>
          </div>

          {/* Premium */}
          <div className="card p-6 border-gold/40">
            <div className="text-sm font-semibold text-amber-400 uppercase tracking-wider mb-2">Premium</div>
            <div className="text-4xl font-black mb-1">R$97<span className="text-xl font-normal text-slate-400">/mês</span></div>
            <div className="text-slate-500 text-sm mb-6">ou R$797/ano (32% off)</div>
            <ul className="space-y-2.5 mb-8 text-sm">
              {['✅ Tudo do Pro', '✅ Match com vagas ilimitado', '✅ Currículo por vaga específica', '✅ Análise de oferta salarial', '✅ Suporte prioritário', '✅ Novos módulos em primeira mão'].map(f => (
                <li key={f} className="text-slate-300 flex items-center gap-2">{f}</li>
              ))}
            </ul>
            <Link href="/signup" className="btn-gold w-full text-center py-2.5 block">Começar com Premium</Link>
          </div>
        </div>
        <p className="text-center text-slate-500 text-sm mt-8">🔒 Pagamento seguro · Cancele a qualquer momento · Sem taxa de cancelamento</p>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-5 pb-20">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10">Perguntas frequentes</h2>
        <div className="space-y-2">
          {FAQS.map((faq, i) => (
            <div key={i} className="card overflow-hidden">
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full text-left px-5 py-4 flex items-center justify-between gap-4">
                <span className="font-medium text-sm sm:text-base">{faq.q}</span>
                <span className={`text-brand transition-transform flex-shrink-0 ${openFaq === i ? 'rotate-45' : ''}`}>+</span>
              </button>
              {openFaq === i && (
                <div className="px-5 pb-4 text-slate-400 text-sm leading-relaxed border-t border-border/50 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="bg-brand/10 border-y border-brand/20 py-20 text-center px-5">
        <h2 className="text-3xl sm:text-4xl font-black mb-4">Pronto para mudar sua vida profissional?</h2>
        <p className="text-slate-400 mb-8 text-lg max-w-xl mx-auto">Junte-se a mais de 12 mil profissionais que já estão usando IA para acelerar a recolocação.</p>
        <Link href="/signup" className="btn-gold text-lg py-4 px-10 inline-flex items-center gap-2">
          🚀 Começar gratuitamente — sem cartão
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border/50 py-10 px-5">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-brand flex items-center justify-center text-base">💼</div>
            <span className="font-bold">Career<span className="text-brand">Agent</span></span>
          </div>
          <div className="flex gap-6 text-sm text-slate-400">
            <Link href="#pricing" className="hover:text-white transition-colors">Preços</Link>
            <Link href="/login" className="hover:text-white transition-colors">Entrar</Link>
            <Link href="/signup" className="hover:text-white transition-colors">Cadastrar</Link>
          </div>
          <p className="text-slate-600 text-sm">© 2025 CareerAgent · Feito com ❤️ no Brasil</p>
        </div>
      </footer>
    </div>
  )
}
