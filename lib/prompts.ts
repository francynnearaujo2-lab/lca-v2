// ═══════════════════════════════════════════════════════════════
//  LinkedIn Career Agent v2 — Prompts reais, conteúdo real
// ═══════════════════════════════════════════════════════════════

export type Profile = {
  // Identidade
  nome: string
  email_display?: string
  areas: string          // até 3 áreas separadas por vírgula: "Marketing, Growth, Vendas"
  cargo_atual: string
  senioridade: string    // Júnior / Pleno / Sênior / Gerente / Diretor / C-Level
  nivel_formacao: string
  formacao: string
  // Conteúdo real do LinkedIn
  headline_atual: string  // headline real atual
  sobre_atual: string     // seção "Sobre" real
  exp1_cargo: string
  exp1_empresa: string
  exp1_descricao: string  // bullets reais
  exp2_cargo?: string
  exp2_empresa?: string
  exp2_descricao?: string
  // Currículo
  curriculo_texto: string // texto colado ou extraído do PDF
  certificacoes?: string
  // Objetivos
  objetivo: string        // recolocação / crescimento / mudança / primeiro emprego
  tipo_empresa?: string
  modalidade: string
  empresas_sonho?: string // "Google, Nubank, TOTVS"
  tipo_contrato?: string  // CLT / PJ / Ambos
  // Localização
  cidade: string
  disponibilidade?: string
  salario?: string
}

export const MODULES = [
  {
    id: 'diagnostico',
    icon: '🔍',
    title: 'Diagnóstico Real do Perfil',
    desc: 'IA lê seu LinkedIn e currículo linha por linha e entrega score real com pontos críticos',
    time: '2-3 min',
  },
  {
    id: 'otimizacao',
    icon: '✨',
    title: 'Otimização do LinkedIn',
    desc: 'Sua headline e "Sobre" reescritos com base no seu conteúdo atual — não templates',
    time: '3-4 min',
  },
  {
    id: 'vagas_ocultas',
    icon: '🎯',
    title: 'Vagas Ocultas do LinkedIn',
    desc: 'Boolean searches + links diretos + abordagem de recrutadores antes da vaga aparecer',
    time: '3-4 min',
  },
  {
    id: 'curriculo',
    icon: '📄',
    title: 'Currículo ATS por Área',
    desc: 'Seu currículo real reescrito e otimizado para cada uma das suas áreas-alvo',
    time: '4-5 min',
  },
  {
    id: 'match_vaga',
    icon: '🎯',
    title: 'Match com Vaga Real',
    desc: 'Cole uma vaga → receba gap analysis, currículo adaptado e script de candidatura',
    time: '2-3 min',
  },
  {
    id: 'conteudo',
    icon: '📱',
    title: 'Autoridade no LinkedIn',
    desc: '30 posts escritos com a sua voz real para atrair recrutadores organicamente',
    time: '4-5 min',
  },
  {
    id: 'entrevistas',
    icon: '🎤',
    title: 'Preparação para Entrevistas',
    desc: 'Perguntas + respostas usando seus próprios cases reais + negociação salarial',
    time: '4-5 min',
  },
]

// ─── PROMPTS REAIS ───────────────────────────────────────────────

