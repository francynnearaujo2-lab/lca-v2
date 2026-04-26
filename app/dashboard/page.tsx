'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { MODULES } from '@/lib/prompts'

const STEPS = [
  { id: 1, title: '👋 Informações Pessoais', fields: [
    { id: 'nome', label: 'Nome Completo', type: 'text', placeholder: 'Ex: Maria Silva', required: true },
    { id: 'email_display', label: 'Email', type: 'email', placeholder: 'seu@email.com', required: false },
  ]},
  { id: 2, title: '💼 Perfil Profissional', fields: [
    { id: 'area', label: 'Área de Atuação', type: 'text', placeholder: 'Ex: Marketing Digital', required: true },
    { id: 'cargo', label: 'Cargo Atual/Último', type: 'text', placeholder: 'Ex: Gerente de Marketing', required: true },
    { id: 'experiencia', label: 'Anos de Experiência', type: 'select', options: ['0-1 ano','1-3 anos','3-5 anos','5-10 anos','10+ anos'], required: true },
    { id: 'setor', label: 'Setor/Indústria', type: 'text', placeholder: 'Ex: SaaS, Varejo, Saúde', required: true },
    { id: 'especializacoes', label: 'Especializações', type: 'textarea', placeholder: 'Ex: Google Ads, Power BI, Python...', required: false },
    { id: 'certificacoes', label: 'Certificações', type: 'textarea', placeholder: 'Ex: PMP, Google Analytics...', required: false },
  ]},
  { id: 3, title: '🎯 Objetivo de Carreira', fields: [
    { id: 'objetivo', label: 'Principal Objetivo', type: 'select', options: ['Recolocação rápida no mesmo setor','Crescimento e promoção','Mudança de área','Primeiro emprego','Trabalho remoto/internacional'], required: true },
    { id: 'tipo_empresa', label: 'Tipo de Empresa', type: 'select', options: ['Qualquer','Startup','Grande empresa','Multinacional','Consultoria'], required: false },
    { id: 'modalidade', label: 'Modalidade', type: 'select', options: ['Qualquer','Presencial','Híbrido','100% Remoto'], required: false },
  ]},
  { id: 4, title: '📍 Localização', fields: [
    { id: 'cidade', label: 'Cidade/Estado', type: 'text', placeholder: 'Ex: São Paulo, SP', required: true },
    { id: 'disponibilidade', label: 'Disponibilidade', type: 'select', options: ['Imediata','15 dias','30 dias','60 dias'], required: false },
    { id: 'salario', label: 'Faixa Salarial (opcional)', type: 'select', options: ['Não informar','Até R$3.000','R$3-5k','R$5-8k','R$8-12k','R$12-20k','Acima R$20k'], required: false },
  ]},
]

