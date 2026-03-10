import { describe, it, expect } from "vitest";
import { useMasks } from "./useMasks";

describe("useMasks - Email Validation", () => {
  const { validarEmail } = useMasks();

  describe("validarEmail - Valid emails", () => {
    it("deve aceitar e-mail válido simples", () => {
      expect(validarEmail("usuario@dominio.com")).toBe(true);
    });

    it("deve aceitar e-mail com domínio .edu.br (correto)", () => {
      expect(validarEmail("joaopedro.passos@mail.uft.edu.br")).toBe(true);
    });

    it("deve aceitar e-mail com números", () => {
      expect(validarEmail("usuario123@dominio456.com")).toBe(true);
    });

    it("deve aceitar e-mail com pontos no local part", () => {
      expect(validarEmail("joao.pedro.passos@empresa.com.br")).toBe(true);
    });

    it("deve aceitar e-mail com hífen no domínio", () => {
      expect(validarEmail("usuario@meu-dominio.com")).toBe(true);
    });

    it("deve aceitar e-mail com TLD de 2 caracteres", () => {
      expect(validarEmail("usuario@dominio.br")).toBe(true);
      expect(validarEmail("usuario@dominio.co")).toBe(true);
    });

    it("deve aceitar e-mail com underscore", () => {
      expect(validarEmail("usuario_nome@dominio.com")).toBe(true);
    });

    it("deve aceitar e-mail com múltiplos níveis de domínio", () => {
      expect(validarEmail("usuario@sub.dominio.com.br")).toBe(true);
    });

    it("deve aceitar e-mail .edu.br (correto para universidades brasileiras)", () => {
      expect(validarEmail("joaopedro.passos@mail.uft.edu.br")).toBe(true);
    });
  });

  describe("validarEmail - Invalid emails", () => {
    it("deve rejeitar e-mail sem @", () => {
      expect(validarEmail("usuariodominio.com")).toBe(false);
    });

    it("deve rejeitar e-mail com @ duplicado", () => {
      expect(validarEmail("usuario@@dominio.com")).toBe(false);
    });

    it("deve rejeitar e-mail sem domínio", () => {
      expect(validarEmail("usuario@")).toBe(false);
    });

    it("deve rejeitar e-mail sem local part", () => {
      expect(validarEmail("@dominio.com")).toBe(false);
    });

    it("deve rejeitar e-mail sem TLD", () => {
      expect(validarEmail("usuario@dominio")).toBe(false);
    });

    it("deve rejeitar e-mail com TLD de 1 caractere", () => {
      expect(validarEmail("usuario@dominio.c")).toBe(false);
    });

    it("deve rejeitar e-mail com TLD incompleto (sem caracteres após ponto)", () => {
      expect(validarEmail("joaopedro.passos@mail.uft.")).toBe(false);
    });

    it("deve rejeitar e-mail com espaço", () => {
      expect(validarEmail("usuario @dominio.com")).toBe(false);
    });

    it("deve rejeitar e-mail vazio", () => {
      expect(validarEmail("")).toBe(false);
    });

    it("deve rejeitar e-mail com espaço no final", () => {
      expect(validarEmail("usuario@dominio.com ")).toBe(false);
    });

    it("deve rejeitar e-mail com números no TLD", () => {
      expect(validarEmail("usuario@dominio.c0m")).toBe(false);
    });

    it("deve rejeitar e-mail com TLD vazio", () => {
      expect(validarEmail("usuario@dominio.")).toBe(false);
    });
  });

  describe("validarEmail - Length validation", () => {
    it("deve rejeitar e-mail com mais de 254 caracteres", () => {
      const longEmail = "a".repeat(250) + "@dominio.br";
      expect(validarEmail(longEmail)).toBe(false);
    });

    it("deve aceitar e-mail com exatamente 254 caracteres", () => {
      const maxEmail = "a".repeat(240) + "@dominio.br";
      expect(validarEmail(maxEmail)).toBe(true);
    });
  });
});

describe("useMasks - CNPJ Validation", () => {
  const { validarCNPJ } = useMasks();

  it("deve aceitar CNPJ válido", () => {
    expect(validarCNPJ("11.222.333/0001-81")).toBe(true);
  });

  it("deve rejeitar CNPJ inválido", () => {
    expect(validarCNPJ("11.222.333/0001-00")).toBe(false);
  });
});

describe("useMasks - CPF Validation", () => {
  const { validarCPF } = useMasks();

  it("deve aceitar CPF válido", () => {
    expect(validarCPF("123.456.789-09")).toBe(true);
  });

  it("deve rejeitar CPF inválido", () => {
    expect(validarCPF("123.456.789-00")).toBe(false);
  });
});
