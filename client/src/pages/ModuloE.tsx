import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function ModuloE() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      <div className="w-full h-96 overflow-hidden">
        <img 
          src="https://d2xsxph8kpxj0f.cloudfront.net/310519663390392783/g9GC8npXGtLqRcd8tG3q6A/modulo-e-saida-v2-KLGDcataadpVdiuHxkPJWG.webp" 
          alt="Caminho de Saída" 
          className="w-full h-full object-cover" 
        />
      </div>

      <div className="bg-gradient-to-r from-primary/20 to-primary/10 border-b border-primary/30 py-12">
        <div className="container mx-auto px-4">
          <Link href="/">
            <Button variant="ghost" className="mb-6">← Voltar</Button>
          </Link>
          <div className="text-5xl mb-4">🚪</div>
          <h1 className="text-4xl font-bold text-primary mb-2" style={{ fontFamily: "'Cinzel', serif" }}>
            Caminho de Saída
          </h1>
          <p className="text-xl text-muted-foreground">Como sair dessa situação sem destruir tudo?</p>
          <p className="text-sm text-primary/70 mt-4">Em breve — acesso antecipado disponível</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="prose prose-invert max-w-none">
          <h2 className="text-2xl font-bold text-primary mb-4">O que este módulo faz</h2>
          <p className="text-muted-foreground mb-6">
            Revela como sair de uma situação difícil mantendo sua integridade. Mostra o caminho sem destruir relacionamentos ou oportunidades.
          </p>

          <h2 className="text-2xl font-bold text-primary mb-4">Para quem é</h2>
          <p className="text-muted-foreground mb-6">
            Para quem está preso em uma situação e não sabe como sair. Para empreendedores que querem encerrar um negócio com dignidade.
          </p>

          <h2 className="text-2xl font-bold text-primary mb-4">O que inclui na degustação</h2>
          <p className="text-muted-foreground mb-6">
            Análise dos seus 4 Pilares SAJO focada em saídas estratégicas. Você descobre qual é o melhor caminho.
          </p>

          <h2 className="text-2xl font-bold text-primary mb-4">Perguntas que você pode fazer</h2>
          <ul className="text-muted-foreground space-y-2 mb-6">
            <li>• Como sair dessa situação sem destruir tudo?</li>
            <li>• Qual é o melhor momento para sair?</li>
            <li>• Como manter minha reputação?</li>
            <li>• Qual é o caminho mais seguro?</li>
          </ul>

          <h2 className="text-2xl font-bold text-primary mb-4">Perguntas Frequentes</h2>
          <div className="space-y-4 mb-6">
            <div>
              <h4 className="font-semibold text-primary mb-2">Isso garante que vou conseguir sair?</h4>
              <p className="text-muted-foreground">Não. É análise do seu padrão e do melhor caminho. A ação é sua.</p>
            </div>
            <div>
              <h4 className="font-semibold text-primary mb-2">Preciso estar em uma situação específica?</h4>
              <p className="text-muted-foreground">Não. O módulo funciona para qualquer tipo de saída.</p>
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/30 rounded-lg p-6 mb-6">
            <p className="text-sm text-muted-foreground">
              <strong>Importante:</strong> Este módulo é análise simbólica. Para situações legais complexas, consulte um profissional.
            </p>
          </div>
        </div>

        <div className="text-center py-8">
          <Link href="/cadastro">
            <Button size="lg" className="text-lg px-8 py-6">
              GARANTIR MINHA VAGA NA LISTA
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
