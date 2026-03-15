/*
 * CheckoutFlow.tsx — 4 Pilares LGPD
 * Checkout em 4 etapas com coleta de dados empresariais
 */
import { useState, useEffect, useRef } from "react";
import { useSearchParams, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, CheckCircle2, Loader2, ArrowLeft, ArrowRight, Lock } from "lucide-react";
import { Link } from "wouter";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import MercadoPagoBrickPayment from "@/components/MercadoPagoBrickPayment";
import { toast } from "sonner";
import { PLANOS, PLANOS_ARRAY, formatarPreco, getPlanoById } from "@/const/pricing";
import { useMasks, buscarEnderecoPorCEP } from "@/hooks/useMasks";
import { trpc } from "@/lib/trpc";



type Etapa = "plano" | "empresa" | "termos" | "pagamento";

interface FormData {
  razaoSocial: string;
  cnpj: string;
  cep: string;
  endereco: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  responsavel: string;
  cpf: string;
  telefone: string;
  email: string;
}

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
};

export default function CheckoutFlow() {
  const [, setLocation] = useLocation();
  const [searchParams] = useSearchParams();
  const planoId = searchParams.get("plan") || "profissional";
  const plano = getPlanoById(planoId);
  const processPayment = trpc.subscriptions.processPayment.useMutation();

  const [etapaAtual, setEtapaAtual] = useState<Etapa>("plano");
  const [planoSelecionado, setPlanoSelecionado] = useState(plano);
  const [loading, setLoading] = useState(false);
  const [buscandoCEP, setBuscandoCEP] = useState(false);
  const [aceitouTermos, setAceitouTermos] = useState(false);
  const [brickLoaded, setBrickLoaded] = useState(false);
  const [brickError, setBrickError] = useState<string | null>(null);
  const brickRef = useRef<any>(null);
  const sdkLoadedRef = useRef(false);

  const { maskCNPJ, maskCPF, maskCEP, maskTelefone, unmask, validarCNPJ, validarCPF, validarEmail } = useMasks();

  const [form, setForm] = useState<FormData>({
    razaoSocial: "",
    cnpj: "",
    cep: "",
    endereco: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
    responsavel: "",
    cpf: "",
    telefone: "",
    email: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let maskedValue = value;

    if (name === "cnpj") maskedValue = maskCNPJ(value);
    if (name === "cpf") maskedValue = maskCPF(value);
    if (name === "cep") maskedValue = maskCEP(value);
    if (name === "telefone") maskedValue = maskTelefone(value);

    setForm((prev) => ({ ...prev, [name]: maskedValue }));
  };

  const handleBuscarCEP = async () => {
    if (form.cep.length < 9) {
      toast.error("CEP inválido");
      return;
    }

    setBuscandoCEP(true);
    try {
      const endereco = await buscarEnderecoPorCEP(form.cep);
      if (endereco) {
        setForm((prev) => ({
          ...prev,
          endereco: endereco.endereco || "",
          bairro: endereco.bairro || "",
          cidade: endereco.cidade || "",
          estado: endereco.estado || "",
        }));
        toast.success("Endereço preenchido com sucesso");
      } else {
        toast.error("CEP não encontrado");
      }
    } catch (error) {
      toast.error("Erro ao buscar CEP");
    } finally {
      setBuscandoCEP(false);
    }
  };

  const validarEtapaEmpresa = () => {
    console.log("🔍 Validando etapa empresa...");
    console.log("📋 Dados do formulário:", {
      razaoSocial: form.razaoSocial,
      cnpj: form.cnpj,
      email: form.email,
    });
    
    // Validações essenciais
    if (!form.razaoSocial.trim()) {
      console.error("❌ Razão Social vazia");
      toast.error("Razão Social é obrigatória");
      return false;
    }

    const cnpjValido = validarCNPJ(form.cnpj);
    console.log(`📌 CNPJ: ${form.cnpj} - Válido: ${cnpjValido}`);
    if (!form.cnpj || !cnpjValido) {
      console.error("❌ CNPJ inválido");
      toast.error("CNPJ inválido");
      return false;
    }

    const emailValido = validarEmail(form.email);
    console.log(`📌 Email: ${form.email} - Válido: ${emailValido}`);
    if (!form.email || !emailValido) {
      console.error("❌ Email inválido");
      toast.error("E-mail inválido");
      return false;
    }

    console.log("✅ Validação passou");
    return true;
  };

  const proximaEtapa = () => {
    console.log(`📍 Tentando avançar de ${etapaAtual}`);

    if (etapaAtual === "plano") {
      setEtapaAtual("empresa");
    } else if (etapaAtual === "empresa") {
      if (validarEtapaEmpresa()) {
        setEtapaAtual("termos");
      }
    } else if (etapaAtual === "termos") {
      if (!aceitouTermos) {
        toast.error("Você deve aceitar os termos");
        return;
      }
      setEtapaAtual("pagamento");
    }
  };

  const etapaAnterior = () => {
    if (etapaAtual === "empresa") setEtapaAtual("plano");
    else if (etapaAtual === "termos") setEtapaAtual("empresa");
    else if (etapaAtual === "pagamento") setEtapaAtual("termos");
  };

  const selecionarPlano = (planoId: string) => {
    const novoPlano = getPlanoById(planoId);
    setPlanoSelecionado(novoPlano);
  };

  const calcularPreco = () => {
    if (!planoSelecionado) return { valor: 0, desconto: null, label: null };

    return {
      valor: planoSelecionado.precoPromocional || planoSelecionado.precoNormal,
      desconto: planoSelecionado.desconto,
      label: planoSelecionado.badge,
    };
  };

  const preco = calcularPreco();

  // Carregar SDK do Mercado Pago
  useEffect(() => {
    if (etapaAtual !== "pagamento") {
      return;
    }

    // Aguardar animação terminar (300ms) e container estar disponível
    const timer = setTimeout(() => {
      const checkContainer = setInterval(() => {
        const container = document.getElementById("paymentBrick_container");
        if (!container) {
          console.log("⏳ Aguardando container...");
          return;
        }
        clearInterval(checkContainer);

        // Se SDK já foi carregado, inicializar brick
        if (sdkLoadedRef.current && (window as any).MercadoPago) {
          console.log("SDK já carregado, inicializando brick");
          inicializarPaymentBrick();
          return;
        }

        // Verificar se script já existe
        const scriptExistente = document.querySelector('script[src="https://sdk.mercadopago.com/js/v2"]');
        if (scriptExistente) {
          console.log("Script já existe no DOM");
          // Aguardar SDK estar disponível
          const checkInterval = setInterval(() => {
            if ((window as any).MercadoPago) {
              clearInterval(checkInterval);
              sdkLoadedRef.current = true;
              inicializarPaymentBrick();
            }
          }, 100);
          setTimeout(() => clearInterval(checkInterval), 5000);
          return;
        }

        // Carregar script do Mercado Pago
        console.log("Carregando SDK Mercado Pago...");
        const script = document.createElement("script");
        script.src = "https://sdk.mercadopago.com/js/v2";
        script.async = true;
        script.onload = () => {
          console.log("✅ SDK Mercado Pago carregado com sucesso");
          sdkLoadedRef.current = true;
          inicializarPaymentBrick();
        };
        script.onerror = () => {
          console.error("❌ Erro ao carregar SDK Mercado Pago");
          setBrickError("Erro ao carregar sistema de pagamento");
          toast.error("Erro ao carregar sistema de pagamento");
        };
        document.head.appendChild(script);
      }, 100);
    }, 300); // Aguardar animação terminar

    return () => {
      clearTimeout(timer);
    };
  }, [etapaAtual, validarEmail, preco, form.email, planoSelecionado]);

  const inicializarPaymentBrick = async () => {
    try {
      console.log("🔧 Iniciando Payment Brick...");

      let publicKey: string | undefined;
      try {
        const response = await fetch('/api/trpc/payments.getPublicKey?input={}', {
          credentials: 'include',
        });
        const data = await response.json();
        publicKey = data.result?.data?.json?.publicKey;
      } catch (err) {
        console.warn("⚠️ Erro ao buscar chave pública via tRPC, tentando import.meta.env", err);
        publicKey = import.meta.env.VITE_MERCADO_PAGO_PUBLIC_KEY;
      }

      console.log("📌 Chave pública:", publicKey ? "✅ Configurada" : "❌ Não configurada");

      if (!publicKey) {
        console.error("❌ Chave pública do Mercado Pago não configurada");
        setBrickError("Chave de pagamento não configurada");
        toast.error("Erro: Chave de pagamento não configurada");
        return;
      }

      // Aguardar SDK estar disponível
      if (!(window as any).MercadoPago) {
        console.warn("⏳ MercadoPago SDK ainda não disponível, tentando novamente...");
        setTimeout(() => inicializarPaymentBrick(), 500);
        return;
      }

      console.log("✅ SDK Mercado Pago disponível");

      // Limpar brick anterior se existir
      if (brickRef.current) {
        try {
          brickRef.current.unmount();
          console.log("🧹 Brick anterior desmontado");
        } catch (e) {
          console.log("ℹ️ Brick anterior já desmontado");
        }
      }

      console.log("🔐 Inicializando MercadoPago com chave pública");
      const mp = new (window as any).MercadoPago(publicKey, {
        locale: "pt-BR",
      });

      // Garantir que preco.valor é um número válido
      const precoValor = typeof preco.valor === 'number' ? preco.valor : 0;
      const amount = Math.max(precoValor / 100, 1); // Converter centavos para reais
      console.log("💰 Valor do pagamento: R$", amount.toFixed(2), "(", (amount * 100).toFixed(0), "centavos)");

      // Verificar se container existe
      const container = document.getElementById("paymentBrick_container");
      if (!container) {
        console.error("❌ Container #paymentBrick_container não encontrado");
        setBrickError("Container de pagamento não encontrado");
        return;
      }

      console.log("🎯 Criando Payment Brick...");
      
      // Validar e-mail antes de passar ao Payment Brick
      if (!form.email || !validarEmail(form.email)) {
        console.error("❌ E-mail inválido para Payment Brick:", form.email);
        setBrickError("E-mail inválido. Verifique e volte à etapa anterior.");
        toast.error("E-mail inválido. Por favor, corrija na etapa anterior.");
        return;
      }
      
      // Garantir que o container está pronto
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const bricksBuilder = mp.bricks();
      
      brickRef.current = await bricksBuilder.create("payment", "paymentBrick_container", {
        initialization: {
          amount: amount,
        },
        customization: {
          paymentMethods: {
            creditCard: "all",
            debitCard: "all",
            ticket: "all",
            bankTransfer: "all",
          },
          visual: {
            theme: "default",
          },
        },
        callbacks: {
          onReady: () => {
            console.log("✅ Payment Brick renderizado com sucesso");
            setBrickLoaded(true);
            setBrickError(null);
            toast.success("Sistema de pagamento carregado");
          },
          onSubmit: async (formData: any) => {
            console.log("📤 Formulário de pagamento enviado:", formData);
            setLoading(true);

            try {
              // Validar token
              if (!formData.token) {
                console.error("❌ Token não gerado pelo Payment Brick");
                console.error("❌ Estrutura recebida:", formData);
                toast.error("Erro: Token de pagamento não gerado. Tente novamente.");
                setLoading(false);
                return;
              }

              console.log("✅ Token gerado com sucesso:", formData.token);
              console.log(`💳 Processando pagamento: ${form.email} - Plano ${planoSelecionado.id}`);

              const response = await processPayment.mutateAsync({
                email: form.email,
                razaoSocial: form.razaoSocial,
                cnpj: form.cnpj,
                cpf: form.cpf,
                planId: planoSelecionado.id,
                planName: planoSelecionado.nome,
                token: formData.token,
              });

              console.log("📊 Resposta do servidor:", response);

              if (response.status === "approved") {
                console.log("✅ Pagamento aprovado!");
                toast.success("Pagamento aprovado com sucesso!");
                setLocation(`/confirmation?payment_id=${response.paymentId}&status=approved`);
              } else if (response.status === "pending") {
                console.log("⏳ Pagamento pendente");
                toast.info("Pagamento em processamento. Você receberá confirmação por e-mail.");
                setLocation(`/confirmation?payment_id=${response.paymentId}&status=pending`);
              } else if (response.status === "rejected") {
                console.error("❌ Pagamento rejeitado");
                toast.error(`Pagamento rejeitado: ${response.message || "Motivo desconhecido"}`);
              } else {
                console.error("❌ Status desconhecido:", response.status);
                toast.error(`Erro no pagamento: ${response.message || "Erro desconhecido"}`);
              }
            } catch (error) {
              console.error("❌ Erro ao processar pagamento:", error);
              let errorMsg = "Erro ao processar pagamento";
              if (error instanceof Error) {
                errorMsg = error.message;
              }
              toast.error(`${errorMsg}. Se persistir, verifique seus dados e tente novamente.`);
            } finally {
              setLoading(false);
            }
          },
          onError: (error: any) => {
            console.error("❌ Erro no Payment Brick:", error);
            setBrickError(error.message || "Erro desconhecido");
            toast.error(`Erro: ${error.message || "Erro desconhecido"}`);
          },
          onFetching: (resource: any) => {
            console.log("🔄 Carregando:", resource);
          },
        },
      });
      console.log("✅ Payment Brick montado com sucesso");
    } catch (error) {
      console.error("❌ Erro ao inicializar Payment Brick:", error);
      setBrickError(String(error));
      toast.error("Erro ao inicializar sistema de pagamento");
    }
  };
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Indicador de Etapas */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-8">
              {(['plano', 'empresa', 'termos', 'pagamento'] as const).map((etapa, idx) => (
                <div key={etapa} className="flex items-center flex-1">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                      etapaAtual === etapa
                        ? 'bg-blue-600 text-white scale-110'
                        : ['plano', 'empresa', 'termos', 'pagamento'].indexOf(etapaAtual) > idx
                        ? 'bg-green-500 text-white'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {['plano', 'empresa', 'termos', 'pagamento'].indexOf(etapaAtual) > idx ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : (
                      idx + 1
                    )}
                  </div>
                  {idx < 3 && (
                    <div
                      className={`flex-1 h-1 mx-2 ${
                        ['plano', 'empresa', 'termos', 'pagamento'].indexOf(etapaAtual) > idx
                          ? 'bg-green-500'
                          : 'bg-slate-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs font-medium text-slate-600">
              <span>Plano</span>
              <span>Empresa</span>
              <span>Termos</span>
              <span>Pagamento</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Conteúdo Principal */}
            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">
                {etapaAtual === "plano" && (
                  <motion.div key="plano" initial="hidden" animate="visible" exit="exit" variants={fadeIn} className="space-y-6">
                    <h2 className="text-3xl font-bold text-slate-900">Escolha seu plano</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {PLANOS_ARRAY.map((p: any) => (
                        <motion.button
                          key={p.id}
                          onClick={() => selecionarPlano(p.id)}
                          className={`p-6 rounded-lg border-2 transition-all text-left ${
                            planoSelecionado.id === p.id
                              ? 'border-blue-600 bg-blue-50'
                              : 'border-slate-200 hover:border-blue-300'
                          }`}
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="font-bold text-slate-900">{p.nome}</h3>
                              <p className="text-sm text-slate-600">{p.tagline}</p>
                            </div>
                            {p.highlight && <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">Destaque</span>}
                          </div>
                          <p className="text-2xl font-bold text-blue-600 mb-2">{formatarPreco(p.precoNormal)}</p>
                          {p.badge && <p className="text-xs text-green-600 font-medium">{p.badge}</p>}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {etapaAtual === "empresa" && (
                  <motion.div key="empresa" initial="hidden" animate="visible" exit="exit" variants={fadeIn} className="space-y-6">
                    <h2 className="text-3xl font-bold text-slate-900">Dados da empresa</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Razão Social *</label>
                        <input
                          type="text"
                          name="razaoSocial"
                          placeholder="Ex: Tech Solutions Ltda"
                          value={form.razaoSocial}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">CNPJ *</label>
                          <input
                            type="text"
                            name="cnpj"
                            placeholder="00.000.000/0000-00"
                            value={form.cnpj}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">CEP</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              name="cep"
                              placeholder="00000-000"
                              value={form.cep}
                              onChange={handleInputChange}
                              className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <Button
                              onClick={handleBuscarCEP}
                              disabled={buscandoCEP || form.cep.length < 9}
                              className="px-4"
                            >
                              {buscandoCEP ? <Loader2 className="w-4 h-4 animate-spin" /> : "Buscar"}
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          name="endereco"
                          placeholder="Rua/Avenida"
                          value={form.endereco}
                          onChange={handleInputChange}
                          className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <input
                          type="text"
                          name="numero"
                          placeholder="123"
                          value={form.numero}
                          onChange={handleInputChange}
                          className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <input
                          type="text"
                          name="bairro"
                          placeholder="Bairro"
                          value={form.bairro}
                          onChange={handleInputChange}
                          className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <input
                          type="text"
                          name="cidade"
                          placeholder="São Paulo"
                          value={form.cidade}
                          onChange={handleInputChange}
                          className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <input
                          type="text"
                          name="estado"
                          placeholder="SP"
                          value={form.estado}
                          onChange={handleInputChange}
                          maxLength={2}
                          className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">E-mail *</label>
                        <input
                          type="email"
                          name="email"
                          placeholder="seu@email.com"
                          value={form.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {etapaAtual === "termos" && (
                  <motion.div key="termos" initial="hidden" animate="visible" exit="exit" variants={fadeIn} className="space-y-6">
                    <h2 className="text-3xl font-bold text-slate-900">Termos e Condições</h2>
                    <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 max-h-96 overflow-y-auto">
                      <h3 className="font-bold mb-3">Termos de Uso - 4 Pilares LGPD</h3>
                      <p className="text-sm text-slate-700 space-y-3">
                        <div>
                          <strong>1. Aceitação dos Termos</strong><br />
                          Ao contratar nossos serviços, você concorda com estes termos e condições.
                        </div>
                        <div>
                          <strong>2. Descrição do Serviço</strong><br />
                          Fornecemos consultoria em conformidade com a Lei Geral de Proteção de Dados (LGPD).
                        </div>
                        <div>
                          <strong>3. Pagamento</strong><br />
                          O pagamento é processado mensalmente e pode ser cancelado a qualquer momento.
                        </div>
                        <div>
                          <strong>4. Responsabilidades</strong><br />
                          Você é responsável por manter a confidencialidade de suas credenciais.
                        </div>
                        <div>
                          <strong>5. Limitação de Responsabilidade</strong><br />
                          Não somos responsáveis por danos indiretos ou consequentes.
                        </div>
                      </p>
                    </div>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={aceitouTermos}
                        onChange={(e) => setAceitouTermos(e.target.checked)}
                        className="w-5 h-5 rounded border-slate-300"
                      />
                      <span className="text-sm text-slate-700">
                        Aceito os termos e condições de uso
                      </span>
                    </label>
                  </motion.div>
                )}

                {etapaAtual === "pagamento" && (
                  <motion.div key="pagamento" initial="hidden" animate="visible" exit="exit" variants={fadeIn} className="space-y-6">
                    <h2 className="text-3xl font-bold text-slate-900">Pagamento</h2>
                    
                    {brickError && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-red-900">Erro ao carregar sistema de pagamento</p>
                          <p className="text-sm text-red-800">{brickError}</p>
                        </div>
                      </div>
                    )}

                    <div
                      id="paymentBrick_container"
                      className={`${!brickLoaded ? 'bg-slate-100 rounded-lg p-8 flex items-center justify-center min-h-96' : ''}`}
                    >
                      {!brickLoaded && (
                        <div className="text-center">
                          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-3" />
                          <p className="text-slate-600">Carregando sistema de pagamento...</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Resumo do Pedido */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg border border-slate-200 p-6 sticky top-8">
                <h3 className="font-bold text-slate-900 mb-4">Resumo do pedido</h3>

                <div className="space-y-3 mb-6 pb-6 border-b border-slate-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Plano selecionado</span>
                    <span className="font-medium text-slate-900">{planoSelecionado.nome}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Preço original</span>
                    <span className="font-medium text-slate-900">{formatarPreco(planoSelecionado.precoNormal)}</span>
                  </div>
                  {preco.desconto && (
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Desconto</span>
                      <span className="font-medium text-green-600">-{preco.desconto}</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between mb-6">
                  <span className="font-bold text-slate-900">Valor mensal</span>
                  <span className="text-2xl font-bold text-blue-600">{formatarPreco(preco.valor)}</span>
                </div>

                {preco.label && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-6 text-xs text-yellow-800">
                    <p className="font-medium">{preco.label}</p>
                  </div>
                )}

                <div className="space-y-2 text-xs text-slate-600 mb-6">
                  <p>✓ Renovação automática mensal</p>
                  <p>✓ Cancelamento sem multa</p>
                  <p>✓ Suporte especializado</p>
                </div>

                <div className="flex gap-3">
                  {etapaAtual !== "plano" && (
                    <Button
                      onClick={etapaAnterior}
                      variant="outline"
                      className="flex-1"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Voltar
                    </Button>
                  )}
                  {etapaAtual !== "pagamento" && (
                    <Button
                      onClick={proximaEtapa}
                      className="flex-1"
                    >
                      Próximo
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
