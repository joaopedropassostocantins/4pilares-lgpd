import { Link } from "wouter";
import { modules } from "@/data/modules";

interface ModuleCardProps {
  module: (typeof modules)[0];
}

export default function ModuleCard({ module }: ModuleCardProps) {
  return (
    <Link href={`/${module.slug}`}>
      <div className="module-card group cursor-pointer h-full flex flex-col">
        {/* Icon */}
        <div className="text-4xl mb-4">{module.icon}</div>

        {/* Title */}
        <h3
          className="text-lg font-bold text-foreground mb-2 group-hover:text-gold transition-colors"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {module.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-4 flex-grow leading-relaxed">
          {module.shortDescription}
        </p>

        {/* Status Badge */}
        <div className="mb-4">
          <span className="inline-block px-3 py-1 bg-purple/20 text-purple-light text-xs font-semibold rounded-full border border-purple/30">
            {module.status}
          </span>
        </div>

        {/* CTA */}
        <div>
          <span className="btn-gold w-full text-center block text-sm py-2.5">
            Saiba Mais →
          </span>
        </div>
      </div>
    </Link>
  );
}
