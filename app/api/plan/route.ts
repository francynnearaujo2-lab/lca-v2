import { NextRequest, NextResponse } from 'next/server'
import { PLAN_PROMPT } from '@/lib/prompts'

export const runtime = 'edge'

const PRIMARY_MODEL = 'llama-3.3-70b-versatile'
const FALLBACK_MODEL = 'llama-3.1-8b-instant'

async function callGroq(prompt: string, model: string, key: string) {
  return fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: 'system',
          content: 'Você é coach de carreira sênior especializado no mercado brasileiro. Responda em português do Brasil com Markdown rico. Seja específico, com ações concretas e datas reais.'
        },
        { role: 'user', content: prompt }
      ],
      max_tokens: 5000,
      temperature: 0.65,
    }),
  })
}

export async function POST(req: NextRequest) {
  try {
    const { profile, completedModules } = await req.json()
    const key = process.env.GROQ_API_KEY
    if (!key) return NextResponse.json({ error: 'GROQ_API_KEY não configurada' }, { status: 500 })

    const prompt = PLAN_PROMPT(profile, completedModules || [])

    let res = await callGroq(prompt, PRIMARY_MODEL, key)

    if (res.status === 429) {
      await new Promise(r => setTimeout(r, 2000))
      res = await callGroq(prompt, FALLBACK_MODEL, key)
    }

    if (res.status === 429) {
      await new Promise(r => setTimeout(r, 3000))
      res = await callGroq(prompt, FALLBACK_MODEL, key)
    }

    if (!res.ok) {
      if (res.status === 429) {
        return NextResponse.json({ error: '⏳ Aguarde 10 segundos e tente novamente.' }, { status: 429 })
      }
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
