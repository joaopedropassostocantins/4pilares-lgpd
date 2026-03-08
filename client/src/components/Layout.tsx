/*
 * Layout.tsx — 4 Pilares LGPD
 * Design: Clareza Estrutural — Navbar limpa + Footer institucional completo
 */
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Scale, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "/", label: "Início" },
  { href: "/sobre", label: "Sobre" },
  { href: "/planos", label: "Planos" },
  { href: "/blog", label: "Blog" },
  { href: "/faq", label: "FAQ" },
  { href: "/contato", label: "Contato" },
];

const pilares = [
  { href: "/lei", label: "Lei", color: "#1D4ED8" },
  { href: "/regras", label: "Regras", color: "#059669" },
  { href: "/conformidade", label: "Conformidade", color: "#EA580C" },
  { href: "/titular", label: "Titular", color: "#7C3AED" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [pilaresOpen, setPilaresOpen] = useState(false);
  const [location] = useLocation();

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#F8FAFC" }}>
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
        <div className="container">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 no-underline">
              <div className="w-8 h-8 rounded-lg bg-blue-700 flex items-center justify-center">
                <Scale className="w-4 h-4 text-white" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-semibold text-slate-900 text-sm tracking-tight" style={{ fontFamily: "var(--font-sans)" }}>
                  4 Pilares LGPD
                </span>
                <span className="text-[10px] text-slate-500 font-mono tracking-wider uppercase">
                  Lei · Regras · Conformidade · Titular
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors no-underline ${
                    location === link.href
                      ? "text-blue-700 bg-blue-50 font-medium"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {/* Pilares dropdown */}
              <div className="relative">
                <button
                  onClick={() => setPilaresOpen(!pilaresOpen)}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
                >
                  Pilares <ChevronDown className={`w-3.5 h-3.5 transition-transform ${pilaresOpen ? "rotate-180" : ""}`} />
                </button>
                {pilaresOpen && (
                  <div className="absolute top-full right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg p-2 w-48 z-50">
                    {pilares.map((p) => (
                      <Link
                        key={p.href}
                        href={p.href}
                        onClick={() => setPilaresOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg no-underline transition-colors"
                      >
                        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: p.color }} />
                        {p.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </nav>

            {/* CTA + Mobile toggle */}
            <div className="flex items-center gap-2">
              <a
                href="https://wa.me/5563984381782"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90 no-underline"
                style={{ backgroundColor: "#25D366" }}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp
              </a>
              <button
                className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white">
            <div className="container py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`px-3 py-2.5 text-sm rounded-lg no-underline transition-colors ${
                    location === link.href
                      ? "text-blue-700 bg-blue-50 font-medium"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-slate-100 mt-2 pt-2">
                <p className="px-3 py-1 text-xs font-mono text-slate-400 uppercase tracking-wider">Pilares</p>
                {pilares.map((p) => (
                  <Link
                    key={p.href}
                    href={p.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50 rounded-lg no-underline"
                  >
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                    {p.label}
                  </Link>
                ))}
              </div>
              <a
                href="https://wa.me/5563984381782"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white no-underline"
                style={{ backgroundColor: "#25D366" }}
              >
                Falar no WhatsApp
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300">
        <div className="container py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Brand */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                  <Scale className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold text-white text-sm" style={{ fontFamily: "var(--font-sans)" }}>
                  4 Pilares LGPD
                </span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed max-w-xs mb-4">
                Adequação à LGPD estruturada em 4 pilares. Diagnóstico, governança e gestão de privacidade para empresas brasileiras.
              </p>
              <div className="space-y-1 text-xs font-mono text-slate-500">
                <p>CNPJ: 58.551.044/0001-90</p>
                <p>Palmas / TO — Atendimento 100% remoto nacional</p>
                <p>Dr. João Pedro Pereira Passos</p>
                <p>ORCID: 0000-0001-7181-4587</p>
              </div>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-white text-sm font-semibold mb-4" style={{ fontFamily: "var(--font-sans)" }}>
                Navegação
              </h4>
              <ul className="space-y-2">
                {[
                  { href: "/", label: "Início" },
                  { href: "/sobre", label: "Sobre" },
                  { href: "/planos", label: "Planos" },
                  { href: "/faq", label: "FAQ" },
                  { href: "/blog", label: "Blog" },
                  { href: "/contato", label: "Contato" },
                  { href: "/privacidade", label: "Privacidade" },
                  { href: "/termos", label: "Termos de Uso" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-slate-400 hover:text-white transition-colors no-underline">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white text-sm font-semibold mb-4" style={{ fontFamily: "var(--font-sans)" }}>
                Contato
              </h4>
              <ul className="space-y-2">
                <li>
                  <a href="https://wa.me/5563984381782" className="text-sm text-slate-400 hover:text-white transition-colors no-underline">
                    (63) 98438-1782
                  </a>
                </li>
                {[
                  "contato@sajodiagnos.club",
                  "atendimento@sajodiagnos.club",
                  "docs@sajodiagnos.club",
                  "titular@sajodiagnos.club",
                ].map((email) => (
                  <li key={email}>
                    <a href={`mailto:${email}`} className="text-xs text-slate-500 hover:text-slate-300 transition-colors no-underline font-mono">
                      {email}
                    </a>
                  </li>
                ))}
              </ul>

              <div className="mt-6">
                <h4 className="text-white text-sm font-semibold mb-3" style={{ fontFamily: "var(--font-sans)" }}>
                  Os 4 Pilares
                </h4>
                <div className="flex flex-col gap-1.5">
                  {pilares.map((p) => (
                    <Link key={p.href} href={p.href} className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors no-underline">
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: p.color }} />
                      {p.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-600 font-mono">
              © {new Date().getFullYear()} 4 Pilares LGPD — Todos os direitos reservados
            </p>
            <div className="flex items-center gap-4">
              <Link href="/privacidade" className="text-xs text-slate-600 hover:text-slate-400 no-underline transition-colors">
                Política de Privacidade
              </Link>
              <Link href="/termos" className="text-xs text-slate-600 hover:text-slate-400 no-underline transition-colors">
                Termos de Uso
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
