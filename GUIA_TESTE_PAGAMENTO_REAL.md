# 💳 Guia Prático - Teste de Pagamento Real

## ⚠️ Aviso Importante

**Você está em PRODUÇÃO. Pagamentos são REAIS.**

- ✅ Dinheiro será cobrado de verdade
- ✅ Você pode solicitar reembolso ao Mercado Pago
- ✅ Cada transação fica registrada

---

## 🎯 Objetivo

Fazer um pagamento real de teste para validar:
1. ✅ Fluxo de checkout funciona
2. ✅ Payment Brick gera token
3. ✅ Mercado Pago processa pagamento
4. ✅ Webhook atualiza assinatura
5. ✅ Dashboard mostra transação

---

## 📋 Pré-requisitos

- [ ] Acesso ao site: https://4pilareslgpd.club
- [ ] Cartão de crédito OU Pix OU Boleto
- [ ] Saldo/limite disponível
- [ ] Acesso ao dashboard Mercado Pago
- [ ] Tempo: ~5 minutos

---

## 🔄 Passo-a-Passo: Teste com Cartão

### 1️⃣ Acessar Página de Preços
```
URL: https://4pilareslgpd.club/preco
```

### 2️⃣ Escolher Plano
```
Recomendação: Plano Básico ANPD (R$ 150,00)
Clique em: "Contratar agora"
```

### 3️⃣ Preencher Dados da Empresa
```
Razão Social: [Sua Empresa]
CNPJ: 11.222.333/0001-81 (válido)
E-mail: [seu-email@teste.com]
Clique em: "Próximo"
```

### 4️⃣ Selecionar Cartão de Crédito
```
No Payment Brick:
- Selecione: "Cartão de Crédito"
- Clique em: "Pagar"
```

### 5️⃣ Inserir Dados do Cartão
```
Número: [seu cartão real]
Validade: MM/AA
CVV: [3 dígitos atrás]
Titular: [seu nome]
Clique em: "Pagar"
```

### 6️⃣ Aguardar Processamento
```
O sistema processará:
- Validação do cartão: 1-2 segundos
- Autorização: 2-5 segundos
- Confirmação: instantâneo
```

### 7️⃣ Validar Sucesso
```
Você verá:
- ✅ Página de sucesso
- ✅ Confirmação de pagamento
- ✅ ID da transação
```

### 8️⃣ Verificar Dashboard
```
URL: https://4pilareslgpd.club/subscription
Você verá:
- Status: "active"
- Plano contratado
- Próxima cobrança
- Histórico de pagamentos
```

---

## 🔄 Passo-a-Passo: Teste com Pix

### 1️⃣ Acessar Página de Preços
```
URL: https://4pilareslgpd.club/preco
Clique em: "Contratar agora"
```

### 2️⃣ Preencher Dados da Empresa
```
Razão Social: [Sua Empresa]
CNPJ: 11.222.333/0001-81
E-mail: [seu-email@teste.com]
Clique em: "Próximo"
```

### 3️⃣ Selecionar Pix
```
No Payment Brick:
- Selecione: "Pix"
- Clique em: "Pagar"
```

### 4️⃣ Gerar QR Code
```
Um QR Code será exibido
Opções:
A) Escanear com celular
B) Copiar código Pix
C) Usar Pix por telefone
```

### 5️⃣ Fazer Pagamento Pix
```
Opção A - Escanear:
1. Abra app do seu banco
2. Selecione "Pix"
3. Clique em "Escanear QR Code"
4. Aponte para o QR Code
5. Confirme o pagamento

Opção B - Copiar Código:
1. Copie o código Pix
2. Abra app do seu banco
3. Cole o código
4. Confirme o pagamento
```

### 6️⃣ Confirmar Pagamento
```
Após pagar no banco:
- Aguarde 1-2 segundos
- Página atualizará automaticamente
- Você verá confirmação
```

### 7️⃣ Verificar Dashboard
```
URL: https://4pilareslgpd.club/subscription
Você verá:
- Status: "active"
- Plano contratado
- Método: Pix
- Histórico atualizado
```

---

## 🔄 Passo-a-Passo: Teste com Boleto

### 1️⃣ Acessar Página de Preços
```
URL: https://4pilareslgpd.club/preco
Clique em: "Contratar agora"
```

### 2️⃣ Preencher Dados da Empresa
```
Razão Social: [Sua Empresa]
CNPJ: 11.222.333/0001-81
E-mail: [seu-email@teste.com]
Clique em: "Próximo"
```

### 3️⃣ Selecionar Boleto
```
No Payment Brick:
- Selecione: "Boleto"
- Clique em: "Pagar"
```

### 4️⃣ Gerar Código de Barras
```
Um código de barras será gerado
Opções:
A) Copiar código
B) Escanear com app
C) Imprimir boleto
```

### 5️⃣ Pagar Boleto
```
1. Abra app do seu banco
2. Selecione "Pagar Boleto"
3. Cole o código de barras
4. Confirme o pagamento
```

### 6️⃣ Aguardar Compensação
```
⏱️ Boleto leva 1-2 dias úteis para compensar

Após compensação:
- Webhook é enviado
- Status muda para "active"
- Assinatura é ativada
```

### 7️⃣ Verificar Dashboard
```
URL: https://4pilareslgpd.club/subscription
Você verá (após compensação):
- Status: "active"
- Plano contratado
- Método: Boleto
- Histórico atualizado
```

---

## ✅ Checklist de Validação

### Após Pagamento Aprovado (Cartão/Pix)

- [ ] Página de sucesso exibida
- [ ] ID da transação visível
- [ ] Dashboard acessível em /subscription
- [ ] Status mostra "active"
- [ ] Plano correto exibido
- [ ] Próxima cobrança calculada
- [ ] Histórico mostra transação
- [ ] Método de pagamento correto

