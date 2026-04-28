import { NextRequest, NextResponse } from 'next/server'
import { PLAN_PROMPT } from '@/lib/prompts'

export const runtime = 'edge'

const GROQ_PRIMARY  = 'llama-3.3-70b-versatile'
const GROQ_FALLBACK = 'llama-3.1-8b-instant'
const OLLAMA_MODEL  = process.env.OLLAMA_MODEL || 'llama3.3'

async function callOpenAICompat(prompt: string, model: string, baseUrl: string, apiKey: string, maxTokens = 5000) {
  return fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: 'Você é coach de carreira sênior especializado no mercado brasileiro. Responda em português do Brasil com Markdown rico. Seja específico, com ações concretas.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: maxTokens,
      temperature: 0.65,
    }),
  })
}

export async function POST(req: NextRequest) {
  try {
    const { profile, completedModules } = await req.json()
    const prompt = PLAN_PROMPT(profile, completedModules || [])

    // Ollama local
    if (process.env.OLLAMA_BASE_URL) {
      const res = await callOpenAICompat(prompt, OLLAMA_MODEL, process.env.OLLAMA_BASE_URL + '/v1', 'ollama', 6000)
      if (!res.ok) { const e = await res.text(); return NextResponse.json({ error: `Ollama: ${e}` }, { status: 500 }) }
      const data = await res.json()
      return NextResponse.json({ content: data.choices?.[0]?.message?.content || '' })
    }

    // Groq produção
    const groqKey = process.env.GROQ_API_KEY
    if (!groqKey) return NextResponse.json({ error: 'Configure GROQ_API_KEY' }, { status: 500 })

    const GROQ_BASE = 'https://api.groq.com/openai/v1'
    let res = await callOpenAICompat(prompt, GROQ_PRIMARY, GROQ_BASE, groqKey)

    if (res.status === 429) {
      await new Promise(r => setTimeout(r, 2000))
      res = await callOpenAICompat(prompt, GROQ_FALLBACK, GROQ_BASE, groqKey)
    }
    if (res.status === 429) {
      await new Promise(r => setTimeout(r, 3000))
      res = await callOpenAICompat(prompt, GROQ_FALLBACK, GROQ_BASE, groqKey)
    }

    if (!res.ok) {
      if (res.status === 429) return NextResponse.json({ error: '⏳ Aguarde 10s e tente novamente.' }, { status: 429 })
      const err = await res.text()
      return NextResponse.json({ error: `Groq ${res.status}: ${err}` }, { status: 500 })
    }

    const data = await res.json()
    return NextResponse.json({ content: data.choices?.[0]?.message?.content || '' })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Erro.' }, { status: 500 })
  }
}
