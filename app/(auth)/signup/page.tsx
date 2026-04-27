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
  const [needsConfirm, setNeedsConfirm] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')

    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: { emailRedirectTo: `${location.origin}/auth/callback` }
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    // Se a sessão foi criada (confirmação desativada no Supabase), vai direto ao dashboard
    if (data?.session) {
      router.push('/dashboard')
      return
    }

    // Se precisa confirmar email
    setNeedsConfirm(true)
    setLoading(false)
  }

  if (needsConfirm) return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">📧</div>
        <h2 className="text-2xl font-bold mb-3">Confirme seu email</h2>
        <p className="text-slate-400 mb-2">
          Enviamos um link para <strong className="text-white">{email}</strong>.
        </p>
        <p className="text-slate-500 text-sm mb-6">
          Não encontrou? Verifique o spam ou aguarde alguns minutos.
        </p>
        <div className="card p-4 text-sm text-slate-400 mb-6">
          💡 <strong className="text-white">Dica:</strong> Se você é o administrador do app, desative a confirmação de email em{' '}
          <span className="text-brand">Supabase → Authentication → Providers → Email → desmarque "Confirm email"</span>
          {' '}para entrar direto sem precisar confirmar.
        </div>
        <Link href="/login" className="btn-primary inline-flex">Já confirmei, entrar →</Link>
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
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg px-4 py-3 text-sm">
              {error.includes('already registered') ? '⚠️ Este email já está cadastrado. Tente fazer login.' : error}
            </div>
          )}
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
