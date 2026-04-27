import { NextRequest, NextResponse } from 'next/server'
import { MODULE_PROMPTS } from '@/lib/prompts'

export const runtime = 'edge'

export async function POST(req: NextRequest) {
  try {
    const { module, profile } = await req.json()
    if (!module || !profile) return NextResponse.json({ error: 'Parâmetros inválidos' }, { status: 400 })

    const promptFn = MODULE_PROMPTS[module]
    if (!promptFn) return NextResponse.json({ error: 'Módulo inválido' }, { status: 400 })

    const key = process.env.GROQ_API_KEY
    if (!key) return NextResponse.json({ error: 'GROQ_API_KEY não configurada' }, { status: 500 })

    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: 'Você é um especialista em carreira e LinkedIn para o mercado brasileiro. Responda sempre em português do Brasil. Use Markdown rico com emojis, tabelas e listas. Seja específico, prático e entregue conteúdo pronto para usar.' },
          { role: 'user', content: promptFn(profile) },
        ],
        max_tokens: 4096,
        temperature: 0.7,
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      return NextResponse.json({ error: `Groq ${res.status}: ${err}` }, { status: 500 })
    }

    const data = await res.json()
    const content = data.choices?.[0]?.message?.content || ''
    return NextResponse.json({ content })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Erro ao gerar.' }, { status: 500 })
  }
}
