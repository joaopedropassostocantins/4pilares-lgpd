# 🚀 Guia de Migração para PRODUÇÃO - Mercado Pago

## ⚠️ IMPORTANTE: PAGAMENTOS REAIS AGORA ATIVADOS

As credenciais foram migradas do ambiente de **SANDBOX (teste)** para **PRODUÇÃO (real)**. A partir de agora:

- ✅ **Pagamentos são REAIS**
- ✅ **Dinheiro será depositado na sua conta**
- ✅ **Clientes pagarão de verdade**
- ✅ **Não há mais simulações**

---

## ✅ Status da Migração

| Item | Status |
|------|--------|
| Public Key de Produção | ✅ Validada |
| Access Token de Produção | ✅ Validada |
| Conexão com API | ✅ Funcionando |
| Preferências de Pagamento | ✅ Criadas com sucesso |
| Payment Brick | ✅ Pronto para produção |
| Webhook | ✅ Configurado |

---

## 🔄 Fluxo de Pagamento em PRODUÇÃO

### 1. Cliente Acessa Checkout
```
https://4pilareslgpd.club/preco → "Contratar agora"
```

### 2. Preenche Dados da Empresa
- Razão Social
- CNPJ (será validado)
- E-mail

### 3. Payment Brick Carrega (REAL)
- Opções: **Pix**, Cartão de Crédito, Boleto
- Dados são enviados diretamente ao Mercado Pago
- **Nenhum dado sensível passa pelo seu servidor**

### 4. Cliente Completa Pagamento
- **Pix**: Escaneia QR Code ou copia código
- **Cartão**: Insere dados do cartão
- **Boleto**: Recebe código para pagar

### 5. Mercado Pago Processa
- Valida pagamento
- Envia webhook para seu servidor
- Status atualizado automaticamente

### 6. Assinatura Criada
- Status: `active` (se aprovado)
- Dashboard disponível em `/subscription`
- Cliente pode fazer upgrade/downgrade

---

## 💰 Fluxo de Dinheiro

```
Cliente paga via Pix/Cartão/Boleto
        ↓
Mercado Pago processa
        ↓
Webhook notifica seu servidor
        ↓
Assinatura criada/atualizada
        ↓
Dinheiro vai para sua conta Mercado Pago
        ↓
Você transfere para banco (via Mercado Pago)
```

---

## 📊 Monitorar Pagamentos

### Dashboard Mercado Pago
1. Acesse: https://www.mercadopago.com.br/
2. Faça login com suas credenciais
3. Vá para "Vendas" ou "Transações"
4. Veja todos os pagamentos em tempo real

### Webhook Logs
Verifique os logs do servidor:
```bash
tail -f .manus-logs/devserver.log | grep -i webhook
```

### Banco de Dados
Consulte a tabela `subscriptions`:
```sql
SELECT * FROM subscriptions WHERE status = 'active';
```

---

## 🛡️ Segurança em Produção

### ✅ Implementado
- [x] Payment Brick (PCI compliance automático)
- [x] HTTPS em todas as conexões
- [x] Validação de CNPJ/CPF
- [x] Webhook com assinatura verificada
- [x] Credenciais em variáveis de ambiente
- [x] Sem armazenamento de dados sensíveis

### ⚠️ Recomendações Adicionais
- [ ] Implementar rate limiting no checkout
- [ ] Adicionar CAPTCHA para prevenir abuso
- [ ] Monitorar fraudes com regras do Mercado Pago
- [ ] Fazer backup diário do banco de dados
- [ ] Configurar alertas de pagamento falho

---

## 📋 Checklist de Produção

### Antes de Lançar
- [ ] Testar fluxo completo com cartão real
- [ ] Testar Pix com QR Code real
- [ ] Testar Boleto
- [ ] Verificar se webhook está recebendo
- [ ] Confirmar que assinatura é criada
- [ ] Testar upgrade/downgrade
- [ ] Testar cancelamento
- [ ] Verificar histórico de pagamentos
- [ ] Testar notificações por e-mail (se implementado)

### Após Lançar
- [ ] Monitorar primeiros pagamentos
- [ ] Verificar logs de erro
- [ ] Confirmar depósitos na conta
- [ ] Responder dúvidas de clientes
- [ ] Acompanhar taxa de conversão

---

## 🚨 Possíveis Problemas

### Pagamento Recusado
**Causa**: Cartão inválido, saldo insuficiente, limite excedido
**Solução**: Cliente tenta outro cartão ou método

### Webhook Não Recebido
**Causa**: Firewall bloqueando, URL incorreta, servidor offline
**Solução**: Verificar logs, reconfigurar webhook no Mercado Pago

### Assinatura Não Criada
**Causa**: Erro no banco de dados, validação falhou
**Solução**: Verificar logs do servidor, contatar suporte

### Crédito Calculado Errado
**Causa**: Data de próxima cobrança incorreta
**Solução**: Verificar lógica em `server/routers.ts`

---

## 💳 Dados de Teste em PRODUÇÃO

**NÃO USE dados de teste em produção!**

Se precisar testar:
1. Use sua própria conta Mercado Pago
2. Ou use cartão de crédito real
3. Ou use Pix real

---

## 📞 Suporte

### Problemas Técnicos
- Verifique logs: `.manus-logs/devserver.log`
- Teste endpoints manualmente
- Verifique credenciais no painel Mercado Pago

### Problemas de Pagamento
- Acesse dashboard Mercado Pago
- Verifique status da transação
- Contate suporte Mercado Pago

---

## 🎯 Próximos Passos

1. **Testar com Pagamento Real** - Faça um pagamento de teste com seu cartão
2. **Monitorar Primeiros Pagamentos** - Acompanhe os primeiros clientes
3. **Implementar Notificações** - Enviar e-mails de confirmação
4. **Adicionar Recibos** - Permitir download de recibos em PDF
5. **Análise de Dados** - Gráficos de receita, clientes, etc.

---

## ✅ Confirmação de Migração

- ✅ Credenciais de produção inseridas
- ✅ Testes de validação passaram
- ✅ Servidor reiniciado
- ✅ Payment Brick pronto
- ✅ Webhook configurado
- ✅ Dashboard funcional
- ✅ Histórico de pagamentos ativo
- ✅ Upgrade/downgrade com créditos

**Status**: 🟢 PRONTO PARA PRODUÇÃO

---

**Última atualização**: 11/03/2026 22:16
**Ambiente**: PRODUÇÃO (Pagamentos Reais)
