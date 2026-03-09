/*
 * CheckoutFlow.tsx — 4 Pilares LGPD
 * Checkout em 4 etapas com coleta de dados empresariais
 */
import { useState, useEffect } from "react";
import { useSearchParams } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, CheckCircle2, Loader2, ArrowLeft, ArrowRight, Lock } from "lucide-react";
import { Link } from "wouter";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { PLANOS, formatarPreco, getPlanoById } from "@/const/pricing";
import { useMasks, buscarEnderecoPorCEP } from "@/hooks/useMasks";

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
  const [searchParams] = useSearchParams();
  const planoId = searchParams.get("plan") || "profissional";
  const plano = getPlanoById(planoId);

  const [etapaAtual, setEtapaAtual] = useState<Etapa>("plano");
  const [planoSelecionado, setPlanoSelecionado] = useState(plano);
  const [loading, setLoading] = useState(false);
  const [buscandoCEP, setBuscandoCEP] = useState(false);
  const [aceitouTermos, setAceitouTermos] = useState(false);

  const { maskCNPJ, maskCPF, maskCEP, maskTelefone, unmask, validarCNPJ, validarCPF } = useMasks();

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
      setForm((prev) => ({
        ...prev,
        endereco: endereco.endereco,
        bairro: endereco.bairro,
        cidade: endereco.cidade,
        estado: endereco.estado,
      }));
      toast.success("Endereço encontrado!");
    } catch (error) {
      toast.error("CEP não encontrado");
    } finally {
      setBuscandoCEP(false);
    }
  };

  const validarEtapa = (): boolean => {
    if (etapaAtual === "empresa") {
      if (!form.razaoSocial) {
        toast.error("Razão Social é obrigatória");
        return false;
      }
      if (!validarCNPJ(form.cnpj)) {
        toast.error("CNPJ inválido");
        return false;
      }
      if (!form.endereco || !form.numero || !form.cidade || !form.estado) {
        toast.error("Endereço completo é obrigatório");
        return false;
      }
      if (!form.responsavel) {
        toast.error("Nome do responsável é obrigatório");
        return false;
      }
      if (!validarCPF(form.cpf)) {
        toast.error("CPF inválido");
        return false;
      }
      if (!form.email || !form.email.includes("@")) {
        toast.error("E-mail válido é obrigatório");
        return false;
      }
    }

    if (etapaAtual === "termos") {
      if (!aceitouTermos) {
        toast.error("Você deve aceitar os termos para continuar");
        return false;
      }
    }

    return true;
  };

  const proximaEtapa = () => {
    if (!validarEtapa()) return;

    const etapas: Etapa[] = ["plano", "empresa", "termos", "pagamento"];
    const indexAtual = etapas.indexOf(etapaAtual);
    if (indexAtual < etapas.length - 1) {
      setEtapaAtual(etapas[indexAtual + 1]);
    }
  };

  const etapaAnterior = () => {
    const etapas: Etapa[] = ["plano", "empresa", "termos", "pagamento"];
    const indexAtual = etapas.indexOf(etapaAtual);
    if (indexAtual > 0) {
      setEtapaAtual(etapas[indexAtual - 1]);
    }
  };

  const calcularPreco = () => {
    if (planoSelecionado.precoPromocional) {
      return {
        valor: planoSelecionado.precoPromocional,
        desconto: planoSelecionado.precoNormal,
        label: `${planoSelecionado.desconto} de desconto por ${planoSelecionado.mesesPromocao} meses`,
      };
    }
    return {
      valor: planoSelecionado.precoNormal,
      desconto: null,
      label: null,
    };
  };

  const preco = calcularPreco();
  const precoValor = preco.valor || 0;

  // Carregar Payment Brick quando chegar na etapa de pagamento
  useEffect(() => {
    if (etapaAtual === "pagamento" && typeof window !== "undefined") {
      // Carregar script do Mercado Pago
      const script = document.createElement("script");
      script.src = "https://sdk.mercadopago.com/js/v2";
      script.async = true;
      script.onload = () => {
        // Inicializar Payment Brick
        if ((window as any).MercadoPago) {
          const mp = new (window as any).MercadoPago(import.meta.env.VITE_MERCADO_PAGO_PUBLIC_KEY, {
            locale: "pt-BR",
          });

          mp.bricks().create("payment", {
            initialization: {
              amount: (preco.valor || 0) * 100, // Converter para centavos
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
                console.log("Payment Brick pronto");
              },
              onSubmit: async (formData: any) => {
                console.log("Formulário enviado:", formData);
                // Aqui você enviaria os dados para seu backend
              },
              onError: (error: any) => {
                console.error("Erro no Payment Brick:", error);
              },
            },
          });
        }
      };
      document.head.appendChild(script);

      return () => {
        // Limpar script ao desmontar
        if (document.head.contains(script)) {
          document.head.removeChild(script);
        }
      };
    }
  }, [etapaAtual, preco]);

  return (
    <Layout>
      <section className="py-12" style={{ backgroundColor: "#F8FAFC" }}>
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Conteúdo principal */}
            <div className="lg:col-span-2">
              {/* Barra de progresso */}
              <div className="mb-12">
                <div className="flex items-center justify-between mb-4">
                  {["plano", "empresa", "termos", "pagamento"].map((e, i) => (
                    <div key={e} className="flex items-center flex-1">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                          etapaAtual === e
                            ? "bg-blue-600 text-white"
                            : ["plano", "empresa", "termos", "pagamento"].indexOf(etapaAtual) > i
                              ? "bg-green-600 text-white"
                              : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        {["plano", "empresa", "termos", "pagamento"].indexOf(etapaAtual) > i ? "✓" : i + 1}
                      </div>
                      {i < 3 && (
                        <div
                          className={`flex-1 h-1 mx-2 rounded-full transition-all ${
                            ["plano", "empresa", "termos", "pagamento"].indexOf(etapaAtual) > i
                              ? "bg-green-600"
                              : "bg-slate-200"
                          }`}
                        />
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-slate-500 font-mono">
                  <span>Plano</span>
                  <span>Empresa</span>
                  <span>Termos</span>
                  <span>Pagamento</span>
                </div>
              </div>

              {/* Conteúdo das etapas */}
              <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm min-h-96">
                <AnimatePresence mode="wait">
                  {/* ETAPA 1: PLANO */}
                  {etapaAtual === "plano" && (
                    <motion.div key="plano" initial="hidden" animate="visible" exit="exit" variants={fadeIn}>
                      <h2 className="title-serif text-2xl text-slate-900 mb-6">Escolha seu plano</h2>
                      <div className="space-y-3">
                        {Object.values(PLANOS).map((p) => (
                          <button
                            key={p.id}
                            onClick={() => setPlanoSelecionado(p)}
                            className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                              planoSelecionado.id === p.id
                                ? "border-blue-600 bg-blue-50"
                                : "border-slate-200 hover:border-slate-300"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-semibold text-slate-900">{p.nome}</p>
                                <p className="text-sm text-slate-500">{p.tagline}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-slate-900" style={{ fontFamily: "var(--font-mono)" }}>
                                  {formatarPreco(p.precoNormal || p.precoPromocional)}
                                </p>
                                {p.precoPromocional && (
                                  <p className="text-xs text-green-600 font-medium">{p.desconto} OFF</p>
                                )}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* ETAPA 2: EMPRESA */}
                  {etapaAtual === "empresa" && (
                    <motion.div key="empresa" initial="hidden" animate="visible" exit="exit" variants={fadeIn}>
                      <h2 className="title-serif text-2xl text-slate-900 mb-6">Dados da empresa</h2>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Razão Social *</label>
                          <input
                            type="text"
                            name="razaoSocial"
                            value={form.razaoSocial}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            placeholder="Ex: Tech Solutions Ltda"
                          />
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">CNPJ *</label>
                            <input
                              type="text"
                              name="cnpj"
                              value={form.cnpj}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                              placeholder="00.000.000/0000-00"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">CEP *</label>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                name="cep"
                                value={form.cep}
                                onChange={handleInputChange}
                                className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                placeholder="00000-000"
                              />
                              <button
                                onClick={handleBuscarCEP}
                                disabled={buscandoCEP}
                                className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                              >
                                {buscandoCEP ? <Loader2 className="w-4 h-4 animate-spin" /> : "Buscar"}
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Endereço *</label>
                            <input
                              type="text"
                              name="endereco"
                              value={form.endereco}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                              placeholder="Rua/Avenida"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Número *</label>
                            <input
                              type="text"
                              name="numero"
                              value={form.numero}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                              placeholder="123"
                            />
                          </div>
                        </div>

                        <div className="grid sm:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Bairro *</label>
                            <input
                              type="text"
                              name="bairro"
                              value={form.bairro}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                              placeholder="Bairro"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Cidade *</label>
                            <input
                              type="text"
                              name="cidade"
                              value={form.cidade}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                              placeholder="Cidade"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Estado *</label>
                            <input
                              type="text"
                              name="estado"
                              value={form.estado}
                              onChange={handleInputChange}
                              maxLength={2}
                              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none uppercase"
                              placeholder="TO"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Complemento</label>
                          <input
                            type="text"
                              name="complemento"
                            value={form.complemento}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            placeholder="Apto, sala, etc."
                          />
                        </div>

                        <div className="border-t border-slate-200 pt-6">
                          <h3 className="font-semibold text-slate-900 mb-4">Responsável</h3>
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">Nome *</label>
                              <input
                                type="text"
                                name="responsavel"
                                value={form.responsavel}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                placeholder="Nome completo"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">CPF *</label>
                              <input
                                type="text"
                                name="cpf"
                                value={form.cpf}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                placeholder="000.000.000-00"
                              />
                            </div>
                          </div>
                          <div className="grid sm:grid-cols-2 gap-4 mt-4">
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">Telefone</label>
                              <input
                                type="text"
                                name="telefone"
                                value={form.telefone}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                placeholder="(63) 98438-1782"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">E-mail *</label>
                              <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                placeholder="seu@email.com"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* ETAPA 3: TERMOS */}
                  {etapaAtual === "termos" && (
                    <motion.div key="termos" initial="hidden" animate="visible" exit="exit" variants={fadeIn}>
                      <h2 className="title-serif text-2xl text-slate-900 mb-6">Termos do contrato</h2>
                      <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 max-h-96 overflow-y-auto mb-6 text-sm text-slate-700 leading-relaxed space-y-4">
                        <p>
                          <strong>1. Objeto do Contrato</strong>
                          <br />
                          A 4 PILARES LGPD se compromete a prestar serviços de consultoria e adequação à Lei Geral de Proteção de Dados (Lei 13.709/2018), conforme plano selecionado.
                        </p>
                        <p>
                          <strong>2. Vigência</strong>
                          <br />
                          O contrato tem vigência de 30 dias a partir da confirmação do pagamento, renovando-se automaticamente a cada mês, salvo cancelamento prévio.
                        </p>
                        <p>
                          <strong>3. Preço e Forma de Pagamento</strong>
                          <br />
                          O valor mensal será cobrado conforme plano selecionado. O pagamento será realizado via cartão de crédito, processado pelo Mercado Pago.
                        </p>
                        <p>
                          <strong>4. Cancelamento</strong>
                          <br />
                          O cliente pode cancelar o contrato a qualquer momento, sem multa. O cancelamento será efetivo a partir do próximo ciclo de cobrança.
                        </p>
                        <p>
                          <strong>5. Responsabilidades</strong>
                          <br />
                          A 4 PILARES LGPD se responsabiliza pela qualidade dos serviços prestados. O cliente se responsabiliza pela implementação das recomendações.
                        </p>
                        <p>
                          <strong>6. Confidencialidade</strong>
                          <br />
                          Todas as informações compartilhadas são tratadas com sigilo profissional e não serão divulgadas a terceiros sem consentimento prévio.
                        </p>
                      </div>
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={aceitouTermos}
                          onChange={(e) => setAceitouTermos(e.target.checked)}
                          className="w-5 h-5 rounded border-slate-300 text-blue-600 mt-1"
                        />
                        <span className="text-sm text-slate-700">
                          Eu li e aceito os termos do contrato de serviços da 4 PILARES LGPD *
                        </span>
                      </label>
                    </motion.div>
                  )}

                  {/* ETAPA 4: PAGAMENTO */}
                  {etapaAtual === "pagamento" && (
                    <motion.div key="pagamento" initial="hidden" animate="visible" exit="exit" variants={fadeIn}>
                      <h2 className="title-serif text-2xl text-slate-900 mb-6">Pagamento seguro</h2>
                      <div id="paymentBrick_container" className="mb-6 min-h-96" />
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
                        <Lock className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div className="text-xs text-blue-700">
                          <p className="font-medium mb-1">Pagamento 100% seguro</p>
                          <p>Seus dados são processados diretamente pelo Mercado Pago com criptografia SSL.</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Navegação */}
              <div className="flex items-center justify-between mt-8">
                <button
                  onClick={etapaAnterior}
                  disabled={etapaAtual === "plano"}
                  className="flex items-center gap-2 px-6 h-11 rounded-xl font-medium text-slate-700 border border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" /> Voltar
                </button>
                <button
                  onClick={proximaEtapa}
                  disabled={etapaAtual === "pagamento"}
                  className="flex items-center gap-2 px-6 h-11 rounded-xl font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Próximo <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Resumo lateral */}
            <div className="lg:col-span-1">
              <div className="sticky top-20 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <h3 className="font-semibold text-slate-900 mb-4">Resumo do pedido</h3>

                <div className="mb-6 pb-6 border-b border-slate-200">
                  <p className="text-xs text-slate-500 font-mono mb-1">Plano selecionado</p>
                  <p className="font-semibold text-slate-900">{planoSelecionado.nome}</p>
                  <p className="text-xs text-slate-600 mt-1">{planoSelecionado.tagline}</p>
                </div>

                {preco.desconto && (
                  <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-xs text-green-700 font-medium">Preço original</p>
                    <p className="text-sm font-semibold text-slate-900 line-through">{formatarPreco(preco.desconto)}</p>
                  </div>
                )}

                <div className="mb-6 pb-6 border-b border-slate-200">
                  <p className="text-xs text-slate-500 font-mono mb-1">Valor mensal</p>
                  <p className="text-2xl font-bold text-slate-900" style={{ fontFamily: "var(--font-mono)" }}>
                    {formatarPreco(preco.valor)}
                  </p>
                  {preco.label && <p className="text-xs text-green-600 font-medium mt-2">{preco.label}</p>}
                </div>

                {planoSelecionado.precoPromocional && (
                  <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200 text-xs text-blue-700 space-y-2">
                    <p className="font-semibold">Próximas cobranças:</p>
                    <p>Meses 1-12: <strong>{formatarPreco(planoSelecionado.precoPromocional)}</strong></p>
                    <p>A partir do 13º mês: <strong>{formatarPreco(planoSelecionado.precoNormal)}</strong></p>
                    <p className="text-xs text-blue-600 mt-3">Promoção válida enquanto vigente no site</p>
                  </div>
                )}

                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <p className="text-xs text-slate-600 font-mono mb-2">Informações do pagamento</p>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    <li>✓ Processado via Mercado Pago</li>
                    <li>✓ Renovação automática mensal</li>
                    <li>✓ Cancelamento sem multa</li>
                    <li>✓ Suporte especializado incluído</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
