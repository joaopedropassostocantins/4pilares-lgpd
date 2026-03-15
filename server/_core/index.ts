import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { validateWebhookSignature, processarWebhookMercadoPago } from "../webhooks";
import stripeWebhookRouter from "../webhooks/stripe";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);

  // Mercado Pago webhook — com validação de assinatura HMAC
  app.post("/api/webhooks/mercadopago", express.raw({ type: "application/json" }), async (req, res) => {
    try {
      const xSignature = req.headers["x-signature"] as string;
      const xRequestId = req.headers["x-request-id"] as string;
      const body = req.body instanceof Buffer ? req.body.toString() : JSON.stringify(req.body);

      console.log("[Webhook] Mercado Pago recebido — signature:", xSignature ? "presente" : "ausente");

      if (!xSignature || !xRequestId) {
        console.error("[Webhook] Headers de segurança ausentes");
        return res.status(400).json({ error: "Headers de segurança ausentes" });
      }

      const isValid = validateWebhookSignature(body, xSignature, xRequestId);
      if (!isValid) {
        console.error("[Webhook] Assinatura HMAC inválida");
        return res.status(401).json({ error: "Assinatura inválida" });
      }

      let data: unknown;
      try {
        data = JSON.parse(body);
      } catch {
        return res.status(400).json({ error: "JSON inválido" });
      }

      await processarWebhookMercadoPago({ ...(data as object), requestId: xRequestId });
      res.status(200).json({ success: true });
    } catch (error) {
      console.error("[Webhook] Erro ao processar evento:", error);
      res.status(500).json({ error: "Erro interno" });
    }
  });

  // Stripe webhook
  app.use("/api/webhooks", stripeWebhookRouter);

  // ─── Tracking de eventos de UI (banner, CTAs) ─────────────────────────────
  app.post("/api/events", (req, res) => {
    const { type, meta } = req.body || {};
    if (type) {
      console.log(`[Event] ${type}`, meta || {});
    }
    res.status(200).json({ ok: true });
  });

  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  console.log("[Server] Starting on port", preferredPort);
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
