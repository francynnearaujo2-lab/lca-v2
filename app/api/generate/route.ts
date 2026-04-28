import { NextRequest, NextResponse } from 'next/server'
import { MODULE_PROMPTS } from '@/lib/prompts'

export const runtime = 'edge'

// ─── Configuração de provedor de IA ──────────────────────────────
// Ollama (local, grátis, sem rate limit): set OLLAMA_BASE_URL=http://localhost:11434
// Groq (produção): set GROQ_API_KEY=gsk_...
// Google Gemini (alternativa grátis): set GEMINI_API_KEY=AIza...

const GROQ_PRIMARY   = 'llama-3.3-70b-versatile'  // 12k TPM free
const GROQ_FALLBACK  = 'llama-3.1-8b-instant'     // 30k TPM free
const OLLAMA_MODEL   = process.env.OLLAMA_MODEL || 'llama3.3' // modelo local

async function callOpenAICompat(
  prompt: string,
  model: string,
  baseUrl: string,
  apiKey: string,
  maxTokens = 3500
) {
  return fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: 'system',
          content: 'Você é especialista em carreira e LinkedIn para o mercado brasileiro. Responda SEMPRE em português do Brasil. Use Markdown rico: títulos ##, negrito, tabelas, listas, emojis. Seja MUITO específico — use o conteúdo real do perfil do usuário. Nunca dê conselhos genéricos. Entregue conteúdo pronto para usar.'
        },
        { role: 'user', content: prompt }
      ],
      max_tokens: maxTokens,
      temperature: 0.65,
    }),
  })
}

export async function POST(req: NextRequest) {
  try {
    const { module, profile, extra } = await req.json()
    if (!module || !profile) return NextResponse.json({ error: 'Parâmetros inválidos' }, { status: 400 })

    const promptFn = MODULE_PROMPTS[module]
    if (!promptFn) return NextResponse.json({ error: 'Módulo inválido' }, { status: 400 })

    const prompt = promptFn(profile, extra)

    // ── OLLAMA (desenvolvimento local) ────────────────────────────
    if (process.env.OLLAMA_BASE_URL) {
      const res = await callOpenAICompat(
        prompt, OLLAMA_MODEL,
        process.env.OLLAMA_BASE_URL + '/v1',
        'ollama', // Ollama não precisa de API key real
        4000
      )
      if (!res.ok) {
        const err = await res.text()
        return NextResponse.json({ error: `Ollama erro: ${err}` }, { status: 500 })
      }
      const data = await res.json()
      return NextResponse.json({ content: data.choices?.[0]?.message?.content || '', model: OLLAMA_MODEL })
    }

    // ── GROQ (produção) ───────────────────────────────────────────
    const groqKey = process.env.GROQ_API_KEY
    if (!groqKey) return NextResponse.json({ error: 'Configure GROQ_API_KEY ou OLLAMA_BASE_URL' }, { status: 500 })

    const GROQ_BASE = 'https://api.groq.com/openai/v1'

    // Tentativa 1: modelo principal 70B
    let res = await callOpenAICompat(prompt, GROQ_PRIMARY, GROQ_BASE, groqKey)

    // 429: espera e tenta com 8B (mais rápido, 30k TPM)
    if (res.status === 429) {
      await new Promise(r => setTimeout(r, 2000))
      res = await callOpenAICompat(prompt, GROQ_FALLBACK, GROQ_BASE, groqKey)
    }

    // Ainda 429: última tentativa
    if (res.status === 429) {
      await new Promise(r => setTimeout(r, 3000))
      res = await callOpenAICompat(prompt, GROQ_FALLBACK, GROQ_BASE, groqKey)
    }

    if (!res.ok) {
      if (res.status === 429) {
        return NextResponse.json({
          error: '⏳ Servidor ocupado. Aguarde 10 segundos e tente novamente.'
        }, { status: 429 })
      }
      const err = await res.text()
      return NextResponse.json({ error: `Groq ${res.status}: ${err}` }, { status: 500 })
    }

    const data = await res.json()
    return NextResponse.json({
      content: data.choices?.[0]?.message?.content || '',
      model: data.model
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Erro ao gerar.' }, { status: 500 })
  }
}
