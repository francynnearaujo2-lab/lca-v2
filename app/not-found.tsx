import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 text-center">
      <div>
        <div className="text-8xl mb-6">🔍</div>
        <h1 className="text-4xl font-black mb-3">Página não encontrada</h1>
        <p className="text-slate-400 mb-8">A página que você procura não existe ou foi movida.</p>
        <div className="flex gap-3 justify-center">
          <Link href="/" className="btn-primary">← Voltar ao início</Link>
          <Link href="/dashboard" className="btn-ghost">Meu dashboard</Link>
        </div>
      </div>
    </div>
  )
}
