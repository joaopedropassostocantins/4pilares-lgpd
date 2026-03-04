import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function ModuloB() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      <div className="w-full h-96 overflow-hidden">
        <img
          src="https://d2xsxph8kpxj0f.cloudfront.net/310519663390392783/g9GC8npXGtLqRcd8tG3q6A/modulo-b-judicial-v2-7XmnjC5F5o9CQXubcXSf4k.webp"
          alt="Conselheiro Judicial"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="bg-gradient-to-r from-primary/20 to-primary/10 border-b border-primary/30 py-12">
        <div className="container mx-auto px-4">
          <Link href="/">
            <Button variant="ghost" className="mb-6">← Voltar</Button>
          </Link>
          <div className="text-5xl mb-4">⚖️</div>
          <h1 className="text-4xl font-bold text-primary mb-2" style={{ fontFamily: "'Cinzel', serif" }}>
            Conselheiro Judicial
          </h1>
          <p className="text-xl text-muted-foreground">Quais são meus direitos e por onde começo?</p>
          <p className="text-sm text-primary/70 mt-4">Em breve — lista de espera aberta</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="prose prose-invert max-w-none">
          <h2 className="text-2xl font-bold text-primary mb-4">O que este módulo faz</h2>
          <p className="text-muted-foreground mb-6">
            Revela o padrão que te prende em conflitos legais. Não é consultoria jurídica — é análise do seu padrão de decisão em questões legais.
          </p>

          <h2 className="text-2xl font-bold text-primary mb-4">Para quem é</h2>
          <p className="text-muted-foreground mb-6">
            Para quem enfrenta problemas legais e quer entender a raiz. Para empreendedores que repetem os mesmos erros contratuais.
          </p>

          <h2 className="text-2xl font-bold text-primary mb-4">O que inclui na degustação</h2>
          <p className="text-muted-foreground mb-6">
            Análise dos seus 4 Pilares SAJO focada em padrões de decisão legal. Você descobre qual é o "gancho" que te prende em conflitos.
          </p>

          <h2 className="text-2xl font-bold text-primary mb-4">Perguntas que você pode fazer</h2>
          <ul className="text-muted-foreground space-y-2 mb-6">
            <li>• Por que sempre me vejo em conflitos legais?</li>
            <li>• Qual é meu padrão em decisões contratuais?</li>
            <li>• Como sair do ciclo de problemas legais?</li>
            <li>• Qual é o melhor momento para agir legalmente?</li>
          </ul>

          <h2 className="text-2xl font-bold text-primary mb-4">Perguntas Frequentes</h2>
          <div className="space-y-4 mb-6">
            <div>
              <h4 className="font-semibold text-primary mb-2">Isso substitui um advogado?</h4>
              <p className="text-muted-foreground">Não. É análise do seu padrão de decisão. Sempre consulte um advogado para questões legais.</p>
            </div>
            <div>
              <h4 className="font-semibold text-primary mb-2">Preciso estar em um conflito agora?</h4>
              <p className="text-muted-foreground">Não. O módulo funciona para prevenção e entendimento de padrões.</p>
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/30 rounded-lg p-6 mb-6">
            <p className="text-sm text-muted-foreground">
              <strong>Importante:</strong> Este módulo é análise simbólica. Não substitui aconselhamento jurídico profissional. Sempre consulte um advogado certificado.
            </p>
          </div>
        </div>

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
