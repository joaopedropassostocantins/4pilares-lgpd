/*
 * useMasks.ts — 4 Pilares LGPD
 * Hooks para máscaras de entrada (CNPJ, CPF, CEP, telefone)
 */

export function useMasks() {
  const maskCNPJ = (value: string): string => {
    const digits = value.replace(/\D/g, "").substring(0, 14);
    if (digits.length <= 2) return digits;
    if (digits.length <= 5) return `${digits.slice(0, 2)}.${digits.slice(2)}`;
    if (digits.length <= 8) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`;
    if (digits.length <= 12) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8)}`;
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12)}`;
  };

  const maskCPF = (value: string): string => {
    const digits = value.replace(/\D/g, "").substring(0, 11);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
    if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
  };

  const maskCEP = (value: string): string => {
    const digits = value.replace(/\D/g, "").substring(0, 8);
    if (digits.length <= 5) return digits;
    return `${digits.slice(0, 5)}-${digits.slice(5)}`;
  };

  const maskTelefone = (value: string): string => {
    const digits = value.replace(/\D/g, "").substring(0, 11);
    if (digits.length <= 2) return digits;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  };

  const unmask = (value: string): string => {
    return value.replace(/\D/g, "");
  };

  const validarCNPJ = (cnpj: string): boolean => {
    const numbers = unmask(cnpj);
    if (numbers.length !== 14) return false;
    
    // Rejeitar CNPJs com todos os dígitos iguais
    if (/^(\d)\1{13}$/.test(numbers)) return false;
    
    // Rejeitar CNPJ 00.000.000/0001-91 (inválido)
    if (numbers === '00000000000191') return false;

    let size = numbers.length - 2;
    let numbers1 = numbers.substring(0, size);
    let digits = numbers.substring(size);
    let sum = 0;
    let pos = size - 7;

    for (let i = size; i >= 1; i--) {
      sum += parseInt(numbers1.charAt(size - i)) * pos--;
      if (pos < 2) pos = 9;
    }

    let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== parseInt(digits.charAt(0))) return false;

    size = size + 1;
    numbers1 = numbers.substring(0, size);
    sum = 0;
    pos = size - 7;

    for (let i = size; i >= 1; i--) {
      sum += parseInt(numbers1.charAt(size - i), 10) * pos--;
      if (pos < 2) pos = 9;
    }

    result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== parseInt(digits.charAt(1), 10)) return false;

    return true; // CNPJ válido
  };

  const validarCPF = (cpf: string): boolean => {
    const numbers = unmask(cpf);
    if (numbers.length !== 11) return false;
    
    // Rejeitar CPFs com todos os dígitos iguais (111.111.111-11, 000.000.000-00, etc)
    if (/^(\d)\1{10}$/.test(numbers)) return false;

    let sum = 0;
    let remainder;

    for (let i = 1; i <= 9; i++) {
      sum += parseInt(numbers.substring(i - 1, i), 10) * (11 - i);
    }

    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(numbers.substring(9, 10))) return false;

    sum = 0;
    for (let i = 1; i <= 10; i++) {
      sum += parseInt(numbers.substring(i - 1, i), 10) * (12 - i);
    }

    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(numbers.substring(10, 11))) return false;

    return true;
  };

  const validarEmail = (email: string): boolean => {
    // Regex RFC 5321 com TLD mínimo de 2 caracteres
    // Formato: local-part@domain.tld
    // TLD deve ter pelo menos 2 caracteres (ex: .com, .br, .edu.br)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
    // Verificar formato e comprimento máximo (RFC 5321)
    return emailRegex.test(email) && email.length <= 254;
  };

  return {
    maskCNPJ,
    maskCPF,
    maskCEP,
    maskTelefone,
    unmask,
    validarCNPJ,
    validarCPF,
    validarEmail,
  };
}

export async function buscarEnderecoPorCEP(cep: string) {
  const cleanCEP = cep.replace(/\D/g, "");
  if (cleanCEP.length !== 8) throw new Error("CEP inválido");

  const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`);
  const data = await response.json();

  if (data.erro) throw new Error("CEP não encontrado");

  return {
    endereco: data.logradouro,
    bairro: data.bairro,
    cidade: data.localidade,
    estado: data.uf,
  };
}
