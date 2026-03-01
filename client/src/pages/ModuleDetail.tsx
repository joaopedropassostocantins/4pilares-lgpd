import { Link, useRoute } from "wouter";
import { modules } from "@/data/modules";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ModuleDetail() {
  const [, params] = useRoute("/modulo-:slug");
  const slug = params?.slug;
  const module = modules.find((m) => m.slug === `modulo-${slug}`);

  if (!module) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary mb-4">Módulo não encontrado</h1>
          <Link href="/">
            <Button>Voltar para Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      {/* Hero Image */}
      {module.heroImage && (
        <div className="w-full h-96 overflow-hidden">
          <img src={module.heroImage} alt={module.title} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-primary/20 to-primary/10 border-b border-primary/30 py-12">
        <div className="container mx-auto px-4">
          <Link href="/">
            <Button variant="ghost" className="mb-6">← Voltar</Button>
          </Link>
          <div className="text-5xl mb-4">{module.icon}</div>
          <h1 className="text-4xl font-bold text-primary mb-2" style={{ fontFamily: "'Cinzel', serif" }}>
            {module.title}
          </h1>
          <p className="text-xl text-muted-foreground">{module.shortDescription}</p>
          <p className="text-sm text-primary/70 mt-4">{module.status}</p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        {/* O que este módulo faz */}
        <Card className="bg-card/60 border-primary/30 mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-primary">O que este módulo faz</CardTitle>
          </CardHeader>
          <CardContent className="text-foreground leading-relaxed">
            <p>{module.shortDescription}</p>
          </CardContent>
        </Card>

        {/* O que você recebe */}
        <Card className="bg-card/60 border-primary/30 mb-8">
          <CardHeader>
            <CardTitle className="text-xl text-primary">O que você recebe na degustação</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {module.tastingIncludes.map((item, idx) => (
                <li key={idx} className="flex gap-3">
                  <span className="text-primary">✓</span>
                  <span className="text-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Exemplos de perguntas */}
        <Card className="bg-card/60 border-primary/30 mb-8">
          <CardHeader>
            <CardTitle className="text-xl text-primary">Exemplos de perguntas que você pode fazer</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {module.exampleQuestions.map((q, idx) => (
                <li key={idx} className="text-foreground italic">
                  "{q}"
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* O que NÃO faz */}
        <Card className="bg-destructive/10 border-destructive/30 mb-8">
          <CardHeader>
            <CardTitle className="text-xl text-destructive">O que este módulo NÃO faz</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {module.disclaimers.map((disclaimer, idx) => (
                <li key={idx} className="flex gap-3">
                  <span className="text-destructive">⚠️</span>
                  <span className="text-foreground">{disclaimer}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Como será a liberação */}
        <Card className="bg-card/60 border-primary/30 mb-8">
          <CardHeader>
            <CardTitle className="text-xl text-primary">Como será a liberação</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-foreground">
            <p>Os módulos são liberados por ordem de demanda real. Quanto mais pessoas se cadastram e demonstram interesse (leitura completa + cadastro), mais rápido o módulo entra em produção. Você está ajudando a decidir o que construímos primeiro.</p>
            <ul className="space-y-2 mt-4">
              <li className="flex gap-3">
                <span className="text-primary">•</span>
                <span>Vagas de degustação liberadas em blocos semanais (ex: 20 vagas/semana)</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary">•</span>
                <span>Prioridade: cadastro + leitura completa desta página + data de inscrição</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary">•</span>
                <span>Notificação por e-mail ou WhatsApp quando sua vaga for liberada</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* FAQ */}
        <Card className="bg-card/60 border-primary/30 mb-8">
          <CardHeader>
            <CardTitle className="text-xl text-primary">Perguntas Frequentes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {module.faq.map((item, idx) => (
              <div key={idx}>
                <h4 className="font-semibold text-primary mb-2">P: {item.question}</h4>
                <p className="text-foreground text-sm">R: {item.answer}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="bg-gradient-to-br from-primary/20 to-primary/10 border-primary/50 rounded-lg p-8 text-center mb-12">
          <h3 className="text-2xl font-bold text-primary mb-4">Quero acesso antecipado</h3>
          <p className="text-foreground mb-6">Garanta sua vaga na lista de espera. Gratuito. Sem compromisso.</p>
          <Link href={`/cadastro?modulo=${module.id}`}>
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              GARANTIR MINHA VAGA NA LISTA
            </Button>
          </Link>
        </div>

        {/* LGPD Footer */}
        <div className="bg-muted/30 border border-muted-foreground/20 rounded-lg p-6 text-sm text-muted-foreground">
          <h4 className="font-semibold text-foreground mb-3">Sobre Degustação, LGPD e Responsabilidade</h4>
          <p className="mb-3">
            A degustação FUSION-SAJO é uma experiência de leitura simbólica e reflexão orientada por IA. NÃO é diagnóstico médico, psicológico ou psiquiátrico. NÃO substitui advogado, assessor financeiro ou profissional de saúde. NÃO garante resultados financeiros, jurídicos ou pessoais. É uma ferramenta de autoconhecimento e organização de pensamento.
          </p>
          <p>
            Seus dados são tratados conforme a LGPD. Você pode solicitar exclusão a qualquer momento em privacidade@fusionsajo.com.br
          </p>
        </div>
      </div>
    </div>
  );
}
