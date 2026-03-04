import { Link } from "wouter";

/**
 * Banner de orientação de fluxo — aparece no topo de cada página de módulo
 * Orienta usuários que chegaram diretamente sem ter feito a análise dos 4 Pilares
 */
export default function AnalysisBanner() {
    return (
        <div className="bg-gradient-to-r from-amber-900/30 via-amber-800/20 to-amber-900/30 border border-gold/40 rounded-xl p-5 mx-4 mt-6 mb-2 text-center">
            <div className="text-2xl mb-2">✦</div>
            <p className="text-gold font-bold text-base mb-1" style={{ fontFamily: "'Cinzel', serif" }}>
                Para maior precisão, faça primeiro a Análise SAJO completa
            </p>
            <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                A <strong>Análise dos 4 Pilares</strong> identifica automaticamente qual módulo é mais urgente para você agora — e gera um resultado personalizado com base no seu perfil único.
            </p>
            <Link href="/#form">
                <span className="inline-block cursor-pointer bg-gradient-to-r from-gold to-amber-400 text-background font-bold py-2.5 px-6 rounded-lg text-sm hover:opacity-90 transition-opacity">
                    ✦ Fazer minha análise gratuita agora
                </span>
            </Link>
            <p className="text-muted-foreground/60 text-xs mt-3">
                Acesso imediato · Sem cadastro · 100% gratuito
            </p>
        </div>
    );
}
