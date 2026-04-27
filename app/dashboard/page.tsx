'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { MODULES } from '@/lib/prompts'

const SENIORITY = ['Estágio/Trainee', 'Júnior', 'Pleno', 'Sênior', 'Especialista', 'Coordenador', 'Gerente', 'Diretor', 'C-Level (CEO, CFO, CTO...)']
const OBJECTIVES = ['Recolocação rápida no mesmo setor', 'Crescimento e promoção na empresa atual', 'Mudança de área de atuação', 'Primeiro emprego / Estágio', 'Trabalho remoto ou internacional', 'Empreendedorismo / Freelance']
const MODALITIES = ['Qualquer modalidade', 'Presencial', 'Híbrido', '100% Remoto']
const CONTRACTS = ['CLT', 'PJ', 'CLT ou PJ']
const SALARIES = ['Não informar', 'Até R$3.000', 'R$3.001 a R$5.000', 'R$5.001 a R$8.000', 'R$8.001 a R$12.000', 'R$12.001 a R$20.000', 'Acima de R$20.000']
const LEVELS = ['Ensino Médio', 'Técnico', 'Superior Incompleto', 'Superior Completo', 'Pós-graduação', 'MBA', 'Mestrado', 'Doutorado']

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

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUser(user)
      setForm(f => ({ ...f, email_display: user.email || '' }))
      const { data: p } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (p) { setProfile(p); setAreas(p.areas?.split(',') || ['']); setStep(99) }
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

  function validateStep(s: number) {
    const required: Record<number, string[]> = {
      1: ['nome', 'senioridade', 'cargo_atual'],
      2: ['headline_atual', 'sobre_atual', 'exp1_cargo', 'exp1_empresa', 'exp1_descricao'],
      3: ['curriculo_texto', 'nivel_formacao', 'formacao'],
      4: ['objetivo', 'modalidade', 'cidade'],
    }
    const missing = required[s]?.filter(f => !form[f]?.trim())
    if (s === 1 && areas.every(a => !a.trim())) { alert('Informe ao menos uma área de atuação'); return false }
    if (missing?.length) { alert(`Preencha: ${missing.join(', ')}`); return false }
    return true
  }

  async function saveProfile() {
    if (!user) return
    setSaving(true)
    const data = {
      id: user.id,
      ...form,
      areas: areas.filter(Boolean).join(', '),
      updated_at: new Date().toISOString(),
    }
    await supabase.from('profiles').upsert(data)
    setProfile(data)
    setSaving(false)
    setStep(99)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
  }

  const pct = Math.round((completedModules.length / MODULES.length) * 100)
  const days = [90, 80, 70, 60, 50, 40, 30, 20][Math.min(completedModules.length, 7)]

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-border border-t-brand rounded-full spin" />
    </div>
  )

  // Welcome screen
  if (step === 0) return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <div className="text-6xl mb-4">🚀</div>
        <h1 className="text-3xl font-black mb-3">Vamos começar, {user?.email?.split('@')[0]}!</h1>
        <p className="text-slate-400 mb-2">Em 5 etapas rápidas você terá sua estratégia completa de recolocação.</p>
        <p className="text-slate-500 text-sm mb-8">Quanto mais detalhes você der, mais personalizadas serão as análises da IA.</p>
        <button onClick={() => setStep(1)} className="btn-gold text-lg py-4 px-10">Criar minha estratégia →</button>
      </div>
    </div>
  )

  // STEP INDICATOR component
  const StepDots = () => (
    <div className="flex gap-2 mb-8 justify-center items-center">
      {[1,2,3,4,5].map((s, i) => (
        <div key={s} className="flex items-center gap-2">
          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all ${s < step ? 'bg-emerald-500 text-white' : s === step ? 'bg-brand text-white ring-2 ring-brand/30' : 'bg-border/50 text-slate-500'}`}>
            {s < step ? '✓' : s}
          </div>
          {i < 4 && <div className={`h-0.5 w-8 transition-all ${s < step ? 'bg-emerald-500' : 'bg-border'}`} />}
        </div>
      ))}
    </div>
  )

  // ── STEP 1: Identidade ──────────────────────────────────────────
  if (step === 1) return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl"><StepDots />
        <div className="card p-6 md:p-8">
          <h2 className="text-xl font-bold mb-1">👋 Identidade Profissional</h2>
          <p className="text-slate-400 text-sm mb-6">Etapa 1 de 5 · Sobre você</p>

          <div className="space-y-4">
            <div><label className="label">Nome Completo *</label>
              <input className="input" placeholder="Ex: Maria Silva" value={form.nome||''} onChange={e=>setF('nome',e.target.value)} /></div>

            <div>
              <label className="label">Áreas de Atuação * <span className="text-slate-500 font-normal normal-case">(até 3 — isso expande suas chances)</span></label>
              {areas.map((a, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <input className="input flex-1" placeholder={i===0?"Ex: Marketing Digital":"Ex: Growth, Vendas B2B..."} value={a} onChange={e=>setArea(i,e.target.value)} />
                  {i>0 && <button onClick={()=>removeArea(i)} className="text-slate-500 hover:text-red-400 px-2 text-lg">×</button>}
                </div>
              ))}
              {areas.length < 3 && <button onClick={addArea} className="text-brand text-sm hover:underline">+ Adicionar outra área</button>}
            </div>

            <div><label className="label">Senioridade *</label>
              <select className="input" value={form.senioridade||''} onChange={e=>setF('senioridade',e.target.value)}>
                <option value="">Selecione...</option>
                {SENIORITY.map(s=><option key={s}>{s}</option>)}
              </select></div>

            <div><label className="label">Cargo Atual ou Último *</label>
              <input className="input" placeholder="Ex: Gerente de Marketing" value={form.cargo_atual||''} onChange={e=>setF('cargo_atual',e.target.value)} /></div>

            <div><label className="label">Contrato preferido</label>
              <select className="input" value={form.tipo_contrato||''} onChange={e=>setF('tipo_contrato',e.target.value)}>
                <option value="">Qualquer</option>
                {CONTRACTS.map(c=><option key={c}>{c}</option>)}
              </select></div>
          </div>

          <div className="flex gap-3 mt-6">
            <button onClick={()=>setStep(0)} className="btn-ghost">← Voltar</button>
            <button onClick={()=>validateStep(1)&&setStep(2)} className="btn-primary flex-1">Próximo →</button>
          </div>
        </div>
      </div>
    </div>
  )

  // ── STEP 2: LinkedIn Real ───────────────────────────────────────
  if (step === 2) return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl"><StepDots />
        <div className="card p-6 md:p-8">
          <h2 className="text-xl font-bold mb-1">💼 Conteúdo Real do LinkedIn</h2>
          <p className="text-slate-400 text-sm mb-1">Etapa 2 de 5 · A IA precisa do seu conteúdo ATUAL para dar feedback específico</p>
          <div className="bg-brand/10 border border-brand/20 rounded-lg px-4 py-2 mb-6 text-sm text-brand">
            💡 Abra seu LinkedIn agora e copie os textos reais. Quanto mais completo, mais precisa a análise.
          </div>

          <div className="space-y-4">
            <div>
              <label className="label">Sua Headline atual do LinkedIn *</label>
              <input className="input" placeholder='Ex: "Gerente de Marketing | SaaS | Growth | B2B"' value={form.headline_atual||''} onChange={e=>setF('headline_atual',e.target.value)} />
              <p className="text-xs text-slate-500 mt-1">Cole exatamente como está no seu perfil</p>
            </div>

            <div>
              <label className="label">Sua seção "Sobre" atual *</label>
              <textarea className="input min-h-28" placeholder="Cole aqui o texto completo da sua seção Sobre no LinkedIn..." value={form.sobre_atual||''} onChange={e=>setF('sobre_atual',e.target.value)} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div><label className="label">Cargo (Exp. 1) *</label>
                <input className="input" placeholder="Gerente de Marketing" value={form.exp1_cargo||''} onChange={e=>setF('exp1_cargo',e.target.value)} /></div>
              <div><label className="label">Empresa (Exp. 1) *</label>
                <input className="input" placeholder="Nome da empresa" value={form.exp1_empresa||''} onChange={e=>setF('exp1_empresa',e.target.value)} /></div>
            </div>

            <div>
              <label className="label">Descrição da Experiência 1 * <span className="text-slate-500 font-normal normal-case">(cole os bullets do LinkedIn)</span></label>
              <textarea className="input min-h-24" placeholder="Cole aqui as responsabilidades e conquistas como estão no LinkedIn..." value={form.exp1_descricao||''} onChange={e=>setF('exp1_descricao',e.target.value)} />
            </div>

            <div className="border-t border-border pt-4">
              <p className="text-sm text-slate-400 mb-3">Experiência anterior (opcional mas recomendado)</p>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div><label className="label">Cargo (Exp. 2)</label>
                  <input className="input" placeholder="Ex: Analista de Marketing" value={form.exp2_cargo||''} onChange={e=>setF('exp2_cargo',e.target.value)} /></div>
                <div><label className="label">Empresa (Exp. 2)</label>
                  <input className="input" placeholder="Nome da empresa" value={form.exp2_empresa||''} onChange={e=>setF('exp2_empresa',e.target.value)} /></div>
              </div>
              <textarea className="input min-h-20" placeholder="Descrição da experiência 2..." value={form.exp2_descricao||''} onChange={e=>setF('exp2_descricao',e.target.value)} />
            </div>

            <div><label className="label">Certificações relevantes</label>
              <input className="input" placeholder="Ex: PMP, Google Analytics, AWS, CPA-20..." value={form.certificacoes||''} onChange={e=>setF('certificacoes',e.target.value)} /></div>
          </div>

          <div className="flex gap-3 mt-6">
            <button onClick={()=>setStep(1)} className="btn-ghost">← Anterior</button>
            <button onClick={()=>validateStep(2)&&setStep(3)} className="btn-primary flex-1">Próximo →</button>
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
          <h2 className="text-xl font-bold mb-1">📄 Seu Currículo</h2>
          <p className="text-slate-400 text-sm mb-6">Etapa 3 de 5 · Cole o texto do seu currículo atual</p>

          <div className="space-y-4">
            <div>
              <label className="label">Texto completo do currículo * <span className="text-slate-500 font-normal normal-case">(abra o PDF e selecione tudo → Ctrl+A → Ctrl+C)</span></label>
              <textarea className="input min-h-48" placeholder="Cole aqui todo o conteúdo do seu currículo atual (formatação não importa, só o texto)..." value={form.curriculo_texto||''} onChange={e=>setF('curriculo_texto',e.target.value)} />
              <p className="text-xs text-slate-500 mt-1">Quanto mais completo, mais precisa a reescrita da IA</p>
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
            <button onClick={()=>validateStep(3)&&setStep(4)} className="btn-primary flex-1">Próximo →</button>
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
          <h2 className="text-xl font-bold mb-1">🎯 Objetivos de Carreira</h2>
          <p className="text-slate-400 text-sm mb-6">Etapa 4 de 5 · Para onde você quer ir</p>

          <div className="space-y-4">
            <div><label className="label">Objetivo principal *</label>
              <select className="input" value={form.objetivo||''} onChange={e=>setF('objetivo',e.target.value)}>
                <option value="">Selecione...</option>
                {OBJECTIVES.map(o=><option key={o}>{o}</option>)}
              </select></div>

            <div><label className="label">Modalidade desejada *</label>
              <select className="input" value={form.modalidade||''} onChange={e=>setF('modalidade',e.target.value)}>
                <option value="">Selecione...</option>
                {MODALITIES.map(m=><option key={m}>{m}</option>)}
              </select></div>

            <div><label className="label">Cidade / Estado *</label>
              <input className="input" placeholder="Ex: São Paulo, SP" value={form.cidade||''} onChange={e=>setF('cidade',e.target.value)} /></div>

            <div>
              <label className="label">Empresas dos seus sonhos <span className="text-slate-500 font-normal normal-case">(opcional — usamos para personalizar buscas)</span></label>
              <input className="input" placeholder="Ex: Nubank, Google, Magazine Luiza, TOTVS..." value={form.empresas_sonho||''} onChange={e=>setF('empresas_sonho',e.target.value)} />
            </div>

            <div><label className="label">Pretensão salarial</label>
              <select className="input" value={form.salario||''} onChange={e=>setF('salario',e.target.value)}>
                <option value="">Prefiro não informar</option>
                {SALARIES.map(s=><option key={s}>{s}</option>)}
              </select></div>
          </div>

          <div className="flex gap-3 mt-6">
            <button onClick={()=>setStep(3)} className="btn-ghost">← Anterior</button>
            <button onClick={()=>validateStep(4)&&setStep(5)} className="btn-primary flex-1">Próximo →</button>
          </div>
        </div>
      </div>
    </div>
  )

  // ── STEP 5: Confirmar ───────────────────────────────────────────
  if (step === 5) return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl"><StepDots />
        <div className="card p-6 md:p-8 text-center">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold mb-2">Tudo pronto, {form.nome?.split(' ')[0]}!</h2>
          <p className="text-slate-400 mb-6">Sua estratégia de recolocação foi criada. Agora é hora de gerar os módulos com IA.</p>

          <div className="bg-surface rounded-xl p-4 text-left mb-6 space-y-2">
            <p className="text-sm"><span className="text-slate-400">Áreas-alvo:</span> <span className="font-semibold text-brand">{areas.filter(Boolean).join(' · ')}</span></p>
            <p className="text-sm"><span className="text-slate-400">Cargo:</span> <span className="font-semibold">{form.exp1_cargo} em {form.exp1_empresa}</span></p>
            <p className="text-sm"><span className="text-slate-400">Objetivo:</span> <span className="font-semibold">{form.objetivo}</span></p>
            <p className="text-sm"><span className="text-slate-400">Cidade:</span> <span className="font-semibold">{form.cidade}</span></p>
          </div>

          <button onClick={saveProfile} disabled={saving} className="btn-gold w-full py-3.5 text-base disabled:opacity-50">
            {saving ? 'Salvando...' : '🚀 Ir para o Dashboard'}
          </button>
          <button onClick={()=>setStep(4)} className="btn-ghost w-full mt-3 text-sm">← Editar informações</button>
        </div>
      </div>
    </div>
  )

  // ── DASHBOARD ───────────────────────────────────────────────────
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 bg-surface-card/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center flex-shrink-0">💼</div>
            <div className="hidden sm:block">
              <p className="text-xs text-slate-400 leading-none">Bem-vinda de volta,</p>
              <p className="font-bold leading-none">{profile?.nome?.split(' ')[0]}</p>
            </div>
          </div>

          {/* Areas */}
          <div className="hidden md:flex gap-2">
            {(profile?.areas||'').split(',').filter(Boolean).map((a: string) => (
              <span key={a} className="badge-blue text-xs">{a.trim()}</span>
            ))}
          </div>

          <div className="flex gap-2 items-center">
            <button onClick={()=>setStep(1)} className="btn-ghost text-xs py-1.5 px-3">✏️ Editar</button>
            <button onClick={handleLogout} className="text-slate-500 hover:text-white text-xs transition-colors">Sair</button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-6 py-6">
        {/* Progress */}
        <div className="card p-5 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <h3 className="font-bold">📊 Progresso da Estratégia</h3>
            <div className="flex gap-4">
              <div className="text-center"><span className="block text-2xl font-black text-brand">{completedModules.length}</span><span className="text-xs text-slate-400">completos</span></div>
              <div className="text-center"><span className="block text-2xl font-black">{MODULES.length}</span><span className="text-xs text-slate-400">módulos</span></div>
            </div>
          </div>
          <div className="h-2.5 bg-surface rounded-full overflow-hidden mb-2">
            <div className="h-full bg-gradient-to-r from-brand to-sky-400 rounded-full transition-all duration-700" style={{width:`${pct}%`}} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">{pct}% concluído</span>
            <span className="badge-gold text-xs">⏱️ Estimativa: {days} dias para o emprego</span>
          </div>
        </div>

        {/* Modules */}
        <h2 className="font-bold text-base mb-3">🧩 Seus Módulos de IA</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mb-6">
          {MODULES.map(mod => {
            const done = completedModules.includes(mod.id)
            return (
              <Link key={mod.id} href={`/module/${mod.id}`}
                className={`card p-4 hover:border-brand/60 hover:-translate-y-1 transition-all duration-200 group relative overflow-hidden ${done?'border-emerald-500/40':''}`}>
                <div className={`absolute top-0 inset-x-0 h-0.5 transition-colors ${done?'bg-emerald-500':'bg-border group-hover:bg-brand'}`} />
                <div className="flex justify-between items-start mb-2.5">
                  <span className="text-2xl">{mod.icon}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${done?'bg-emerald-500/15 text-emerald-400':'bg-slate-500/15 text-slate-400'}`}>
                    {done?'✅ Pronto':'⬜ Pendente'}
                  </span>
                </div>
                <h3 className="font-semibold text-sm mb-1 group-hover:text-brand transition-colors leading-tight">{mod.title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed mb-3">{mod.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">⏱️ {mod.time}</span>
                  <span className="text-brand text-sm group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </Link>
            )
          })}
        </div>

        {/* 90-day plan CTA */}
        <div className="card p-6 md:p-8 text-center border-gold/30">
          <h3 className="text-xl font-bold mb-2">🗓️ Plano de Ação 90 Dias</h3>
          <p className="text-slate-400 text-sm mb-4">Cronograma personalizado semana a semana com KPIs e metas para conseguir o emprego</p>
          {completedModules.length >= 3
            ? <Link href="/module/plano90" className="btn-gold inline-flex items-center gap-2">✨ Gerar meu Plano de 90 Dias</Link>
            : <p className="text-slate-500 text-sm">🔒 Complete pelo menos 3 módulos para desbloquear</p>}
        </div>
      </main>
    </div>
  )
}
