# 🧪 Guia de Teste Completo - 4 Fluxos de Pagamento em PRODUÇÃO

## ✅ Status da Conta Mercado Pago

| Item | Status | Detalhes |
|------|--------|----------|
| Token de Acesso | ✅ Válido | APP_USR-5477028403491204-... |
| User ID | ✅ Confirmado | 240523153 |
| Conta | ✅ Ativa | site_status: active |
| Modo | ✅ Produção | live_mode: true |
| Empresa | ✅ Configurada | JP CRIATIVIDADE |
| Soft Descriptor | ✅ Ativo | APOIOJP (no extrato) |
| Permissões | ✅ Completas | billing, buy, sell |

---

## 🧪 TESTE 1: Fluxo Pix Real

### 📋 Pré-requisitos
- [ ] Ter uma chave Pix cadastrada no Mercado Pago
- [ ] Ter acesso ao app do seu banco
- [ ] Ter saldo disponível para teste

### 🔄 Passo-a-Passo

#### 1. Acessar Checkout
```
URL: https://4pilareslgpd.club/preco
Clique em: "Contratar agora" (qualquer plano)
```

#### 2. Preencher Dados da Empresa
```
Razão Social: Sua Empresa Teste
CNPJ: 11.222.333/0001-81 (válido)
E-mail: seu-email@teste.com
```

#### 3. Selecionar Pix
```
No Payment Brick, selecione: "Pix"
Clique em: "Pagar"
```

#### 4. Gerar QR Code
```
Um QR Code será exibido
Você pode:
  - Escanear com seu celular
  - Copiar código para app do banco
  - Usar Pix por telefone
```

#### 5. Confirmar Pagamento
```
Abra app do seu banco
Escaneie o QR Code ou cole o código
Confirme o pagamento
```

#### 6. Validar Assinatura
```
Após pagamento confirmado:
- Acesse: /subscription
- Verifique status: "active"
- Confirme plano contratado
- Veja histórico de pagamentos
```

### ✅ Checklist Pix
- [ ] QR Code gerado corretamente
- [ ] Pagamento processado no banco
- [ ] Webhook recebido (status muda para active)
- [ ] Assinatura criada no dashboard
- [ ] Histórico mostra transação Pix
- [ ] Dinheiro aparece na conta Mercado Pago

### 💰 Valor de Teste
- **Plano Básico ANPD**: R$ 150,00
- **Plano Essencial**: R$ 997,00
- **Plano Profissional**: R$ 1.997,00
- **Plano Enterprise**: R$ 4.997,00

---

## 💳 TESTE 2: Fluxo Cartão de Crédito Real

### 📋 Pré-requisitos
- [ ] Ter um cartão de crédito válido
- [ ] Limite disponível no cartão
- [ ] Acesso ao extrato do cartão

### 🔄 Passo-a-Passo

#### 1. Acessar Checkout
```
URL: https://4pilareslgpd.club/preco
Clique em: "Contratar agora"
```

#### 2. Preencher Dados da Empresa
```
Razão Social: Sua Empresa Teste
CNPJ: 11.222.333/0001-81
E-mail: seu-email@teste.com
```

#### 3. Selecionar Cartão de Crédito
```
No Payment Brick, selecione: "Cartão de Crédito"
```

#### 4. Preencher Dados do Cartão
```
Número do Cartão: [seu cartão real]
Validade: MM/AA
CVV: [3 dígitos atrás]
Titular: [seu nome]
```

#### 5. Confirmar Pagamento
```
Clique em: "Pagar"
Aguarde processamento (2-5 segundos)
```

#### 6. Validar Assinatura
```
Após aprovação:
- Acesse: /subscription
- Verifique status: "active"
- Confirme plano contratado
- Veja histórico de pagamentos
```

### ✅ Checklist Cartão
- [ ] Dados do cartão aceitos
- [ ] Pagamento aprovado
- [ ] Webhook recebido
- [ ] Assinatura criada
- [ ] Histórico mostra transação cartão
- [ ] Cobrança aparece no extrato

### ⚠️ Importante
- Use seu próprio cartão (não é teste)
- Será cobrado o valor real
- Você pode solicitar reembolso ao Mercado Pago se necessário

---

## 🧾 TESTE 3: Fluxo Boleto Real

### 📋 Pré-requisitos
- [ ] Ter acesso a um app bancário
- [ ] Ter saldo para pagar boleto
- [ ] Ter tempo para aguardar compensação

### 🔄 Passo-a-Passo

#### 1. Acessar Checkout
```
URL: https://4pilareslgpd.club/preco
Clique em: "Contratar agora"
```

#### 2. Preencher Dados da Empresa
```
Razão Social: Sua Empresa Teste
CNPJ: 11.222.333/0001-81
E-mail: seu-email@teste.com
```

#### 3. Selecionar Boleto
```
No Payment Brick, selecione: "Boleto"
```

#### 4. Gerar Código de Barras
```
Um código de barras será gerado
Você pode:
  - Copiar código
  - Escanear com app do banco
  - Imprimir boleto
```

#### 5. Pagar Boleto
```
Abra seu app bancário
Cole o código de barras
Confirme pagamento
```

