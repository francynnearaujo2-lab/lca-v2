type Profile = Record<string, string>

export const MODULES = [
  { id: 'diagnostico', icon: '🔍', title: 'Diagnóstico do Mercado', desc: 'Score do perfil, top palavras-chave e análise da concorrência', time: '2-3 min' },
  { id: 'otimizacao', icon: '✨', title: 'Otimização do LinkedIn', desc: 'Headlines magnéticas, resumo e top 50 skills', time: '3-4 min' },
  { id: 'vagas', icon: '🎯', title: 'Vagas Ocultas', desc: '20 empresas-alvo e scripts prontos de abordagem', time: '2-3 min' },
  { id: 'conteudo', icon: '📱', title: 'Calendário de Conteúdo', desc: '30 posts prontos para posicionar como autoridade', time: '4-5 min' },
  { id: 'ferramentas', icon: '🛠️', title: 'Ferramentas', desc: 'Guia completo de ferramentas gratuitas e pagas', time: '2-3 min' },
  { id: 'curriculo', icon: '📄', title: 'Currículo ATS', desc: 'Currículo otimizado para sistemas ATS', time: '3-4 min' },
  { id: 'entrevistas', icon: '🎤', title: 'Preparação para Entrevistas', desc: '30 perguntas + respostas e negociação salarial', time: '3-4 min' },
]

