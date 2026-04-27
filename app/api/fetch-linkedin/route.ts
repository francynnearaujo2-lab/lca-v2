import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

export async function POST(req: NextRequest) {
  try {
    const { linkedinUrl } = await req.json()

    if (!linkedinUrl) {
      return NextResponse.json({ error: 'URL do LinkedIn não fornecida' }, { status: 400 })
    }

    // Validar que é um URL do LinkedIn
    const cleanUrl = linkedinUrl.trim()
    if (!cleanUrl.includes('linkedin.com/in/')) {
      return NextResponse.json({ error: 'URL inválida. Use o formato: linkedin.com/in/seu-usuario' }, { status: 400 })
    }

    const apiKey = process.env.SCRAPIN_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'SCRAPIN_API_KEY não configurada' }, { status: 500 })
    }

    // Chamar a API Scrapin.io
    const res = await fetch(
      `https://api.scrapin.io/enrichment/profile?apikey=${apiKey}&linkedInUrl=${encodeURIComponent(cleanUrl)}`,
      { headers: { 'Content-Type': 'application/json' } }
    )

    if (!res.ok) {
      const errText = await res.text()
      console.error('Scrapin error:', res.status, errText)

      if (res.status === 401) return NextResponse.json({ error: 'API Key do Scrapin.io inválida.' }, { status: 401 })
      if (res.status === 402) return NextResponse.json({ error: 'Créditos Scrapin.io esgotados. Adicione mais em scrapin.io.' }, { status: 402 })
      if (res.status === 404) return NextResponse.json({ error: 'Perfil do LinkedIn não encontrado. Verifique se é público.' }, { status: 404 })

      return NextResponse.json({ error: `Erro ao buscar perfil: ${res.status}` }, { status: 500 })
    }

    const data = await res.json()
    const p = data.person

    if (!p) {
      return NextResponse.json({ error: 'Perfil não encontrado ou privado.' }, { status: 404 })
    }

    // Montar experiências
    const positions = p.positions || []
    const exp1 = positions[0] || {}
    const exp2 = positions[1] || {}

    // Montar skills
    const skills = (p.skills || []).slice(0, 20).join(', ')

    const profile = {
      nome: `${p.firstName || ''} ${p.lastName || ''}`.trim(),
      headline_atual: p.headline || '',
      sobre_atual: p.summary || '',
      exp1_cargo: exp1.title || '',
      exp1_empresa: exp1.companyName || '',
      exp1_descricao: [exp1.description, exp1.timePeriod ? `Período: ${exp1.timePeriod}` : ''].filter(Boolean).join('\n'),
      exp2_cargo: exp2.title || '',
      exp2_empresa: exp2.companyName || '',
      exp2_descricao: exp2.description || '',
      certificacoes: (p.certifications || []).map((c: any) => c.name).join(', '),
      nivel_formacao: p.educations?.[0]?.degreeName || '',
      formacao: p.educations?.[0] ? `${p.educations[0].fieldOfStudy || ''} — ${p.educations[0].schoolName || ''}`.trim() : '',
      skills,
      cidade: p.location || '',
      creditsLeft: data.credits_left,
    }

    return NextResponse.json({ profile, raw: { skills } })
  } catch (err: any) {
    console.error('fetch-linkedin error:', err)
    return NextResponse.json({ error: 'Erro ao importar perfil.' }, { status: 500 })
  }
}
