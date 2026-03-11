# 🧪 Teste de Fluxo Pix Completo - Execução

## Fase 1: Teste do Fluxo Pix com Cartão de Teste

### Objetivo
Validar que o Payment Brick carrega corretamente, gera token real e processa pagamento via Mercado Pago.

### Pré-requisitos
- ✅ Servidor rodando (`pnpm dev`)
- ✅ Build sem erros
- ✅ Credenciais Mercado Pago configuradas

### Passo 1: Acessar Página de Checkout
```
URL: https://seu-dominio.com/checkout?plan=profissional
ou
URL: http://localhost:3000/checkout?plan=profissional
```

### Passo 2: Selecionar Plano
- Clique em "Profissional" (R$ 150/mês)
- Clique em "Próximo"

**Esperado:**
- ✅ Transição suave para próxima etapa
- ✅ Nenhum erro no console

### Passo 3: Preencher Dados Empresariais

**Dados de Teste Válidos:**
```
Razão Social: Empresa Teste LTDA
CNPJ: 12.345.678/0001-95
CEP: 01310-100 (São Paulo)
Endereço: Avenida Paulista
Número: 1000
Bairro: Bela Vista
Cidade: São Paulo
Estado: SP
Responsável: João Silva
CPF: 123.456.789-09
Telefone: (11) 98765-4321
E-mail: seu-email@example.com.br
```

**Validações Esperadas:**
- ✅ CNPJ aceito (válido)
- ✅ CPF aceito (válido)
- ✅ E-mail aceito (tem TLD com 2+ caracteres)
- ✅ CEP busca endereço automaticamente
- ✅ Nenhum erro de validação

**Clique em "Próximo"**

### Passo 4: Aceitar Termos
- Leia os termos de serviço
- Marque a checkbox "Eu li e aceito os termos..."
- Clique em "Próximo"

**Esperado:**
- ✅ Transição para etapa de pagamento
- ✅ Loading spinner "Carregando sistema de pagamento..."

### Passo 5: Aguardar Payment Brick Carregar

**Esperado (2-3 segundos):**
- ✅ Loading desaparece
- ✅ Payment Brick renderizado
- ✅ Toast de sucesso: "Sistema de pagamento carregado"
- ✅ Formulário de pagamento visível

**Verificar no Console (F12):**
```
✅ SDK Mercado Pago carregado com sucesso
✅ Payment Brick renderizado com sucesso
💰 Valor do pagamento: R$ 150.00 (15000 centavos)
```

### Passo 6: Selecionar Método de Pagamento - PIX

**No Payment Brick:**
1. Procure por opção "Pix" ou "Transferência Bancária"
2. Clique em "Pix"

**Esperado:**
- ✅ Opção Pix selecionada
- ✅ Formulário de Pix aparece
- ✅ Nenhum erro

### Passo 7: Usar Cartão de Teste (Simulação)

**Nota:** Se o Pix não estiver disponível em modo de teste, use cartão de crédito:

**Cartão de Teste - Aprovado:**
```
Número: 4111 1111 1111 1111
Vencimento: 11/25
CVV: 123
Titular: TESTE USUARIO
```

**Cartão de Teste - Recusado:**
```
Número: 5555 5555 5555 4444
Vencimento: 11/25
CVV: 123
```

### Passo 8: Clicar em "Pagar"

**Esperado:**
- ✅ Loading spinner aparece
- ✅ Console mostra: "💳 Tentativa 1/3"
- ✅ Requisição enviada ao backend

### Passo 9: Aguardar Resposta do Backend

**Esperado (3-5 segundos):**
- ✅ Pagamento processado
- ✅ Status retornado: "approved" ou "pending"
- ✅ Redirecionamento para página de sucesso

**Verificar no Console:**
```
✅ Pagamento processado com sucesso
Status: approved (ou pending)
Payment ID: [ID do pagamento]
```

### Passo 10: Validar Página de Sucesso

**Esperado:**
- ✅ Mensagem de sucesso exibida
- ✅ Dados da assinatura mostrados
- ✅ Próxima data de cobrança informada

---

## Fase 2: Validar Webhook Mercado Pago

### Objetivo
Confirmar que o webhook recebe notificações de pagamento e atualiza status corretamente.

### Passo 1: Acessar Painel Mercado Pago
```
URL: https://www.mercadopago.com.br/admin
```

### Passo 2: Ir para Configurações de Webhook
```
Configurações → Integrações → Webhooks
```

### Passo 3: Verificar Webhook Registrado
```
URL: https://seu-dominio.com/api/webhooks/mercadopago
ou
URL: https://4pilareslgpd-upm86dcc.manus.space/api/webhooks/mercadopago
```

**Esperado:**
- ✅ Webhook URL registrada
- ✅ Status: Ativo
- ✅ Eventos: payment.created, payment.updated

### Passo 4: Verificar Histórico de Webhooks

**No Painel Mercado Pago:**
1. Clique em "Histórico de Webhooks"
2. Procure por eventos recentes

**Esperado:**
- ✅ Evento "payment.created" recebido
- ✅ Evento "payment.updated" recebido
- ✅ Status HTTP 200 (sucesso)

### Passo 5: Validar Logs do Backend

