'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { createClient } from '@/lib/supabase/client'
import { MODULES } from '@/lib/prompts'

export default function ModulePage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [copied, setCopied] = useState(false)

  const isPlan = id === 'plano90'
  const mod = isPlan ? { icon: '🗓️', title: 'Plano de Ação 90 Dias', desc: 'Cronograma semana a semana', time: '4-5 min' } : MODULES.find(m => m.id === id)

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUser(user)
      const { data: p } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile(p)
      if (isPlan) {
        const { data } = await supabase.from('action_plans').select('content').eq('user_id', user.id).single()
        if (data) setContent(data.content)
      } else {
        const { data } = await supabase.from('module_results').select('content').eq('user_id', user.id).eq('module_id', id).single()
        if (data) setContent(data.content)
      }
      setFetching(false)
    }
    init()
  }, [id])

  async function generate() {
    if (!profile) return
    setLoading(true); setContent('')
    try {
      const endpoint = isPlan ? '/api/plan' : '/api/generate'
      const body = isPlan
        ? { profile, completedModules: [] }
        : { module: id, profile }
      const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setContent(data.content)
    } catch (e: any) {
      setContent(`**Erro:** ${e.message}`)
    } finally {
      setLoading(false)
    }
  }

  function copyContent() {
    navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function downloadContent() {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `${mod?.title?.replace(/\s+/g, '_') || 'modulo'}.txt`
    a.click()
  }

  if (fetching) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-border border-t-brand rounded-full spin" />
    </div>
  )

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-surface-card/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center gap-4">
          <Link href="/dashboard" className="w-8 h-8 rounded-lg border border-border hover:border-brand flex items-center justify-center text-slate-400 hover:text-brand transition-all">←</Link>
          <span className="text-lg">{mod?.icon}</span>
          <h1 className="font-bold flex-1 truncate">{mod?.title}</h1>
          <span className={content ? 'badge-green' : 'badge-gray'} style={{ fontSize: '11px' }}>
            {content ? '✅ Concluído' : '⬜ Pendente'}
          </span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Profile tags */}
        {profile && (
          <div className="flex flex-wrap gap-2 mb-6">
            {[profile.nome, profile.cargo, profile.area, profile.cidade].filter(Boolean).map((tag: string) => (
              <span key={tag} className="badge-blue text-xs">{tag}</span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-3 mb-6">
          {!content && !loading && (
            <button onClick={generate} className="btn-primary flex items-center gap-2">✨ Gerar com IA</button>
          )}
          {content && !loading && (
            <>
              <button onClick={copyContent} className="btn-ghost text-sm py-2 px-4">{copied ? '✅ Copiado!' : '📋 Copiar'}</button>
              <button onClick={downloadContent} className="btn-ghost text-sm py-2 px-4">⬇️ Baixar .txt</button>
              <button onClick={generate} className="btn-ghost text-sm py-2 px-4">🔄 Regenerar</button>
            </>
          )}
        </div>

        {/* Content area */}
        <div className="card min-h-64">
          {loading && (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-12 h-12 border-4 border-border border-t-brand rounded-full spin" />
              <div className="text-center">
                <p className="font-semibold">Gerando {mod?.title}...</p>
                <p className="text-slate-400 text-sm mt-1">IA analisando seu perfil · {mod?.time}</p>
              </div>
            </div>
          )}

          {!loading && !content && (
            <div className="flex flex-col items-center justify-center py-20 gap-4 text-center px-6">
              <span className="text-5xl">{mod?.icon}</span>
              <div>
                <h3 className="font-semibold text-lg mb-1">Pronto para gerar!</h3>
                <p className="text-slate-400 text-sm">Clique em "Gerar com IA" para criar seu {mod?.title} personalizado.<br/>Tempo estimado: {mod?.time}.</p>
              </div>
              <button onClick={generate} className="btn-primary">✨ Gerar com IA agora</button>
            </div>
          )}

          {!loading && content && (
            <div className="p-6 prose prose-invert prose-headings:text-white prose-p:text-slate-300 prose-li:text-slate-300 prose-strong:text-white prose-code:text-amber-400 prose-pre:bg-surface prose-table:text-sm max-w-none">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          )}
        </div>

        {content && !loading && (
          <div className="flex justify-center mt-6">
            <Link href="/dashboard" className="btn-ghost text-sm py-2 px-6">← Voltar ao Dashboard</Link>
          </div>
        )}
      </main>
    </div>
  )
}
