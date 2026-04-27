import { NextRequest, NextResponse } from 'next/server'
import { PLAN_PROMPT } from '@/lib/prompts'

export const runtime = 'edge'

export async function POST(req: NextRequest) {
  try {
    const { profile, completedModules } = await req.json()

    const key = process.env.GROQ_API_KEY
    if (!key) return NextResponse.json({ error: 'GROQ_API_KEY não configurada' }, { status: 500 })

    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: 'Você é coach de carreira sênior especializado no mercado brasileiro. Responda em português do Brasil com Markdown rico. Seja específico, com datas e ações concretas.' },
          { role: 'user', content: PLAN_PROMPT(profile, completedModules) },
        ],
        max_tokens: 6000,
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
    return NextResponse.json({ error: err.message || 'Erro ao gerar plano.' }, { status: 500 })
  }
}
