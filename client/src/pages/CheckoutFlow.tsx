/**
 * CheckoutFlow.tsx — 4 Pilares LGPD
 * Checkout em 4 etapas com coleta de dados empresariais
 * VERSÃO REFATORADA COM MercadoPagoBrickPayment
 */
import { useState, useEffect } from "react";
import { useSearchParams, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, CheckCircle2, ArrowLeft, ArrowRight, Lock } from "lucide-react";
import { Link } from "wouter";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { PLANOS, PLANOS_ARRAY, formatarPreco, getPlanoById } from "@/const/pricing";
import { useMasks, buscarEnderecoPorCEP } from "@/hooks/useMasks";
import { trpc } from "@/lib/trpc";
import MercadoPagoBrickPayment from "@/components/MercadoPagoBrickPayment";

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

  const [etapaAtual, setEtapaAtual] = useState<Etapa>("plano");
  const [planoSelecionado, setPlanoSelecionado] = useState(plano);
  const [loading, setLoading] = useState(false);
  const [buscandoCEP, setBuscandoCEP] = useState(false);
  const [aceitouTermos, setAceitouTermos] = useState(false);

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

  // Buscar chave pública
  const { data: publicKeyData } = trpc.payments.getPublicKey.useQuery();
  const publicKey = publicKeyData?.publicKey;

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
          endereco: endereco.logradouro || "",
          bairro: endereco.bairro || "",
          cidade: endereco.localidade || "",
          estado: endereco.uf || "",
        }));
        toast.success("Endereço preenchido automaticamente");
      }
    } catch (error) {
      toast.error("CEP não encontrado");
    } finally {
      setBuscandoCEP(false);
    }
  };

  const validarEtapaEmpresa = () => {
    console.log("📌 Validando Etapa 2 (Empresa)");
    console.log("  Razão Social:", form.razaoSocial);
    console.log("  CNPJ:", form.cnpj);
    console.log("  Email:", form.email);

    if (!form.razaoSocial.trim()) {
      toast.error("Razão Social é obrigatória");
      return false;
    }

    if (!validarCNPJ(form.cnpj)) {
      toast.error("CNPJ inválido");
      return false;
    }

    if (!validarEmail(form.email)) {
      toast.error("Email inválido");
      return false;
    }

    console.log("✅ Validação passou");
    return true;
  };

  const proximaEtapa = () => {
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

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Indicador de Progresso */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              {["plano", "empresa", "termos", "pagamento"].map((etapa, idx) => (
                <div key={etapa} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                      etapa === etapaAtual
                        ? "bg-blue-600 text-white"
                        : ["plano", "empresa", "termos", "pagamento"].indexOf(etapaAtual) > idx
                        ? "bg-green-600 text-white"
                        : "bg-slate-300 text-slate-600"
                    }`}
                  >
                    {["plano", "empresa", "termos", "pagamento"].indexOf(etapaAtual) > idx ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      idx + 1
                    )}
                  </div>
                  {idx < 3 && (
                    <div
                      className={`h-1 flex-1 mx-2 transition-all ${
                        ["plano", "empresa", "termos", "pagamento"].indexOf(etapaAtual) > idx
                          ? "bg-green-600"
                          : "bg-slate-300"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-slate-600">
              <span>Plano</span>
              <span>Empresa</span>
              <span>Termos</span>
              <span>Pagamento</span>
            </div>
          </div>

          {/* Conteúdo Principal */}
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg border border-slate-200 p-8">
                <AnimatePresence mode="wait">
                  {/* Etapa 1: Plano */}
                  {etapaAtual === "plano" && (
                    <motion.div key="plano" initial="hidden" animate="visible" exit="exit" variants={fadeIn} className="space-y-6">
                      <h2 className="text-3xl font-bold text-slate-900">Selecione seu Plano</h2>

                      <div className="grid md:grid-cols-2 gap-4">
                        {PLANOS_ARRAY.map((p) => (
                          <div
                            key={p.id}
                            onClick={() => {
                              setPlanoSelecionado(p);
                              toast.success(`Plano ${p.nome} selecionado`);
                            }}
                            className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                              planoSelecionado.id === p.id
                                ? "border-blue-600 bg-blue-50"
                                : "border-slate-200 hover:border-slate-300"
                            }`}
                          >
                            <h3 className="font-bold text-lg text-slate-900">{p.nome}</h3>
                            <p className="text-sm text-slate-600 mt-2">{p.tagline}</p>
                            <p className="text-2xl font-bold text-blue-600 mt-4">
                              {formatarPreco(p.precoPromocional || p.precoNormal)}
                              <span className="text-sm text-slate-600">/mês</span>
                            </p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Etapa 2: Empresa */}
                  {etapaAtual === "empresa" && (
                    <motion.div key="empresa" initial="hidden" animate="visible" exit="exit" variants={fadeIn} className="space-y-6">
                      <h2 className="text-3xl font-bold text-slate-900">Dados da Empresa</h2>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Razão Social *</label>
                          <input
                            type="text"
                            name="razaoSocial"
                            placeholder="Sua Empresa Ltda"
                            value={form.razaoSocial}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>

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

                  {/* Etapa 3: Termos */}
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

                  {/* Etapa 4: Pagamento */}
                  {etapaAtual === "pagamento" && (
                    <motion.div key="pagamento" initial="hidden" animate="visible" exit="exit" variants={fadeIn} className="space-y-6">
                      <h2 className="text-3xl font-bold text-slate-900">Pagamento</h2>

                      {publicKey ? (
                        <MercadoPagoBrickPayment
                          amount={(planoSelecionado.precoPromocional || planoSelecionado.precoNormal) as number}
                          publicKey={publicKey}
                          email={form.email}
                          razaoSocial={form.razaoSocial}
                          cnpj={form.cnpj}
                          cpf={form.cpf}
                          planId={planoSelecionado.id}
                          planName={planoSelecionado.nome}
                          onPaymentSuccess={(response) => {
                            console.log("✅ Pagamento bem-sucedido:", response);
                            toast.success("Pagamento processado com sucesso!");
                            const paymentId = response?.result?.data?.json?.paymentId;
                            const status = response?.result?.data?.json?.status;
                            if (paymentId && status) {
                              setLocation(`/confirmation?payment_id=${paymentId}&status=${status}`);
                            }
                          }}
                          onPaymentError={(error) => {
                            console.error("❌ Erro no pagamento:", error);
                            toast.error(`Erro: ${error}`);
                          }}
                        />
                      ) : (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                          <p className="text-yellow-800">Carregando sistema de pagamento...</p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Resumo do Pedido */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg border border-slate-200 p-6 sticky top-8">
                <h3 className="font-bold text-slate-900 mb-4">Resumo do pedido</h3>

                <div className="space-y-3 mb-6 pb-6 border-b border-slate-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Plano</span>
                    <span className="font-medium text-slate-900">{planoSelecionado.nome}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Valor mensal</span>
                    <span className="font-medium text-slate-900">
                      {formatarPreco(planoSelecionado.precoPromocional || planoSelecionado.precoNormal)}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={proximaEtapa}
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <ArrowRight className="w-4 h-4 mr-2" />
                    {etapaAtual === "pagamento" ? "Processar Pagamento" : "Próximo"}
                  </Button>

                  {etapaAtual !== "plano" && (
                    <Button
                      onClick={etapaAnterior}
                      variant="outline"
                      className="w-full"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Voltar
                    </Button>
                  )}
                </div>

                <div className="mt-6 pt-6 border-t border-slate-200">
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <Lock className="w-4 h-4" />
                    <span>Pagamento seguro com Mercado Pago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
