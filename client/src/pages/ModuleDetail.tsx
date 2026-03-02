import { useState } from "react";
import { Link, useRoute } from "wouter";
import { modules } from "@/data/modules";
import { ArrowLeft, ChevronDown, ChevronUp, Sparkles, Shield } from "lucide-react";

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-border/50 rounded-lg overflow-hidden transition-all hover:border-gold/30">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-purple/10 transition-colors"
      >
        <span className="font-semibold text-foreground text-sm">{question}</span>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-gold flex-shrink-0" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        )}
      </button>
      {isOpen && (
        <div className="px-5 py-4 border-t border-border/30 bg-card/40">
          <p className="text-muted-foreground text-sm leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}

export default function ModuleDetail() {
  const [, params] = useRoute("/modulo-:slug");
  const slug = params?.slug ? `modulo-${params.slug}` : "";
  const module = modules.find((m) => m.slug === slug);

  if (!module) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1
            className="text-3xl font-bold shimmer-gold mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Módulo não encontrado
          </h1>
          <Link href="/">
            <span className="btn-gold inline-block">Voltar para Home</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Image */}
      {module.heroImage && (
        <div className="w-full h-64 md:h-96 overflow-hidden relative">
          <img
            src={module.heroImage}
            alt={module.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
        </div>
      )}

      {/* Header */}
      <div className="max-w-3xl mx-auto px-5 -mt-16 relative z-10">
        <Link href="/">
          <span className="inline-flex items-center gap-2 text-gold text-sm mb-6 hover:text-gold/80 transition-colors cursor-pointer">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </span>
        </Link>

        <div className="text-5xl mb-4">{module.icon}</div>
        <h1
          className="text-3xl md:text-4xl font-bold shimmer-gold mb-3"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {module.title}
        </h1>
        <p className="text-lg text-muted-foreground mb-2">
          {module.shortDescription}
        </p>
        <span className="inline-block px-3 py-1 bg-purple/20 text-purple-light text-xs font-semibold rounded-full border border-purple/30">
          {module.status}
        </span>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-5 py-12 space-y-10">
        {/* Full Description */}
        <div className="module-card">
          <h2
            className="text-xl font-bold text-gold mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Sobre este módulo
          </h2>
          <div className="text-muted-foreground leading-relaxed text-sm whitespace-pre-line">
            {module.fullDescription}
          </div>
        </div>

        {/* O que você recebe */}
        <div className="module-card">
          <h2
            className="text-xl font-bold text-gold mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            O que você recebe na degustação
          </h2>
          <ul className="space-y-3">
            {module.tastingIncludes.map((item, idx) => (
              <li key={idx} className="flex gap-3 text-sm">
                <span className="text-gold flex-shrink-0">✓</span>
                <span className="text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Exemplos de perguntas */}
        <div className="module-card">
          <h2
            className="text-xl font-bold text-gold mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Exemplos de perguntas
          </h2>
          <ul className="space-y-3">
            {module.exampleQuestions.map((q, idx) => (
              <li key={idx} className="text-muted-foreground text-sm italic">
                "{q}"
              </li>
            ))}
          </ul>
        </div>

        {/* Disclaimers */}
        <div className="module-card border-red-500/20">
          <h2
            className="text-xl font-bold text-red-400 mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            O que este módulo NÃO faz
          </h2>
          <ul className="space-y-3">
            {module.disclaimers.map((disclaimer, idx) => (
              <li key={idx} className="flex gap-3 text-sm">
                <span className="text-red-400 flex-shrink-0">⚠️</span>
                <span className="text-muted-foreground">{disclaimer}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* FAQ */}
        <div>
          <h2
            className="text-xl font-bold shimmer-gold mb-6"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Perguntas Frequentes
          </h2>
          <div className="space-y-3">
            {module.faq.map((item, idx) => (
              <FAQItem key={idx} question={item.question} answer={item.answer} />
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="module-card text-center border-gold/30">
          <Sparkles className="h-8 w-8 text-gold mx-auto mb-4" />
          <h3
            className="text-2xl font-bold shimmer-gold mb-3"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Quero acesso antecipado
          </h3>
          <p className="text-muted-foreground mb-6 text-sm">
            Garanta sua vaga na lista de espera. Gratuito. Sem compromisso.
          </p>
          <Link href={`/cadastro?modulo=${module.id}`}>
            <span className="btn-gold btn-gold-pulse inline-block">
              GARANTIR MINHA VAGA NA LISTA
            </span>
          </Link>
        </div>

        {/* LGPD Footer */}
        <div className="bg-card/30 border border-border/30 rounded-lg p-6 text-xs text-muted-foreground">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="h-4 w-4 text-gold" />
            <h4 className="font-semibold text-foreground text-sm">
              Sobre Degustação, LGPD e Responsabilidade
            </h4>
          </div>
          <p className="mb-2 leading-relaxed">
            A degustação FUSION-SAJO é uma experiência de leitura simbólica e reflexão orientada por
            IA. NÃO é diagnóstico médico, psicológico ou psiquiátrico. NÃO substitui advogado,
            assessor financeiro ou profissional de saúde. NÃO garante resultados financeiros,
            jurídicos ou pessoais. É uma ferramenta de autoconhecimento e organização de pensamento.
          </p>
          <p className="leading-relaxed">
            Seus dados são tratados conforme a LGPD. Você pode solicitar exclusão a qualquer momento
            em privacidade@fusionsajo.com.br
          </p>
        </div>
      </div>
    </div>
  );
}
