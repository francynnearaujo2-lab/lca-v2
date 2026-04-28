'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { MODULES } from '@/lib/prompts'

const SITUATIONS = [
  { id: 'desempregado', icon: '😔', label: 'Estou desempregado', desc: 'Preciso me recolocar o mais rápido possível', color: 'border-red-500/50 bg-red-500/10 hover:border-red-400' },
  { id: 'transicao', icon: '🔄', label: 'Quero mudar de área', desc: 'Tenho experiência mas quero atuar em outro setor', color: 'border-amber-500/50 bg-amber-500/10 hover:border-amber-400' },
  { id: 'formado', icon: '🎓', label: 'Primeiro emprego', desc: 'Recém-formado buscando a primeira oportunidade', color: 'border-blue-500/50 bg-blue-500/10 hover:border-blue-400' },
  { id: 'insatisfeito', icon: '😤', label: 'Quero mudar de emprego', desc: 'Tenho trabalho mas busco algo melhor, com sigilo', color: 'border-emerald-500/50 bg-emerald-500/10 hover:border-emerald-400' },
]

const SENIORITY = ['Estágio/Trainee', 'Júnior (0-2 anos)', 'Pleno (2-5 anos)', 'Sênior (5-10 anos)', 'Especialista', 'Coordenador/Supervisor', 'Gerente/Líder', 'Diretor', 'C-Level / Sócio']
const OBJECTIVES = ['Recolocação rápida no mesmo setor', 'Crescimento e promoção', 'Mudança de área de atuação', 'Primeiro emprego / Estágio', 'Trabalho remoto ou internacional', 'Empreendedorismo / Freelance']
const MODALITIES = ['Qualquer modalidade', 'Presencial', 'Híbrido', '100% Remoto']
const SALARIES = ['Não informar', 'Até R$3.000', 'R$3.001 a R$5.000', 'R$5.001 a R$8.000', 'R$8.001 a R$12.000', 'R$12.001 a R$20.000', 'Acima de R$20.000']
const LEVELS = ['Ensino Médio', 'Técnico', 'Superior Incompleto', 'Superior Completo', 'Pós-graduação', 'MBA', 'Mestrado', 'Doutorado']

const FIRST_MODULES: Record<string, string> = {
  desempregado: 'diagnostico',
  transicao: 'diagnostico',
  formado: 'curriculo',
  insatisfeito: 'vagas_ocultas',
}

