# Integração Mercado Pago — 4 Pilares LGPD

## Overview

A plataforma 4 Pilares LGPD agora possui integração completa com **Mercado Pago Payment Brick** para processamento seguro de pagamentos recorrentes dos planos de adequação LGPD.

## Configuração

### 1. Chave Pública (já configurada)

A chave pública do Mercado Pago está armazenada em:
```
VITE_MERCADO_PAGO_PUBLIC_KEY=APP_USR-4f174d8f-6fe6-4905-8969-68d1acd7fb9a
```

Esta chave é injetada automaticamente no frontend via variáveis de ambiente.

### 2. Localização da Integração

- **Página de Checkout**: `/client/src/pages/Checkout.tsx`
- **Rota**: `/checkout?plan=essencial|profissional|empresarial`
- **Componente**: Payment Brick renderizado em `#paymentBrick_container`

## Fluxo de Pagamento

### 1. Seleção de Plano
Usuário acessa `/planos` e clica em "Escolher plano"

### 2. Redirecionamento para Checkout
Redirecionado para `/checkout?plan=profissional` (exemplo)

### 3. Carregamento do SDK
- SDK do Mercado Pago é carregado dinamicamente
- Payment Brick é inicializado com:
  - **Locale**: pt-BR (português brasileiro)
  - **Tema**: Roxo #5b21b6 (identidade 4 Pilares)
  - **Métodos aceitos**: Cartão de crédito, débito, boleto, transferência bancária
  - **Parcelas**: Máximo 1x (mensalidade recorrente)

### 4. Processamento de Pagamento
- Usuário preenche dados de pagamento no Payment Brick
- Dados são enviados diretamente ao Mercado Pago (PCI-DSS compliant)
- Callback `onSubmit` recebe formData para processar no backend

### 5. Confirmação
- Sucesso: Usuário é redirecionado para `/dashboard`
- Erro: Mensagem de erro é exibida com opção de tentar novamente

## Implementação Backend (Próxima Etapa)

Atualmente, a integração é apenas **frontend**. Para completar a integração, você precisa:

### 1. Criar Endpoint de Processamento

```typescript
// server/routers.ts
export const appRouter = router({
  payments: router({
    processPayment: protectedProcedure
      .input(z.object({
        planType: z.enum(['essencial', 'profissional', 'empresarial']),
        paymentData: z.any(), // Dados do Payment Brick
      }))
      .mutation(async ({ ctx, input }) => {
        // 1. Validar dados de pagamento
        // 2. Chamar API do Mercado Pago para processar
        // 3. Criar assinatura no banco de dados
        // 4. Enviar confirmação por e-mail
        // 5. Retornar status de sucesso
      }),
  }),
});
```

### 2. Chamar Backend do Checkout

```typescript
// client/src/pages/Checkout.tsx - onSubmit callback
onSubmit: async (formData: any) => {
  setStatus("processing");
  try {
    const result = await trpc.payments.processPayment.useMutation({
      planType,
      paymentData: formData,
    });
    // Processar resultado
  } catch (error) {
    setStatus("error");
  }
}
```

### 3. Configurar Webhook (Opcional)

Para notificações em tempo real de mudanças de pagamento:

```typescript
// server/routers.ts
export const appRouter = router({
  webhooks: router({
    mercadoPago: publicProcedure
      .input(z.any())
      .post(async ({ input }) => {
        // Processar notificações do Mercado Pago
        // Atualizar status de assinatura
      }),
  }),
});
```

## Variáveis de Ambiente

### Frontend (já configurado)
```env
VITE_MERCADO_PAGO_PUBLIC_KEY=APP_USR-4f174d8f-6fe6-4905-8969-68d1acd7fb9a
```

### Backend (necessário configurar)
```env
MERCADO_PAGO_ACCESS_TOKEN=APP_USR-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
MERCADO_PAGO_WEBHOOK_SECRET=seu-webhook-secret
```

## Segurança

✅ **O que está seguro:**
- Chave pública é exposta no frontend (por design)
- Dados de pagamento são criptografados pelo Mercado Pago
- Nenhum dado sensível é armazenado localmente
- Comunicação HTTPS obrigatória

⚠️ **O que precisa de atenção:**
- Access Token do Mercado Pago deve estar **apenas no backend**
- Webhook deve validar assinatura do Mercado Pago
- Implementar rate limiting no endpoint de pagamento
- Validar dados de entrada antes de processar

## Testes

### Cartões de Teste (Mercado Pago)
```
Crédito (Aprovado):    4111 1111 1111 1111 | 11/25 | 123
Débito (Aprovado):     5031 4332 3010 9903 | 11/25 | 123
Boleto (Aprovado):     Qualquer CPF
```

### Fluxo de Teste
1. Acesse `/planos`
2. Clique em "Escolher plano"
3. Use cartão de teste acima
4. Verifique se o Payment Brick renderiza corretamente
5. Teste callback de sucesso/erro

## Referências

- [Documentação Mercado Pago Payment Brick](https://www.mercadopago.com.br/developers/pt/docs/checkout-bricks/payment-brick/introduction)
- [SDK JavaScript Mercado Pago](https://sdk.mercadopago.com/js/v2)
- [API de Pagamentos Mercado Pago](https://www.mercadopago.com.br/developers/pt/reference/payments/_payments/post)

## Status da Integração

| Componente | Status | Notas |
|-----------|--------|-------|
| SDK Carregamento | ✅ Completo | Carregamento dinâmico |
| Payment Brick UI | ✅ Completo | Tema roxo #5b21b6 |
| Métodos de Pagamento | ✅ Completo | Crédito, débito, boleto, transferência |
| Locale pt-BR | ✅ Completo | Interface em português |
| Callback onSubmit | ✅ Completo | Pronto para backend |
| Backend Processing | ⏳ Pendente | Próxima etapa |
| Webhook Notifications | ⏳ Pendente | Opcional |
| Testes E2E | ⏳ Pendente | Após backend |

## Próximos Passos

1. **Implementar backend de pagamento** (`server/routers.ts`)
2. **Configurar Access Token** do Mercado Pago
3. **Criar tabela de assinaturas** no banco de dados
4. **Implementar webhook** para notificações
5. **Testar fluxo completo** com cartões de teste
6. **Documentar API** de pagamentos
7. **Configurar e-mails** de confirmação
8. **Implementar retry logic** para falhas de pagamento
