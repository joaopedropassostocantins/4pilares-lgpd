import { Link } from "wouter";
import { Scale, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#F8FAFC" }}>
      <div className="text-center max-w-md px-6">
        <div className="w-16 h-16 rounded-2xl bg-blue-700 flex items-center justify-center mx-auto mb-6">
          <Scale className="w-8 h-8 text-white" />
        </div>
        <p className="font-mono text-slate-400 text-sm mb-2">ERRO 404</p>
        <h1 className="text-4xl font-bold text-slate-900 mb-4" style={{ fontFamily: "var(--font-serif)" }}>
          Página não encontrada
        </h1>
        <p className="text-slate-600 mb-8">
          A página que você está procurando não existe ou foi movida.
        </p>
        <Link href="/">
          <Button className="bg-blue-700 hover:bg-blue-800 text-white h-11 px-6 rounded-xl">
            <ArrowLeft className="mr-2 w-4 h-4" /> Voltar ao início
          </Button>
        </Link>
      </div>
    </div>
  );
}
