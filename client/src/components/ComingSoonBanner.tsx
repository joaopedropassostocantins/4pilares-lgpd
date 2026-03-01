import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Sparkles, Mail, Bell } from "lucide-react";

export default function ComingSoonBanner() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-primary/20 via-primary/10 to-primary/5 border-2 border-primary/40 rounded-xl p-8 md:p-12 my-8">
      {/* Animated background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -mr-48 -mt-48 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full -ml-32 -mb-32 animate-pulse" style={{ animationDelay: '1s' }} />

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-start gap-4 mb-6">
          <div className="text-4xl animate-bounce">✨</div>
          <div>
            <h3 className="text-2xl md:text-3xl font-bold text-primary mb-2" style={{ fontFamily: "'Cinzel', serif" }}>
              Novidades em Breve
            </h3>
            <p className="text-muted-foreground">
              Estamos desenvolvendo 6 módulos especializados para transformar sua vida
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="flex gap-3">
            <Sparkles className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
            <div>
              <p className="font-semibold text-foreground">Oráculo dos Investimentos</p>
              <p className="text-sm text-muted-foreground">Análise simbólica de suas decisões financeiras</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Sparkles className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
            <div>
              <p className="font-semibold text-foreground">Conselheiro Judicial</p>
              <p className="text-sm text-muted-foreground">Orientação simbólica para questões legais</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Sparkles className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
            <div>
              <p className="font-semibold text-foreground">Navegador de Conflitos</p>
              <p className="text-sm text-muted-foreground">Caminhos para resolver relacionamentos</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Sparkles className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
            <div>
              <p className="font-semibold text-foreground">Oráculo do Amor</p>
              <p className="text-sm text-muted-foreground">Reflexão profunda sobre seus padrões afetivos</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/cadastro">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
              <Bell className="h-4 w-4" />
              Garantir Minha Vaga
            </Button>
          </Link>
          <Button variant="outline" className="border-primary/40 text-primary hover:bg-primary/10 gap-2">
            <Mail className="h-4 w-4" />
            Notificar-me
          </Button>
        </div>

        {/* Social proof */}
        <p className="text-xs text-muted-foreground mt-6">
          🔒 Seus dados são protegidos conforme a LGPD. Sem spam. Sem compromisso.
        </p>
      </div>
    </div>
  );
}