export const MODULE_PROMPTS: Record<string, (p: Profile) => string> = {
  diagnostico: (p) => `Você é especialista sênior em mercado de trabalho e LinkedIn. Analise o perfil e entregue em português:

### 🎯 SCORE DO PERFIL (0-100)
Avalie cada critério com pontuação justificada. Total final.

### 🔑 TOP 25 PALAVRAS-CHAVE
Para ${p.area} — listadas por relevância para recrutadores.

### 📊 ANÁLISE DO MERCADO
Panorama atual para ${p.cargo} em ${p.cidade}, demanda, salário médio, tendências.

### 🚨 5 LACUNAS CRÍTICAS
O que está reduzindo sua visibilidade agora.

### ✅ 5 AÇÕES IMEDIATAS (próximos 7 dias)
Concretas e específicas.

### 🏆 PERFIL DA CONCORRÊNCIA
Quem está sendo contratado para ${p.cargo} hoje.

Perfil: Nome: ${p.nome} | Área: ${p.area} | Cargo: ${p.cargo} | Experiência: ${p.experiencia} anos | Setor: ${p.setor} | Objetivo: ${p.objetivo} | Cidade: ${p.cidade} | Modalidade: ${p.modalidade}`,

  otimizacao: (p) => `Você é especialista em LinkedIn e personal branding. Entregue em português:

### ✨ 3 HEADLINES (máx 220 chars cada)
Headline 1 — foco em cargo:
Headline 2 — foco em resultado:
Headline 3 — foco em transformação:

### 📝 RESUMO/ABOUT COMPLETO (1800-2000 chars)
Storytelling com abertura impactante, conquistas com métricas e CTA.

### 💼 5 BULLETS DE EXPERIÊNCIA
Método CAR para ${p.cargo} com métricas reais.

### 🛠️ TOP 50 SKILLS
Divididas: Técnicas (25) | Comportamentais (15) | Ferramentas (10)

### 🤝 ESTRATÉGIA DE RECOMENDAÇÕES
Quem pedir + script de solicitação.

Perfil: ${p.nome} | ${p.cargo} | ${p.area} | ${p.experiencia} anos | ${p.objetivo}`,

  vagas: (p) => `Você é headhunter sênior com 15 anos no Brasil. Entregue em português:

### 🏢 20 EMPRESAS-ALVO
Nome | Por que contrata ${p.cargo} | Como abordar

### 📨 5 SCRIPTS DE MENSAGEM LINKEDIN
Prontos para enviar a recrutadores e gestores.

### 🎯 SCRIPT PARA HEADHUNTERS
Mensagem perfeita para headhunters de ${p.area}.

### 🌐 NETWORKING ESTRATÉGICO
10 tipos de profissionais para conectar + como conseguir warm intro.

### 📅 CALENDÁRIO 2 SEMANAS
Dia a dia com metas de prospecção.

### 🌍 15 SITES ESPECIALIZADOS
Para encontrar vagas em ${p.area} além do LinkedIn.

Perfil: ${p.nome} | ${p.cargo} | ${p.area} | ${p.cidade} | ${p.objetivo} | Salário: ${p.salario || 'a combinar'}`,

  conteudo: (p) => `Você é estrategista de conteúdo para LinkedIn. Crie 30 posts completos em português.

Para cada post:
**POST [N] — Semana X, Dia Y**
- Formato: [texto/carrossel/enquete/vídeo]
- Horário ideal:
- Hook (primeira linha):
- Corpo completo do post (com emojis e quebras de linha):
- Hashtags (5-8):

Tipos: 8 experiências pessoais | 6 dicas técnicas | 5 tendências | 4 erros superados | 4 bastidores | 3 conquistas

Área: ${p.area} | Cargo: ${p.cargo} | Objetivo: ${p.objetivo} | Setor: ${p.setor}`,

  ferramentas: (p) => `Você é especialista em produtividade para carreira. Entregue em português:

### 🆓 20 FERRAMENTAS GRATUITAS
| Ferramenta | Link | Para que serve | Como usar na busca | Nota |

### 💰 10 FERRAMENTAS PAGAS QUE VALEM
| Ferramenta | Preço | ROI | Alternativa gratuita |

### 🔌 TOP 10 EXTENSÕES CHROME PARA LINKEDIN
Nome + o que faz + como usar estrategicamente.

### ✅ AUTOMAÇÕES SEGURAS vs BANIMENTO
O que é permitido, limites diários seguros.

### 📊 STACK POR OBJETIVO
Para recolocação | Para crescimento | Para mudança de área

Área: ${p.area} | Objetivo: ${p.objetivo}`,

  curriculo: (p) => `Você é especialista em RH e ATS. Crie currículo COMPLETO em português, pronto para usar:

**[${p.nome}]**
${p.cargo} | ${p.cidade}
[email] | [telefone] | [LinkedIn]

**RESUMO EXECUTIVO**
[4-5 linhas poderosas]

**COMPETÊNCIAS**
[Organizadas por categoria para ${p.area}]

**EXPERIÊNCIA PROFISSIONAL**
[3 posições com bullets CAR e métricas]

**FORMAÇÃO**
**CERTIFICAÇÕES**
**IDIOMAS**

---
### 🤖 ANÁLISE ATS
Score estimado: X/100
30 palavras-chave que DEVEM aparecer:
Erros comuns a evitar:

Perfil completo: ${p.nome} | ${p.cargo} | ${p.area} | ${p.experiencia} anos | ${p.especializacoes || ''} | ${p.certificacoes || ''} | ${p.objetivo}`,

  entrevistas: (p) => `Você é coach de carreira sênior. Entregue guia completo em português:

### 🎯 30 PERGUNTAS + RESPOSTAS MODELO
Para cada pergunta:
**PERGUNTA [N]: "[texto]"**
- Por que perguntam:
- Estrutura ideal (STAR):
- Resposta modelo completa:
- Erros a evitar:

Tipos: 10 comportamentais | 8 técnicas para ${p.area} | 5 motivação | 4 situacionais | 3 salário

### 💰 NEGOCIAÇÃO SALARIAL
Faixa de mercado para ${p.cargo} em ${p.cidade}
Scripts para 3 cenários de negociação
O que pedir além do salário

### ✅ CHECKLIST PRÉ-ENTREVISTA
Online + Presencial

### 📧 FOLLOW-UP PERFEITO
Templates para: após entrevista | sem retorno (7 dias) | agradecimento por oferta

Perfil: ${p.nome} | ${p.cargo} | ${p.area} | ${p.cidade} | Salário desejado: ${p.salario || 'a combinar'}`,
}

export const PLAN_PROMPT = (p: Profile, modules: string[]) => `Você é coach de carreira sênior. Crie Plano de Ação 90 Dias DETALHADO em português para ${p.nome}.

### 🗓️ SEMANA A SEMANA (12 semanas)
Para cada semana:
**SEMANA [N] — [Tema]**
- Meta: [objetivo mensurável]
- Segunda a Sexta: [ação específica por dia]
- KPI da semana:
- Motivação:

### 🏆 MARCOS
Mês 1 | Mês 2 | Mês 3 (emprego conquistado)

### 📈 KPIs SEMANAIS
Tabela: Conexões | Candidaturas | Entrevistas | Posts | Networking

### 🆘 PLANO DE CONTINGÊNCIA
Se mês 1 sem entrevistas | Se mês 2 sem ofertas

### ⚡ AMANHÃ CEDO — 5 primeiras ações

Perfil: ${p.nome} | ${p.cargo} | ${p.area} | ${p.objetivo} | ${p.cidade}
Módulos concluídos: ${modules.join(', ')}`
