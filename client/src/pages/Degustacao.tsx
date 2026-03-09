/*
 * Degustacao.tsx — 4 Pilares LGPD
 * Painel de Degustação (Trial/Demo) — Formulário de coleta de dados
 */
import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, CheckCircle2, AlertCircle } from "lucide-react";
import { useRouter } from "wouter";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const demandas = [
  { id: "diagnostico", label: "Diagnóstico LGPD", icon: "🔍" },
  { id: "politica", label: "Política de Privacidade", icon: "📄" },
  { id: "ropa", label: "ROPA (Registro de Operações)", icon: "📋" },
  { id: "ripd", label: "RIPD (Relatório de Impacto)", icon: "📊" },
  { id: "dpa", label: "Contratos DPA", icon: "🤝" },
  { id: "treinamento", label: "Treinamento LGPD", icon: "🎓" },
  { id: "dpo", label: "DPO as a Service", icon: "⚖️" },
  { id: "auditoria", label: "Auditoria de Conformidade", icon: "✅" },
];

const riscos = [
  { id: "dados-pessoais", label: "Tratamento de dados pessoais sensíveis", icon: "🔐" },
  { id: "transferencia", label: "Transferência internacional de dados", icon: "🌍" },
  { id: "terceiros", label: "Compartilhamento com terceiros", icon: "👥" },
  { id: "seguranca", label: "Vulnerabilidades de segurança", icon: "⚠️" },
  { id: "conformidade", label: "Falta de conformidade regulatória", icon: "❌" },
  { id: "incidentes", label: "Histórico de incidentes de privacidade", icon: "🚨" },
];

