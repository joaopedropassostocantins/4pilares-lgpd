# Configuração de Rastreamento de Conversão

Este documento descreve como configurar os pixels de rastreamento do Google Ads e Meta Ads para otimizar sua campanha de R$ 800.

## 1. Google Ads Conversion Tracking

### Passo 1: Obter seu Google Ads ID
1. Acesse [Google Ads](https://ads.google.com)
2. Clique em "Ferramentas" → "Conversões"
3. Copie seu **Google Ads Account ID** (formato: AW-XXXXXXXXXX)

### Passo 2: Configurar Conversão
1. Clique em "+ Conversão"
2. Selecione "Website"
3. Nome da conversão: "Análise SAJO Criada"
4. Valor da conversão: 0 (será rastreado dinamicamente)
5. Copie o **ID de conversão** (formato: AW-XXXXXXXXXX/XXXXXXXXXX)

### Passo 3: Atualizar arquivo `client/index.html`
Substitua `AW-XXXXXXXXXX` pelos seus IDs:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=AW-XXXXXXXXXX"></script>
<script>
  gtag('config', 'AW-XXXXXXXXXX');
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### Passo 4: Rastreamento de Eventos
Os eventos são rastreados automaticamente em `client/src/pages/Ads.tsx`:
- **view_item**: Quando usuário vê análise de degustação
- **add_to_cart**: Quando clica em "Desbloquear"
- **purchase**: Quando pagamento é confirmado

## 2. Meta Pixel (Facebook Ads)

### Passo 1: Criar Meta Pixel
1. Acesse [Meta Business Suite](https://business.facebook.com)
2. Vá para "Dados" → "Pixels"
3. Clique em "+ Criar"
4. Nome: "FUSION-SAJO"
5. Copie o **Pixel ID** (formato: XXXXXXXXXX)

### Passo 2: Atualizar arquivo `client/index.html`
Substitua `XXXXXXXXXX` pelo seu Pixel ID:
```html
<script>
  fbq('init', 'XXXXXXXXXX');
  fbq('track', 'PageView');
</script>
<noscript><img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=XXXXXXXXXX&ev=PageView&noscript=1" /></noscript>
```

### Passo 3: Configurar Eventos
Os eventos são rastreados automaticamente em `client/src/pages/Ads.tsx`:
- **ViewContent**: Quando usuário vê análise de degustação
- **AddToCart**: Quando clica em "Desbloquear"
- **Purchase**: Quando pagamento é confirmado

## 3. Eventos Rastreados

### ViewContent (Análise de Degustação)
```javascript
fbq('track', 'ViewContent', {
  content_id: 'diagnostic_id',
  content_name: 'Análise SAJO',
  content_type: 'product',
  value: 0,
  currency: 'BRL'
});
```

### Purchase (Pagamento Confirmado)
```javascript
fbq('track', 'Purchase', {
  value: 14.99,
  currency: 'BRL',
  content_id: 'diagnostic_id',
  content_name: 'Análise Completa SAJO'
});
```

## 4. Otimizações Recomendadas

### Para Google Ads:
1. **Bid Strategy**: Use "Maximize Conversions" ou "Target CPA" (R$ 5-7 por conversão)
2. **Keywords**: Foque em "astrologia coreana", "saju análise", "4 pilares destino"
3. **Audience**: Mulheres 25-40 anos, interesse em astrologia/bem-estar
4. **Landing Page**: Use `/ads` para melhor conversão

### Para Meta Ads:
1. **Audience**: Mulheres 25-40 anos, interesse em astrologia/autoconhecimento
2. **Campaign Objective**: "Conversões" (rastreadas via pixel)
3. **Bid Strategy**: "Lowest Cost" com limite de custo por resultado
4. **Creative**: Use imagens dos 4 Pilares, depoimentos, promoção R$ 9,99

## 5. Monitoramento

### Google Ads:
- Vá para "Ferramentas" → "Conversões"
- Verifique "Conversões registradas" em tempo real
- Monitore "Custo por conversão" (meta: < R$ 10)

### Meta Ads:
- Vá para "Gerenciador de Anúncios"
- Verifique "Eventos de Conversão" na coluna de resultados
- Monitore "Custo por Resultado" (meta: < R$ 10)

## 6. Troubleshooting

### Google Ads não registra conversões:
1. Verifique se o ID está correto em `index.html`
2. Abra DevTools (F12) → Console
3. Digite: `gtag('event', 'view_item')` e verifique se aparece em Google Ads em 5 minutos

### Meta Pixel não registra eventos:
1. Verifique se o Pixel ID está correto
2. Use [Meta Pixel Helper](https://www.facebook.com/business/tools/meta-pixel-helper) (extensão Chrome)
3. Verifique se os eventos aparecem na extensão

## 7. ROI Esperado

Com R$ 800 de orçamento:
- **CPC esperado**: R$ 1,50-2,50
- **CTR esperado**: 3-5%
- **Conversão esperada**: 2-3% (80-120 diagnósticos)
- **Pagamentos esperados**: 30-50 (com 40% de conversão)
- **Receita esperada**: R$ 450-750 (com R$ 9,99 de preço)
- **ROI**: 56-94% (breakeven em R$ 425)

## 8. Próximos Passos

1. Configure os IDs de rastreamento em `client/index.html`
2. Teste os pixels com Meta Pixel Helper e Google Tag Assistant
3. Lance a campanha com orçamento diário de R$ 50
4. Monitore conversões por 3-5 dias
5. Otimize baseado em dados (aumentar budget para keywords com melhor ROI)
