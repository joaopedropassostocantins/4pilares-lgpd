/*
 * PromoBar.tsx — 4 Pilares LGPD
 * Barra promocional no topo do site
 */
import { X } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

export default function PromoBar() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 relative">
      <div className="container flex items-center justify-between gap-4">
        <div className="flex items-center justify-center flex-1 text-center">
          <span className="text-sm font-medium">
            🔥 Plano Básico ANPD <strong>R$ 150/mês</strong> — 50% OFF por 12 meses
          </span>
        </div>
        <Link href="/checkout?plan=basico-anpd" className="ml-4 flex-shrink-0">
          <button className="px-4 py-1.5 bg-white text-blue-600 rounded-lg text-xs font-semibold hover:bg-blue-50 transition-colors no-underline">
            Contratar agora
          </button>
        </Link>
        <button
          onClick={() => setVisible(false)}
          className="flex-shrink-0 p-1 hover:bg-white/20 rounded transition-colors"
          aria-label="Fechar"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
