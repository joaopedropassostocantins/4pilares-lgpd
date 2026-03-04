# RELEASE CHECKLIST — FUSION SAJO
**Data alvo:** Após revalidação no Manus

---

## ✅ Pré-Deploy (código)

- [x] P0: `getFeedbackByDiagnosticId` corrigido (campo FK correto)
- [x] P0: `getDiagnosticsCount` corrigido (não usa `eq` como agregador)
- [x] P0: `BASE_PRICE` extraído como constante em `applyCoupon`
- [x] P1: Typo `hasCVWNote` → `hasCVVNote` corrigido
- [x] P1: Leitura `hasCVVNote` no `PostTastingQuestionnaire` corrigida
- [x] P1: Links `/cadastro` → `/` em todos os 6 módulos (A–F)
- [x] P1: Banner CVV 188 adicionado em `ModuloE.tsx`
- [x] QA_REPORT.md criado
- [x] IMPROVEMENTS.md criado

---

## ✅ Variáveis de Ambiente (verificar no Manus)

- [ ] `DATABASE_URL` — MySQL connection string ativa
- [ ] `MERCADOPAGO_ACCESS_TOKEN` — token de produção (não sandbox)
- [ ] `OPENAI_API_KEY` ou equivalente LLM — para geração de análises
- [ ] `MP_WEBHOOK_SECRET` — para validação de assinatura webhook (IMP-01)
- [ ] `SENDGRID_API_KEY` ou equivalente email
- [ ] `OWNER_OPEN_ID` — para rota admin

---

## ✅ Pré-Deploy (infra)

- [ ] Build `pnpm build` verde no Manus (sem erros TypeScript reais)
- [ ] Banco de dados com migrations `pnpm db:push` aplicadas
- [ ] Endpoint `/api/webhooks/mercadopago` configurado no painel Mercado Pago
- [ ] SSL ativo em pilaresdasabedoria.club
- [ ] Domínio resolvendo corretamente

---

## ✅ Testes pós-deploy (smoke test manual)

- [ ] Home carrega em < 3s
- [ ] Formulário 4 Pilares funciona e gera resultado
- [ ] Página `/resultado/:id` exibe análise gratuita
- [ ] PostTastingQuestionnaire aparece após análise
- [ ] Questionário Likert (32 perguntas) submete corretamente
- [ ] Hook é exibido com módulo correto após scoring
- [ ] CVV 188 aparece quando módulo E ou F é selecionado
- [ ] Botão "Pagar R$ 9,99" abre pagamento Mercado Pago
- [ ] Webhook de pagamento (teste com PIX sandbox) dispara análise completa
- [ ] Email de análise enviado após pagamento
- [ ] Páginas ModuloA–F: CTA leva à home corretamente
- [ ] ModuloE: banner CVV 188 visível
- [ ] Rota `/admin` protegida (retorna 401 para usuários sem auth)
- [ ] Rota inexistente retorna 404 gracioso

---

## ✅ Performance

- [ ] Lighthouse Score > 70 em Mobile (home)
- [ ] Web Vitals: LCP < 4s, CLS < 0.1

---

## 🚀 Go/No-Go

| Item | Status |
|------|--------|
| Todos P0/P1 corrigidos | ✅ |
| Build verde | ⏳ Confirmar no Manus |
| Smoke test completo | ⏳ Confirmar no Manus |
| Envs de produção | ⏳ Confirmar |

**DECISÃO:** GO após confirmação dos itens ⏳
