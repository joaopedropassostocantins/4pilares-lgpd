import { Link } from "wouter";
import { modules } from "@/data/modules";

type Module = (typeof modules)[0];

interface ModuleCardProps {
  module: Module;
}

export default function ModuleCard({ module }: ModuleCardProps) {
  // Cor do módulo com fallback
  const accentColor = (module as any).accentColor ?? "#C9A84C";
  const colorClass = (module as any).colorClass ?? "";
  const paymentSlug = (module as any).paymentSlug;

  return (
    <div
      className={`module-card module-card-obangsaek ${colorClass} group h-full flex flex-col`}
      style={{ "--mod-color": accentColor, "--mod-color-light": `${accentColor}18` } as React.CSSProperties}
    >
      {/* Icon */}
      <div
        className="text-4xl mb-4 w-16 h-16 rounded-2xl flex items-center justify-center"
        style={{ background: `${accentColor}18` }}
      >
        {module.icon}
      </div>

      {/* Badge de elemento */}
      <div className="mb-3">
        <span className="module-badge">{module.status}</span>
      </div>

      {/* Title */}
      <h3
        className="text-lg font-bold text-foreground mb-2 transition-colors"
        style={{ fontFamily: "'Playfair Display', serif", color: `group-hover:${accentColor}` }}
      >
        {module.title}
      </h3>

      {/* Description */}
      <p className="text-sm text-muted-foreground mb-5 flex-grow leading-relaxed">
        {module.shortDescription}
      </p>

      {/* Botões */}
      <div className="flex flex-col gap-2 mt-auto">
        {/* Saiba Mais → vai para página do módulo com scroll top */}
        <Link
          href={`/${module.slug}`}
          onClick={() => window.scrollTo({ top: 0, behavior: "instant" })}
        >
          <span className="block text-center text-sm py-2.5 px-4 rounded-full border font-semibold transition-all hover:opacity-90"
            style={{ borderColor: accentColor, color: accentColor }}
          >
            Saiba Mais →
          </span>
        </Link>

        {/* Desbloquear → vai para checkout */}
        {paymentSlug && (
          <Link
            href={`/checkout/${paymentSlug}`}
            onClick={() => window.scrollTo({ top: 0, behavior: "instant" })}
          >
            <span
              className="btn-module-checkout block text-center w-full text-sm py-2.5"
              style={{ background: accentColor }}
            >
              🔓 Módulo + 90 dias com especialista Musok (무속) coreano — R$ 299
            </span>
          </Link>
        )}
      </div>

      {/* Descrição de benefícios */}
      {paymentSlug && (
        <p className="text-xs text-muted-foreground text-center mt-2 leading-relaxed">
          Inclui análise completa + 1 videochamada/semana por 90 dias
          <br />
          <span style={{ color: "#C9A84C" }}>✓ Garantia total de devolução</span>
        </p>
      )}
    </div>
  );
}
