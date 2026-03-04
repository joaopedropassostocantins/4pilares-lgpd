import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { modules } from "@/data/modules";

import { Link } from "wouter";

export default function BetaSignup() {
  const [, params] = useRoute("/cadastro");
  const [, navigate] = useLocation();
  
  const moduleId = new URLSearchParams(window.location.search).get("modulo");
  const selectedModule = modules.find((m) => m.id === moduleId);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: "",
    moduleId: moduleId || "a",
    lgpdConsent: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      alert("Nome e email são obrigatórios");
      return;
    }

    if (!formData.lgpdConsent) {
      alert("Você precisa aceitar os termos de LGPD");
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Implement API call to save beta signup
      // For now, just simulate success
      await new Promise((resolve) => setTimeout(resolve, 1000));

      alert("Seu cadastro foi realizado com sucesso!");

      // Redirect to thank you page
      navigate(`/obrigado-cadastro?modulo=${formData.moduleId}`);
    } catch (error) {
      alert("Ocorreu um erro ao processar seu cadastro");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/20 to-primary/10 border-b border-primary/30 py-8">
        <div className="container mx-auto px-4">
          <Link href="/">
            <Button variant="ghost" className="mb-4">← Voltar</Button>
          </Link>
          <h1 className="text-3xl font-bold text-primary" style={{ fontFamily: "'Cinzel', serif" }}>
            Garanta sua vaga na lista de espera
          </h1>
          <p className="text-muted-foreground mt-2">Gratuito. Sem compromisso. Sem spam.</p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        {selectedModule && (
          <Card className="bg-card/60 border-primary/30 mb-8">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="text-4xl">{selectedModule.icon}</div>
                <div>
                  <h3 className="text-lg font-semibold text-primary">{selectedModule.title}</h3>
                  <p className="text-sm text-muted-foreground">{selectedModule.shortDescription}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="bg-card/60 border-primary/30 mb-8">
          <CardHeader>
            <CardTitle>Seu cadastro</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nome */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Nome completo *
                </label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Seu nome"
                  className="bg-background/50 border-primary/30"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email *
                </label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="seu@email.com"
                  className="bg-background/50 border-primary/30"
                  required
                />
              </div>

              {/* WhatsApp */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  WhatsApp (opcional)
                </label>
                <Input
                  type="tel"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  placeholder="(11) 99999-9999"
                  className="bg-background/50 border-primary/30"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Usaremos apenas para notificar quando sua vaga for liberada
                </p>
              </div>

              {/* Módulo */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Qual módulo você quer primeiro? *
                </label>
                <select
                  name="moduleId"
                  value={formData.moduleId}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-background/50 border border-primary/30 rounded-lg text-foreground"
                >
                  {modules.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.icon} {m.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* LGPD */}
              <div className="flex items-start gap-3">
                <Checkbox
                  id="lgpd"
                  name="lgpdConsent"
                  checked={formData.lgpdConsent}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, lgpdConsent: checked as boolean }))
                  }
                  className="mt-1" style={{borderColor: '#f9f9f9'}}
                />
                <label htmlFor="lgpd" className="text-sm text-muted-foreground cursor-pointer">
                  Concordo que meus dados sejam tratados conforme a LGPD. Posso solicitar exclusão a qualquer momento em privacidade@fusionsajo.com.br *
                </label>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-6 text-lg font-bold"
              >
                {isSubmitting ? "Processando..." : "GARANTIR MINHA VAGA"}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                Você receberá um email de confirmação + notificação quando sua vaga for liberada
              </p>
            </form>
          </CardContent>
        </Card>

        {/* Info */}
        <Card className="bg-muted/30 border-muted-foreground/20">
          <CardHeader>
            <CardTitle className="text-base">Como funciona a fila de espera</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              <strong>1. Você se cadastra</strong> — Seu nome entra na fila de espera do módulo escolhido
            </p>
            <p>
              <strong>2. Nós liberamos vagas</strong> — A cada semana, liberamos 20 vagas de degustação por módulo
            </p>
            <p>
              <strong>3. Você é chamado</strong> — Quando chegar sua vez, você recebe email + WhatsApp com link de acesso
            </p>
            <p>
              <strong>4. Você faz a degustação</strong> — Acesso imediato. Sem pagamento. Sem compromisso.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
