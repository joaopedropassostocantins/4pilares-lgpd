# IMPROVEMENTS — FUSION SAJO (Atualizado pós-QA)
**Priorizadas por Impacto × Esforço**

---

## 🔴 Segurança (implementar imediatamente após lançamento)

### IMP-01: Validação de assinatura webhook Mercado Pago ⚠️ URGENTE
**Risco:** Qualquer pessoa pode enviar POST para `/api/webhooks/mercadopago` e forçar análise sem pagar
```ts
// server/_core/index.ts
import crypto from 'crypto';
const signature = req.headers['x-signature'];
const expectedSig = crypto.createHmac('sha256', process.env.MP_WEBHOOK_SECRET!)
  .update(JSON.stringify(req.body)).digest('hex');
if (signature !== expectedSig) return res.status(401).json({ error: 'Invalid signature' });
```

### IMP-02: Rate limiting nas rotas tRPC
**Como:** `npm install express-rate-limit` + middleware antes do `/api/trpc`
```ts
import rateLimit from 'express-rate-limit';
app.use('/api/trpc', rateLimit({ windowMs: 60000, max: 30 }));
```

---

## 🟡 UX / Conversão

### IMP-03: Configurar número WhatsApp real no banner
**Arquivo:** `client/src/components/TopPromoBanner.tsx` linha 12
**Ação:** Substituir `"5511999999999"` pelo número real da consultora

### IMP-04: Scroll automático ao formulário após CTA nos módulos
**Atual:** CTA vai para `/` (home do topo)
**Melhoria:** `/?scroll=formulario` + scroll suave para `#formulario`

### IMP-05: Texto "Acesso liberado por demanda" confuso nos módulos B,C,D,F
**Melhoria:** Substituir por "Análise disponível — comece agora"

### IMP-06: Meta tags SEO por página de módulo
```html
<title>Oráculo dos Investimentos | SAJO</title>
<meta name="description" content="...">
<meta property="og:image" content="...">
```

### IMP-07: Template de "resultado não encontrado" mais amigável
**Atual:** "Diagnóstico não encontrado" sem contexto
**Melhoria:** Link claro + sugestão de refazer análise

---

## 🟢 Testes A/B (após 100 conversões)

### AB-01: Hook dramático vs racional (módulos E e F)
### AB-02: CTA "FAZER MINHA ANÁLISE" vs "VER MEU DIAGNÓSTICO GRÁTIS"
### AB-03: Questionário antes vs depois da análise gratuita
### AB-04: Preço exibido como "R$ 14,99" vs "6x de R$ 2,50"
### AB-05: Banner com contagem regressiva vs "Vagas limitadas"

---

## 🔵 Técnico (backlog)

### IMP-08: COUNT(*) SQL em vez de busca completa em `getDiagnosticsCount`
### IMP-09: Índice em `diagnostics.paymentId` para webhook mais rápido
### IMP-10: Timeout/retry na invocação LLM (max 30s com retry)
```ts
const withTimeout = (p: Promise<any>, ms: number) =>
  Promise.race([p, new Promise((_, r) => setTimeout(() => r(new Error('timeout')), ms))]);
```
### IMP-11: Persistir respostas do PostTastingQuestionnaire no banco
### IMP-12: Fallback email quando WhatsApp falha silenciosamente
### IMP-13: Adicionar campo `lastAccessAt` em diagnostics para expirar acesso
### IMP-14: Logs estruturados (JSON) em vez de console.log puro
### IMP-15: Cache de análise LLM por publicId (evitar reprocessamento)
