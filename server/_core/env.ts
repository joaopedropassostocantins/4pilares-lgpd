export const ENV = {
  appId: process.env.VITE_APP_ID ?? "",
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? "",
  mercadoPagoAccessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN ?? "",
  // Chave pública do MP — usada tanto pelo frontend (via rota /api/trpc/payments.getPublicKey)
  // quanto pelo servidor para inicializar o SDK se necessário.
  // Variável: MERCADO_PAGO_PUBLIC_KEY (sem prefixo VITE_, pois é lida pelo servidor)
  mercadoPagoPublicKey: process.env.MERCADO_PAGO_PUBLIC_KEY ?? "",
  // Secret para validar assinatura HMAC dos webhooks — OBRIGATÓRIO em produção
  mercadoPagoWebhookSecret: process.env.MERCADO_PAGO_WEBHOOK_SECRET ?? "",
  mercadoPagoClientId: process.env.MERCADO_PAGO_CLIENT_ID ?? "",
  mercadoPagoClientSecret: process.env.MERCADO_PAGO_CLIENT_SECRET ?? "",
  stripeSecretKey: process.env.STRIPE_SECRET_KEY ?? "",
  stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY ?? "",
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET ?? "",
  // URL base da aplicação — usada para montar notification_url e back_urls do MP
  appUrl: process.env.APP_URL ?? "",
};

// Alertas de configuração crítica (não lança erro para não bloquear desenvolvimento)
if (!ENV.mercadoPagoWebhookSecret) {
  console.warn(
    "[ENV] ⚠️  MERCADO_PAGO_WEBHOOK_SECRET não configurado — validação de webhooks desabilitada!"
  );
}
if (!ENV.mercadoPagoPublicKey) {
  console.warn("[ENV] ⚠️  MERCADO_PAGO_PUBLIC_KEY não configurado — Payment Brick não funcionará.");
}
if (!ENV.appUrl) {
  console.warn("[ENV] ⚠️  APP_URL não configurado — URLs de retorno do MP usarão fallback.");
}
