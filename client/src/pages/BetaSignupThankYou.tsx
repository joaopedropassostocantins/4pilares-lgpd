import { useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { modules } from "@/data/modules";
import { Link } from "wouter";

export default function BetaSignupThankYou() {
  const [, params] = useRoute("/obrigado-cadastro");
  const moduleId = new URLSearchParams(window.location.search).get("modulo");
  const selectedModule = modules.find((m) => m.id === moduleId);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        {/* Success Card */}
        <Card className="bg-card/60 border-primary/30 mb-8 text-center">
          <CardHeader>
            <div className="text-6xl mb-4">✨</div>
            <CardTitle className="text-3xl text-primary" style={{ fontFamily: "'Cinzel', serif" }}>
              Você está na fila!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg text-foreground">
              Seu cadastro foi confirmado com sucesso.
            </p>
            
            {selectedModule && (
              <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 my-6">
                <p className="text-sm text-muted-foreground mb-2">Você se cadastrou para:</p>
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{selectedModule.icon}</div>
                  <div className="text-left">
                    <p className="font-semibold text-primary">{selectedModule.title}</p>
                    <p className="text-xs text-muted-foreground">{selectedModule.shortDescription}</p>
                  </div>
                </div>
              </div>
            )}

            <p className="text-foreground">
              Você receberá um <strong>email de confirmação</strong> em breve. Guarde bem esse email — ele contém seu código de acesso.
            </p>
          </CardContent>
        </Card>

        {/* What happens next */}
        <Card className="bg-card/60 border-primary/30 mb-8">
          <CardHeader>
            <CardTitle>O que acontece agora</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <div className="text-2xl font-bold text-primary min-w-fit">1️⃣</div>
              <div>
                <h4 className="font-semibold text-foreground mb-1">Você entra na fila</h4>
                <p className="text-sm text-muted-foreground">
                  Seu cadastro está registrado. Você está na posição da fila de espera do módulo escolhido.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-2xl font-bold text-primary min-w-fit">2️⃣</div>
              <div>
                <h4 className="font-semibold text-foreground mb-1">Nós liberamos vagas</h4>
                <p className="text-sm text-muted-foreground">
                  A cada semana, liberamos 20 vagas de degustação por módulo. Você será chamado conforme sua posição.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-2xl font-bold text-primary min-w-fit">3️⃣</div>
              <div>
                <h4 className="font-semibold text-foreground mb-1">Você recebe notificação</h4>
                <p className="text-sm text-muted-foreground">
                  Quando sua vaga for liberada, você receberá email + WhatsApp (se fornecido) com link de acesso imediato.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-2xl font-bold text-primary min-w-fit">4️⃣</div>
              <div>
                <h4 className="font-semibold text-foreground mb-1">Você faz a degustação</h4>
                <p className="text-sm text-muted-foreground">
                  Acesso imediato ao módulo. Sem pagamento. Sem compromisso. Você tem 7 dias para explorar.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FAQ */}
        <Card className="bg-card/60 border-primary/30 mb-8">
          <CardHeader>
            <CardTitle>Dúvidas frequentes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-primary mb-1">Quanto tempo até minha vaga?</h4>
              <p className="text-sm text-muted-foreground">
                Depende da demanda. Se há 100 pessoas na fila e liberamos 20/semana, você será chamado em ~5 semanas. Mas se há poucos, pode ser em dias.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-primary mb-1">Posso mudar de módulo?</h4>
              <p className="text-sm text-muted-foreground">
                Sim. Envie um email para suporte@fusionsajo.com.br com seu novo módulo preferido.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-primary mb-1">Preciso pagar algo?</h4>
              <p className="text-sm text-muted-foreground">
                Não. A degustação é 100% gratuita. Você só paga se quiser a análise completa (R$ 299,00).
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-primary mb-1">Como cancelo meu cadastro?</h4>
              <p className="text-sm text-muted-foreground">
                Envie um email para privacidade@fusionsajo.com.br solicitando exclusão. Seus dados serão apagados em 30 dias.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="space-y-4">
          <Link href="/">
            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-6 text-lg font-bold">
              Voltar para Home
            </Button>
          </Link>

          <p className="text-center text-sm text-muted-foreground">
            Enquanto espera, explore os outros módulos e veja qual mais te interessa.
          </p>
        </div>
      </div>
    </div>
  );
}