export const MODULE_PROMPTS: Record<string, (p: Profile, extra?: string) => string> = {

  diagnostico: (p) => `Você é um consultor sênior de carreira e LinkedIn com 15 anos de experiência no mercado brasileiro. Você vai analisar o perfil REAL desta pessoa — não dê conselhos genéricos, comente linha por linha o que está errado e o que precisa mudar.

## DADOS REAIS DO PERFIL:

**Nome:** ${p.nome}
**Senioridade:** ${p.senioridade}
**Áreas-alvo:** ${p.areas}
**Cargo atual:** ${p.cargo_atual}
**Objetivo:** ${p.objetivo}
**Modalidade:** ${p.modalidade}
**Cidade:** ${p.cidade}
${p.salario ? `**Pretensão salarial:** ${p.salario}` : ''}
${p.empresas_sonho ? `**Empresas dos sonhos:** ${p.empresas_sonho}` : ''}

### HEADLINE ATUAL DO LINKEDIN:
"${p.headline_atual}"

### SEÇÃO "SOBRE" ATUAL:
"${p.sobre_atual}"

### EXPERIÊNCIA 1:
**${p.exp1_cargo}** na **${p.exp1_empresa}**
${p.exp1_descricao}
${p.exp2_cargo ? `\n### EXPERIÊNCIA 2:\n**${p.exp2_cargo}** na **${p.exp2_empresa}**\n${p.exp2_descricao}` : ''}

### CURRÍCULO (texto real):
${p.curriculo_texto}

${p.certificacoes ? `### CERTIFICAÇÕES:\n${p.certificacoes}` : ''}

---

## ENTREGUE ESTA ANÁLISE COMPLETA:

### 🎯 SCORE GERAL: X/100
Dê uma nota real e explique brevemente por que.

### 🔴 ANÁLISE DA HEADLINE ATUAL
Cite a headline exata entre aspas e explique:
- O que está errado nela especificamente
- Por que recrutadores não a encontram
- Quais palavras-chave estão faltando para as áreas: ${p.areas}

### 🔴 ANÁLISE DO "SOBRE" ATUAL
Cite trechos reais do texto e aponte:
- O que está vago e não impressiona
- O que está faltando (métricas, conquistas, palavras-chave)
- Erros de posicionamento para o objetivo de ${p.objetivo}

### 🔴 ANÁLISE DAS EXPERIÊNCIAS
Para cada cargo, aponte:
- Bullets que são fracos (só responsabilidade, sem resultado)
- O que falta em termos de impacto e números
- Inconsistências entre currículo e LinkedIn

### 🟡 ANÁLISE DO CURRÍCULO
- Compatibilidade ATS (0-100%)
- Top 10 palavras-chave que FALTAM para ${p.areas}
- Formatação e estrutura

### 🏆 COMPARATIVO COM O MERCADO
Para ${p.senioridade} em ${p.areas} em ${p.cidade}:
- Como seu perfil se compara com quem está sendo contratado hoje
- O que os perfis que recebem mais entrevistas têm que o seu não tem ainda

### ✅ TOP 5 AÇÕES IMEDIATAS (próximos 7 dias)
Ações específicas e concretas — não genéricas.`,

  // ─────────────────────────────────────────────────────────────

  otimizacao: (p) => `Você é o melhor especialista de personal branding e LinkedIn do Brasil. Você vai REESCREVER o perfil desta pessoa usando o conteúdo real dela como base — não templates genéricos.

## PERFIL REAL:
**Nome:** ${p.nome} | **Cargo:** ${p.cargo_atual} | **Nível:** ${p.senioridade}
**Áreas-alvo:** ${p.areas}
**Objetivo:** ${p.objetivo}
**Empresas dos sonhos:** ${p.empresas_sonho || 'não informado'}

### HEADLINE ATUAL (o que você vai melhorar):
"${p.headline_atual}"

### "SOBRE" ATUAL (o que você vai melhorar):
"${p.sobre_atual}"

### EXPERIÊNCIA PRINCIPAL:
${p.exp1_cargo} | ${p.exp1_empresa}
${p.exp1_descricao}
${p.exp2_cargo ? `\n${p.exp2_cargo} | ${p.exp2_empresa}\n${p.exp2_descricao}` : ''}

### CURRÍCULO:
${p.curriculo_texto}

---

## ENTREGUE:

### ✨ 3 OPÇÕES DE HEADLINE OTIMIZADA
Para cada uma:
- **A headline:** (máx 220 caracteres)
- **Por que funciona:** explique as palavras-chave escolhidas e por que recrutadores vão encontrar
- **Melhor para:** quando usar esta versão

As headlines devem ser baseadas nas suas experiências reais em ${p.exp1_empresa}${p.exp2_empresa ? ` e ${p.exp2_empresa}` : ''}.

### 📝 "SOBRE" REESCRITO COMPLETO
Escreva a seção "Sobre" nova completa (1.800-2.000 caracteres) que:
- Abre com uma frase impactante que NÃO comece com "Sou" ou "Profissional com X anos"
- Menciona conquistas reais das experiências informadas (com números quando possível)
- Usa as palavras-chave certas para ${p.areas}
- Termina com CTA claro
- Tom: profissional mas humano, brasileiro

### 💼 EXPERIÊNCIAS REESCRITAS COM MÉTODO STAR
Para cada cargo informado, reescreva os bullets:
- Cada bullet começa com verbo de ação forte (Liderou, Implementou, Aumentou...)
- Adiciona contexto + resultado mensurável
- Usa palavras-chave de ${p.areas}

### 🛠️ 50 SKILLS PARA ADICIONAR
Organizadas por categoria, priorizadas para ${p.areas} no mercado brasileiro.

### 🔗 URL PERSONALIZADA SUGERIDA
3 opções de URL curta para o perfil.`,

  // ─────────────────────────────────────────────────────────────

  vagas_ocultas: (p) => `Você é um headhunter sênior com 15 anos de experiência no mercado brasileiro e especialista em LinkedIn Recruiter. Sua missão: revelar as vagas que NUNCA aparecem nas plataformas abertas para ${p.nome}.

80% das vagas são preenchidas antes de serem publicadas. Você vai ensinar exatamente como acessar esse mercado oculto.

## PERFIL:
**Nome:** ${p.nome}
**Áreas-alvo:** ${p.areas}
**Cargo atual:** ${p.exp1_cargo} em ${p.exp1_empresa}
**Senioridade:** ${p.senioridade}
**Objetivo:** ${p.objetivo}
**Cidade:** ${p.cidade} | **Modalidade:** ${p.modalidade}
${p.empresas_sonho ? `**Empresas dos sonhos:** ${p.empresas_sonho}` : ''}
${p.salario ? `**Pretensão:** ${p.salario}` : ''}

---

## ENTREGUE:

### 🔍 BOOLEAN SEARCH STRINGS PARA LINKEDIN
Crie 8 strings de busca Boolean prontas para usar na barra de pesquisa do LinkedIn Jobs:

Para cada string:
**String [N]:** \`"termo1" AND ("variacao1" OR "variacao2") NOT "excluir"\`
**Objetivo:** [o que esta busca encontra]
**Como usar:** [instruções de uso]

As strings devem cobrir variações de cargo para ${p.areas} no mercado brasileiro (use termos em português E inglês pois muitas vagas BR misturam os dois).

### 🔗 LINKS DIRETOS DO LINKEDIN (clique e já busca)
Gere 6 URLs completas do LinkedIn Jobs já configuradas. Formato:
\`https://www.linkedin.com/jobs/search/?keywords=TERMOS&location=CIDADE&f_TPR=r604800&sortBy=DD\`

Para cada link:
**Link [N]:** [descrição do que busca]
\`[URL completa]\`

Use os parâmetros:
- \`f_TPR=r86400\` = últimas 24h (mais fresco, menos concorrência)
- \`f_TPR=r604800\` = última semana
- \`f_WT=2\` = remoto | \`f_WT=3\` = híbrido | \`f_WT=1\` = presencial
- \`sortBy=DD\` = ordenar por data

### 🏢 20 EMPRESAS-ALVO PARA ABORDAGEM DIRETA
Empresas que contratam ${p.senioridade} em ${p.areas} no Brasil — com estratégia específica:

| Empresa | Por que contratar você | Quem buscar no LinkedIn | Abordagem |
|---------|----------------------|------------------------|-----------|

### 👤 COMO ENCONTRAR RECRUTADORES E HIRING MANAGERS
String de busca para encontrar a pessoa certa em cada empresa:
\`"head of talent" OR "gerente de RH" OR "talent acquisition" [EMPRESA] [CIDADE]\`

Scripts específicos para cada tipo de abordagem:

**Abordagem ao Recrutador:**
[mensagem completa pronta, 300 caracteres para InMail]

**Abordagem ao Hiring Manager (antes da vaga aparecer):**
[mensagem completa pronta, 300 caracteres]

**Abordagem via post (comenta no conteúdo → depois mensagem):**
[estratégia passo a passo]

### 📅 PLANO DE PROSPECÇÃO 14 DIAS
Dia a dia com ações específicas e metas:
- Quantas buscas Boolean fazer
- Quantas conexões enviar
- Quantas mensagens mandar
- O que monitorar

### 🚨 SINAIS DE QUE UMA EMPRESA VAI ABRIR VAGA
Como identificar antes de todo mundo:
- O que monitorar no LinkedIn
- Eventos que precedem contratações
- Como usar o "Open to Work" de forma estratégica`,

  // ─────────────────────────────────────────────────────────────

  curriculo: (p) => `Você é um especialista em recrutamento e sistemas ATS com 15 anos de experiência. Você vai reescrever o currículo REAL de ${p.nome} — não um template genérico.

## CURRÍCULO ORIGINAL (o que você vai melhorar):
${p.curriculo_texto}

## PERFIL COMPLETO:
**Nome:** ${p.nome} | **Senioridade:** ${p.senioridade}
**Áreas-alvo:** ${p.areas}
**Formação:** ${p.formacao} | **Nível:** ${p.nivel_formacao}
${p.certificacoes ? `**Certificações:** ${p.certificacoes}` : ''}
**Objetivo:** ${p.objetivo} | **Cidade:** ${p.cidade}
${p.salario ? `**Pretensão:** ${p.salario}` : ''}

**LinkedIn headline:** "${p.headline_atual}"

---

## ENTREGUE:

### 📄 CURRÍCULO PRINCIPAL OTIMIZADO
Reescreva o currículo completo e pronto para usar, com:

**[${p.nome.toUpperCase()}]**
${p.cargo_atual} | ${p.cidade}
[email] | [telefone] | linkedin.com/in/[url] | [portfolio se mencionado]

**RESUMO PROFISSIONAL** (4 linhas poderosas — baseadas nas experiências reais):
[escreva usando os dados reais do currículo]

**EXPERIÊNCIA PROFISSIONAL:**
Para cada cargo do currículo original:
- Reescreva com bullets STAR (Situação, Tarefa, Ação, Resultado)
- Adicione métricas onde possível (% de crescimento, valores, equipes)
- Use palavras-chave de ${p.areas}

**FORMAÇÃO** | **CERTIFICAÇÕES** | **COMPETÊNCIAS** | **IDIOMAS**

---

### 📄 VARIAÇÃO POR ÁREA
${p.areas.split(',').length > 1 ? `Como o currículo principal muda para cada área:
${p.areas.split(',').map((a, i) => `\n**Versão ${i+1} — ${a.trim()}:**\n- Ajustes no título\n- Palavras-chave específicas\n- Bullets para destacar`).join('\n')}` : ''}

### 🤖 ANÁLISE ATS
- **Score ATS estimado:** X/100
- **30 palavras-chave que DEVEM estar no currículo** para ${p.areas}
- **Erros de formatação** que causam falha nos filtros automáticos
- **Formato correto do arquivo** (PDF vs Word, margens, fontes)`,

  // ─────────────────────────────────────────────────────────────

  match_vaga: (p, jobDescription) => `Você é um especialista em carreira com foco em candidaturas cirúrgicas. Analise o perfil de ${p.nome} versus a vaga real abaixo e entregue um kit completo de candidatura personalizado.

## PERFIL DO CANDIDATO:
**Nome:** ${p.nome} | **Senioridade:** ${p.senioridade}
**Headline atual:** "${p.headline_atual}"
**Sobre atual:** "${p.sobre_atual?.substring(0, 300)}..."
**Experiência principal:** ${p.exp1_cargo} em ${p.exp1_empresa}
**Currículo (resumo):** ${p.curriculo_texto?.substring(0, 500)}...
**Áreas:** ${p.areas}
**Formação:** ${p.formacao}
${p.certificacoes ? `**Certificações:** ${p.certificacoes}` : ''}

## DESCRIÇÃO DA VAGA:
${jobDescription || '[Cole a descrição da vaga aqui]'}

---

## ENTREGUE:

### 📊 ANÁLISE DE FIT (Match Score)
**Score de compatibilidade: X%**

**✅ Pontos fortes para esta vaga** (o que você tem que eles pedem):
[lista específica]

**⚠️ Gaps a compensar** (o que eles pedem que você não tem ou não deixou claro):
[lista com estratégia para cada gap]

**🔑 Palavras-chave da vaga que DEVEM estar em sua candidatura:**
[lista das top 15 keywords da vaga]

### 📄 CURRÍCULO ADAPTADO PARA ESTA VAGA
Reescreva o resumo profissional e os bullets mais relevantes do currículo original de ${p.nome} usando as palavras-exatas da vaga. Estrutura completa pronta para enviar.

### ✉️ CARTA DE APRESENTAÇÃO
Carta personalizada (350 palavras) que:
- Abre mencionando algo específico da empresa/vaga
- Conecta a experiência real de ${p.nome} com o que a vaga pede
- Endereça os principais gaps com confiança
- CTA claro

### 💬 MENSAGEM PARA O RECRUTADOR (LinkedIn InMail)
300 caracteres, personalizada para esta vaga específica.

### 🎯 ESTRATÉGIA DE CANDIDATURA
- Momento ideal para candidatar
- Quem buscar na empresa antes de candidatar
- Como se destacar neste processo seletivo específico
- O que pesquisar sobre a empresa antes da entrevista`,

  // ─────────────────────────────────────────────────────────────

  conteudo: (p) => `Você é estrategista de conteúdo especializado em LinkedIn que ajudou profissionais a multiplicar entrevistas através de conteúdo. Crie 30 posts REAIS para ${p.nome} — usando a voz e experiências dela/dele, não textos genéricos.

## PERFIL REAL:
**Nome:** ${p.nome} | **Cargo:** ${p.exp1_cargo} em ${p.exp1_empresa}
**Áreas-alvo:** ${p.areas}
**Sobre atual:** "${p.sobre_atual?.substring(0, 300)}..."
**Experiência:** ${p.exp1_descricao?.substring(0, 300)}...
**Objetivo:** ${p.objetivo}
**Senioridade:** ${p.senioridade}

---

## ENTREGUE 30 POSTS COMPLETOS:

Para cada post:
**POST [N] — Semana X, [Dia]**
📌 Formato: [texto/carrossel/enquete]
⏰ Horário ideal: [horário]
🎯 Objetivo: [atrair recrutadores/autoridade/engajamento]

**Hook (primeira linha — deve parar o scroll):**
[escreva]

**Corpo completo:**
[escreva o post inteiro, pronto para publicar, com emojis e quebras de linha]

**Hashtags:** [5-8 relevantes]

Os 30 posts devem:
- Usar casos e situações PLAUSÍVEIS para alguém com background em ${p.exp1_empresa}
- Ter tom autêntico e humano — não corporativo
- Misturar formatos: histórias pessoais, dicas técnicas, bastidores, celebrações, polêmicas do setor
- Mencionar situações típicas de ${p.areas}
- Posicionar como autoridade ${p.senioridade} em ${p.areas}`,

  // ─────────────────────────────────────────────────────────────

  entrevistas: (p) => `Você é coach de carreira sênior especializado em entrevistas no mercado brasileiro. Use as experiências REAIS de ${p.nome} para criar respostas personalizadas — não respostas genéricas de livro.

## PERFIL REAL:
**Nome:** ${p.nome} | **Cargo:** ${p.exp1_cargo} em ${p.exp1_empresa}
${p.exp2_cargo ? `**Experiência anterior:** ${p.exp2_cargo} em ${p.exp2_empresa}` : ''}
**Áreas-alvo:** ${p.areas}
**Senioridade:** ${p.senioridade}
**Objetivo:** ${p.objetivo}
**Cidade:** ${p.cidade}
${p.salario ? `**Pretensão salarial:** ${p.salario}` : ''}
**Formação:** ${p.formacao}
${p.certificacoes ? `**Certificações:** ${p.certificacoes}` : ''}

**Experiência real (para basear as respostas):**
${p.exp1_descricao}
${p.exp2_descricao ? p.exp2_descricao : ''}

---

## ENTREGUE:

### 🎯 30 PERGUNTAS + RESPOSTAS BASEADAS NAS SUAS EXPERIÊNCIAS REAIS

Para cada pergunta:
**PERGUNTA [N]: "[texto da pergunta]"**
- 🎯 Por que perguntam isso:
- ⭐ Estrutura ideal (STAR/PAR):
- ✅ **Sua resposta modelo** (usando os casos reais de ${p.exp1_empresa}${p.exp2_empresa ? ` e ${p.exp2_empresa}` : ''}):
[resposta completa personalizada — 150-200 palavras]
- ❌ O que NÃO dizer:

Inclua:
- 8 perguntas comportamentais clássicas
- 6 perguntas técnicas para ${p.areas}
- 5 perguntas sobre motivação e fit cultural
- 4 perguntas situacionais difíceis
- 4 perguntas sobre salário e expectativas
- 3 perguntas armadilha (ex: "Qual seu maior defeito?")

### 💰 NEGOCIAÇÃO SALARIAL PARA ${p.areas.split(',')[0].trim().toUpperCase()}
- Faixa de mercado REAL para ${p.senioridade} em ${p.areas} em ${p.cidade} (pesquise dados de 2025)
- Quando e como trazer o assunto
- Scripts para 3 cenários: abaixo do esperado / dentro / acima
- O que negociar além do salário (home office, bônus, stock, benefícios)
- Como responder "Qual sua pretensão?" sem se prejudicar

### 📧 MENSAGEM PÓS-ENTREVISTA
Template personalizado para enviar em até 24h após a entrevista.

### ✅ CHECKLIST PRÉ-ENTREVISTA
Online e presencial — O que pesquisar, preparar e checar.`,
}

