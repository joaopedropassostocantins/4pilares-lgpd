import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Eye, Check, Clock } from "lucide-react";
import { useState } from "react";

export default function AdminDiagnostics() {
  const [page, setPage] = useState(0);
  const limit = 10;
  const offset = page * limit;

  const { data, isLoading } = trpc.admin.diagnostics.useQuery({ limit, offset });

  const handlePrevious = () => setPage(Math.max(0, page - 1));
  const handleNext = () => {
    if (data && (page + 1) * limit < data.total) {
      setPage(page + 1);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!data) {
    return <div className="text-center text-muted-foreground">Erro ao carregar diagnósticos</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary" style={{ fontFamily: "'Cinzel Decorative', serif" }}>
          Diagnósticos
        </h1>
        <p className="text-muted-foreground mt-2">
          Total: {data.total} diagnósticos | Página {page + 1}
        </p>
      </div>

      <div className="space-y-3">
        {data.items.map((diagnostic) => (
          <Card key={diagnostic.publicId} className="bg-card/60 border-primary/30">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-bold text-primary">{diagnostic.consultantName || "Sem nome"}</h3>
                  <p className="text-sm text-muted-foreground">
                    ID: {diagnostic.publicId}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Local: {diagnostic.birthPlace}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Data: {new Date(diagnostic.createdAt).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-2">
                      {diagnostic.paymentStatus === "paid" ? (
                        <div className="flex items-center gap-1 text-green-500">
                          <Check className="h-4 w-4" />
                          <span className="text-sm font-medium">Pago</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-yellow-500">
                          <Clock className="h-4 w-4" />
                          <span className="text-sm font-medium">Pendente</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`/resultado/${diagnostic.publicId}`, "_blank")}
                    className="border-primary/40 hover:border-primary"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Ver
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={page === 0}
          className="border-primary/40 hover:border-primary"
        >
          ← Anterior
        </Button>
        <span className="text-sm text-muted-foreground">
          {offset + 1} a {Math.min(offset + limit, data.total)} de {data.total}
        </span>
        <Button
          variant="outline"
          onClick={handleNext}
          disabled={(page + 1) * limit >= data.total}
          className="border-primary/40 hover:border-primary"
        >
          Próxima →
        </Button>
      </div>
    </div>
  );
}
