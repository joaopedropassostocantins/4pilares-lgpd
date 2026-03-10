# Guia de Teste de Pagamento - 4 Pilares LGPD

## 🧪 Teste End-to-End com Cartões de Teste Mercado Pago

### Cartões de Teste Disponíveis

| Cenário | Cartão | CVV | Data |
|---------|--------|-----|------|
| ✅ Aprovado | `4111 1111 1111 1111` | `123` | `12/25` |
| ⏳ Pendente | `4111 1111 1111 1112` | `123` | `12/25` |
| ❌ Rejeitado | `4111 1111 1111 1113` | `123` | `12/25` |

### Passo a Passo

#### 1. Acessar Checkout
```
URL: https://4pilareslgpd-upm86dcc.manus.space/checkout
ou
https://4pilareslgpd.club/checkout
```

#### 2. Preencher Dados da Empresa
- **Razão Social**: Qualquer nome (ex: "Empresa Teste LTDA")
- **CNPJ**: `11.222.333/0001-81` (válido para teste)
- **E-mail**: Seu e-mail real (receberá confirmação)

#### 3. Selecionar Plano
- Escolher qualquer plano (ex: Plano Básico)
- Preço será validado no servidor (não confia no frontend)

#### 4. Preencher Dados de Pagamento
- **CPF**: `123.456.789-09` (válido para teste)
- **E-mail**: Mesmo da empresa
- **Método**: Selecionar "Pix" ou "Cartão de Crédito"

#### 5. Inserir Cartão de Teste
- Usar cartão da tabela acima conforme cenário desejado
- Nome: Qualquer nome
- CPF: Qualquer CPF válido

#### 6. Clicar em "Pagar"

### Resultados Esperados

#### ✅ Cartão Aprovado (4111 1111 1111 1111)
```
1. Página mostra: "Pagamento aprovado com sucesso!"
2. Redirecionamento para /checkout-success
3. Banco de dados:
   - Usuário criado com email
   - Assinatura com status "active"
   - Mercado Pago ID registrado
4. E-mail de confirmação enviado
```

#### ⏳ Cartão Pendente (4111 1111 1111 1112)
```
1. Página mostra: "Pagamento em processamento. Confirmação por e-mail."
2. Redirecionamento para /checkout-success
3. Banco de dados:
   - Usuário criado
   - Assinatura com status "pending"
   - Webhook posterior atualizará para "active"
4. E-mail de confirmação enviado
```

#### ❌ Cartão Rejeitado (4111 1111 1111 1113)
```
1. Página mostra: "Pagamento rejeitado: [motivo]"
2. SEM redirecionamento
3. Usuário pode tentar novamente
4. Banco de dados: Nenhuma assinatura criada
```

### 🔄 Retry Automático

Se o pagamento falhar por **timeout** ou **erro de rede**:
```
1. Toast mostra: "Tentando novamente... (1/2)"
2. Aguarda 2 segundos
3. Tenta novamente automaticamente
4. Máximo 2 retries
```

### 📊 Verificação no Painel Admin

Após teste bem-sucedido:

1. **Acessar Admin**: `/admin`
2. **Clientes**: Verificar novo cliente criado
3. **Financeiro**: Verificar pagamento registrado
4. **Status**: Deve estar "active" ou "pending"

### 🔍 Logs para Debugging

Se algo der errado, verificar:

1. **Console do navegador** (F12):
   - Procurar por erros de rede
   - Verificar requisição para `/api/trpc/subscriptions.processPayment`

2. **Logs do servidor**:
   ```
   💳 Processando pagamento real: [email] - Plano [id] - R$ [valor]
   ✅ Pagamento criado no Mercado Pago: [paymentId] - Status: [status]
   ```

3. **Banco de dados**:
   - Tabela `users`: Novo usuário criado
   - Tabela `subscriptions`: Assinatura com `mercadoPagoId` preenchido

### ⚠️ Problemas Comuns

| Problema | Causa | Solução |
|----------|-------|---------|
| "Token de pagamento não gerado" | Payment Brick não carregou | Recarregar página |
| "Plano inválido" | planId incorreto | Verificar seleção de plano |
| "Erro ao processar pagamento" | Credenciais Mercado Pago vazias | Configurar `MERCADO_PAGO_ACCESS_TOKEN` |
| Sem redirecionamento após sucesso | Frontend não recebeu status "approved" | Verificar resposta do backend |
| Webhook não atualiza status | Webhook não registrado no Mercado Pago | Configurar URL: `https://[seu-dominio]/api/trpc/webhooks.mercadoPago` |

### 📋 Checklist de Validação

- [ ] Cartão aprovado: Redirecionamento para sucesso
- [ ] Cartão pendente: Mostra mensagem de processamento
- [ ] Cartão rejeitado: Mostra erro sem redirecionamento
- [ ] Usuário criado no banco de dados
- [ ] Assinatura criada com status correto
- [ ] E-mail de confirmação recebido
- [ ] Retry automático funciona (simular timeout)
- [ ] Admin mostra novo cliente
- [ ] Webhook atualiza status (aguardar 5 minutos)

### 🚀 Próximos Passos Após Validação

1. **Configurar webhook real** no painel Mercado Pago
2. **Implementar email de confirmação** com detalhes da assinatura
3. **Adicionar histórico de tentativas** no admin
4. **Testar com cartões reais** em ambiente de produção
