import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export default function GarantiaPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: "Como funciona a garantia de devolução?",
      answer: "Se você não ficar satisfeito com a análise ou o acompanhamento, devolvemos 100% do valor pago. Sem perguntas, sem burocracia. Basta entrar em contato via WhatsApp.",
    },
    {
      question: "Qual é o prazo para solicitar a devolução?",
      answer: "Você tem até 30 dias após o pagamento para solicitar a devolução. Não há prazo mínimo de uso — se quiser devolver no primeiro dia, pode.",
    },
    {
      question: "Como solicito a devolução?",
      answer: "Entre em contato via WhatsApp com seu nome e email. Você receberá um formulário simples para preencher. Processamos a devolução em até 5 dias úteis.",
    },
    {
      question: "A devolução é automática?",
      answer: "Sim. Após confirmar sua solicitação, o reembolso é processado automaticamente para o cartão ou conta que você usou para pagar.",
    },
    {
      question: "E se eu tiver dúvidas sobre a análise?",
      answer: "Durante os 90 dias de acompanhamento, você tem acesso direto ao Xamã via videochamada semanal. Todas as suas dúvidas serão respondidas.",
    },
    {
      question: "Posso compartilhar a análise com outras pessoas?",
      answer: "A análise é pessoal e intransferível. Cada pessoa precisa fazer sua própria análise para receber acompanhamento personalizado.",
    },
    {
      question: "O que acontece após os 90 dias?",
      answer: "Após 90 dias, o acompanhamento semanal termina. Você mantém acesso à sua análise completa. Pode contratar novos módulos ou renovar o acompanhamento quando quiser.",
    },
    {
      question: "Posso cancelar a videochamada semanal?",
      answer: "Sim. Se precisar pular uma semana, avise com antecedência. Mas recomendamos manter o acompanhamento para aproveitar ao máximo a análise.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/20 to-primary/10 border-b border-primary/30 py-12">
        <div className="container mx-auto px-4">
          <Link href="/">
            <Button variant="ghost" className="mb-6">← Voltar</Button>
          </Link>
          <div className="text-5xl mb-4">🛡️</div>
          <h1 className="text-4xl font-bold text-primary mb-2" style={{ fontFamily: "'Cinzel', serif" }}>
            Garantia Total de Devolução
          </h1>
          <p className="text-xl text-muted-foreground">Sua satisfação é nossa prioridade</p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        {/* Intro */}
        <div className="bg-primary/5 border border-primary/30 rounded-lg p-6 mb-12">
          <h2 className="text-2xl font-bold text-primary mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Você está protegido
          </h2>
          <p className="text-muted-foreground mb-4">
            Oferecemos garantia total de devolução porque confiamos na qualidade das nossas análises. Se não ficar satisfeito, devolvemos seu dinheiro — sem perguntas, sem burocracia.
          </p>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex gap-3">
              <span className="text-gold flex-shrink-0">✓</span>
              <span>100% de reembolso se não ficar satisfeito</span>
            </li>
            <li className="flex gap-3">
              <span className="text-gold flex-shrink-0">✓</span>
              <span>Sem prazo mínimo — devolva quando quiser</span>
            </li>
            <li className="flex gap-3">
              <span className="text-gold flex-shrink-0">✓</span>
              <span>Processamento em até 5 dias úteis</span>
            </li>
            <li className="flex gap-3">
              <span className="text-gold flex-shrink-0">✓</span>
              <span>Sem perguntas incômodas</span>
            </li>
          </ul>
        </div>

        {/* FAQ */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-primary mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
            Perguntas Frequentes
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border border-border/30 rounded-lg overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-6 py-4 text-left hover:bg-background/50 transition-colors flex items-center justify-between"
                >
                  <span className="font-semibold text-foreground">{faq.question}</span>
                  <ChevronDown
                    className={`h-5 w-5 text-muted-foreground transition-transform ${
                      openFaq === idx ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-6 py-4 bg-background/50 border-t border-border/30">
                    <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-primary/5 border border-primary/30 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-primary mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Pronto para começar?
          </h3>
          <p className="text-muted-foreground mb-6">
            Escolha um módulo e comece sua análise. Você está 100% protegido pela nossa garantia.
          </p>
          <Link href="/">
            <Button size="lg" className="text-lg px-8 py-6">
              Ver Módulos
            </Button>
          </Link>
        </div>

        {/* Support */}
        <div className="mt-12 pt-8 border-t border-border/30 text-center">
          <p className="text-muted-foreground mb-4">
            Dúvidas sobre a garantia?
          </p>
          <a
            href="https://wa.me/5511999999999?text=Olá!%20Tenho%20dúvidas%20sobre%20a%20garantia%20de%20devolução"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-gold hover:text-gold/80 transition-colors font-semibold"
          >
            💬 Fale conosco no WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
