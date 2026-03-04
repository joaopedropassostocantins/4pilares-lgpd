# IMPROVEMENTS — FUSION SAJO
**Pós-lançamento — Priorizadas por impacto**

---

## 🔴 Segurança (implementar imediatamente após lançamento)

### IMP-01: Validação de assinatura webhook Mercado Pago
**Impacto:** Crítico — sem isso qualquer pessoa pode forçar análise sem pagar  
**Como implementar:**
```ts
// server/_core/index.ts — no handler do webhook MP
import crypto from 'crypto';
const signature = req.headers['x-signature'];
const expectedSig = crypto
  .createHmac('sha256', process.env.MP_WEBHOOK_SECRET!)
  .update(JSON.stringify(req.body))
  .digest('hex');
if (signature !== expectedSig) return res.status(401).json({ error: 'Invalid signature' });
```

### IMP-02: Rate limiting nas rotas tRPC
**Impacto:** Alto — previne abuso de API e brute-force  
**Como:** `npm install express-rate-limit` + middleware antes do `/api/trpc`

---

## 🟡 UX / Conversão (implementar em 1–2 semanas)

### IMP-03: Scroll automático ao formulário nos módulos
**Atual:** CTA vai para `/` (home do topo)  
**Melhoria:** Usar `/?scroll=form` e scroll suave para `#formulario`

### IMP-04: Texto "Acesso liberado por demanda" é confuso
**Módulos B, C, D, F:** O texto implica que o módulo não existe ainda  
**Melhoria:** Substituir por "Análise disponível — comece agora" quando módulo ativo

### IMP-05: Meta tags SEO nas páginas de módulos
**Atual:** Sem `<meta name="description">` específico por módulo  
**Impacto:** Afeta ranqueamento orgânico e preview em redes sociais

### IMP-06: Loading skeleton no PostTastingQuestionnaire
**Atual:** Transição abrupta ao submeter questionário  
**Melhoria:** Adicionar skeleton/spinner enquanto aplica scoring

### IMP-07: Progresso visual no questionário Likert
**Atual:** 32 perguntas sem indicador de progresso  
**Melhoria:** Barra de progresso "Pergunta X de 32"

---

## 🟢 A/B Tests (implementar após 100 conversões)

### AB-01: Hook dramático vs racional
**Hipótese:** Hook dramático converte melhor em módulos E e F  
**Como:** Feature flag por `Math.random() < 0.5`, logar evento `ab_hook_type`

### AB-02: CTA "FAZER MINHA ANÁLISE" vs "VER MEU DIAGNÓSTICO GRÁTIS"
**Hipótese:** "Grátis" na CTA aumenta CTR nas páginas de módulos

### AB-03: Questionnaire antes vs depois da análise gratuita
**Hipótese:** Questionnaire antes aumenta engajamento pois user ainda está "aquecido"

---

## 🔵 Técnico (backlog)

### IMP-08: Migrar `getDiagnosticsCount` para query SQL de COUNT(*)
**Atual:** Busca todos os registros e conta no JS (ineficiente com muitos registros)  
**Quick win:** `SELECT COUNT(*) FROM diagnostics`

### IMP-09: Adicionar índice em `diagnostics.paymentId`
**Atual:** Webhook faz full scan para encontrar diagnostic por paymentId  
**Fix:** `CREATE INDEX idx_payment_id ON diagnostics(paymentId)`

### IMP-10: Timeout/retry na invocação LLM
**Atual:** `invokeLLM()` sem timeout — pode travar o webhook indefinidamente  
**Fix:** Wrapper com `Promise.race([invokeLLM(...), delay(30000)])`

### IMP-11: Persistir respostas do PostTastingQuestionnaire no banco
**Atual:** Respostas descartadas após exibir hook  
**Valor:** Analytics para melhorar scoring e personalizar módulos

### IMP-12: Webhook de fallback para email quando pagamento aprovado mas WhatsApp falha
**Atual:** WhatsApp falha silenciosamente se número inválido  
**Fix:** Retry de email com template de fallback
