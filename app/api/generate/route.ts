import { NextRequest, NextResponse } from 'next/server'
import { MODULE_PROMPTS } from '@/lib/prompts'

export const runtime = 'edge'

// Modelo principal (melhor qualidade) e fallback (mais rápido, maior limite)
const PRIMARY_MODEL = 'llama-3.3-70b-versatile'   // 12k TPM free
const FALLBACK_MODEL = 'llama-3.1-8b-instant'      // 30k TPM free

async function callGroq(prompt: string, model: string, key: string) {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: 'system',
          content: 'Você é especialista em carreira e LinkedIn para o mercado brasileiro. Responda SEMPRE em português do Brasil. Use Markdown rico: títulos ##, negrito, tabelas, listas, emojis. Seja MUITO específico — referencie o conteúdo real do perfil do usuário. Nunca dê conselhos genéricos. Entregue conteúdo pronto para usar imediatamente.'
        },
        { role: 'user', content: prompt }
      ],
      max_tokens: 3500,
      temperature: 0.65,
    }),
  })
  return res
}

export async function POST(req: NextRequest) {
  try {
    const { module, profile, extra } = await req.json()
    if (!module || !profile) return NextResponse.json({ error: 'Parâmetros inválidos' }, { status: 400 })

    const promptFn = MODULE_PROMPTS[module]
    if (!promptFn) return NextResponse.json({ error: 'Módulo inválido' }, { status: 400 })

    const key = process.env.GROQ_API_KEY
    if (!key) return NextResponse.json({ error: 'GROQ_API_KEY não configurada' }, { status: 500 })

    const prompt = promptFn(profile, extra)

    // Tentativa 1: modelo principal (maior qualidade)
    let res = await callGroq(prompt, PRIMARY_MODEL, key)

    // Se rate limit (429), aguarda 2s e tenta com modelo de fallback (mais rápido)
    if (res.status === 429) {
      await new Promise(r => setTimeout(r, 2000))
      res = await callGroq(prompt, FALLBACK_MODEL, key)
    }

    // Se ainda 429, aguarda mais 3s e tenta novamente com fallback
    if (res.status === 429) {
      await new Promise(r => setTimeout(r, 3000))
      res = await callGroq(prompt, FALLBACK_MODEL, key)
    }

    if (!res.ok) {
      const err = await res.text()
      if (res.status === 429) {
        return NextResponse.json({
          error: '⏳ Muitas requisições ao mesmo tempo. Aguarde 10 segundos e tente novamente.'
        }, { status: 429 })
      }
      return NextResponse.json({ error: `Erro Groq ${res.status}: ${err}` }, { status: 500 })
    }

    const data = await res.json()
    const content = data.choices?.[0]?.message?.content || ''
    const modelUsed = data.model || PRIMARY_MODEL

    return NextResponse.json({ content, model: modelUsed })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Erro ao gerar.' }, { status: 500 })
  }
}
