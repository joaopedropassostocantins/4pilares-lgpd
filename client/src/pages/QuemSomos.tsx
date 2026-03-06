import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function QuemSomosPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-border/30 py-12">
        <div className="container mx-auto px-4">
          <Link href="/">
            <Button variant="ghost" className="mb-6">← Voltar</Button>
          </Link>
          <div className="text-5xl mb-4">🏛️</div>
          <h1 className="text-4xl font-bold text-primary mb-2" style={{ fontFamily: "'Cinzel', serif" }}>
            Quem Somos
          </h1>
          <p className="text-xl text-muted-foreground">Preservando a sabedoria milenar do Musok coreano</p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Logo */}
        <div className="text-center mb-12">
          <img 
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663390392783/g9GC8npXGtLqRcd8tG3q6A/IMG_7629_4d8cbc7e.PNG" 
            alt="Pilares da Sabedoria" 
            className="h-32 w-auto mx-auto mb-6"
          />
        </div>

        {/* Main Text */}
        <div className="prose prose-invert max-w-none mb-12">
          <div className="bg-primary/5 border border-primary/30 rounded-lg p-8 mb-8">
            <p className="text-lg text-foreground leading-relaxed mb-6">
              <strong>A Pilares da Sabedoria</strong> é uma organização dedicada a preservar e disseminar o conhecimento milenar do <strong>Musok (무속) coreano</strong>. O Musok, ou xamanismo coreano, é uma tradição viva na Coreia do Sul, onde os praticantes, conhecidos como <strong>Mudang (mulheres)</strong> e <strong>Paksu (homens)</strong>, atuam como intermediários entre o mundo espiritual e o humano.
            </p>

            <p className="text-lg text-foreground leading-relaxed mb-6">
              Tradicionalmente transmitido de mestre para aprendiz ou através de experiências espirituais como a <em>"doença espiritual" (Shinbyeong)</em>, o Musok hoje também é ensinado em escolas privadas e centros de estudo, oferecendo um caminho estruturado para aprender seus rituais e magias.
            </p>

            <p className="text-lg text-foreground leading-relaxed">
              Nossos especialistas são treinados nas diversas habilidades necessárias para a realização do <strong><em>Kut</em></strong> (ritual xamânico), que inclui cânticos e danças sagradas, rituais de cura, adivinhação e o manuseio de talismãs para proteção. Através de nossos módulos, conectamos você a essa sabedoria ancestral, oferecendo acompanhamento e análises personalizadas baseadas nos princípios autênticos do Musok.
            </p>
          </div>

          {/* Pillars */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-card border border-border/30 rounded-lg p-6">
              <div className="text-4xl mb-4">🔮</div>
              <h3 className="text-xl font-bold text-primary mb-3">Tradição Autêntica</h3>
              <p className="text-muted-foreground">
                Preservamos e ensinamos os conhecimentos genuínos do Musok coreano, respeitando suas origens e práticas ancestrais.
              </p>
            </div>

            <div className="bg-card border border-border/30 rounded-lg p-6">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-xl font-bold text-primary mb-3">Educação Estruturada</h3>
              <p className="text-muted-foreground">
                Oferecemos módulos bem organizados que permitem aprender desde os fundamentos até as práticas avançadas do xamanismo.
              </p>
            </div>

            <div className="bg-card border border-border/30 rounded-lg p-6">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-bold text-primary mb-3">Acompanhamento Pessoal</h3>
              <p className="text-muted-foreground">
                Cada aluno recebe atenção personalizada de especialistas experientes durante todo o seu caminho de aprendizado.
              </p>
            </div>
          </div>

          {/* Musok Practices */}
          <div className="bg-secondary/5 border border-secondary/30 rounded-lg p-8 mb-12">
            <h2 className="text-2xl font-bold text-primary mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
              O que é Musok?
            </h2>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-foreground mb-2">🎭 Rituais Sagrados (Kut)</h4>
                <p className="text-muted-foreground">
                  Cerimônias complexas que envolvem cânticos, danças e oferendas para comunicação com o mundo espiritual.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-foreground mb-2">🔮 Adivinhação (Mudang Gut)</h4>
                <p className="text-muted-foreground">
                  Técnicas ancestrais para ler sinais, interpretar mensagens espirituais e orientar decisões importantes.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-foreground mb-2">💫 Cura Espiritual</h4>
                <p className="text-muted-foreground">
                  Práticas para equilibrar energias, remover bloqueios e restaurar harmonia física e emocional.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-foreground mb-2">🛡️ Proteção e Talismãs</h4>
                <p className="text-muted-foreground">
                  Criação de amuletos e rituais de proteção contra influências negativas e energias prejudiciais.
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-primary/10 border border-primary/30 rounded-lg p-8 text-center">
            <h3 className="text-2xl font-bold text-primary mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Pronto para aprender?
            </h3>
            <p className="text-muted-foreground mb-6">
              Escolha um módulo e comece sua jornada na sabedoria do Musok coreano.
            </p>
            <Link href="/">
              <Button size="lg" className="gap-2">
                Explorar Módulos <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
