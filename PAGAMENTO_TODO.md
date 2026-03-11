# TODO - Correção Completa do Fluxo de Pagamento Mercado Pago

## FASE 1: Análise
- [ ] Mapear fluxo atual (frontend → backend → Mercado Pago)
- [ ] Identificar onde token real é perdido
- [ ] Verificar se API Mercado Pago está sendo chamada
- [ ] Validar persistência no banco

## FASE 2: Frontend
- [ ] Validar que Payment Brick gera token real
- [ ] Confirmar que token é enviado ao backend
- [ ] Remover qualquer sucesso falso antes de validação
- [ ] Implementar retry automático

## FASE 3: Backend
- [ ] Receber token real do frontend
- [ ] Chamar API Mercado Pago com token
- [ ] Validar resposta (approved/pending/rejected)
- [ ] Remover qualquer mock ou simulação
- [ ] Implementar tratamento de erros

## FASE 4: Persistência
- [ ] Salvar status real do Mercado Pago
- [ ] Criar usuário apenas se pagamento aprovado/pending
- [ ] Atualizar assinatura com status correto
- [ ] Implementar transações para rollback

## FASE 5: Webhook
- [ ] Implementar rota Express real
- [ ] Validar assinatura HMAC
- [ ] Processar notificações de pagamento
- [ ] Atualizar status na assinatura
- [ ] Implementar idempotência

## FASE 6: Testes
- [ ] Testar fluxo completo end-to-end
- [ ] Validar no painel Mercado Pago
- [ ] Confirmar webhook funcionando
- [ ] Documentar processo