#### 6. Aguardar Compensação
```
Boleto leva 1-2 dias úteis para compensar
Após compensação:
- Webhook é enviado
- Status muda para "active"
- Assinatura é ativada
```

### ✅ Checklist Boleto
- [ ] Código de barras gerado
- [ ] Boleto pago no banco
- [ ] Aguardar compensação (1-2 dias)
- [ ] Webhook recebido após compensação
- [ ] Assinatura criada
- [ ] Histórico mostra transação boleto

### ⏱️ Timing
- Geração: Imediato
- Pagamento: Imediato (no banco)
- Compensação: 1-2 dias úteis
- Webhook: Após compensação

---

## 📊 TESTE 4: Monitorar Transações no Dashboard

### 🔗 Acessar Dashboard Mercado Pago

#### 1. Login
```
URL: https://www.mercadopago.com.br/
E-mail: [sua conta]
Senha: [sua senha]
```

#### 2. Ir para Transações
```
Menu → "Vendas" ou "Transações"
Ou acesse: https://www.mercadopago.com.br/balance/activity
```

#### 3. Visualizar Pagamentos
```
Você verá:
- Data e hora do pagamento
- Método (Pix, Cartão, Boleto)
- Valor
- Status (Aprovado, Pendente, Rejeitado)
- ID da transação
```

#### 4. Filtrar por Método
```
Filtros disponíveis:
- Data
- Método de pagamento
- Status
- Valor
```

#### 5. Detalhes da Transação
```
Clique em uma transação para ver:
- ID do pagamento
- Detalhes do cliente
- Soft Descriptor (APOIOJP)
- Taxas cobradas
- Valor líquido
```

### ✅ Checklist Dashboard
- [ ] Acessar dashboard com sucesso
- [ ] Ver transações Pix
- [ ] Ver transações Cartão
- [ ] Ver transações Boleto
- [ ] Filtrar por método
- [ ] Visualizar detalhes
- [ ] Confirmar valores
- [ ] Verificar soft descriptor (APOIOJP)

### 📈 Informações Disponíveis
```
Para cada transação:
├── ID do Pagamento
├── Data/Hora
├── Método (Pix/Cartão/Boleto)
├── Valor Bruto
├── Taxas
├── Valor Líquido
├── Status
├── Cliente
└── Soft Descriptor
```

---

## 🔗 Links Úteis

| Recurso | URL |
|---------|-----|
| Dashboard Vendas | https://www.mercadopago.com.br/balance/activity |
| Configurações | https://www.mercadopago.com.br/settings/account |
| Webhooks | https://www.mercadopago.com.br/developers/panel |
| Documentação | https://developers.mercadopago.com |
| Suporte | https://www.mercadopago.com.br/ajuda |

---

## 📋 Ordem Recomendada de Testes

### Dia 1: Testes Rápidos
```
1. Pix (mais rápido)
2. Cartão (imediato)
```

### Dia 2-3: Teste Boleto
```
3. Boleto (aguardar compensação)
```

### Contínuo: Monitoramento
```
4. Dashboard (acompanhar todas as transações)
```

---

## ✅ Checklist Final

### Pix
- [ ] QR Code gerado
- [ ] Pagamento processado
- [ ] Assinatura criada
- [ ] Histórico atualizado
- [ ] Dashboard mostra transação

### Cartão
- [ ] Dados aceitos
- [ ] Pagamento aprovado
- [ ] Assinatura criada
- [ ] Histórico atualizado
- [ ] Dashboard mostra transação

### Boleto
- [ ] Código gerado
- [ ] Pagamento realizado
- [ ] Compensação aguardada
- [ ] Webhook recebido
- [ ] Assinatura criada

### Dashboard
- [ ] Todas as transações visíveis
- [ ] Filtros funcionando
- [ ] Detalhes corretos
- [ ] Soft descriptor correto
- [ ] Valores corretos

---

## 🚨 Troubleshooting

### Pix não gera QR Code
- Verifique se Payment Brick carregou
- Atualize a página
- Limpe cache do navegador

### Cartão rejeitado
- Verifique limite disponível
- Confirme dados do cartão
- Tente outro cartão

### Boleto não compensa
- Aguarde 1-2 dias úteis
- Verifique se foi pago corretamente
- Contate seu banco

### Webhook não recebido
- Verifique logs: `.manus-logs/devserver.log`
- Confirme URL de webhook no Mercado Pago
- Teste webhook manualmente

### Assinatura não criada
- Verifique se pagamento foi aprovado
- Confirme webhook foi recebido
- Verifique banco de dados

---

## 📞 Suporte

### Problemas Técnicos
- Verifique logs do servidor
- Teste endpoints manualmente
- Contate suporte Manus

### Problemas de Pagamento
- Acesse dashboard Mercado Pago
- Verifique status da transação
- Contate suporte Mercado Pago

---

## 📊 Métricas para Acompanhar

```
Após testes completos:
├── Taxa de aprovação (%)
├── Tempo médio de processamento
├── Método mais utilizado
├── Valor médio por transação
├── Taxa de conversão
└── Satisfação do cliente
```

---

**Status**: ✅ Pronto para testes
**Ambiente**: PRODUÇÃO (Pagamentos Reais)
**Data**: 11/03/2026
