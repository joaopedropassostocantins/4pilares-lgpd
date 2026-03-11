import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";

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
  // Webhook Mercado Pago (ANTES do tRPC para ter acesso aos headers)
  app.post("/api/webhooks/mercadopago", express.raw({ type: "application/json" }), async (req, res) => {
    try {
      const xSignature = req.headers["x-signature"] as string;
      const xRequestId = req.headers["x-request-id"] as string;
      const body = req.body instanceof Buffer ? req.body.toString() : JSON.stringify(req.body);

      console.log("📩 Webhook Mercado Pago recebido");
      console.log("🔐 x-signature:", xSignature ? "✅ Presente" : "❌ Ausente");
      console.log("🔐 x-request-id:", xRequestId ? "✅ Presente" : "❌ Ausente");

      // Validar assinatura HMAC
      if (!xSignature || !xRequestId) {
        console.error("❌ Headers de segurança ausentes");
        return res.status(400).json({ error: "Headers ausentes" });
      }

      const { validateWebhookSignature } = await import("../webhooks.js");
      console.log("🔍 Validando assinatura HMAC...");
      const isValid = validateWebhookSignature(body, xSignature, xRequestId);

      if (!isValid) {
        console.error("❌ Assinatura HMAC inválida - webhook forjado?");
        return res.status(401).json({ error: "Assinatura inválida" });
      }

      console.log("✅ Assinatura HMAC validada com sucesso");

      // Parse do body
      let data;
      try {
        data = JSON.parse(body);
      } catch (e) {
        console.error("❌ Erro ao fazer parse do JSON:", e);
        return res.status(400).json({ error: "JSON inválido" });
      }
      const { processarWebhookMercadoPago } = await import("../webhooks.js");
      console.log("📊 Dados do webhook:", data);
      const result = await processarWebhookMercadoPago({
        ...data,
        requestId: xRequestId,
      });

      res.status(200).json(result);
    } catch (error) {
      console.error("❌ Erro ao processar webhook:", error);
      res.status(500).json({ error: "Erro ao processar webhook" });
    }
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
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
