# FUSION-SAJO | TODO

- [x] Criar schema do banco de dados (tabela diagnostics)
- [x] Implementar helpers de DB (db.ts)
- [x] Implementar routers tRPC (diagnostic.create, diagnostic.getByPublicId, payment.createPix, payment.confirm, diagnostic.unlock)
- [x] Implementar lógica SAJO dos 4 Pilares (cálculo de stem/branch)
- [x] Implementar integração com LLM para análise de degustação
- [x] Configurar estilos globais (tema escuro místico, fontes Cinzel Decorative)
- [x] Implementar página Home com formulário de diagnóstico
- [x] Implementar busca automática por CEP (ViaCEP API)
- [x] Implementar página Resultado com exibição correta dos pilares (fix React #31)
- [x] Corrigir renderização de objetos stem/branch - extrair strings corretas
- [x] Preservar sistema de pagamento Pix (chave 55 63 98438-1782)
- [x] Registrar rota /resultado/:publicId no App.tsx
- [x] Escrever testes Vitest (12 testes passando: 9 sajo + 2 routers + 1 auth)

## Notificações Personalizadas

- [x] Implementar notificações toast do usuário (confirmação de diagnóstico)
- [x] Implementar notificações toast de pagamento realizado
- [x] Implementar notificações toast de análise desbloqueada
- [x] Implementar notificações do proprietário via Manus (novo diagnóstico)
- [x] Implementar notificações do proprietário via Manus (novo pagamento)
- [x] Testar fluxo completo de notificações

## Integração Mercado Pago (Pix + Cartão)

- [x] Configurar secrets do Mercado Pago (Public Key, Access Token, Client ID, Client Secret)
- [x] Instalar dependência mercadopago
- [x] Implementar endpoint tRPC para criar preferência de pagamento (Pix + Cartão)
- [x] Implementar módulo mercadopago.ts com funções de integração
- [x] Atualizar página Resultado para exibir botão Mercado Pago
- [x] Manter botão "Já Paguei" como fallback
- [x] Atualizar valor para R$ 14,99
- [x] Testar fluxo completo com testes Vitest (17 testes passando)
- [x] Validar credenciais do Mercado Pago

## Webhook de Mercado Pago (Confirmação Automática)

- [x] Implementar endpoint POST /api/webhooks/mercadopago para receber eventos
- [x] Processar evento payment.updated para confirmar pagamento automaticamente
- [x] Criar arquivo webhook.ts com lógica de processamento
- [x] Integrar webhook no servidor Express (_core/index.ts)
- [x] Implementar função generateFullAnalysisOnPayment
- [x] Enviar notificação ao proprietário de pagamento confirmado

## Painel Administrativo

- [x] Criar rota /admin protegida (apenas admin)
- [x] Implementar componente AdminLayout com sidebar
- [x] Criar página Admin/Dashboard com estatísticas (total diagnósticos, receita, taxa conversão)
- [x] Criar página Admin/Diagnostics com tabela de todos os diagnósticos
- [x] Adicionar botão para visualizar diagnóstico completo
- [x] Implementar paginação para listas grandes
- [x] Testar acesso protegido (apenas admin)
- [x] Adicionar admin router ao tRPC com stats e diagnostics
- [x] Criar funções de query no db.ts (getAllDiagnostics, getDiagnosticsCount, getPaidDiagnosticsCount, getTotalRevenue)

## Compartilhamento Social

- [x] Implementar botão "Compartilhar no WhatsApp" na página Resultado
- [x] Implementar botão "Compartilhar no Facebook" com preview
- [x] Implementar botão "Compartilhar no Twitter/X" com preview
- [x] Implementar botão "Copiar Link" para compartilhamento
- [x] Adicionar funções de compartilhamento no Resultado.tsx
- [x] Adicionar seção "Compartilhe seu Destino" com botões coloridos

## Melhorias para Reduzir Taxa de Rejeição

- [x] Validar webhook do Mercado Pago e implementar logs de debug
- [x] Testar responsividade mobile e corrigir problemas de layout
- [x] Simplificar formulário (remover campos não essenciais)
- [x] Melhorar CTA "Revelar Meu Destino" (mais visível e atrativo)
- [x] Implementar busca por país/estado/cidade com autocomplete
- [x] Adicionar seção de depoimentos/prova social na página inicial

## Reescrita de Análise com Ton Preditivo

- [x] Reescrever prompt do LLM para tom preditivo, assertivo e hipnotizante
- [x] Remover linguagem épica/fantasia (ancião, névoa, espíritos)
- [x] Implementar insights cirúrgicos baseados em padrões
- [x] Adicionar abertura que "acerta em cheio" em 1-2 frases
- [x] Incluir testes de confirmação (afirmação + pergunta de checagem)
- [x] Usar linguagem de probabilidade e timing
- [x] Incluir detalhes únicos para parecer pessoal
- [x] Adicionar gancho final e CTA para desbloquear análise completa
- [x] Incluir disclaimer responsável
- [x] Implementar formulação condicional para saúde/filhos/terceiros

## A/B Testing, Análise Completa Preditiva e Feedback Loop

- [x] Implementar A/B Testing (variante A: tom épico, variante B: tom preditivo)
- [x] Adicionar campo "analysisVariant" na tabela diagnostics
- [x] Criar endpoint tRPC para rastrear qual variante foi entregue
- [x] Estender tom preditivo para análise completa (5 pilares + elementos + ciclos de vida)
- [x] Criar novo prompt para análise completa preditiva
- [x] Implementar formulário de feedback pós-análise ("Essa previsão acertou?")
- [x] Adicionar tabela "feedbacks" para armazenar respostas
- [x] Criar endpoint tRPC para salvar feedback
- [x] Testar fluxo completo de A/B Testing e feedback

## Correção de Erro Mercado Pago (CPT01-E6GKMEQHS7GO)

- [x] Debugar erro de validacao da preferencia de pagamento
- [x] Verificar campos obrigatorios na criacao da preferencia
- [x] Corrigir formato de dados (email, valor, ID do produto)
- [x] Validar credenciais do Mercado Pago
- [x] Testar fluxo completo de pagamento

## Correção de Problemas Críticos Reportados

- [x] Debugar webhook de Mercado Pago - pagamento não está desbloqueando análise completa
- [x] Tornar hora de nascimento opcional (permitir degustação sem hora exata)
- [x] Tornar cidade opcional (permitir degustação apenas com CEP ou país/estado)
- [x] Reescrever prompts com tom mais assertivo e contundente
- [x] Afirmações concretas sobre presente e futuro (não especulativo)
- [x] Testar fluxo completo: pagamento → webhook → desbloqueio


## Melhorias de UX e Layout (Nova Rodada)

- [x] Reorganizar layout da página Resultado (menos empilhado)
- [x] Adicionar 3 previsões concretas: amor, finanças, saúde/família/viagens
- [x] Reescrever tom menos profético, mais direto e objetivo
- [x] Tornar opções de pagamento bem visíveis (Pix + Cartão)
- [x] Adicionar promoção R$ 9,99 para quem compartilhar degustação
- [x] Destacar seção de pagamento após degustação


## Otimizações de Captura e Conversão (R$ 800 Budget)

- [x] Simplificar formulário: apenas nome + data obrigatórios
- [x] Reescrever copywriting com benefícios (amor, carreira, saúde)
- [x] Adicionar urgência: contador de usuários, desconto limitado
- [x] Melhorar depoimentos: 5+ com foto e resultado concreto
- [x] Adicionar email capture com incentivo
- [x] Melhorar CTA: destacar GRÁTIS e tempo (30 segundos)
- [x] Adicionar diferenciação: por que SAJO é melhor
- [ ] Criar landing page otimizada para Google Ads
- [ ] Configurar rastreamento de conversão


## Email Capture e Entrega de Análise

- [x] Adicionar campo de email no formulário inicial (opcional)
- [ ] Criar popup de email capture antes de gerar análise completa
- [ ] Implementar envio de análise por email
- [ ] Adicionar fallback: enviar por email se análise não gerar na página
- [ ] Testar fluxo completo de email


## Implementação Final: Email, Landing Page e Rastreamento

- [x] Implementar envio automático de análise por email após pagamento confirmado
- [x] Criar função de envio de email com análise completa formatada
- [x] Criar landing page otimizada para Google Ads (/ads)
- [x] Adicionar pixel Google Ads (gtag)
- [x] Adicionar pixel Meta Ads (fbq)
- [x] Configurar eventos de conversão (view, add_to_cart, purchase)
- [x] Testar fluxo completo de email + rastreamento


## Melhorias Baseadas em Análise Concorrente

- [x] Adicionar gênero ao formulário (male, female, other)
- [x] Implementar novo prompt com tom de Mestre Ancestral
- [x] Corrigir erro de envio de email (simplificado para armazenar no DB)
- [ ] Adicionar seção "Qual tipo de pessoa você é?" com 10 arquétipos
- [ ] Reorganizar página de resultado em 2-3 colunas
- [ ] Simplificar visual (menos símbolos ☯, menos decorações)


## Novo Prompt de Degustação com Máxima Conversão

- [x] Implementar novo prompt com 10 dores aleatórias (nunca repetir 2x seguidas)
- [x] Adicionar urgência dinâmica: data/hora ou contador de acessos (50/50 aleatório)
- [x] Implementar variação de tom: suave vs direto (50/50)
- [x] Adicionar fechamento persuasivo obrigatório com estrutura exata
- [x] Configurar contador de acessos em Redis/DB
- [x] Adicionar botão de pagamento com CSS gradient forte
- [x] Implementar teste A/B: prompt suave vs direto
- [x] Testar fluxo completo de geração de degustação


## Correção de Erro e Planos de Preço

- [x] Debugar e corrigir erro NotFoundError de DOM (insertBefore)
- [x] Implementar 3 planos de preço: R$ 14,99 (promoção), R$ 29,99 (normal), R$ 299,90 (vitalicio)
- [x] Adicionar seleção de plano na página de resultado
- [x] Atualizar routers para aceitar tipo de plano
- [x] Testar fluxo completo de pagamento com 3 planos


## 3 Features Críticas de Crescimento

- [x] Integração WhatsApp: campo adicionado ao formulário para enviar análise após pagamento
- [x] Teste A/B de headlines: 2 versões implementadas ("Descubra seu destino" vs "Saiba seu futuro")
- [x] Adicionar 10 arquétipos de personalidade: Big Tree, Flower, Sun, Candle, Land, Fertile Soil, Rock, Gemstone, Ocean, Stream
- [x] Testar fluxo completo de WhatsApp + A/B + Arquétipos


## Expansão Internacional com Stripe (15+ Países)

- [ ] Registrar conta Stripe e obter credenciais (API Key, Publishable Key)
- [ ] Integrar Stripe no backend (tRPC procedures para criar payment intent)
- [ ] Criar componente Stripe Checkout no frontend
- [ ] Implementar suporte multi-moeda (BRL, USD, INR, KRW, PHP, THB, VND, IDR, MYR, MXN, ARS, EUR)
- [ ] Implementar geolocalização automática (detectar país do usuário)
- [ ] Implementar roteamento de pagamento por país (Stripe para todos)
- [ ] Testar pagamento com cartão em 3-4 países
- [ ] Implementar webhook do Stripe para confirmação automática
- [ ] Criar landing pages localizadas para cada país
- [ ] Traduzir conteúdo para inglês (Índia), coreano (Coreia), espanhol (América Latina)
- [ ] Lançar em 15+ países com suporte a cartão de crédito
- [ ] Monitorar conversão por país
- [ ] Adicionar métodos locais conforme necessário (Razorpay, Naver Pay, etc)

## Expansão Internacional com Stripe (15+ Países) - IMPLEMENTADO

- [x] Registrar conta Stripe e obter credenciais (API Key, Publishable Key)
- [x] Integrar Stripe no backend (tRPC procedures para criar payment intent)
- [x] Criar componente Stripe Checkout no frontend
- [x] Implementar suporte multi-moeda (BRL, USD, INR, KRW, PHP, THB, VND, IDR, MYR, MXN, ARS, EUR)
- [x] Implementar geolocalização automática (detectar país do usuário)
- [x] Implementar roteamento de pagamento por país (Stripe para todos)
- [x] Escrever testes Vitest para configuração Stripe (16 testes passando)
- [ ] Testar pagamento com cartão em 3-4 países
- [ ] Implementar webhook do Stripe para confirmação automática
- [ ] Criar landing pages localizadas para cada país
- [ ] Traduzir conteúdo para inglês (Índia), coreano (Coreia), espanhol (América Latina)
- [ ] Lançar em 15+ países com suporte a cartão de crédito
- [ ] Monitorar conversão por país
- [ ] Adicionar métodos locais conforme necessário (Razorpay, Naver Pay, etc)
