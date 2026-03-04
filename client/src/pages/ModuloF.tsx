import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function ModuloF() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      <div className="w-full h-96 overflow-hidden">
        <img
          src="https://d2xsxph8kpxj0f.cloudfront.net/310519663390392783/g9GC8npXGtLqRcd8tG3q6A/modulo-f-conexao-v2-7jgaca3Shg3kmj64W4eyBk.webp"
          alt="Conexão com Quem Partiu"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="bg-gradient-to-r from-primary/20 to-primary/10 border-b border-primary/30 py-12">
        <div className="container mx-auto px-4">
          <Link href="/">
            <Button variant="ghost" className="mb-6">← Voltar</Button>
          </Link>
          <div className="text-5xl mb-4">🕊️</div>
          <h1 className="text-4xl font-bold text-primary mb-2" style={{ fontFamily: "'Cinzel', serif" }}>
            Conexão com Quem Partiu
          </h1>
          <p className="text-xl text-muted-foreground">Como honrar quem se foi e seguir em frente?</p>
          <p className="text-sm text-primary/70 mt-4">Análise disponível agora — vagas limitadas</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="prose prose-invert max-w-none">
          <h2 className="text-2xl font-bold text-primary mb-4">O que este módulo faz</h2>
          <p className="text-muted-foreground mb-6">
            Revela como honrar quem se foi e seguir em frente. Mostra o caminho para transformar a dor em sabedoria.
          </p>

          <h2 className="text-2xl font-bold text-primary mb-4">Para quem é</h2>
          <p className="text-muted-foreground mb-6">
            Para quem perdeu alguém importante. Para quem quer transformar o luto em crescimento.
          </p>

          <h2 className="text-2xl font-bold text-primary mb-4">O que inclui na degustação</h2>
          <p className="text-muted-foreground mb-6">
            Análise dos seus 4 Pilares SAJO focada em luto e transformação. Você descobre como honrar e seguir.
          </p>

          <h2 className="text-2xl font-bold text-primary mb-4">Perguntas que você pode fazer</h2>
          <ul className="text-muted-foreground space-y-2 mb-6">
            <li>• Como honrar quem se foi?</li>
            <li>• Como seguir em frente sem culpa?</li>
            <li>• Qual é a mensagem que essa pessoa deixou?</li>
            <li>• Como transformar a dor em sabedoria?</li>
          </ul>

          <h2 className="text-2xl font-bold text-primary mb-4">Perguntas Frequentes</h2>
          <div className="space-y-4 mb-6">
            <div>
              <h4 className="font-semibold text-primary mb-2">Isso é contato com espíritos?</h4>
              <p className="text-muted-foreground">Não. É análise simbólica do seu padrão de luto e transformação.</p>
            </div>
            <div>
              <h4 className="font-semibold text-primary mb-2">Quanto tempo depois da perda posso usar?</h4>
              <p className="text-muted-foreground">Não há limite. O módulo funciona em qualquer momento.</p>
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/30 rounded-lg p-6 mb-6">
            <p className="text-sm text-muted-foreground">
              <strong>Importante:</strong> Este módulo é análise simbólica. Para luto complicado, considere terapia profissional.
            </p>
          </div>
        </div>

        <div className="text-center py-8">
          <Link href="/?scroll=form">
            <Button size="lg" className="text-lg px-8 py-6">
              FAZER MINHA ANÁLISE GRATUITA AGORA
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
