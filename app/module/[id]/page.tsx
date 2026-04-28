'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { createClient } from '@/lib/supabase/client'
import { MODULES } from '@/lib/prompts'

const PLAN_MOD = { id: 'plano90', icon: '🗓️', title: 'Plano de Ação 90 Dias', desc: 'Cronograma semana a semana', time: '5-6 min' }

export default function ModulePage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const supabase = createClient()
  const [profile, setProfile] = useState<any>(null)
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [copied, setCopied] = useState(false)
  const [jobDesc, setJobDesc] = useState('')
  const [showJobInput, setShowJobInput] = useState(false)
  const [retrying, setRetrying] = useState(false)

  const isPlan = id === 'plano90'
  const isJobMatch = id === 'match_vaga'
  const mod = isPlan ? PLAN_MOD : MODULES.find(m => m.id === id)

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const { data: p } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile(p)
      if (isPlan) {
        const { data } = await supabase.from('action_plans').select('content').eq('user_id', user.id).maybeSingle()
        if (data) setContent(data.content)
      } else {
        const { data } = await supabase.from('module_results').select('content').eq('user_id', user.id).eq('module_id', id).maybeSingle()
        if (data) setContent(data.content)
      }
      setFetching(false)
    }
    init()
  }, [id])

  async function generate() {
    if (!profile) return
    if (isJobMatch && !jobDesc.trim()) { setShowJobInput(true); return }
    setLoading(true); setContent(''); setRetrying(false)
    try {
      const endpoint = isPlan ? '/api/plan' : '/api/generate'
      const body = isPlan
        ? { profile: { ...profile, areas: profile.areas }, completedModules: [] }
        : { module: id, profile: { ...profile, areas: profile.areas }, extra: isJobMatch ? jobDesc : undefined }
      const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const data = await res.json()
      if (res.status === 429) {
        setRetrying(true)
        await new Promise(r => setTimeout(r, 8000))
        setRetrying(false)
        const res2 = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
        const data2 = await res2.json()
        if (data2.error) throw new Error(data2.error)
        setContent(data2.content)
        return
      }
      if (data.error) throw new Error(data.error)
      setContent(data.content)
    } catch (e: any) {
      setContent(`**Erro:** ${e.message}`)
    } finally {
      setLoading(false); setRetrying(false)
    }
  }

  function copyContent() {
    navigator.clipboard.writeText(content)
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }

  function downloadContent() {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `${mod?.title?.replace(/\s+/g,'_')||'modulo'}.txt`
    a.click()
  }

  if (fetching) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-border border-t-brand rounded-full spin" />
    </div>
  )

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 bg-surface-card/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link href="/dashboard" className="w-8 h-8 rounded-lg border border-border hover:border-brand flex items-center justify-center text-slate-400 hover:text-brand transition-all flex-shrink-0">←</Link>
          <span className="text-xl flex-shrink-0">{mod?.icon}</span>
          <h1 className="font-bold flex-1 truncate text-sm md:text-base">{mod?.title}</h1>
          <span className={`text-xs px-2 py-1 rounded-full font-semibold flex-shrink-0 ${content?'bg-emerald-500/15 text-emerald-400':'bg-slate-500/15 text-slate-400'}`}>
            {content?'✅ Pronto':'⬜ Pendente'}
          </span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Profile tags */}
        {profile && (
          <div className="flex flex-wrap gap-2 mb-5">
            {[profile.nome?.split(' ')[0], profile.exp1_cargo, ...(profile.areas||'').split(',').map((a:string)=>a.trim())].filter(Boolean).map((tag:string) => (
              <span key={tag} className="badge-blue text-xs">{tag}</span>
            ))}
          </div>
        )}

        {/* Job match input */}
        {isJobMatch && (
          <div className="card p-5 mb-5">
            <h3 className="font-semibold mb-2">📋 Cole a descrição da vaga aqui</h3>
            <p className="text-slate-400 text-sm mb-3">Quanto mais detalhada a vaga, mais preciso o match e os materiais gerados.</p>
            <textarea
              className="input min-h-36 text-sm"
              placeholder="Cole aqui a descrição completa da vaga — título, requisitos, responsabilidades, benefícios..."
              value={jobDesc}
              onChange={e => setJobDesc(e.target.value)}
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-2 mb-5">
          {!content && !loading && (
            <button onClick={generate} className="btn-primary flex items-center gap-2">
              ✨ {isJobMatch ? 'Analisar vaga com IA' : 'Gerar com IA'}
            </button>
          )}
          {content && !loading && (
            <>
              <button onClick={copyContent} className="btn-ghost text-sm py-2 px-4">{copied?'✅ Copiado!':'📋 Copiar'}</button>
              <button onClick={downloadContent} className="btn-ghost text-sm py-2 px-4">⬇️ Baixar .txt</button>
              <button onClick={() => { setContent(''); setLoading(false) }} className="btn-ghost text-sm py-2 px-4">🔄 Regenerar</button>
            </>
          )}
          {isPlan && !loading && <button onClick={() => window.print()} className="btn-ghost text-sm py-2 px-4">🖨️ Imprimir PDF</button>}
        </div>

        {/* Content area */}
        <div className="card min-h-64">
          {loading && (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-12 h-12 border-4 border-border border-t-brand rounded-full spin" />
              <div className="text-center">
                {retrying ? (
                  <>
                    <p className="font-semibold text-amber-400">⏳ Alta demanda no servidor...</p>
                    <p className="text-slate-400 text-sm mt-1">Tentando novamente com servidor alternativo · aguarde</p>
                  </>
                ) : (
                  <>
                    <p className="font-semibold">Gerando {mod?.title}...</p>
                    <p className="text-slate-400 text-sm mt-1 animate-pulse">IA analisando seu perfil real · {mod?.time}</p>
                  </>
                )}
              </div>
            </div>
          )}

          {!loading && !content && (
            <div className="flex flex-col items-center justify-center py-16 gap-4 text-center px-6">
              <span className="text-5xl">{mod?.icon}</span>
              <div>
                <h3 className="font-semibold text-lg mb-1">Pronto para analisar!</h3>
                <p className="text-slate-400 text-sm max-w-md">
                  {isJobMatch
                    ? 'Cole a descrição da vaga acima e clique em Analisar. A IA vai comparar seu perfil real com a vaga e gerar um kit completo.'
                    : `Clique em "Gerar com IA" para criar seu ${mod?.title} usando seu perfil real. Tempo: ${mod?.time}.`}
                </p>
              </div>
              <button onClick={generate} className="btn-primary">
                ✨ {isJobMatch ? 'Analisar vaga com IA' : 'Gerar com IA agora'}
              </button>
            </div>
          )}

          {!loading && content && (
            <div className="p-5 md:p-8 prose prose-invert prose-sm md:prose-base prose-headings:text-white prose-p:text-slate-300 prose-li:text-slate-300 prose-strong:text-white prose-code:text-amber-400 prose-pre:bg-surface prose-table:text-sm max-w-none">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          )}
        </div>

        {content && !loading && (
          <div className="flex justify-center mt-5">
            <Link href="/dashboard" className="btn-ghost text-sm py-2 px-6">← Voltar ao Dashboard</Link>
          </div>
        )}
      </main>
    </div>
  )
}
