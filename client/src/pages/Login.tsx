/*
 * Login.tsx — 4 Pilares LGPD
 * Página de login premium com dark background
 */
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Scale, Mail, Lock, Eye, EyeOff, ArrowRight, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Login() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Preencha e-mail e senha.");
      return;
    }
    setLoading(true);
    // Simulação de login — substituir por tRPC auth quando disponível
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    toast.success("Login realizado com sucesso!");
    setLocation("/portal");
  };

  return (
    <div
      className="min-h-screen flex"
      style={{ background: "linear-gradient(135deg, #060B14 0%, #0C1525 60%, #111827 100%)" }}
    >
      {/* Left — branding */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12">
        <Link href="/">
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
              <Scale className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white font-semibold text-lg leading-none">4 Pilares LGPD</p>
              <p className="text-slate-500 text-xs font-mono mt-0.5">Consultoria & Compliance</p>
            </div>
          </div>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <div>
            <h1 className="text-4xl font-serif text-white leading-tight mb-4">
              Sua empresa em conformidade<br />
              <span className="text-blue-400">com a LGPD.</span>
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              Acesse sua área exclusiva e acompanhe o progresso da adequação da sua empresa em tempo real.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Lei 13.709/2018", sub: "Totalmente coberta" },
              { label: "4 Pilares", sub: "Framework completo" },
              { label: "ANPD", sub: "Regulamentações" },
              { label: "DPO", sub: "Encarregado dedicado" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl p-4 border"
                style={{ backgroundColor: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.08)" }}
              >
                <p className="text-white font-semibold text-sm">{item.label}</p>
                <p className="text-slate-500 text-xs mt-0.5">{item.sub}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <Shield className="w-4 h-4 text-green-500" />
            <span>Plataforma segura com criptografia de ponta a ponta</span>
          </div>
        </motion.div>

        <p className="text-slate-600 text-sm">© 2025 4 Pilares LGPD. Todos os direitos reservados.</p>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
              <Scale className="w-4 h-4 text-white" />
            </div>
            <p className="text-white font-semibold">4 Pilares LGPD</p>
          </div>

          <div
            className="rounded-2xl p-8 border"
            style={{ backgroundColor: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.10)" }}
          >
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-white">Acessar plataforma</h2>
              <p className="text-slate-400 text-sm mt-1">Entre com suas credenciais para continuar</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-1.5">E-mail</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg text-white placeholder-slate-500 outline-none border focus:border-blue-500 transition-colors text-sm"
                    style={{ backgroundColor: "rgba(255,255,255,0.07)", borderColor: "rgba(255,255,255,0.12)" }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 text-sm font-medium mb-1.5">Senha</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-lg text-white placeholder-slate-500 outline-none border focus:border-blue-500 transition-colors text-sm"
                    style={{ backgroundColor: "rgba(255,255,255,0.07)", borderColor: "rgba(255,255,255,0.12)" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
                  <input type="checkbox" className="rounded" />
                  Lembrar-me
                </label>
                <button type="button" className="text-blue-400 hover:text-blue-300 transition-colors">
                  Esqueci a senha
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-semibold flex items-center justify-center gap-2 transition-colors text-sm"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Entrar <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t text-center space-y-3" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
              <p className="text-slate-400 text-sm">
                Não tem conta?{" "}
                <Link href="/degustacao">
                  <span className="text-blue-400 hover:text-blue-300 cursor-pointer font-medium transition-colors">
                    Solicitar diagnóstico gratuito
                  </span>
                </Link>
              </p>
              <p className="text-slate-500 text-xs">
                Ou{" "}
                <Link href="/checkout">
                  <span className="text-slate-400 hover:text-slate-300 cursor-pointer transition-colors underline">
                    assine agora um plano
                  </span>
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
