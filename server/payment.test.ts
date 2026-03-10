import { describe, it, expect, beforeEach, vi } from "vitest";
import * as payment from "./payment";
import axios from "axios";

// Mock axios
vi.mock("axios");
const mockedAxios = axios as any;

describe("Mercado Pago Payment Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createMercadoPagoPreference", () => {
    it("deve criar uma preferência de pagamento", async () => {
      const mockResponse = {
        data: {
          id: "123456789",
          init_point: "https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=123456789",
        },
      };

      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const result = await payment.createMercadoPagoPreference({
        planId: "basico-anpd",
        planName: "Básico ANPD",
        priceMonthly: 150,
        razaoSocial: "Empresa Teste LTDA",
        cnpj: "12.345.678/0001-90",
        email: "teste@empresa.com",
        userId: 1,
      });

      expect(result.preferenceId).toBe("123456789");
      expect(result.initPoint).toContain("mercadopago.com.br");
      expect(result.externalReference).toContain("1-basico-anpd");
    });

    it("deve incluir notification_url na preferência", async () => {
      const mockResponse = {
        data: {
          id: "123456789",
          init_point: "https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=123456789",
        },
      };

      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      await payment.createMercadoPagoPreference({
        planId: "essencial",
        planName: "Essencial",
        priceMonthly: 997,
        razaoSocial: "Empresa Teste",
        cnpj: "12.345.678/0001-90",
        email: "teste@empresa.com",
        userId: 1,
      });

      const callArgs = mockedAxios.post.mock.calls[0];
      const preferenceData = callArgs[1];

      expect(preferenceData.notification_url).toBeDefined();
      expect(preferenceData.notification_url).toContain("/api/trpc/webhooks.mercadoPago");
    });

    it("deve incluir external_reference na preferência", async () => {
      const mockResponse = {
        data: {
          id: "123456789",
          init_point: "https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=123456789",
        },
      };

      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const result = await payment.createMercadoPagoPreference({
        planId: "profissional",
        planName: "Profissional",
        priceMonthly: 1997,
        razaoSocial: "Empresa Teste",
        cnpj: "12.345.678/0001-90",
        email: "teste@empresa.com",
        userId: 2,
      });

      const callArgs = mockedAxios.post.mock.calls[0];
      const preferenceData = callArgs[1];

      expect(preferenceData.external_reference).toBe(result.externalReference);
      expect(preferenceData.external_reference).toContain("2-profissional");
    });

    it("deve lançar erro se a API retornar erro", async () => {
      mockedAxios.post.mockRejectedValueOnce(new Error("API Error"));

      await expect(
        payment.createMercadoPagoPreference({
          planId: "empresarial",
          planName: "Empresarial",
          priceMonthly: 3997,
          razaoSocial: "Empresa Teste",
          cnpj: "12.345.678/0001-90",
          email: "teste@empresa.com",
          userId: 3,
        })
      ).rejects.toThrow();
    });
  });

  describe("getPaymentStatus", () => {
    it("deve retornar o status do pagamento", async () => {
      const mockResponse = {
        data: {
          id: 123456789,
          status: "approved",
          status_detail: "accredited",
          transaction_amount: 150,
          external_reference: "1-basico-anpd-1234567890",
        },
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await payment.getPaymentStatus("123456789");

      expect(result.id).toBe(123456789);
      expect(result.status).toBe("approved");
      expect(result.statusDetail).toBe("accredited");
      expect(result.amount).toBe(150);
    });

    it("deve retornar pending para pagamento pendente", async () => {
      const mockResponse = {
        data: {
          id: 987654321,
          status: "pending",
          status_detail: "pending_review",
          transaction_amount: 997,
          external_reference: "2-essencial-1234567890",
        },
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await payment.getPaymentStatus("987654321");

      expect(result.status).toBe("pending");
      expect(result.statusDetail).toBe("pending_review");
    });

    it("deve lançar erro se a API retornar erro", async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error("Payment not found"));

      await expect(payment.getPaymentStatus("invalid-id")).rejects.toThrow();
    });
  });

  describe("refundPayment", () => {
    it("deve processar reembolso", async () => {
      const mockResponse = {
        data: {
          id: 111222333,
          status: "refunded",
        },
      };

      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const result = await payment.refundPayment("123456789");

      expect(result.success).toBe(true);
      expect(result.refundId).toBe(111222333);
    });

    it("deve lançar erro se a API retornar erro", async () => {
      mockedAxios.post.mockRejectedValueOnce(new Error("Refund failed"));

      await expect(payment.refundPayment("invalid-id")).rejects.toThrow();
    });
  });

  describe("Fluxo Completo de Pagamento", () => {
    it("deve criar preferência, processar pagamento e atualizar status", async () => {
      // Step 1: Criar preferência
      const preferenceResponse = {
        data: {
          id: "pref_123456789",
          init_point: "https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=pref_123456789",
        },
      };

      mockedAxios.post.mockResolvedValueOnce(preferenceResponse);

      const preference = await payment.createMercadoPagoPreference({
        planId: "basico-anpd",
        planName: "Básico ANPD",
        priceMonthly: 150,
        razaoSocial: "Empresa Teste LTDA",
        cnpj: "12.345.678/0001-90",
        email: "teste@empresa.com",
        userId: 1,
      });

      expect(preference.preferenceId).toBe("pref_123456789");

      // Step 2: Simular pagamento aprovado
      const paymentResponse = {
        data: {
          id: 999888777,
          status: "approved",
          status_detail: "accredited",
          transaction_amount: 150,
          external_reference: preference.externalReference,
        },
      };

      mockedAxios.get.mockResolvedValueOnce(paymentResponse);

      const status = await payment.getPaymentStatus("999888777");

      expect(status.status).toBe("approved");
      expect(status.externalReference).toBe(preference.externalReference);
    });
  });
});
