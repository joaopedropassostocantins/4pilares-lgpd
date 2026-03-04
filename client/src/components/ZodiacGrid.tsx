import React from "react";

const ZODIAC = [
    { name: "Rato", emoji: "🐭", years: "1948, 1960, 1972, 1984, 1996, 2008, 2020", element: "Água", color: "#7FB7B2", bg: "rgba(127,183,178,0.12)" },
    { name: "Boi", emoji: "🐮", years: "1949, 1961, 1973, 1985, 1997, 2009, 2021", element: "Terra", color: "#C6A24A", bg: "rgba(198,162,74,0.12)" },
    { name: "Tigre", emoji: "🐯", years: "1950, 1962, 1974, 1986, 1998, 2010, 2022", element: "Madeira", color: "#7FB7B2", bg: "rgba(127,183,178,0.12)" },
    { name: "Coelho", emoji: "🐰", years: "1951, 1963, 1975, 1987, 1999, 2011, 2023", element: "Madeira", color: "#D06B5C", bg: "rgba(208,107,92,0.12)" },
    { name: "Dragão", emoji: "🐲", years: "1952, 1964, 1976, 1988, 2000, 2012, 2024", element: "Terra", color: "#C6A24A", bg: "rgba(198,162,74,0.12)" },
    { name: "Cobra", emoji: "🐍", years: "1953, 1965, 1977, 1989, 2001, 2013, 2025", element: "Fogo", color: "#D06B5C", bg: "rgba(208,107,92,0.12)" },
    { name: "Cavalo", emoji: "🐴", years: "1954, 1966, 1978, 1990, 2002, 2014, 2026", element: "Fogo", color: "#D06B5C", bg: "rgba(208,107,92,0.12)" },
    { name: "Cabra", emoji: "🐑", years: "1955, 1967, 1979, 1991, 2003, 2015, 2027", element: "Terra", color: "#C6A24A", bg: "rgba(198,162,74,0.12)" },
    { name: "Macaco", emoji: "🐵", years: "1956, 1968, 1980, 1992, 2004, 2016, 2028", element: "Metal", color: "#A0A0A0", bg: "rgba(160,160,160,0.12)" },
    { name: "Galo", emoji: "🐓", years: "1957, 1969, 1981, 1993, 2005, 2017, 2029", element: "Metal", color: "#A0A0A0", bg: "rgba(160,160,160,0.12)" },
    { name: "Cão", emoji: "🐶", years: "1958, 1970, 1982, 1994, 2006, 2018, 2030", element: "Terra", color: "#C6A24A", bg: "rgba(198,162,74,0.12)" },
    { name: "Porco", emoji: "🐷", years: "1959, 1971, 1983, 1995, 2007, 2019, 2031", element: "Água", color: "#7FB7B2", bg: "rgba(127,183,178,0.12)" },
];

export default function ZodiacGrid() {
    return (
        <section className="py-16 px-4 max-w-5xl mx-auto">
            <div className="text-center mb-10">
                <p className="text-xs tracking-widest text-muted-foreground uppercase mb-2">Calendário Lunar</p>
                <h2 className="text-3xl font-bold shimmer-gold mb-3" style={{ fontFamily: "'Cinzel', serif" }}>
                    Signos do Calendário Coreano
                </h2>
                <p className="text-muted-foreground text-sm max-w-md mx-auto">
                    O zodíaco luni-solar coreano (십이지, Sibiji) compartilha ciclos de 12 anos com os mesmos animais do Leste Asiático. Cada animal carrega um elemento e uma energia específica.
                </p>
            </div>

            <div className="zodiac-grid">
                {ZODIAC.map((animal) => (
                    <div
                        key={animal.name}
                        className="zodiac-card"
                        style={{ borderColor: `${animal.color}44` }}
                    >
                        {/* Emoji kawaii grande */}
                        <div
                            className="rounded-2xl flex items-center justify-center mb-1"
                            style={{
                                background: animal.bg,
                                width: 72,
                                height: 72,
                                fontSize: 44,
                            }}
                        >
                            {animal.emoji}
                        </div>
                        <div className="zodiac-label" style={{ color: animal.color }}>{animal.name}</div>
                        <div
                            className="text-xs px-2 py-0.5 rounded-full"
                            style={{
                                background: animal.bg,
                                color: animal.color,
                                fontSize: "0.6rem",
                                fontWeight: 600,
                            }}
                        >
                            {animal.element}
                        </div>
                        <div className="zodiac-year" style={{ fontSize: "0.58rem", opacity: 0.7 }}>
                            {animal.years.split(",")[0].trim()} ...
                        </div>
                    </div>
                ))}
            </div>

            <p className="text-center text-xs text-muted-foreground/50 mt-6">
                * Os anos exatos variam conforme o calendário lunar. Verifique sua data de nascimento.
            </p>
        </section>
    );
}
