import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, json, decimal } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  password: varchar("password", { length: 255 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Tabela de Degustação (Trial/Demo)
 * Armazena informações básicas da empresa e demandas de conformidade
 */
export const tastings = mysqlTable("tastings", {
  id: int("id").autoincrement().primaryKey(),
  
  // Identificação
  userId: int("user_id"),
  email: varchar("email", { length: 320 }).notNull(),
  
  // Informações da Empresa
  razaoSocial: varchar("razao_social", { length: 255 }).notNull(),
  cnpj: varchar("cnpj", { length: 18 }).notNull().unique(),
  segmento: varchar("segmento", { length: 100 }),
  tamanho: mysqlEnum("tamanho", ["micro", "pequena", "media", "grande", "multinacional"]),
  
  // Localização
  cep: varchar("cep", { length: 9 }),
  estado: varchar("estado", { length: 2 }),
  cidade: varchar("cidade", { length: 100 }),
  
  // Contato
  responsavel: varchar("responsavel", { length: 255 }),
  cargo: varchar("cargo", { length: 100 }),
  telefone: varchar("telefone", { length: 20 }),
  
  // Demandas (JSON array)
  demandas: json("demandas").$type<string[]>(),
  
  // Riscos identificados (JSON array)
  riscos: json("riscos").$type<string[]>(),
  
  // Status de conformidade por pilar (0-100%)
  statusLei: int("status_lei").notNull(),
  statusRegras: int("status_regras").notNull(),
  statusConformidade: int("status_conformidade").notNull(),
  statusTitular: int("status_titular").notNull(),
  
  // Observações
  observacoes: text("observacoes"),
  
  // Status
  status: mysqlEnum("status", ["draft", "submitted", "converted", "expired"]).default("draft"),
  
  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  submittedAt: timestamp("submitted_at"),
});

export type Tasting = typeof tastings.$inferSelect;
export type InsertTasting = typeof tastings.$inferInsert;

/**
 * Tabela de Assinaturas
 * Rastreia planos ativos, datas de renovação e status de pagamento
 */
export const subscriptions = mysqlTable("subscriptions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  
  // Plano
  planId: varchar("plan_id", { length: 64 }).notNull(),
  planName: varchar("plan_name", { length: 100 }).notNull(),
  
  // Preço
  priceMonthly: decimal("price_monthly", { precision: 10, scale: 2 }).notNull(),
  discount: decimal("discount", { precision: 5, scale: 2 }),
  
  // Empresa
  razaoSocial: varchar("razao_social", { length: 255 }).notNull(),
  cnpj: varchar("cnpj", { length: 18 }).notNull(),
  
  // Mercado Pago
  mercadoPagoId: varchar("mercado_pago_id", { length: 255 }),
  paymentStatus: mysqlEnum("payment_status", ["pending", "approved", "failed", "cancelled"]).default("pending"),
  
  // Status
  status: mysqlEnum("status", ["active", "cancelled", "suspended", "expired"]).default("active"),
  
  // Datas
  startDate: timestamp("start_date").notNull(),
  nextBillingDate: timestamp("next_billing_date"),
  endDate: timestamp("end_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = typeof subscriptions.$inferInsert;

/**
 * Tabela de Documentos
 * Armazena documentos gerados para cada cliente (políticas, contratos, etc)
 */
export const documents = mysqlTable("documents", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  
  // Identificação
  type: mysqlEnum("type", ["politica", "termos", "ripd", "ropa", "dpa", "procuracao"]),
  title: varchar("title", { length: 255 }).notNull(),
  
  // Armazenamento
  fileUrl: varchar("file_url", { length: 500 }),
  fileKey: varchar("file_key", { length: 255 }),
  
  // Status
  status: mysqlEnum("status", ["draft", "pending_review", "approved", "signed"]).default("draft"),
  
  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type Document = typeof documents.$inferSelect;
export type InsertDocument = typeof documents.$inferInsert;

/**
 * Tabela de Eventos de Webhook
 * Armazena IDs de webhooks já processados para evitar duplicação
 */
export const webhookEvents = mysqlTable("webhook_events", {
  id: int("id").autoincrement().primaryKey(),
  
  // Identificação do evento
  requestId: varchar("request_id", { length: 255 }).notNull().unique(),
  paymentId: varchar("payment_id", { length: 255 }).notNull(),
  
  // Tipo de evento
  eventType: varchar("event_type", { length: 50 }).notNull(), // "payment.created", "payment.updated", etc
  
  // Status
  status: mysqlEnum("status", ["pending", "processed", "failed"]).default("pending"),
  
  // Dados do evento
  eventData: json("event_data"),
  
  // Resultado do processamento
  result: text("result"),
  error: text("error"),
  
  // Timestamps
  receivedAt: timestamp("received_at").defaultNow().notNull(),
  processedAt: timestamp("processed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type WebhookEvent = typeof webhookEvents.$inferSelect;
export type InsertWebhookEvent = typeof webhookEvents.$inferInsert;