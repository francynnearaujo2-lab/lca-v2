'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const supabase = createClient()

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${location.origin}/auth/callback` } })
    if (error) { setError(error.message); setLoading(false) }
    else setDone(true)
  }

  if (done) return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">📧</div>
        <h2 className="text-2xl font-bold mb-3">Confirme seu email</h2>
        <p className="text-slate-400">Enviamos um link de confirmação para <strong className="text-white">{email}</strong>. Clique no link para ativar sua conta.</p>
        <Link href="/login" className="btn-primary inline-flex mt-6">Ir para o login</Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center">💼</div>
            <span className="font-bold text-lg">LinkedIn <span className="text-brand">Career Agent</span></span>
          </Link>
          <h1 className="text-2xl font-bold mb-1">Crie sua conta grátis</h1>
          <p className="text-slate-400 text-sm">Sem cartão de crédito · Acesso imediato</p>
        </div>
        <form onSubmit={handleSignup} className="card p-6 space-y-4">
          {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg px-4 py-3 text-sm">{error}</div>}
          <div>
            <label className="label">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input" placeholder="seu@email.com" required />
          </div>
          <div>
            <label className="label">Senha (mínimo 6 caracteres)</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="input" placeholder="••••••••" minLength={6} required />
          </div>
          <button type="submit" disabled={loading} className="btn-gold w-full py-3 mt-2 disabled:opacity-50">
            {loading ? 'Criando conta...' : '🚀 Criar conta grátis'}
          </button>
        </form>
        <p className="text-center text-slate-400 text-sm mt-6">
          Já tem conta?{' '}
          <Link href="/login" className="text-brand hover:underline">Entrar</Link>
        </p>
      </div>
    </div>
  )
}