export default function Degustacao() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const createTastingMutation = trpc.tastings.create.useMutation();

  // Formulário
  const [form, setForm] = useState({
    // Empresa
    razaoSocial: "",
    cnpj: "",
    segmento: "",
    tamanho: "",
    
    // Localização
    cep: "",
    estado: "",
    cidade: "",
    
    // Contato
    responsavel: "",
    cargo: "",
    email: "",
    telefone: "",
    
    // Demandas e Riscos
    demandas: [] as string[],
    riscos: [] as string[],
    
    // Conformidade
    statusLei: 0,
    statusRegras: 0,
    statusConformidade: 0,
    statusTitular: 0,
    
    // Observações
    observacoes: "",
  });

  const toggleDemanda = (id: string) => {
    setForm((prev) => ({
      ...prev,
      demandas: prev.demandas.includes(id)
        ? prev.demandas.filter((d) => d !== id)
        : [...prev.demandas, id],
    }));
  };

  const toggleRisco = (id: string) => {
    setForm((prev) => ({
      ...prev,
      riscos: prev.riscos.includes(id)
        ? prev.riscos.filter((r) => r !== id)
        : [...prev.riscos, id],
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSliderChange = (field: string, value: number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!form.razaoSocial || !form.cnpj || !form.email) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    setLoading(true);
    try {
      const result = await createTastingMutation.mutateAsync({
        ...form,
        tamanho: (form.tamanho as "micro" | "pequena" | "media" | "grande" | "multinacional" | undefined),
      });
      
      if (result) {
        toast.success("Degustação iniciada! Redirecionando...");
        setTimeout(() => {
          window.location.href = "/degustacao-sucesso";
        }, 1000);
      }
    } catch (error) {
      console.error("Erro ao criar degustação:", error);
      toast.error("Erro ao iniciar degustação. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="py-16 bg-gradient-to-b from-blue-50 to-white border-b border-slate-100">
        <div className="container text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="max-w-2xl mx-auto">
            <h1 className="title-serif text-4xl lg:text-5xl text-slate-900 mb-4">Teste 4 Pilares LGPD</h1>
            <p className="text-lg text-slate-600 mb-6">
              Inicie uma degustação gratuita e descubra como nossa plataforma pode ajudar sua empresa a alcançar conformidade LGPD completa.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Formulário */}
      <section className="py-20" style={{ backgroundColor: "#F8FAFC" }}>
        <div className="container">
          <div className="max-w-4xl mx-auto">
            {/* Progress */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-4">
                {[1, 2, 3, 4].map((s) => (
                  <div key={s} className="flex items-center flex-1">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                        step >= s
                          ? "bg-blue-700 text-white"
                          : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {s}
                    </div>
                    {s < 4 && (
                      <div
                        className={`flex-1 h-1 mx-2 rounded transition-all ${
                          step > s ? "bg-blue-700" : "bg-slate-200"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-sm text-slate-600">
                <span>Empresa</span>
                <span>Demandas</span>
                <span>Riscos</span>
                <span>Conformidade</span>
              </div>
            </div>

            {/* Step 1: Empresa */}
            {step === 1 && (
              <motion.div initial="hidden" animate="visible" variants={fadeUp} className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Informações da Empresa</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Razão Social *</label>
                    <input
                      type="text"
                      name="razaoSocial"
                      value={form.razaoSocial}
                      onChange={handleInputChange}
                      placeholder="Sua Empresa Ltda"
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-blue-700 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">CNPJ *</label>
                    <input
                      type="text"
                      name="cnpj"
                      value={form.cnpj}
                      onChange={handleInputChange}
                      placeholder="00.000.000/0000-00"
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-blue-700 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Segmento</label>
                      <input
                        type="text"
                        name="segmento"
                        value={form.segmento}
                        onChange={handleInputChange}
                        placeholder="Ex: Tecnologia, Saúde, Varejo"
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-blue-700 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Tamanho</label>
                      <select
                        name="tamanho"
                        value={form.tamanho}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-blue-700 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                      >
                        <option value="">Selecione...</option>
                        <option value="micro">Microempresa</option>
                        <option value="pequena">Pequena</option>
                        <option value="media">Média</option>
                        <option value="grande">Grande</option>
                        <option value="multinacional">Multinacional</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">CEP</label>
                      <input
                        type="text"
                        name="cep"
                        value={form.cep}
                        onChange={handleInputChange}
                        placeholder="00000-000"
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-blue-700 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Estado</label>
                      <input
                        type="text"
                        name="estado"
                        value={form.estado}
                        onChange={handleInputChange}
                        placeholder="SP"
                        maxLength={2}
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-blue-700 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Cidade</label>
                      <input
                        type="text"
                        name="cidade"
                        value={form.cidade}
                        onChange={handleInputChange}
                        placeholder="São Paulo"
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-blue-700 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">E-mail *</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleInputChange}
                      placeholder="seu@email.com"
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-blue-700 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Responsável</label>
                      <input
                        type="text"
                        name="responsavel"
                        value={form.responsavel}
                        onChange={handleInputChange}
                        placeholder="Nome completo"
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-blue-700 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Cargo</label>
                      <input
                        type="text"
                        name="cargo"
                        value={form.cargo}
                        onChange={handleInputChange}
                        placeholder="Ex: Diretor, Gerente"
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-blue-700 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Telefone</label>
                    <input
                      type="tel"
                      name="telefone"
                      value={form.telefone}
                      onChange={handleInputChange}
                      placeholder="(00) 00000-0000"
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-blue-700 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-8">
                  <Button
                    onClick={() => setStep(2)}
                    className="bg-blue-700 hover:bg-blue-800 text-white h-11 px-6 rounded-xl flex items-center gap-2"
                  >
                    Próximo <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Demandas */}
            {step === 2 && (
              <motion.div initial="hidden" animate="visible" variants={fadeUp} className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Quais são suas demandas?</h2>
                <p className="text-slate-600 mb-6">Selecione os serviços que sua empresa precisa</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
                  {demandas.map((d) => (
                    <button
                      key={d.id}
                      onClick={() => toggleDemanda(d.id)}
                      className={`p-4 rounded-lg border-2 transition-all text-left flex items-center gap-3 ${
                        form.demandas.includes(d.id)
                          ? "border-blue-700 bg-blue-50"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <div className="text-2xl">{d.icon}</div>
                      <div className="flex-1">
                        <div className="font-medium text-slate-900">{d.label}</div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                          form.demandas.includes(d.id)
                            ? "border-blue-700 bg-blue-700"
                            : "border-slate-300"
                        }`}
                      >
                        {form.demandas.includes(d.id) && <CheckCircle2 className="w-4 h-4 text-white" />}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="flex justify-between gap-3">
                  <Button
                    onClick={() => setStep(1)}
                    className="bg-white hover:bg-slate-100 text-slate-900 border border-slate-300 h-11 px-6 rounded-xl"
                  >
                    Voltar
                  </Button>
                  <Button
                    onClick={() => setStep(3)}
                    className="bg-blue-700 hover:bg-blue-800 text-white h-11 px-6 rounded-xl flex items-center gap-2"
                  >
                    Próximo <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Riscos */}
            {step === 3 && (
              <motion.div initial="hidden" animate="visible" variants={fadeUp} className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Quais riscos sua empresa enfrenta?</h2>
                <p className="text-slate-600 mb-6">Selecione os riscos de privacidade que você identifica</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
                  {riscos.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => toggleRisco(r.id)}
                      className={`p-4 rounded-lg border-2 transition-all text-left flex items-center gap-3 ${
                        form.riscos.includes(r.id)
                          ? "border-orange-700 bg-orange-50"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <div className="text-2xl">{r.icon}</div>
                      <div className="flex-1">
                        <div className="font-medium text-slate-900">{r.label}</div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                          form.riscos.includes(r.id)
                            ? "border-orange-700 bg-orange-700"
                            : "border-slate-300"
                        }`}
                      >
                        {form.riscos.includes(r.id) && <AlertCircle className="w-4 h-4 text-white" />}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="flex justify-between gap-3">
                  <Button
                    onClick={() => setStep(2)}
                    className="bg-white hover:bg-slate-100 text-slate-900 border border-slate-300 h-11 px-6 rounded-xl"
                  >
                    Voltar
                  </Button>
                  <Button
                    onClick={() => setStep(4)}
                    className="bg-blue-700 hover:bg-blue-800 text-white h-11 px-6 rounded-xl flex items-center gap-2"
                  >
                    Próximo <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Conformidade */}
            {step === 4 && (
              <motion.div initial="hidden" animate="visible" variants={fadeUp} className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Status de Conformidade</h2>
                <p className="text-slate-600 mb-8">Avalie o nível de conformidade atual em cada pilar (0-100%)</p>

                <div className="space-y-6 mb-8">
                  {[
                    { key: "statusLei", label: "Pilar 1: Lei", color: "#1D4ED8" },
                    { key: "statusRegras", label: "Pilar 2: Regras", color: "#059669" },
                    { key: "statusConformidade", label: "Pilar 3: Conformidade", color: "#EA580C" },
                    { key: "statusTitular", label: "Pilar 4: Titular", color: "#7C3AED" },
                  ].map((pilar) => (
                    <div key={pilar.key}>
                      <div className="flex justify-between items-center mb-2">
                        <label className="font-medium text-slate-900">{pilar.label}</label>
                        <span className="text-sm font-bold" style={{ color: pilar.color }}>
                          {form[pilar.key as keyof typeof form]}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={form[pilar.key as keyof typeof form]}
                        onChange={(e) => handleSliderChange(pilar.key, parseInt(e.target.value))}
                        className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                        style={{
                          background: `linear-gradient(to right, ${pilar.color} 0%, ${pilar.color} ${form[pilar.key as keyof typeof form]}%, #e5e7eb ${form[pilar.key as keyof typeof form]}%, #e5e7eb 100%)`,
                        }}
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Observações adicionais</label>
                  <textarea
                    name="observacoes"
                    value={form.observacoes}
                    onChange={handleInputChange}
                    placeholder="Descreva qualquer informação adicional relevante..."
                    rows={4}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-blue-700 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  />
                </div>

                <div className="flex justify-between gap-3 mt-8">
                  <Button
                    onClick={() => setStep(3)}
                    className="bg-white hover:bg-slate-100 text-slate-900 border border-slate-300 h-11 px-6 rounded-xl"
                  >
                    Voltar
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={loading || createTastingMutation.isPending}
                    className="bg-blue-700 hover:bg-blue-800 text-white h-11 px-6 rounded-xl disabled:opacity-50"
                  >
                    {loading || createTastingMutation.isPending ? "Enviando..." : "Iniciar Degustação"}
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}
