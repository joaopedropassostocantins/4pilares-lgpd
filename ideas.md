# Ideias de Design — 4 Pilares LGPD

## Contexto
Plataforma jurídica-digital de adequação à LGPD. Deve transmitir autoridade, tecnologia, confiança e elegância premium. Referências: Stripe, Vercel, Supabase, Linear, Notion.

---

<response>
<text>
## Ideia 1 — "Jurídico Mineral" (Probabilidade: 0.07)

**Design Movement:** Neo-Brutalism Refinado com influência Editorial Jurídica

**Core Principles:**
1. Contraste máximo entre fundos claros e elementos de destaque escuros
2. Tipografia editorial com hierarquia agressiva entre títulos e corpo
3. Grid assimétrico com colunas de largura variável
4. Cor como linguagem semântica — cada pilar tem identidade cromática forte

**Color Philosophy:**
Fundo branco-gelo (#F8FAFC) com texto quase-preto (#0F172A). Os quatro pilares usam suas cores institucionais como blocos sólidos, não gradientes. O contraste cria autoridade sem artificialidade.

**Layout Paradigm:**
Colunas assimétricas 60/40 no hero. Cards dos pilares em grid 2x2 com bordas coloridas à esquerda (border-left 4px). Seções separadas por linhas finas, não por fundos alternados.

**Signature Elements:**
- Borda lateral colorida em cards (estilo editorial)
- Números romanos como decoração em seções (I, II, III, IV)
- Monospace para dados técnicos (CNPJ, datas, IDs)

**Interaction Philosophy:**
Hover revela cor de fundo suave do pilar. Transições de 200ms. Sem animações excessivas — sobriedade jurídica.

**Animation:**
Fade-in suave ao entrar na viewport. Cards com translateY(8px) → translateY(0) no hover.

**Typography System:**
- Títulos: DM Serif Display (peso 400, italic para destaques)
- Corpo: DM Sans (peso 400/500)
- Técnico: JetBrains Mono
</text>
<probability>0.07</probability>
</response>

<response>
<text>
## Ideia 2 — "Precision Dark" (Probabilidade: 0.06)

**Design Movement:** SaaS Premium Dark — inspirado em Linear e Vercel

**Core Principles:**
1. Fundo escuro profundo (#060B14) com superfícies em camadas sutis
2. Tipografia clara e precisa sobre escuro — máxima legibilidade
3. Acentos coloridos dos pilares como "sinais" em interface técnica
4. Glassmorphism discreto em cards e painéis

**Color Philosophy:**
Dark mode como padrão. Fundo #060B14, superfícies #0C1525. Texto branco/cinza claro. As cores dos pilares (azul, verde, laranja, roxo) aparecem como acentos luminosos — como LEDs em hardware.

**Layout Paradigm:**
Hero com grid de pontos sutis no fundo. Cards flutuantes com sombra colorida do pilar. Sidebar em painéis admin com ícones lineares.

**Signature Elements:**
- Grid de pontos como textura de fundo
- Glow colorido nos cards dos pilares
- Badges com código de status (ex: "LEI v1.0", "CONFORME")

**Interaction Philosophy:**
Hover com glow intensificado. Animações de entrada com blur → nítido. Sensação de "sistema vivo".

**Animation:**
Entrada com blur(4px) → blur(0) + opacity 0→1. Cards com scale(0.98) → scale(1) no hover.

**Typography System:**
- Títulos: DM Serif Display em branco
- Corpo: DM Sans em cinza claro
- Técnico: JetBrains Mono em verde/azul
</text>
<probability>0.06</probability>
</response>

<response>
<text>
## Ideia 3 — "Clareza Estrutural" (Probabilidade: 0.08) ← ESCOLHIDA

**Design Movement:** Modernismo Funcional com DNA Jurídico-Tecnológico

**Core Principles:**
1. Fundo claro (#F8FAFC) com hierarquia visual construída por espaçamento, não por cor
2. Os 4 pilares como sistema visual coerente — cada um com identidade própria mas harmoniosa
3. Layout assimétrico com âncoras visuais à esquerda (títulos, numeração)
4. Componentes limpos com bordas sutis e sombras mínimas

**Color Philosophy:**
Base neutra clara permite que as cores dos pilares "respirem" com autoridade. Azul (#1D4ED8) para LEI transmite institucionalidade. Verde (#059669) para REGRAS sugere conformidade ativa. Laranja (#EA580C) para CONFORMIDADE indica ação e urgência positiva. Roxo (#7C3AED) para TITULAR evoca privacidade e dignidade.

**Layout Paradigm:**
Hero com layout 55/45 (texto à esquerda, visual à direita). Pilares em grid horizontal 4 colunas no desktop, 2x2 no tablet, 1 coluna no mobile. Seções alternando fundo branco e #F8FAFC para ritmo visual sem agressividade.

**Signature Elements:**
- Numeração decorativa em seções (01, 02, 03...) em fonte monospace
- Linha colorida superior em cards de pilar (border-top 3px)
- Tags de status em badges com fundo colorido suave

**Interaction Philosophy:**
Micro-interações precisas. Hover em cards eleva levemente (shadow + translateY). Botões com transição de cor suave. Formulários com feedback visual imediato.

**Animation:**
Framer Motion para entrada de seções (stagger de 0.1s entre elementos). Cards com hover: translateY(-4px) + shadow intensificada. Sem animações decorativas — apenas funcionais.

**Typography System:**
- Títulos H1/H2: DM Serif Display (peso regular, tamanho generoso)
- Subtítulos H3/H4: DM Sans SemiBold
- Corpo: DM Sans Regular
- Dados técnicos: JetBrains Mono
- Hierarquia: H1 48-64px, H2 32-40px, H3 20-24px, corpo 16px, small 14px
</text>
<probability>0.08</probability>
</response>

---

## Design Escolhido: **Ideia 3 — "Clareza Estrutural"**

Modernismo Funcional com DNA Jurídico-Tecnológico. Fundo claro, tipografia DM Serif Display + DM Sans + JetBrains Mono, layout assimétrico, cores dos pilares como identidade semântica.