**Executar:**
```bash
tail -f /home/ubuntu/4pilares-lgpd/.manus-logs/devserver.log | grep -i webhook
```

**Esperado:**
```
✅ Webhook recebido: payment.created
✅ Validação HMAC: OK
✅ Assinatura atualizada: ID [subscription_id]
```

### Passo 6: Verificar Banco de Dados

**Executar:**
```bash
# Verificar assinatura criada
SELECT * FROM subscriptions WHERE cnpj = '12345678000195';
```

**Esperado:**
- ✅ Assinatura criada
- ✅ Status: "active" (se approved) ou "suspended" (se pending)
- ✅ Payment Status: "approved" ou "pending"
- ✅ Mercado Pago ID: [ID do pagamento]

---

## Fase 3: Implementar Dashboard de Assinaturas

### Objetivo
Criar página para usuários visualizarem status de pagamento, próxima cobrança e histórico.

### Estrutura do Dashboard

```
┌─────────────────────────────────────────────────────────┐
│ Dashboard de Assinaturas                                │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ 📊 Status da Assinatura                                │
│ ┌──────────────────────────────────────────────────┐  │
│ │ Plano: Profissional                              │  │
│ │ Status: Ativo ✅                                 │  │
│ │ Próxima Cobrança: 15/04/2026                     │  │
│ │ Valor: R$ 150,00/mês                             │  │
│ └──────────────────────────────────────────────────┘  │
│                                                         │
│ 💳 Método de Pagamento                                │
│ ┌──────────────────────────────────────────────────┐  │
│ │ Pix/Cartão de Crédito                            │  │
│ │ Últimos 4 dígitos: ****1111                      │  │
│ │ [Alterar Método]                                 │  │
│ └──────────────────────────────────────────────────┘  │
│                                                         │
│ 📜 Histórico de Pagamentos                            │
│ ┌──────────────────────────────────────────────────┐  │
│ │ Data      │ Valor    │ Status    │ Ação        │  │
│ ├──────────────────────────────────────────────────┤  │
│ │ 15/03/26  │ R$ 150   │ Aprovado  │ Recibo      │  │
│ │ 15/02/26  │ R$ 150   │ Aprovado  │ Recibo      │  │
│ │ 15/01/26  │ R$ 150   │ Aprovado  │ Recibo      │  │
│ └──────────────────────────────────────────────────┘  │
│                                                         │
│ [Cancelar Assinatura]  [Atualizar Dados]             │
└─────────────────────────────────────────────────────────┘
```

### Componentes a Implementar

1. **StatusCard** - Exibe status da assinatura
2. **PaymentMethodCard** - Exibe método de pagamento
3. **PaymentHistoryTable** - Lista histórico de pagamentos
4. **CancelSubscriptionModal** - Modal para cancelar

### Dados Necessários

**Tabela: subscriptions**
- ✅ Já existe
- Campos: planId, planName, priceMonthly, status, nextBillingDate, mercadoPagoId

**Tabela: payment_history** (NOVA)
- paymentId (PK)
- subscriptionId (FK)
- amount
- status (approved, pending, failed)
- paymentMethod (pix, credit_card, debit_card)
- createdAt
- updatedAt

### Rotas tRPC Necessárias

1. **subscriptions.getMySubscription** - GET assinatura do usuário
2. **subscriptions.getPaymentHistory** - GET histórico de pagamentos
3. **subscriptions.cancelSubscription** - POST cancelar assinatura
4. **subscriptions.updatePaymentMethod** - POST atualizar método

---

## Checklist de Validação

### Teste Pix
- [ ] Payment Brick carrega em 2-3 segundos
- [ ] Cartão de teste aceito
- [ ] Pagamento processado com sucesso
- [ ] Status "approved" retornado
- [ ] Redirecionamento para sucesso
- [ ] Assinatura criada no banco

### Webhook
- [ ] Webhook registrado no Mercado Pago
- [ ] Notificação recebida (payment.created)
- [ ] Validação HMAC passou
- [ ] Assinatura atualizada no banco
- [ ] Status correto (active/suspended)

### Dashboard
- [ ] Página carrega corretamente
- [ ] Status da assinatura exibido
- [ ] Próxima cobrança mostrada
- [ ] Histórico de pagamentos listado
- [ ] Botão cancelar funciona

---

## Troubleshooting

### Problema: Payment Brick não carrega
**Solução:**
1. Verifique se a chave pública está configurada
2. Recarregue a página
3. Limpe o cache do navegador
4. Verifique console para erros

### Problema: Webhook não recebe notificação
**Solução:**
1. Verifique URL webhook no painel Mercado Pago
2. Verifique se a URL está acessível (não localhost)
3. Verifique logs do backend
4. Teste webhook manualmente via Mercado Pago

### Problema: Assinatura não criada
**Solução:**
1. Verifique se o backend retornou sucesso
2. Verifique logs do servidor
3. Verifique se o usuário foi criado
4. Verifique se o banco de dados está acessível

---

## Status Final

**Fase 1 (Teste Pix):** ⏳ Aguardando execução
**Fase 2 (Webhook):** ⏳ Aguardando execução
**Fase 3 (Dashboard):** ⏳ Aguardando implementação

Próximo passo: Executar Fase 1 agora!