export default function DashboardPage() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [completedModules, setCompletedModules] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<Record<string, string>>({})

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUser(user)
      setForm(f => ({ ...f, email_display: user.email || '' }))

      const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (profile) { setProfile(profile); setStep(5) }

      const { data: modules } = await supabase.from('module_results').select('module_id').eq('user_id', user.id)
      if (modules) setCompletedModules(modules.map((m: any) => m.module_id))

      setLoading(false)
    }
    init()
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
  }

  async function saveProfile() {
    if (!user) return
    const data = { id: user.id, ...form, updated_at: new Date().toISOString() }
    await supabase.from('profiles').upsert(data)
    setProfile(data)
    setStep(5)
  }

  function nextStep() {
    const current = STEPS[step - 1]
    const missing = current?.fields.filter(f => f.required && !form[f.id])
    if (missing?.length) return alert('Preencha os campos obrigatórios')
    if (step === STEPS.length) saveProfile()
    else setStep(s => s + 1)
  }

  const pct = Math.round((completedModules.length / MODULES.length) * 100)
  const days = [90, 80, 70, 60, 50, 40, 30, 20][completedModules.length] || 20

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-border border-t-brand rounded-full spin" />
    </div>
  )

  // Onboarding
  if (step > 0 && step <= STEPS.length) {
    const current = STEPS[step - 1]
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          <div className="flex gap-2 mb-8 justify-center">
            {STEPS.map((s, i) => (
              <div key={s.id} className={`flex items-center gap-2 ${i < STEPS.length - 1 ? 'flex-1' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${i + 1 < step ? 'bg-emerald-500 text-white' : i + 1 === step ? 'bg-brand text-white' : 'bg-border text-slate-400'}`}>
                  {i + 1 < step ? '✓' : i + 1}
                </div>
                {i < STEPS.length - 1 && <div className={`h-0.5 flex-1 ${i + 1 < step ? 'bg-emerald-500' : 'bg-border'}`} />}
              </div>
            ))}
          </div>
          <div className="card p-6">
            <h2 className="text-xl font-bold mb-1">{current.title}</h2>
            <p className="text-slate-400 text-sm mb-6">Etapa {step} de {STEPS.length}</p>
            <div className="space-y-4">
              {current.fields.map(field => (
                <div key={field.id}>
                  <label className="label">{field.label}{field.required && <span className="text-red-400 ml-1">*</span>}</label>
                  {field.type === 'textarea' ? (
                    <textarea className="input h-20 resize-none" placeholder={field.placeholder} value={form[field.id] || ''} onChange={e => setForm(f => ({ ...f, [field.id]: e.target.value }))} />
                  ) : field.type === 'select' ? (
                    <select className="input" value={form[field.id] || ''} onChange={e => setForm(f => ({ ...f, [field.id]: e.target.value }))}>
                      <option value="">Selecione...</option>
                      {field.options?.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : (
                    <input type={field.type} className="input" placeholder={field.placeholder} value={form[field.id] || ''} onChange={e => setForm(f => ({ ...f, [field.id]: e.target.value }))} disabled={field.id === 'email_display'} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              {step > 1 && <button onClick={() => setStep(s => s - 1)} className="btn-ghost flex-1">← Anterior</button>}
              <button onClick={nextStep} className={`${step === 1 ? 'btn-primary' : 'btn-gold'} flex-1`}>
                {step === STEPS.length ? '🚀 Criar minha estratégia' : 'Próximo →'}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Dashboard
  if (!profile && step === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-3">Bem-vinda! 👋</h2>
          <p className="text-slate-400 mb-6">Vamos criar sua estratégia de carreira personalizada.</p>
          <button onClick={() => setStep(1)} className="btn-gold">Começar agora →</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-surface-card/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center">💼</div>
            <div>
              <p className="text-xs text-slate-400">Bem-vinda de volta,</p>
              <p className="font-bold leading-none">{profile?.nome?.split(' ')[0]}</p>
            </div>
          </div>
          <div className="flex gap-3 items-center">
            <button onClick={() => setStep(1)} className="btn-ghost text-sm py-2 px-4">✏️ Editar perfil</button>
            <button onClick={handleLogout} className="text-slate-400 hover:text-white text-sm transition-colors">Sair</button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Progress */}
        <div className="card p-6 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <h3 className="font-semibold">Seu Progresso</h3>
            <div className="flex gap-6">
              <div className="text-center"><span className="block text-2xl font-black text-brand">{completedModules.length}</span><span className="text-xs text-slate-400">concluídos</span></div>
              <div className="text-center"><span className="block text-2xl font-black">{MODULES.length}</span><span className="text-xs text-slate-400">módulos</span></div>
            </div>
          </div>
          <div className="h-2.5 bg-surface rounded-full overflow-hidden mb-3">
            <div className="h-full bg-gradient-to-r from-brand to-brand-light rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">{pct}% concluído</span>
            <span className="badge-gold text-xs">⏱️ ~{days} dias para o emprego</span>
          </div>
        </div>

        {/* Modules */}
        <h2 className="font-bold text-lg mb-4">🧩 Seus 7 Módulos de Carreira</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
          {MODULES.map(mod => {
            const done = completedModules.includes(mod.id)
            return (
              <Link key={mod.id} href={`/module/${mod.id}`}
                className={`card p-5 hover:border-brand/60 hover:-translate-y-1 transition-all duration-200 group relative overflow-hidden ${done ? 'border-emerald-500/30' : ''}`}>
                <div className={`absolute top-0 left-0 right-0 h-0.5 ${done ? 'bg-emerald-500' : 'bg-border group-hover:bg-brand'} transition-colors`} />
                <div className="flex justify-between items-start mb-3">
                  <span className="text-2xl">{mod.icon}</span>
                  <span className={done ? 'badge-green text-xs' : 'badge-gray text-xs'}>
                    {done ? '✅ Pronto' : '⬜ Pendente'}
                  </span>
                </div>
                <h3 className="font-semibold mb-1 text-sm group-hover:text-brand transition-colors">{mod.title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed mb-3">{mod.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">⏱️ {mod.time}</span>
                  <span className="text-brand text-sm group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </Link>
            )
          })}
        </div>

        {/* 90-day plan */}
        <div className="card p-8 text-center border-gold/30 bg-gradient-to-br from-surface-card to-surface">
          <h3 className="text-xl font-bold mb-2">🗓️ Plano de Ação 90 Dias</h3>
          <p className="text-slate-400 mb-6">Cronograma semana a semana personalizado com KPIs e metas concretas.</p>
          {completedModules.length >= 3
            ? <Link href="/module/plano90" className="btn-gold inline-flex items-center gap-2">✨ Gerar meu Plano de 90 Dias</Link>
            : <p className="text-slate-500 text-sm">🔒 Complete pelo menos 3 módulos para desbloquear</p>
          }
        </div>
      </main>
    </div>
  )
}
