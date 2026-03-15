/*
 * AdminIncidentes.tsx — 4 Pilares LGPD
 * Gestão de incidentes de segurança / violações LGPD
 */
import { useState } from "react";
import { AlertTriangle, Plus, Clock, CheckCircle2, XCircle, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type IncidentStatus = "aberto" | "investigando" | "resolvido" | "encerrado";
type IncidentSeverity = "critico" | "alto" | "medio" | "baixo";

interface Incident {
  id: number;
  titulo: string;
  descricao: string;
  status: IncidentStatus;
  severity: IncidentSeverity;
  data: string;
  responsavel: string;
}

const MOCK_INCIDENTS: Incident[] = [
  {
    id: 1,
    titulo: "Acesso não autorizado a dados de clientes",
    descricao: "Tentativa de acesso identificada em logs de auditoria.",
    status: "investigando",
    severity: "alto",
    data: "2024-03-10",
    responsavel: "Equipe de Segurança",
  },
  {
    id: 2,
    titulo: "Solicitação de exclusão de dados — Titular",
    descricao: "Titular solicitou exclusão conforme Art. 18 LGPD.",
    status: "aberto",
    severity: "medio",
    data: "2024-03-12",
    responsavel: "DPO",
  },
];

const statusConfig: Record<IncidentStatus, { label: string; color: string; icon: React.ElementType }> = {
  aberto: { label: "Aberto", color: "bg-red-100 text-red-700", icon: AlertTriangle },
  investigando: { label: "Investigando", color: "bg-yellow-100 text-yellow-700", icon: Clock },
  resolvido: { label: "Resolvido", color: "bg-green-100 text-green-700", icon: CheckCircle2 },
  encerrado: { label: "Encerrado", color: "bg-slate-100 text-slate-600", icon: XCircle },
};

const severityConfig: Record<IncidentSeverity, { label: string; color: string }> = {
  critico: { label: "Crítico", color: "text-red-600" },
  alto: { label: "Alto", color: "text-orange-600" },
  medio: { label: "Médio", color: "text-yellow-600" },
  baixo: { label: "Baixo", color: "text-slate-500" },
};

export default function AdminIncidentes() {
  const [incidents] = useState<Incident[]>(MOCK_INCIDENTS);
  const [filter, setFilter] = useState<IncidentStatus | "todos">("todos");

  const filtered = filter === "todos" ? incidents : incidents.filter((i) => i.status === filter);

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-slate-800 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-red-500" />
              Incidentes
            </h1>
            <p className="text-sm text-slate-500 mt-1">Gestão de incidentes de segurança e conformidade LGPD</p>
          </div>
          <Button
            onClick={() => toast.info("Funcionalidade de registro de incidentes em desenvolvimento.")}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Novo Incidente
          </Button>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {(["todos", "aberto", "investigando", "resolvido", "encerrado"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                filter === s
                  ? "bg-blue-600 text-white"
                  : "bg-white border border-slate-200 text-slate-600 hover:border-blue-200 hover:text-blue-600"
              }`}
            >
              {s === "todos" ? "Todos" : statusConfig[s as IncidentStatus].label}
              {s !== "todos" && ` (${incidents.filter((i) => i.status === s).length})`}
            </button>
          ))}
        </div>

        {/* Incidents list */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-100 p-12 text-center">
              <Shield className="w-8 h-8 text-green-500 mx-auto mb-3" />
              <p className="text-sm font-medium text-slate-700">Nenhum incidente nesta categoria.</p>
              <p className="text-xs text-slate-400 mt-1">Ótimo trabalho mantendo a conformidade!</p>
            </div>
          ) : (
            filtered.map((incident) => {
              const { label, color, icon: StatusIcon } = statusConfig[incident.status];
              const { label: severityLabel, color: severityColor } = severityConfig[incident.severity];
              return (
                <div
                  key={incident.id}
                  className="bg-white rounded-xl border border-slate-100 p-5 hover:border-slate-200 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-semibold ${severityColor}`}>{severityLabel}</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-xs text-slate-400">{incident.data}</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-xs text-slate-400">{incident.responsavel}</span>
                      </div>
                      <h3 className="text-sm font-semibold text-slate-800">{incident.titulo}</h3>
                      <p className="text-xs text-slate-500 mt-1">{incident.descricao}</p>
                    </div>
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${color} shrink-0`}>
                      <StatusIcon className="w-3 h-3" />
                      {label}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
