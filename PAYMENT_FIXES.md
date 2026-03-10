# Correção do Fluxo de Pagamento Real - 4 Pilares LGPD

## Resumo Executivo

Implementadas correções mínimas para fazer o checkout funcionar de verdade com Mercado Pago. O sistema agora:
- ✅ Envia token real do Payment Brick para o backend
- ✅ Cria pagamento real no Mercado Pago (não simulado)
- ✅ Valida preço no servidor (não confia no frontend)
- ✅ Salva status real do pagamento no banco
- ✅ Só redireciona para sucesso se pagamento for aprovado/pendente
- ✅ Gera senha aleatória ao criar usuário (não "123")

---

## Arquivos Alterados

### 1. **client/src/pages/CheckoutFlow.tsx**

**Mudanças:**
- Linha 52: Trocar `createSubscription` → `processPayment`
- Linhas 338-377: Reescrever `onSubmit` do Payment Brick

**O que mudou:**
```typescript
// ANTES: Pegava formData.id (undefined) e criava assinatura fake
const paymentId = formData.id?.toString() || `pag_${Date.now()}`;
await createSubscription.mutateAsync({ ... });
toast.success("Pagamento processado com sucesso!");
setLocation("/checkout-success"); // Redirecionava sempre

// DEPOIS: Envia token real e valida resposta
if (!formData.token) {
  toast.error("Erro: Token de pagamento não gerado");
  return;
}

const response = await processPayment.mutateAsync({
  email: form.email,
  razaoSocial: form.razaoSocial,
  cnpj: form.cnpj,
  cpf: form.cpf,
  planId: planoSelecionado.id,
  planName: planoSelecionado.nome,
  priceMonthly: preco.valor || 0,
  token: formData.token, // Token real do Payment Brick
});

// Só redireciona se status for real
if (response.status === "approved") {
  toast.success("Pagamento aprovado com sucesso!");
  setLocation("/checkout-success");
} else if (response.status === "pending") {
  toast.info("Pagamento em processamento...");
  setLocation("/checkout-success");
} else if (response.status === "rejected") {
  toast.error(`Pagamento rejeitado: ${response.message}`);
}
```

---

### 2. **server/routers.ts**

**Mudanças:**
- Linhas 98-219: Adicionar nova mutação `subscriptions.processPayment`

**O que faz:**
1. Recebe token do Payment Brick, email, CNPJ, CPF, planId
2. Valida planId no servidor e busca preço correto (não confia no frontend)
3. Cria pagamento REAL no Mercado Pago usando o token
4. Cria usuário com senha aleatória (não "123")
5. Salva assinatura com status REAL do Mercado Pago
6. Retorna `{ status, paymentId, message }`

**Fluxo técnico:**
```
Frontend (token) → Backend (processPayment)
  ↓
Valida planId → Busca preço correto
  ↓
POST /v1/payments (Mercado Pago)
  ↓
Cria usuário com senha aleatória
  ↓
INSERT/UPDATE subscriptions com status real
  ↓
Retorna { status: "approved"|"pending"|"rejected", paymentId, message }
  ↓
Frontend valida status e redireciona
```

---

## Como Testar

### Pré-requisitos
- Credenciais Mercado Pago válidas em `.env`:
  ```
  MERCADO_PAGO_ACCESS_TOKEN=APP_USR_...
  MERCADO_PAGO_WEBHOOK_SECRET=...
  ```

### Teste 1: Pagamento Aprovado (Cartão de Teste)
1. Ir para `/checkout?plan=basico-anpd`
2. Preencher dados:
   - Email: `teste@example.com`
   - Razão Social: `Empresa Teste`
   - CNPJ: `11.222.333/0001-81`
   - CPF: `123.456.789-09`
3. No Payment Brick, usar cartão de teste:
   - **Número:** `4111111111111111`
   - **Validade:** `12/25`
   - **CVV:** `123`
