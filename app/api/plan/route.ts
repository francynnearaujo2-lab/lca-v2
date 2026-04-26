import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'
import { PLAN_PROMPT } from '@/lib/prompts'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || 'placeholder' })
  try {
    const { profile, completedModules } = await req.json()

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: 'Você é coach de carreira sênior especializado no mercado brasileiro. Responda em português do Brasil com Markdown rico. Seja específico, com datas e ações concretas.' },
        { role: 'user', content: PLAN_PROMPT(profile, completedModules) },
      ],
      max_tokens: 6000,
      temperature: 0.7,
    })

    const content = completion.choices[0]?.message?.content || ''

    try {
      const supabase = await createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase.from('action_plans').upsert({ user_id: user.id, content, updated_at: new Date().toISOString() }, { onConflict: 'user_id' })
      }
    } catch {}

    return NextResponse.json({ content })
  } catch (err: any) {
    return NextResponse.json({ error: 'Erro ao gerar plano.' }, { status: 500 })
  }
}