export default function DashboardPage() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [completedModules, setCompletedModules] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<Record<string, string>>({})
  const [areas, setAreas] = useState<string[]>([''])
  const [saving, setSaving] = useState(false)
  const [situation, setSituation] = useState('')

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUser(user)
      setForm(f => ({ ...f, email_display: user.email || '' }))
      const { data: p } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (p) { setProfile(p); setAreas(p.areas?.split(',') || ['']); setSituation(p.situacao || ''); setStep(99) }
      const { data: mods } = await supabase.from('module_results').select('module_id').eq('user_id', user.id)
      if (mods) setCompletedModules(mods.map((m: any) => m.module_id))
      setLoading(false)
    }
    init()
  }, [])

  function setF(key: string, value: string) { setForm(f => ({ ...f, [key]: value })) }
  function addArea() { if (areas.length < 3) setAreas(a => [...a, '']) }
  function setArea(idx: number, val: string) { setAreas(a => a.map((x, i) => i === idx ? val : x)) }
  function removeArea(idx: number) { if (areas.length > 1) setAreas(a => a.filter((_, i) => i !== idx)) }

  function validate(required: string[]) {
    const missing = required.filter(f => !form[f]?.trim())
    if (missing.length) { alert('Preencha os campos obrigatórios'); return false }
    return true
  }

  async function saveProfile() {
    if (!user) return
    setSaving(true)
    await supabase.from('profiles').upsert({
      id: user.id, ...form,
      areas: areas.filter(Boolean).join(', '),
      situacao: situation,
      updated_at: new Date().toISOString(),
    })
    const { data: p } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    setProfile(p)
    setSaving(false)
    setStep(99)
  }

  async function handleLogout() { await supabase.auth.signOut(); router.push('/') }

  const pct = Math.round((completedModules.length / MODULES.length) * 100)
  const days = [90, 78, 65, 52, 40, 28, 18, 10][Math.min(completedModules.length, 7)]
  const nextModule = profile ? FIRST_MODULES[profile.situacao] || MODULES[0].id : MODULES[0].id
  const firstName = profile?.nome?.split(' ')[0] || user?.email?.split('@')[0] || ''

  const StepDots = ({ total = 4 }: { total?: number }) => (
    <div className="flex gap-1.5 mb-6 justify-center">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i < step - 1 ? 'bg-emerald-500 w-6' : i === step - 1 ? 'bg-brand w-6' : 'bg-border w-3'}`} />
      ))}
    </div>
  )

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-border border-t-brand rounded-full spin" />
    </div>
  )

  // ── STEP 0: Situação ────────────────────────────────────────────
  if (step === 0) return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 fade-in">
      <div className="w-full max-w-2xl text-center">
        <div className="text-5xl mb-4">👋</div>
        <h1 className="text-2xl sm:text-3xl font-black mb-2">Bem-vinda! Qual é a sua situação?</h1>
        <p className="text-slate-400 mb-10">Isso nos ajuda a personalizar toda a experiência para você</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          {SITUATIONS.map(s => (
            <button key={s.id} onClick={() => { setSituation(s.id); setF('objetivo', s.label); setStep(1) }}
              className={`rounded-xl border p-5 text-left transition-all cursor-pointer ${s.color}`}>
              <div className="text-3xl mb-2">{s.icon}</div>
              <div className="font-bold mb-1">{s.label}</div>
              <div className="text-slate-400 text-sm">{s.desc}</div>
            </button>
          ))}
        </div>
        <p className="text-slate-600 text-xs">Você pode alterar isso depois a qualquer momento</p>
      </div>
    </div>
  )

  // ── STEP 1: Identidade ──────────────────────────────────────────
  if (step === 1) return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl"><StepDots />
        <div className="card p-6 md:p-8">
          <h2 className="text-xl font-bold mb-1">Sobre você</h2>
          <p className="text-slate-400 text-sm mb-6">Etapa 1 de 4</p>
          <div className="space-y-4">
            <div>
              <label className="label">Nome Completo *</label>
              <input className="input" placeholder="Ex: Maria Silva" value={form.nome||''} onChange={e=>setF('nome',e.target.value)} />
            </div>
            <div>
              <label className="label">Áreas de Atuação * <span className="text-slate-500 font-normal normal-case">(até 3 — maximiza suas chances)</span></label>
              {areas.map((a, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <input className="input flex-1" placeholder={i===0 ? 'Ex: Marketing Digital' : 'Ex: Growth, Vendas B2B...'} value={a} onChange={e=>setArea(i,e.target.value)} />
                  {i > 0 && <button onClick={()=>removeArea(i)} className="text-slate-500 hover:text-red-400 px-2">×</button>}
                </div>
              ))}
              {areas.length < 3 && <button onClick={addArea} className="text-brand text-sm hover:underline">+ Adicionar outra área</button>}
            </div>
            <div>
              <label className="label">Senioridade *</label>
              <select className="input" value={form.senioridade||''} onChange={e=>setF('senioridade',e.target.value)}>
                <option value="">Selecione...</option>
                {SENIORITY.map(s=><option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Cargo atual ou último *</label>
              <input className="input" placeholder="Ex: Gerente de Marketing" value={form.cargo_atual||''} onChange={e=>setF('cargo_atual',e.target.value)} />
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={()=>setStep(0)} className="btn-ghost">← Voltar</button>
            <button onClick={()=>{ if(!form.nome?.trim()||areas.every(a=>!a)||!form.senioridade||!form.cargo_atual){ alert('Preencha os campos obrigatórios'); return }; setStep(2) }} className="btn-primary flex-1">Próximo →</button>
          </div>
        </div>
      </div>
    </div>
  )

  // ── STEP 2: LinkedIn real ───────────────────────────────────────
  if (step === 2) return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl"><StepDots />
        <div className="card p-6 md:p-8">
          <h2 className="text-xl font-bold mb-1">💼 Seu LinkedIn e experiências</h2>
          <p className="text-slate-400 text-sm mb-2">Etapa 2 de 4</p>
          <div className="bg-brand/10 border border-brand/20 rounded-lg px-4 py-2.5 mb-5 text-sm text-brand">
            💡 Abra seu LinkedIn e copie os textos reais. A IA analisa seu conteúdo — não dá conselhos genéricos.
          </div>
          <div className="space-y-4">
            <div>
              <label className="label">Headline atual do LinkedIn *</label>
              <input className="input" placeholder='Ex: "Gerente de Marketing | SaaS | Growth | 10 anos de experiência"' value={form.headline_atual||''} onChange={e=>setF('headline_atual',e.target.value)} />
              <p className="text-xs text-slate-500 mt-1">Copie exatamente como aparece no seu perfil</p>
            </div>
            <div>
              <label className="label">Seção "Sobre" *</label>
              <textarea className="input min-h-24" placeholder="Cole o texto completo da sua seção Sobre do LinkedIn..." value={form.sobre_atual||''} onChange={e=>setF('sobre_atual',e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="label">Cargo — Exp. 1 *</label>
                <input className="input" placeholder="Gerente de Marketing" value={form.exp1_cargo||''} onChange={e=>setF('exp1_cargo',e.target.value)} /></div>
              <div><label className="label">Empresa — Exp. 1 *</label>
                <input className="input" placeholder="Nome da empresa" value={form.exp1_empresa||''} onChange={e=>setF('exp1_empresa',e.target.value)} /></div>
            </div>
            <div>
              <label className="label">Descrição da experiência 1 * <span className="text-slate-500 font-normal normal-case">(bullets do LinkedIn)</span></label>
              <textarea className="input min-h-20" placeholder="Cole as responsabilidades e conquistas..." value={form.exp1_descricao||''} onChange={e=>setF('exp1_descricao',e.target.value)} />
            </div>
            <div className="border-t border-border pt-3">
              <p className="text-xs text-slate-400 mb-3">Experiência anterior (opcional — recomendado)</p>
              <div className="grid grid-cols-2 gap-3 mb-2">
                <input className="input" placeholder="Cargo anterior" value={form.exp2_cargo||''} onChange={e=>setF('exp2_cargo',e.target.value)} />
                <input className="input" placeholder="Empresa anterior" value={form.exp2_empresa||''} onChange={e=>setF('exp2_empresa',e.target.value)} />
              </div>
              <textarea className="input min-h-16" placeholder="Descrição..." value={form.exp2_descricao||''} onChange={e=>setF('exp2_descricao',e.target.value)} />
            </div>
            <div><label className="label">Certificações</label>
              <input className="input" placeholder="Ex: PMP, Google Analytics, AWS, CPA-20..." value={form.certificacoes||''} onChange={e=>setF('certificacoes',e.target.value)} /></div>
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={()=>setStep(1)} className="btn-ghost">← Anterior</button>
            <button onClick={()=>{ if(!form.headline_atual||!form.sobre_atual||!form.exp1_cargo||!form.exp1_empresa||!form.exp1_descricao){ alert('Preencha os campos obrigatórios'); return }; setStep(3) }} className="btn-primary flex-1">Próximo →</button>
          </div>
        </div>
      </div>
    </div>
  )

  // ── STEP 3: Currículo ───────────────────────────────────────────
  if (step === 3) return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl"><StepDots />
        <div className="card p-6 md:p-8">
          <h2 className="text-xl font-bold mb-1">📄 Seu currículo</h2>
          <p className="text-slate-400 text-sm mb-5">Etapa 3 de 4 · Abra o PDF → Ctrl+A → Ctrl+C → cole aqui</p>
          <div className="space-y-4">
            <div>
              <label className="label">Texto do currículo *</label>
              <textarea className="input min-h-44" placeholder="Cole aqui todo o conteúdo do seu currículo. A formatação não importa, só o texto..." value={form.curriculo_texto||''} onChange={e=>setF('curriculo_texto',e.target.value)} />
              <p className="text-xs text-slate-500 mt-1">Quanto mais completo, mais precisa a reescrita</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="label">Nível de formação *</label>
                <select className="input" value={form.nivel_formacao||''} onChange={e=>setF('nivel_formacao',e.target.value)}>
                  <option value="">Selecione...</option>
                  {LEVELS.map(l=><option key={l}>{l}</option>)}
                </select></div>
              <div><label className="label">Curso / Instituição *</label>
                <input className="input" placeholder="Ex: Administração — FGV" value={form.formacao||''} onChange={e=>setF('formacao',e.target.value)} /></div>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={()=>setStep(2)} className="btn-ghost">← Anterior</button>
            <button onClick={()=>{ if(!form.curriculo_texto||!form.nivel_formacao||!form.formacao){ alert('Preencha os campos obrigatórios'); return }; setStep(4) }} className="btn-primary flex-1">Próximo →</button>
          </div>
        </div>
      </div>
    </div>
  )

  // ── STEP 4: Objetivos ───────────────────────────────────────────
  if (step === 4) return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl"><StepDots />
        <div className="card p-6 md:p-8">
          <h2 className="text-xl font-bold mb-1">🎯 Para onde você quer ir</h2>
          <p className="text-slate-400 text-sm mb-6">Etapa 4 de 4 · Última etapa!</p>
          <div className="space-y-4">
            <div><label className="label">Modalidade *</label>
              <select className="input" value={form.modalidade||''} onChange={e=>setF('modalidade',e.target.value)}>
                <option value="">Selecione...</option>
                {MODALITIES.map(m=><option key={m}>{m}</option>)}
              </select></div>
            <div><label className="label">Cidade / Estado *</label>
              <input className="input" placeholder="Ex: São Paulo, SP" value={form.cidade||''} onChange={e=>setF('cidade',e.target.value)} /></div>
            <div><label className="label">Empresas dos sonhos <span className="text-slate-500 font-normal normal-case">(personaliza as buscas)</span></label>
              <input className="input" placeholder="Ex: Nubank, iFood, Google, Ambev..." value={form.empresas_sonho||''} onChange={e=>setF('empresas_sonho',e.target.value)} /></div>
            <div><label className="label">Pretensão salarial</label>
              <select className="input" value={form.salario||''} onChange={e=>setF('salario',e.target.value)}>
                <option value="">Prefiro não informar</option>
                {SALARIES.map(s=><option key={s}>{s}</option>)}
              </select></div>
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={()=>setStep(3)} className="btn-ghost">← Anterior</button>
            <button onClick={()=>{ if(!form.modalidade||!form.cidade){ alert('Preencha modalidade e cidade'); return }; saveProfile() }} disabled={saving} className="btn-gold flex-1 disabled:opacity-50">
              {saving ? 'Salvando...' : '🚀 Ver meu dashboard →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  // ── DASHBOARD ───────────────────────────────────────────────────
  const situationData = SITUATIONS.find(s => s.id === profile?.situacao)

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 bg-surface-card/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center flex-shrink-0 text-base">💼</div>
            <div className="hidden sm:block">
              <p className="text-xs text-slate-400 leading-none">Olá,</p>
              <p className="font-bold leading-none">{firstName} {situationData ? situationData.icon : ''}</p>
            </div>
          </div>
          <div className="hidden md:flex gap-2 flex-wrap">
            {(profile?.areas||'').split(',').filter(Boolean).slice(0,3).map((a: string) => (
              <span key={a} className="badge-blue text-xs">{a.trim()}</span>
            ))}
          </div>
          <div className="flex gap-2 items-center">
            <button onClick={()=>setStep(0)} className="btn-ghost text-xs py-1.5 px-3 hidden sm:flex">✏️ Editar</button>
            <button onClick={handleLogout} className="text-slate-500 hover:text-white text-xs transition-colors">Sair</button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-5 py-6 space-y-6">

        {/* Próximo passo recomendado */}
        {completedModules.length === 0 && (
          <div className="card p-5 border-brand/40 bg-brand/5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="text-4xl">👆</div>
            <div className="flex-1">
              <p className="font-bold mb-0.5">Por onde começar?</p>
              <p className="text-slate-400 text-sm">
                Para o seu perfil de <strong className="text-white">{situationData?.label}</strong>, recomendamos começar pelo{' '}
                <strong className="text-brand">{MODULES.find(m => m.id === nextModule)?.title}</strong>.
              </p>
            </div>
            <Link href={`/module/${nextModule}`} className="btn-primary text-sm py-2 px-5 flex-shrink-0 whitespace-nowrap">
              Começar agora →
            </Link>
          </div>
        )}

        {/* Progress */}
        <div className="card p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div>
              <h3 className="font-bold">Progresso da estratégia</h3>
              <p className="text-slate-400 text-xs mt-0.5">{completedModules.length} de {MODULES.length} módulos concluídos</p>
            </div>
            <span className="badge-gold text-xs">⏱️ ~{days} dias para o emprego</span>
          </div>
          <div className="h-2 bg-surface rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-brand to-sky-400 rounded-full transition-all duration-700" style={{width:`${pct}%`}} />
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-xs text-slate-400">{pct}% completo</span>
            <span className="text-xs text-slate-400">{MODULES.length - completedModules.length} módulos restantes</span>
          </div>
        </div>

        {/* Modules */}
        <div>
          <h2 className="font-bold mb-3">🧩 Seus módulos de IA</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {MODULES.map(mod => {
              const done = completedModules.includes(mod.id)
              const isNext = mod.id === nextModule && !done
              return (
                <Link key={mod.id} href={`/module/${mod.id}`}
                  className={`card p-4 hover:border-brand/60 hover:-translate-y-1 transition-all duration-200 group relative overflow-hidden
                    ${done ? 'border-emerald-500/30' : isNext ? 'border-brand/50 ring-1 ring-brand/20' : ''}`}>
                  <div className={`absolute inset-x-0 top-0 h-0.5 transition-colors ${done ? 'bg-emerald-500' : isNext ? 'bg-brand' : 'bg-border group-hover:bg-brand/50'}`} />
                  {isNext && <div className="absolute top-2 right-2 bg-brand text-white text-[10px] font-bold px-1.5 py-0.5 rounded">COMEÇAR</div>}
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-2xl">{mod.icon}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${done ? 'bg-emerald-500/15 text-emerald-400' : 'bg-slate-500/15 text-slate-400'}`}>
                      {done ? '✅ Pronto' : '⬜'}
                    </span>
                  </div>
                  <h3 className="font-semibold text-sm mb-1 leading-tight group-hover:text-brand transition-colors">{mod.title}</h3>
                  <p className="text-slate-400 text-xs leading-relaxed mb-3 line-clamp-2">{mod.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">⏱️ {mod.time}</span>
                    <span className="text-brand text-sm group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Plano 90 dias */}
        <div className="card p-6 md:p-8 text-center border-gold/30">
          <h3 className="text-xl font-bold mb-1.5">🗓️ Plano de Ação 90 Dias</h3>
          <p className="text-slate-400 text-sm mb-5 max-w-lg mx-auto">
            Cronograma semana a semana personalizado para sua situação de <strong className="text-white">{situationData?.label || 'profissional'}</strong> — com KPIs, metas e plano de contingência.
          </p>
          {completedModules.length >= 3
            ? <Link href="/module/plano90" className="btn-gold inline-flex items-center gap-2">✨ Gerar meu Plano de 90 Dias</Link>
            : <p className="text-slate-500 text-sm">🔒 Complete pelo menos 3 módulos para desbloquear ({3 - completedModules.length} restantes)</p>}
        </div>
      </main>
    </div>
  )
}