4. Clicar em "Pagar"
5. **Esperado:**
   - ✅ Console mostra: `💳 Processando pagamento real: teste@example.com - Plano basico-anpd - R$ 150`
   - ✅ Resposta: `{ status: "approved", paymentId: "...", message: "Pagamento aprovado" }`
   - ✅ Redireciona para `/checkout-success`
   - ✅ Banco salva: `paymentStatus: "approved"`, `status: "active"`

### Teste 2: Pagamento Rejeitado
1. Usar cartão: `4000000000000002` (sempre recusado)
2. **Esperado:**
   - ✅ Resposta: `{ status: "rejected", message: "..." }`
   - ✅ Toast mostra erro real
   - ❌ NÃO redireciona para sucesso

### Teste 3: Validação de Preço no Servidor
1. Abrir DevTools → Network
2. Interceptar request de `processPayment`
3. Modificar `priceMonthly` de 150 para 1 (fraude)
4. **Esperado:**
   - ✅ Backend ignora valor do frontend
   - ✅ Usa preço correto do servidor (150)
   - ✅ Mercado Pago recebe 150, não 1

### Teste 4: Webhook (Simulado)
```bash
curl -X POST http://localhost:3000/api/trpc/webhooks.mercadoPago \
  -H "Content-Type: application/json" \
  -d '{
    "type": "payment",
    "data": { "id": 123456789 }
  }'
```
**Esperado:**
- ✅ Webhook busca status real no Mercado Pago
- ✅ Atualiza `paymentStatus` e `status` no banco
- ✅ Log: `✅ Webhook processado com sucesso`

---

## O Que Ainda Ficou Pendente

1. **Integração com Stripe** (se necessário)
   - Atualmente apenas Mercado Pago
   - Webhook de Stripe não implementado

2. **Recorrência/Renovação Automática**
   - Pagamento único implementado
   - Assinatura recorrente requer configuração adicional no Mercado Pago

3. **Reembolsos**
   - Função `refundPayment()` existe em `payment.ts`
   - Não há UI para solicitar reembolso

4. **Validação de Endereço**
   - Payment Brick tenta buscar endereço do payer
   - Se falhar, erro "Failed to get address data" (já corrigido com validação de email)
   - Pode precisar de dados de endereço completos no futuro

5. **Proteção contra Duplicação**
   - Webhook usa `paymentId` como chave única
   - Implementar `idempotency-key` para requests do frontend

6. **Auditoria e Logs**
   - Pagamentos são logados mas não há tabela de auditoria
   - Recomendado adicionar `payment_logs` table para compliance LGPD

---

## Segurança Implementada

✅ **Validação de Preço no Servidor**
- Frontend envia preço mas backend sempre busca do banco de dados
- Impossível fraudar alterando preço no DevTools

✅ **Senha Aleatória**
- Usuários criados com senha aleatória de 12 caracteres
- Removido hardcode "123"

✅ **Validação de Token**
- Token do Payment Brick é obrigatório
- Se vazio, retorna erro imediato

✅ **Status Real**
- Banco salva status real do Mercado Pago
- Não há "approved" hardcoded

---

## Rollback (Se Necessário)

Se algo der errado, reverter para checkpoint anterior:
```bash
git log --oneline | head -5
git revert <commit-hash>
```

---

## Próximos Passos Recomendados

1. **Testar com cartões reais** em sandbox do Mercado Pago
2. **Configurar webhook** no painel do Mercado Pago:
   - URL: `https://4pilareslgpd.club/api/trpc/webhooks.mercadoPago`
   - Eventos: `payment.created`, `payment.updated`
3. **Adicionar retry logic** se webhook falhar
4. **Implementar email de confirmação** após pagamento aprovado
5. **Adicionar testes de integração** para o fluxo completo

---

## Contato & Suporte

Para dúvidas sobre a implementação, consultar:
- `server/payment.ts` - Funções de pagamento
- `server/webhooks.ts` - Processamento de webhooks
- `client/src/pages/CheckoutFlow.tsx` - UI do checkout
