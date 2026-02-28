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
