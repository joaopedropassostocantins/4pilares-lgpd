import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Module } from "@/data/modules";

interface ModuleCardProps {
  module: Module;
}

export default function ModuleCard({ module }: ModuleCardProps) {
  return (
    <Link href={`/modulo-${module.slug}`}>
      <div className="group cursor-pointer h-full">
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/30 hover:border-primary/60 transition-all duration-300 p-6 h-full flex flex-col hover:shadow-xl hover:shadow-primary/20 transform hover:-translate-y-1">
          {/* Background accent */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-300" />
          
          {/* Icon */}
          <div className="text-5xl mb-4 relative z-10">{module.icon}</div>

          {/* Title */}
          <h3 className="text-xl font-bold text-primary mb-2 relative z-10 group-hover:text-primary/90 transition-colors">
            {module.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-muted-foreground mb-4 relative z-10 flex-grow">
            {module.shortDescription}
          </p>

          {/* Status Badge */}
          <div className="mb-4 relative z-10">
            <span className="inline-block px-3 py-1 bg-primary/20 text-primary text-xs font-semibold rounded-full">
              {module.status}
            </span>
          </div>

          {/* CTA */}
          <div className="relative z-10">
            <Button
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 group-hover:shadow-lg transition-all"
              onClick={(e) => {
                e.preventDefault();
                // Link will handle navigation
              }}
            >
              Saiba Mais →
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}
