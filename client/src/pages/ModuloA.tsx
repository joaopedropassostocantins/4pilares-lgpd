import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import AnalysisBanner from "@/components/AnalysisBanner";

export default function ModuloA() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      <AnalysisBanner />
      {/* Hero Image */}
      <div className="w-full h-96 overflow-hidden">
        <img
          src="https://d2xsxph8kpxj0f.cloudfront.net/310519663390392783/g9GC8npXGtLqRcd8tG3q6A/modulo-a-investimentos-v2-YTyBBvNG5NunKMKX95X6eF.webp"
          alt="Oráculo dos Investimentos"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-primary/20 to-primary/10 border-b border-primary/30 py-12">
        <div className="container mx-auto px-4">
          <Link href="/">
            <Button variant="ghost" className="mb-6">← Voltar</Button>
          </Link>
          <div className="text-5xl mb-4">💰</div>
          <h1 className="text-4xl font-bold text-primary mb-2" style={{ fontFamily: "'Cinzel', serif" }}>
            Oráculo dos Investimentos
          </h1>
          <p className="text-xl text-muted-foreground">Onde colocar meu dinheiro quando tudo parece incerto?</p>
          <p className="text-sm text-gold/80 mt-4 font-semibold">✦ Análise disponível — Acesso gratuito</p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="prose prose-invert max-w-none">
          <h2 className="text-2xl font-bold text-primary mb-4">O que este módulo faz</h2>
          <p className="text-muted-foreground mb-6">
            Revela os padrões ocultos nas suas decisões financeiras. Não é previsão de mercado — é análise do seu comportamento com dinheiro, baseada nos 4 Pilares SAJO.
          </p>

          <h2 className="text-2xl font-bold text-primary mb-4">Para quem é</h2>
          <p className="text-muted-foreground mb-6">
            Para quem quer entender por que repete os mesmos erros com dinheiro. Para empreendedores que sabem que o problema não é falta de oportunidade, mas padrão de decisão.
          </p>

          <h2 className="text-2xl font-bold text-primary mb-4">O que inclui na degustação</h2>
          <p className="text-muted-foreground mb-6">
            Análise dos seus 4 Pilares SAJO focada em padrões financeiros. Você descobre qual é o "gancho" que te prende em decisões ruins com dinheiro.
          </p>

          <h2 className="text-2xl font-bold text-primary mb-4">Perguntas que você pode fazer</h2>
          <ul className="text-muted-foreground space-y-2 mb-6">
            <li>• Por que sempre invisto em coisas que não dão certo?</li>
            <li>• Qual é meu padrão com dinheiro?</li>
            <li>• Como sair do ciclo de decisões financeiras ruins?</li>
            <li>• Qual é o momento certo para investir?</li>
          </ul>

          <h2 className="text-2xl font-bold text-primary mb-4">Perguntas Frequentes</h2>
          <div className="space-y-4 mb-6">
            <div>
              <h4 className="font-semibold text-primary mb-2">Isso é análise de mercado?</h4>
              <p className="text-muted-foreground">Não. É análise do seu padrão de decisão. O mercado muda, mas seu padrão é consistente.</p>
            </div>
            <div>
              <h4 className="font-semibold text-primary mb-2">Preciso ter experiência em investimentos?</h4>
              <p className="text-muted-foreground">Não. O módulo funciona para iniciantes e experientes. O padrão é o mesmo.</p>
            </div>
            <div>
              <h4 className="font-semibold text-primary mb-2">Quando vou receber a análise completa?</h4>
              <p className="text-muted-foreground">Após liberar sua vaga na fila de espera. Você receberá um email com a data estimada.</p>
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/30 rounded-lg p-6 mb-6">
            <p className="text-sm text-muted-foreground">
              <strong>Importante:</strong> Este módulo é análise simbólica baseada em astrologia coreana ancestral. Não substitui aconselhamento financeiro profissional. Consulte um consultor financeiro certificado para decisões de investimento.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center py-8">
          <Link href="/">
            <Button size="lg" className="text-lg px-8 py-6">
              FAZER MINHA ANÁLISE GRATUITA
            </Button>
          </Link>
          <p className="text-sm text-muted-foreground mt-4">
            Acesso liberado por demanda. Quanto mais interesse, mais rápido você entra.
          </p>
        </div>
      </div>
    </div>
  );
}