// ─── PLANO 90 DIAS ────────────────────────────────────────────────

export const PLAN_PROMPT = (p: Profile, modules: string[]) => `Você é coach de carreira sênior especializado no mercado brasileiro. Crie um Plano de Ação de 90 Dias HIPER-PERSONALIZADO e ACIONÁVEL para ${p.nome}.

## PERFIL:
**Áreas-alvo:** ${p.areas}
**Cargo/Senioridade:** ${p.exp1_cargo} — ${p.senioridade}
**Empresa atual/anterior:** ${p.exp1_empresa}
**Objetivo:** ${p.objetivo}
**Cidade:** ${p.cidade} | **Modalidade:** ${p.modalidade}
${p.salario ? `**Pretensão:** ${p.salario}` : ''}
${p.empresas_sonho ? `**Empresas dos sonhos:** ${p.empresas_sonho}` : ''}
**Módulos concluídos:** ${modules.join(', ') || 'nenhum ainda'}

---

## PLANO DETALHADO:

### 🗓️ MÊS 1 — FUNDAÇÃO E VISIBILIDADE (Semanas 1-4)
Para cada semana:
**Semana [N] — [Tema]**
🎯 Meta da semana: [objetivo mensurável]
- **Segunda:** [ação específica]
- **Terça:** [ação específica]
- **Quarta:** [ação específica]
- **Quinta:** [ação específica]
- **Sexta:** [ação específica]
📊 KPI: [o que medir]
💡 Dica da semana:

### 🗓️ MÊS 2 — PROSPECÇÃO ATIVA (Semanas 5-8)
[mesma estrutura]

### 🗓️ MÊS 3 — FECHAMENTO (Semanas 9-12)
[mesma estrutura — foco em entrevistas e ofertas]

### 🏆 MARCOS
**Fim do Mês 1:** O que deve ter conquistado
**Fim do Mês 2:** O que deve ter conquistado
**Fim do Mês 3 (META FINAL):** Oferta de emprego em mãos

### 📈 KPIs SEMANAIS
| Métrica | Sem 1 | Sem 4 | Sem 8 | Sem 12 |
|---------|-------|-------|-------|--------|
| Conexões novas | | | | |
| Mensagens enviadas | | | | |
| Candidaturas | | | | |
| Entrevistas | | | | |
| Posts publicados | | | | |
| Boolean searches feitas | | | | |

### 🆘 PLANO DE CONTINGÊNCIA
Se no mês 1 não tiver entrevistas: [ações específicas]
Se no mês 2 não receber ofertas: [ações específicas]

### ⚡ AS 5 PRIMEIRAS AÇÕES (para amanhã cedo)
1.
2.
3.
4.
5.`
