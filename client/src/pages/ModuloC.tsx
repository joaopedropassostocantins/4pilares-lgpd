import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function ModuloC() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      <div className="w-full h-96 overflow-hidden">
        <img
          src="https://d2xsxph8kpxj0f.cloudfront.net/310519663390392783/g9GC8npXGtLqRcd8tG3q6A/modulo-c-conflitos-v2-bQJYRSmif7ywTrzRrpDYm9.webp"
          alt="Navegador de Conflitos"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="bg-gradient-to-r from-primary/20 to-primary/10 border-b border-primary/30 py-12">
        <div className="container mx-auto px-4">
          <Link href="/">
            <Button variant="ghost" className="mb-6">← Voltar</Button>
          </Link>
          <div className="text-5xl mb-4">🌉</div>
          <h1 className="text-4xl font-bold text-primary mb-2" style={{ fontFamily: "'Cinzel', serif" }}>
            Navegador de Conflitos
          </h1>
          <p className="text-xl text-muted-foreground">Como resolver isso sem destruir o relacionamento?</p>
          <p className="text-sm text-primary/70 mt-4">Análise disponível agora — vagas limitadas</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="prose prose-invert max-w-none">
          <h2 className="text-2xl font-bold text-primary mb-4">O que este módulo faz</h2>
          <p className="text-muted-foreground mb-6">
            Revela o padrão que te prende em conflitos relacionais. Mostra como resolver sem destruir o que importa.
          </p>

          <h2 className="text-2xl font-bold text-primary mb-4">Para quem é</h2>
          <p className="text-muted-foreground mb-6">
            Para quem quer resolver conflitos mantendo o relacionamento. Para quem repete o mesmo padrão em todas as relações.
          </p>

          <h2 className="text-2xl font-bold text-primary mb-4">O que inclui na degustação</h2>
          <p className="text-muted-foreground mb-6">
            Análise dos seus 4 Pilares SAJO focada em padrões de conflito. Você descobre qual é o "gancho" que te prende.
          </p>

          <h2 className="text-2xl font-bold text-primary mb-4">Perguntas que você pode fazer</h2>
          <ul className="text-muted-foreground space-y-2 mb-6">
            <li>• Por que sempre me vejo no mesmo conflito?</li>
            <li>• Como resolver sem destruir o relacionamento?</li>
            <li>• Qual é meu padrão em conflitos?</li>
            <li>• Qual é o melhor momento para conversar?</li>
          </ul>

          <h2 className="text-2xl font-bold text-primary mb-4">Perguntas Frequentes</h2>
          <div className="space-y-4 mb-6">
            <div>
              <h4 className="font-semibold text-primary mb-2">Isso garante que o conflito vai resolver?</h4>
              <p className="text-muted-foreground">Não. É análise do seu padrão. A resolução depende de ambas as partes.</p>
            </div>
            <div>
              <h4 className="font-semibold text-primary mb-2">Preciso trazer a outra pessoa?</h4>
              <p className="text-muted-foreground">Não. O módulo analisa seu padrão individual.</p>
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/30 rounded-lg p-6 mb-6">
            <p className="text-sm text-muted-foreground">
              <strong>Importante:</strong> Este módulo é análise simbólica. Para conflitos graves, considere terapia profissional.
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
