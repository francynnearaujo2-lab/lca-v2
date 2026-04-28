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
      const msg = error.message.includes('already registered')
        ? 'Este email já está cadastrado. Tente fazer login.'
        : error.message
      setError(msg); setLoading(false); return
    }

    if (data?.session) {
      router.push('/dashboard'); return
    }

    setNeedsConfirm(true); setLoading(false)
  }

  if (needsConfirm) return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">📧</div>
        <h2 className="text-2xl font-bold mb-3">Confirme seu email</h2>
        <p className="text-slate-400 mb-2">
          Enviamos um link para <strong className="text-white">{email}</strong>.
        </p>
        <p className="text-slate-500 text-sm mb-6">Não encontrou? Verifique o spam.</p>
        <div className="card p-4 text-left text-sm text-slate-400 mb-6">
          <p className="text-white font-semibold mb-1">💡 Para entrar sem confirmar:</p>
          <p>Supabase → Authentication → Providers → Email → desmarque <strong>"Confirm email"</strong> → Save</p>
        </div>
        <Link href="/login" className="btn-primary inline-flex">Já confirmei → Entrar</Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-9 h-9 rounded-xl bg-brand flex items-center justify-center text-xl">💼</div>
            <span className="font-bold text-xl">Career<span className="text-brand">Agent</span></span>
          </Link>
          <h1 className="text-2xl font-bold mb-1">Crie sua conta grátis</h1>
          <p className="text-slate-400 text-sm">Sem cartão de crédito · Acesso imediato</p>
        </div>

        <form onSubmit={handleSignup} className="card p-6 space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg px-4 py-3 text-sm">
              ⚠️ {error}
            </div>
          )}
          <div>
            <label className="label">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              className="input" placeholder="seu@email.com" required />
          </div>
          <div>
            <label className="label">Senha <span className="text-slate-500 font-normal normal-case">(mínimo 6 caracteres)</span></label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              className="input" placeholder="••••••••" minLength={6} required />
          </div>
          <button type="submit" disabled={loading} className="btn-gold w-full py-3 disabled:opacity-50">
            {loading ? 'Criando conta...' : '🚀 Criar conta grátis'}
          </button>
          <p className="text-xs text-slate-500 text-center">
            Ao criar sua conta você concorda com nossos termos de uso.
          </p>
        </form>

        <p className="text-center text-slate-400 text-sm mt-5">
          Já tem conta?{' '}
          <Link href="/login" className="text-brand hover:underline font-medium">Entrar</Link>
        </p>
      </div>
    </div>
  )
}
