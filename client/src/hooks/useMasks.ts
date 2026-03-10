/*
 * useMasks.ts — 4 Pilares LGPD
 * Hooks para máscaras de entrada (CNPJ, CPF, CEP, telefone)
 */

export function useMasks() {
  const maskCNPJ = (value: string): string => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1/$2")
      .replace(/(\d{4})(\d)/, "$1-$2")
      .substring(0, 18);
  };

  const maskCPF = (value: string): string => {
    const digits = value.replace(/\D/g, "").substring(0, 11);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
    if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`;
  };

  const maskCEP = (value: string): string => {
    return value.replace(/\D/g, "").replace(/(\d{5})(\d)/, "$1-$2").substring(0, 9);
  };

  const maskTelefone = (value: string): string => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .substring(0, 15);
  };

  const unmask = (value: string): string => {
    return value.replace(/\D/g, "");
  };

  const validarCNPJ = (cnpj: string): boolean => {
    const numbers = unmask(cnpj);
    if (numbers.length !== 14) return false;

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

    return true;
  };

  const validarCPF = (cpf: string): boolean => {
    const numbers = unmask(cpf);
    if (numbers.length !== 11) return false;

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

  return {
    maskCNPJ,
    maskCPF,
    maskCEP,
    maskTelefone,
    unmask,
    validarCNPJ,
    validarCPF,
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
