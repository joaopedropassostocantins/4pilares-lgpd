# RELEASE CHECKLIST — FUSION SAJO
**Versão:** 1.0.x | **Data:** 2026-03-04 | **Responsável:** Manus + Antigravity

---

## ✅ Código / Build

- [x] Todos os P0/P1 corrigidos (ver QA_REPORT.md)
- [x] schema.ts alinhado com migrações
- [x] Formulário de 4 Pilares funciona (submit → resultado)
- [x] Análise de degustação gerada pelo LLM e salva no banco
- [x] Banner de módulos visível em todas as páginas
- [x] Âncora `#modulos` funcional no Home

---

## 🔑 Variáveis de Ambiente (configurar no Manus/servidor)

| Var | Descrição | Status |
|-----|-----------|--------|
| `DATABASE_URL` | MySQL/PlanetScale connection string | ✅ Configurada |
| `MERCADOPAGO_ACCESS_TOKEN` | Token de produção MP | ❓ Confirmar |
| `OPENAI_API_KEY` ou equiv. | LLM para análises | ❓ Confirmar |
| `MP_WEBHOOK_SECRET` | Assinatura webhook MP (opcional mas recomendado) | ⚠️ Não configurado |
| `WHATSAPP_NUMBER` | Número WhatsApp da consultora | ⚠️ Configurar no banner |

---

## 🔗 Webhook Mercado Pago

- [ ] URL configurada no painel MP: `https://pilaresdasabedoria.club/api/webhooks/mercadopago`
- [ ] Evento selecionado: `payment` (tipo: `payment.updated`)
- [ ] Teste com pagamento sandbox realizado ✓ ver logs `[Webhook]`
- [ ] Validação de assinatura implementada (IMP-01)

---

## 💳 Teste de Pagamento Real

- [ ] Criar diagnóstico de teste: nome "Teste QA", data 01/01/1990
- [ ] Fluxo: formulário → análise degustação → "Desbloquear" → Mercado Pago
- [ ] Pagamento aprovado → webhook recebido → `paymentStatus: "paid"` no banco
- [ ] Análise completa gerada e visível em `/resultado/{publicId}`
- [ ] Email enviado com análise
- [ ] Notificação de owner recebida

---

## 📊 Módulos + Checkout

- [ ] 6 módulos listados na Home com cores Obangsaek
- [ ] Botão "Desbloquear R$ 14,99" em cada módulo
- [ ] Página `/checkout/{slug}` carrega para cada módulo
- [ ] `createModulePayment` retorna preferenceId válido

---

## 🛡️ Segurança

- [ ] Tokens de API não expostos no bundle do cliente (verificar build)
- [ ] CORS configurado adequadamente
- [ ] Webhook MP com validação de assinatura (IMP-01 — urgente)
- [ ] Rate limit básico em endpoints (IMP-02)

---

## 📈 Métricas / Observabilidade

- [ ] Logs `[Event]` funcionam para `banner_view`, `banner_click_*`, `banner_close`
- [ ] Log `[Analytics]` ao criar diagnóstico
- [ ] Log `[Webhook]` ao processar pagamento
- [ ] Admin dashboard em `/admin` carrega lista de diagnósticos

---

## ⚖️ LGPD / Legal

- [ ] Política de Privacidade acessível (link no footer/formulário)
- [ ] Campos PII (email, whatsapp) coletados com consentimento
- [ ] Dados não logados em texto puro desnecessariamente

---

## 🔖 Go/No-Go Final

| Item | Status |
|------|--------|
| Build sem erros críticos | ✅ |
| Análise de degustação funcionando | ✅ |
| Módulos listados com cores | ✅ |
| Banner de promoção visível | ✅ |
| Pagamento MP configurado | ❓ Confirmar produção |
| Webhook MP testado end-to-end | ❓ Aguarda teste real |

**Status:** 🟡 PRONTO PARA DEPLOY — Aguarda confirmação de variáveis e teste de pagamento real
