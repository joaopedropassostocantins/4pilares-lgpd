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
