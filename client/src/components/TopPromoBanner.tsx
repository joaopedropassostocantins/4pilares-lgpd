import { useState, useEffect } from "react";
import { Link } from "wouter";

// ─── Config ──────────────────────────────────────────────────────────────────
const BANNER_KEY = "promo_banner_closed_until";
const BANNER_TTL_DAYS = 7;
// Altere o número abaixo para o WhatsApp real (ou defina como "" para ocultar o botão)
const WHATSAPP_NUMBER = "5511999999999"; // ex: "5511999999999"
const WHATSAPP_MSG = encodeURIComponent(
    "Olá! Vi o banner sobre os módulos de análise SAJO e quero saber mais sobre o acompanhamento virtual de 90 dias."
);
const WHATSAPP_URL = WHATSAPP_NUMBER
    ? `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`
    : "";

// ─── Tracking ─────────────────────────────────────────────────────────────────
function track(type: string, meta?: Record<string, unknown>) {
    try {
        fetch("/api/events", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type, meta: { variant: "modules_90d", ...meta } }),
        }).catch(() => {/* fire and forget */ });
    } catch {/* never break the UI */ }
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function TopPromoBanner() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        try {
            const until = localStorage.getItem(BANNER_KEY);
            if (until && Number(until) > Date.now()) return; // still closed
        } catch {/* SSR / private mode */ }
        setVisible(true);
        track("banner_view");
    }, []);

    const handleClose = () => {
        try {
            localStorage.setItem(
                BANNER_KEY,
                String(Date.now() + BANNER_TTL_DAYS * 24 * 60 * 60 * 1000)
            );
        } catch {/* ignore */ }
        track("banner_close");
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <>
            {/* Spacer to prevent content being covered */}
            <div id="promo-banner-spacer" style={{ height: "var(--banner-h, 0px)" }} />

            <div
                id="promo-banner"
                role="banner"
                aria-label="Módulos disponíveis"
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 9999,
                }}
                className="banner-root"
            >
                {/* Background gradient escuro/dourado consistente com o tema */}
                <div
                    style={{
                        background: "linear-gradient(90deg, #1a1030 0%, #2d1b6b 40%, #1a1030 100%)",
                        borderBottom: "1px solid rgba(201,168,76,0.4)",
                    }}
                >
                    <div
                        style={{
                            maxWidth: "1100px",
                            margin: "0 auto",
                            padding: "10px 16px",
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            flexWrap: "wrap",
                            justifyContent: "space-between",
                        }}
                    >
                        {/* Ícone + Texto */}
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1, minWidth: "220px" }}>
                            <span style={{ fontSize: "1.4rem", flexShrink: 0 }}>🔓</span>
                            <div>
                                <p style={{ margin: 0, fontWeight: 700, fontSize: "0.85rem", color: "#f5d97a", lineHeight: 1.3 }}>
                                    Módulos liberados + acompanhamento virtual por 90 dias
                                </p>
                                <p style={{ margin: "2px 0 0", fontSize: "0.72rem", color: "rgba(255,255,255,0.75)", lineHeight: 1.4, maxWidth: "560px" }}>
                                    Desbloqueie as análises dos módulos e receba acompanhamento virtual com Xamã por 90 dias.&nbsp;
                                    <strong style={{ color: "#f5d97a" }}>Pague em até 6x no cartão.</strong>&nbsp;
                                    <span style={{ color: "#f09e6e" }}>Vagas limitadas.</span>
                                </p>
                            </div>
                        </div>

                        {/* CTAs */}
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", flexShrink: 0 }}>
                            {/* Primário */}
                            <Link
                                href="/#modulos"
                                onClick={() => {
                                    track("banner_click_primary");
                                    // Smooth scroll para a seção de módulos
                                    setTimeout(() => {
                                        const el = document.getElementById("modulos") || document.querySelector("[data-section='modulos']");
                                        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                                    }, 100);
                                }}
                            >
                                <span
                                    style={{
                                        display: "inline-block",
                                        background: "linear-gradient(135deg, #C9A84C, #e6a813)",
                                        color: "#000",
                                        fontWeight: 800,
                                        fontSize: "0.78rem",
                                        padding: "7px 16px",
                                        borderRadius: "50px",
                                        cursor: "pointer",
                                        letterSpacing: "0.3px",
                                        boxShadow: "0 2px 12px rgba(201,168,76,0.35)",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    Ver módulos →
                                </span>
                            </Link>

                            {/* WhatsApp (só renderiza se configurado) */}
                            {WHATSAPP_URL && (
                                <a
                                    href={WHATSAPP_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => track("banner_click_whatsapp")}
                                    style={{
                                        display: "inline-block",
                                        background: "#25D366",
                                        color: "#fff",
                                        fontWeight: 700,
                                        fontSize: "0.78rem",
                                        padding: "7px 14px",
                                        borderRadius: "50px",
                                        cursor: "pointer",
                                        letterSpacing: "0.3px",
                                        boxShadow: "0 2px 10px rgba(37,211,102,0.3)",
                                        whiteSpace: "nowrap",
                                        textDecoration: "none",
                                    }}
                                >
                                    💬 Falar no WhatsApp
                                </a>
                            )}

                            {/* Fechar */}
                            <button
                                onClick={handleClose}
                                aria-label="Fechar banner"
                                title="Fechar"
                                style={{
                                    background: "rgba(255,255,255,0.1)",
                                    border: "1px solid rgba(255,255,255,0.2)",
                                    color: "rgba(255,255,255,0.7)",
                                    borderRadius: "50%",
                                    width: "26px",
                                    height: "26px",
                                    cursor: "pointer",
                                    fontSize: "1rem",
                                    lineHeight: "24px",
                                    textAlign: "center",
                                    flexShrink: 0,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    transition: "background 0.2s",
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.2)")}
                                onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
                            >
                                ×
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Script para medir altura do banner e ajustar o spacer */}
            <BannerHeightObserver />
        </>
    );
}

// Ajusta o spacer dinamicamente para evitar conteúdo coberto
function BannerHeightObserver() {
    useEffect(() => {
        const banner = document.getElementById("promo-banner");
        const spacer = document.getElementById("promo-banner-spacer");
        if (!banner || !spacer) return;

        const update = () => {
            const h = banner.getBoundingClientRect().height;
            spacer.style.height = `${h}px`;
            document.documentElement.style.setProperty("--banner-h", `${h}px`);
        };

        update();
        const ro = new ResizeObserver(update);
        ro.observe(banner);
        window.addEventListener("resize", update);
        return () => { ro.disconnect(); window.removeEventListener("resize", update); };
    }, []);
    return null;
}
