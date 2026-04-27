import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'
import { MODULE_PROMPTS } from '@/lib/prompts'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || 'placeholder' })
  try {
    const { module, profile } = await req.json()
    if (!module || !profile) return NextResponse.json({ error: 'Parâmetros inválidos' }, { status: 400 })

    const promptFn = MODULE_PROMPTS[module]
    if (!promptFn) return NextResponse.json({ error: 'Módulo inválido' }, { status: 400 })

    if (!process.env.GROQ_API_KEY) return NextResponse.json({ error: 'GROQ_API_KEY não configurada' }, { status: 500 })

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: 'Você é um especialista em carreira e LinkedIn para o mercado brasileiro. Responda sempre em português do Brasil. Use formatação Markdown rica com emojis, tabelas e listas. Seja específico, prático e entregue conteúdo pronto para usar.' },
        { role: 'user', content: promptFn(profile) },
      ],
      max_tokens: 4096,
      temperature: 0.7,
    })

    const content = completion.choices[0]?.message?.content || ''

    // Save to Supabase if user is authenticated
    try {
      const supabase = await createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase.from('module_results').upsert({
          user_id: user.id, module_id: module, content, updated_at: new Date().toISOString()
        }, { onConflict: 'user_id,module_id' })
      }
    } catch {}

    return NextResponse.json({ content })
  } catch (err: any) {
    console.error('Groq error:', err?.status, err?.message)
    return NextResponse.json({ error: err?.message || 'Erro ao gerar conteúdo.', code: err?.status }, { status: 500 })
  }
}
