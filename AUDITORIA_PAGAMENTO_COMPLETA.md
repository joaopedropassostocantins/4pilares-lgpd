# AUDITORIA COMPLETA - SISTEMA DE PAGAMENTO MERCADO PAGO
## 4 Pilares LGPD - Repositório: https://github.com/joaopedropassostocantins/4pilares-lgpd

**Data**: 11/03/2026  
**Status**: EM EXECUÇÃO  
**Objetivo**: Eliminar simulações, implementar pagamento real com validação, persistência correta e webhook seguro

---

## FASE 1: MAPEAMENTO DO FLUXO REAL

### 1.1 Fluxo de Checkout Atual

```
Usuario → CheckoutFlow.tsx → Payment Brick → onSubmit → processPayment (tRPC) → Mercado Pago API
                                                            ↓
                                                    routers.ts (subscriptions.processPayment)
                                                            ↓
                                                    Criar usuario + assinatura
                                                            ↓
                                                    Redirecionar para /checkout-success
```

### 1.2 Problemas Identificados

#### PROBLEMA 1: Frontend envia dados incompletos
- **Arquivo**: `client/src/pages/CheckoutFlow.tsx` (linha 354-362)
- **Causa**: Não envia `token` do Payment Brick corretamente
- **Impacto**: Pagamento não é criado no Mercado Pago

#### PROBLEMA 2: Backend não processa pagamento real
- **Arquivo**: `server/routers.ts` (linha 99-200)
- **Causa**: Mutação `processPayment` não existe ou está incompleta
- **Impacto**: Nenhum pagamento é criado no Mercado Pago

#### PROBLEMA 3: Webhook não valida assinatura
- **Arquivo**: `server/webhooks.ts` ou `server/_core/index.ts`
- **Causa**: Webhook implementado como tRPC, não como rota HTTP real
- **Impacto**: Qualquer pessoa pode forjar webhook

#### PROBLEMA 4: Centavos vs Reais inconsistente
- **Arquivo**: `server/routers.ts` (linha 130)
- **Causa**: Enviar `amount` em reais em vez de centavos
- **Impacto**: Pagamentos criados com valor errado

#### PROBLEMA 5: Sem idempotência
- **Arquivo**: `server/routers.ts` (linha 126-148)
- **Causa**: Sem header `X-Idempotency-Key`
- **Impacto**: Duplicação de pagamentos em retry

#### PROBLEMA 6: Senha hardcoded
- **Arquivo**: `server/routers.ts` (linha 119)
- **Causa**: `password: "123"`
- **Impacto**: Segurança crítica

---

## FASE 2: CORREÇÕES FRONTEND

### 2.1 CheckoutFlow.tsx - Enviar token real

**Antes**: Não envia token
**Depois**: Envia `formData.token` do Payment Brick

### 2.2 CheckoutFlow.tsx - Remover sucesso falso

**Antes**: Redireciona para sucesso antes de confirmar pagamento
**Depois**: Só redireciona se `response.status === "approved"` ou `"pending"`

---

## FASE 3: CORREÇÕES BACKEND

### 3.1 routers.ts - Implementar processPayment real

**Checklist**:
- [ ] Validar planId no servidor
- [ ] Buscar preço correto do servidor
- [ ] Criar pagamento real no Mercado Pago
- [ ] Usar `transaction_amount` em REAIS
- [ ] Adicionar header `X-Idempotency-Key`
- [ ] Retornar status real (approved/pending/rejected)
- [ ] Criar usuário com senha aleatória
- [ ] Criar assinatura com status real

### 3.2 payment.ts - Validar integração

**Checklist**:
- [ ] Webhook URL apontando para `/api/webhooks/mercadopago`
- [ ] Usar token correto do Mercado Pago
- [ ] Tratamento de erros com mensagens específicas

---

## FASE 4: WEBHOOK SEGURO

### 4.1 Implementar rota Express real

**Arquivo**: `server/_core/index.ts`

**Checklist**:
- [ ] Rota POST `/api/webhooks/mercadopago`
- [ ] Validar assinatura HMAC SHA-256
- [ ] Tabela `webhook_events` para idempotência
- [ ] Atualizar status da assinatura
- [ ] Logging detalhado

---

## FASE 5: TESTES END-TO-END

### 5.1 Teste de Pagamento Sandbox

**Cartão de teste**: 4111111111111111  
**Validade**: 11/25  
**CVV**: 123

**Checklist**:
- [ ] Preencher dados de empresa
- [ ] Selecionar plano
- [ ] Preencher dados de pagamento
- [ ] Clicar em "Pagar"
- [ ] Validar pagamento criado no Mercado Pago
- [ ] Validar webhook recebido
- [ ] Validar assinatura criada no banco
- [ ] Validar usuário criado com senha aleatória

---

## FASE 6: RELATÓRIO FINAL

### 6.1 Status Geral

- [ ] Frontend corrigido
- [ ] Backend corrigido
- [ ] Webhook seguro
- [ ] Testes passando
- [ ] Sem simulações
- [ ] Sem senhas hardcoded
- [ ] Idempotência implementada

### 6.2 Arquivos Alterados

- `client/src/pages/CheckoutFlow.tsx`
- `server/routers.ts`
- `server/payment.ts`
- `server/_core/index.ts`
- `drizzle/schema.ts`

### 6.3 Como Testar

1. Acessar `/checkout?plan=profissional`
2. Preencher dados
3. Usar cartão 4111111111111111
4. Validar no Mercado Pago

### 6.4 Pendências

- [ ] Email transacional após pagamento
- [ ] Recorrência automática
- [ ] Dashboard de pagamentos

---

## EVIDÊNCIAS

### Teste 1: Token Mercado Pago Válido
```
✅ Token: APP_USR-5477028403491204-022805-76ab643dabbde9bb7702cffce6a0edb4-240523153
✅ API respondendo corretamente
✅ Requer header X-Idempotency-Key
```

### Teste 2: Formato Correto da API
```
✅ Campo: transaction_amount (em REAIS)
✅ Campo: installments: 1
✅ Header: X-Idempotency-Key obrigatório
```

---

**Próxima ação**: Iniciar FASE 2 - Correções Frontend
