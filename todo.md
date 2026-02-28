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
