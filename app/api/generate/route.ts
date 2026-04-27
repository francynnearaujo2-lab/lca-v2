import { NextRequest, NextResponse } from 'next/server'
import { MODULE_PROMPTS } from '@/lib/prompts'

export const runtime = 'edge'

export async function POST(req: NextRequest) {
  try {
    const { module, profile, extra } = await req.json()
    if (!module || !profile) return NextResponse.json({ error: 'Parâmetros inválidos' }, { status: 400 })

    const promptFn = MODULE_PROMPTS[module]
    if (!promptFn) return NextResponse.json({ error: 'Módulo inválido' }, { status: 400 })

    const key = process.env.GROQ_API_KEY
    if (!key) return NextResponse.json({ error: 'GROQ_API_KEY não configurada' }, { status: 500 })

    const prompt = promptFn(profile, extra)

    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'Você é um especialista em carreira e LinkedIn para o mercado brasileiro. Responda SEMPRE em português do Brasil. Use Markdown rico: títulos, negrito, tabelas, listas, emojis. Seja MUITO específico — referencie o conteúdo real do perfil do usuário em suas análises. Nunca dê conselhos genéricos. Entregue conteúdo pronto para usar imediatamente.'
          },
          { role: 'user', content: prompt },
        ],
        max_tokens: 4096,
        temperature: 0.65,
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
