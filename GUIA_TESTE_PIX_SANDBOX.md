# 🧪 Guia de Teste Completo - Fluxo Pix com Mercado Pago (Sandbox)

## ✅ Status das Credenciais

As credenciais de teste do Mercado Pago foram validadas com sucesso:

- **Public Key**: APP_USR-27238065-3636-4ea0-8416-b78a349b8f58
- **Access Token**: APP_USR-2087701143283869-030911-8e11d964e4fbeeea54683a1475e17a8d-3255400588
- **User ID**: 240523153
- **Status**: ✅ Conectado e validado

## 🔄 Fluxo de Teste Completo

### Passo 1: Acessar a Página de Preços
1. Acesse: https://3000-ipapmsx6i7jk4003hquw2-d76ab130.us1.manus.computer/preco
2. Veja os 4 planos disponíveis com preços em reais
3. Clique em "Contratar agora" em qualquer plano

### Passo 2: Checkout - Dados da Empresa
1. Preencha o formulário com dados de teste:
   - **Razão Social**: Empresa Teste LTDA
   - **CNPJ**: 11.222.333/0001-81 (válido)
   - **E-mail**: seu-email@teste.com
2. Clique em "Próximo"

### Passo 3: Checkout - Método de Pagamento
1. O **Payment Brick** do Mercado Pago carregará automaticamente
2. Você verá opções de pagamento: **Pix**, Cartão de Crédito, Boleto

### Passo 4: Testar Pagamento via Pix
1. Selecione **Pix** como método
2. Clique em "Pagar"
3. Um **QR Code será gerado** (simulado no sandbox)
4. O sistema criará uma preferência de pagamento no Mercado Pago

### Passo 5: Simular Confirmação de Pagamento
No ambiente de sandbox, você pode:

**Opção A: Via Dashboard Mercado Pago**
1. Acesse: https://www.mercadopago.com.br/developers/panel
2. Faça login com as credenciais de teste
3. Vá para "Ferramentas" → "Simulador de Pagamento"
4. Simule um pagamento aprovado com o ID da preferência

**Opção B: Webhook Simulado**
1. O sistema está configurado para receber webhooks do Mercado Pago
2. Quando um pagamento é confirmado, o webhook atualiza a assinatura automaticamente

### Passo 6: Verificar Dashboard de Assinatura
1. Após pagamento confirmado, acesse: `/subscription`
2. Você verá:
   - ✅ Status da assinatura: "active"
   - 📊 Informações do plano contratado
   - 💳 Método de pagamento (Pix)
   - 📜 **Histórico de pagamentos** (novo!)
   - ⚙️ Opção de cancelar assinatura

### Passo 7: Testar Upgrade/Downgrade
1. No dashboard, clique em "Alterar Plano"
2. Você será redirecionado para `/upgrade-plan`
3. Selecione um novo plano
4. O sistema calculará créditos proporcionais automaticamente
5. Confirme a alteração
6. O plano será atualizado com crédito aplicado

## 🧮 Cálculo de Créditos (Exemplo)

**Cenário**: Usuário contratou "Básico ANPD" (R$ 150/mês) e quer fazer upgrade para "Essencial Completo" (R$ 997/mês)

```
Plano Atual:    R$ 150/mês
Novo Plano:     R$ 997/mês
Diferença:      R$ 847/mês
Dias Restantes: 25 dias (exemplo)

Crédito Diário Atual:    R$ 150 ÷ 30 = R$ 5/dia
Crédito Diário Novo:     R$ 997 ÷ 30 = R$ 33,23/dia

Crédito a Receber:       R$ 5 × 25 = R$ 125
Valor a Pagar:           R$ 33,23 × 25 = R$ 830,75
Diferença Final:         R$ 830,75 - R$ 125 = R$ 705,75
```

## 📋 Dados de Teste Disponíveis

### Cartão de Crédito (Teste)
- **Número**: 4111 1111 1111 1111
- **Validade**: 11/25
- **CVV**: 123

### Pix (Teste)
- QR Code será gerado automaticamente
- No sandbox, simule aprovação via dashboard

### Boleto (Teste)
- Código de barras será gerado automaticamente

## 🔍 Verificações Importantes

### 1. Payment Brick Carregando
- [ ] Brick aparece na página de checkout
- [ ] Não há erro "Token de pagamento não gerado"
- [ ] Opções de pagamento aparecem corretamente

### 2. Geração de Preferência
- [ ] Ao clicar "Pagar", a API cria uma preferência
- [ ] QR Code/código de barras aparece
- [ ] Transação recebe ID único

### 3. Webhook Funcionando
- [ ] Após pagamento simulado, status muda para "active"
- [ ] Histórico de pagamentos aparece no dashboard
- [ ] Assinatura é criada corretamente

### 4. Dashboard Completo
- [ ] Informações da empresa aparecem
- [ ] Método de pagamento é exibido
- [ ] Histórico mostra transações
- [ ] Botão "Alterar Plano" funciona

### 5. Upgrade/Downgrade
- [ ] Cálculo de créditos é correto
- [ ] Novo plano é aplicado
- [ ] Próxima data de cobrança é atualizada

## 🐛 Troubleshooting

### Erro: "Token de pagamento não gerado"
- Verifique se a Public Key está correta
- Reinicie o servidor: `pnpm dev`
- Limpe o cache do navegador

### Erro: "Assinatura não encontrada"
- Verifique se o usuário está autenticado
- Confirme que a assinatura foi criada no banco de dados

### Erro: "Plano inválido"
- Verifique se o ID do plano existe em `PLANOS`
- Confirme que está usando `basico-anpd`, `essencial-completo`, etc.

### Webhook não recebido
- Verifique logs do servidor: `tail -f .manus-logs/devserver.log`
- Confirme que a URL de webhook está configurada no Mercado Pago
- Teste manualmente via dashboard Mercado Pago

## 📊 Endpoints Testáveis

### Criar Assinatura
```bash
curl -X POST http://localhost:3000/api/trpc/subscriptions.create \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@example.com",
    "razaoSocial": "Empresa Teste",
    "cnpj": "11.222.333/0001-81",
    "planId": "basico-anpd",
    "planName": "Básico ANPD",
    "priceMonthly": 150
  }'
```

### Buscar Assinatura
```bash
curl http://localhost:3000/api/trpc/subscriptions.getMySubscription
```

### Buscar Histórico de Pagamentos
```bash
curl http://localhost:3000/api/trpc/subscriptions.getPaymentHistory
```

### Fazer Upgrade
```bash
curl -X POST http://localhost:3000/api/trpc/subscriptions.upgradePlan \
  -H "Content-Type: application/json" \
  -d '{
    "newPlanId": "essencial-completo",
    "creditAmount": 125.50
  }'
```

## ✅ Checklist Final

- [ ] Credenciais do Mercado Pago validadas
- [ ] Payment Brick carregando corretamente
- [ ] Fluxo de checkout completo funcionando
- [ ] Assinatura criada após pagamento
- [ ] Dashboard exibindo informações corretas
- [ ] Histórico de pagamentos aparecendo
- [ ] Upgrade/downgrade calculando créditos corretamente
- [ ] Webhook atualizando status automaticamente
- [ ] Cancelamento de assinatura funcionando

## 🚀 Próximos Passos

1. **Notificações por E-mail** - Enviar confirmação de pagamento
2. **Download de Recibos** - Gerar PDF com detalhes da transação
3. **Gráfico de Gastos** - Visualizar tendência de gastos
4. **Integração com Webhook** - Atualizar status automaticamente

---

**Última atualização**: 11/03/2026
**Status**: ✅ Pronto para teste completo