### No Dashboard Mercado Pago

- [ ] Acessar: https://www.mercadopago.com.br/balance/activity
- [ ] Transação visível
- [ ] Valor correto
- [ ] Status: Aprovado
- [ ] Soft Descriptor: APOIOJP
- [ ] Data/hora corretos

### Após Pagamento (Boleto)

- [ ] Código de barras gerado
- [ ] Pagamento realizado no banco
- [ ] Aguardar 1-2 dias úteis
- [ ] Webhook recebido
- [ ] Status muda para "active"
- [ ] Dashboard atualizado

---

## 💰 Valores de Teste

| Plano | Valor | Recomendação |
|-------|-------|--------------|
| Básico ANPD | R$ 150,00 | ✅ Menor valor |
| Essencial | R$ 997,00 | Valor médio |
| Profissional | R$ 1.997,00 | Valor alto |
| Enterprise | R$ 4.997,00 | Maior valor |

**Recomendação**: Usar Plano Básico (R$ 150,00) para teste

---

## 🔍 O Que Observar Durante o Teste

### No Checkout
```
✅ Payment Brick carrega
✅ Opções de pagamento aparecem
✅ Nenhuma mensagem de erro
✅ Botão "Pagar" funciona
```

### No Processamento
```
✅ Página não congela
✅ Sem erro 404 ou 500
✅ Processamento leva 2-5 segundos
✅ Sem timeout
```

### Após Pagamento
```
✅ Página de sucesso exibida
✅ ID da transação visível
✅ Sem erro de webhook
✅ Dashboard atualiza automaticamente
```

---

## 🚨 Possíveis Problemas

### Cartão Rejeitado
```
Causas possíveis:
- Limite insuficiente
- Cartão bloqueado
- Dados incorretos
- Banco recusou

Solução:
- Tente outro cartão
- Contate seu banco
- Verifique limite
```

### Pix Não Gera QR Code
```
Causas possíveis:
- Payment Brick não carregou
- Erro de conexão
- Timeout

Solução:
- Atualize a página
- Limpe cache do navegador
- Tente novamente
```

### Dashboard Não Atualiza
```
Causas possíveis:
- Webhook não recebido
- Erro no banco de dados
- Delay de processamento

Solução:
- Aguarde 30 segundos
- Atualize a página
- Verifique logs do servidor
```

### Boleto Não Compensa
```
Causas possíveis:
- Não foi pago corretamente
- Aguardando compensação
- Erro no código

Solução:
- Aguarde 1-2 dias úteis
- Verifique se foi pago
- Contate seu banco
```

---

## 📊 Monitorar Transação

### No Dashboard Mercado Pago

1. Acesse: https://www.mercadopago.com.br/
2. Vá para: "Vendas" → "Transações"
3. Procure pela transação
4. Clique para ver detalhes:
   - ID do pagamento
   - Valor
   - Status
   - Método
   - Soft Descriptor
   - Taxas

### No Dashboard da Aplicação

1. Acesse: https://4pilareslgpd.club/subscription
2. Você verá:
   - Status da assinatura
   - Plano contratado
   - Próxima cobrança
   - Histórico de pagamentos

---

## 💡 Dicas Importantes

### ✅ Faça
- ✅ Teste com valor pequeno (R$ 150)
- ✅ Use seu próprio cartão/Pix
- ✅ Monitore ambos os dashboards
- ✅ Anote o ID da transação
- ✅ Guarde o recibo

### ❌ Não Faça
- ❌ Não teste com cartão de outra pessoa
- ❌ Não tente múltiplos pagamentos rápido
- ❌ Não feche a página durante processamento
- ❌ Não tente cartões inválidos

---

## 📞 Se Algo Der Errado

### Pagamento Foi Cobrado Mas Não Criou Assinatura
```
1. Verifique dashboard Mercado Pago
2. Confirme que pagamento foi aprovado
3. Aguarde 1 minuto (webhook pode atrasar)
4. Atualize página /subscription
5. Se ainda não aparecer, contate suporte
```

### Pagamento Rejeitado
```
1. Tente outro cartão
2. Verifique limite disponível
3. Contate seu banco
4. Tente Pix ou Boleto
```

### Preciso Reembolso
```
1. Acesse: https://www.mercadopago.com.br/
2. Vá para: Transações
3. Clique na transação
4. Selecione: "Devolver"
5. Confirme o reembolso
```

---

## ✅ Próximos Passos Após Teste

1. **Validar Fluxo Completo**
   - [ ] Pagamento processado
   - [ ] Assinatura criada
   - [ ] Dashboard atualizado
   - [ ] Histórico registrado

2. **Testar Upgrade/Downgrade**
   - [ ] Acessar /upgrade-plan
   - [ ] Selecionar novo plano
   - [ ] Validar cálculo de créditos
   - [ ] Confirmar alteração

3. **Testar Cancelamento**
   - [ ] Acessar /subscription
   - [ ] Clicar em "Cancelar Assinatura"
   - [ ] Confirmar cancelamento
   - [ ] Validar status muda para "cancelled"

4. **Monitorar Próximas Cobranças**
   - [ ] Anotar data da próxima cobrança
   - [ ] Aguardar cobrança automática
   - [ ] Validar que funciona

---

## 📝 Notas Importantes

**Ambiente**: PRODUÇÃO (Pagamentos Reais)
**Status**: ✅ Pronto para teste
**Soft Descriptor**: APOIOJP (aparece no extrato)
**Suporte**: Mercado Pago (https://www.mercadopago.com.br/ajuda)

---

**Boa sorte com o teste! 🚀**

Se tiver dúvidas durante o processo, consulte este guia ou contate o suporte.
