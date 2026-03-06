import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Search, Calendar, User } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: "ritual" | "pratica" | "historia" | "guia";
  author: string;
  date: string;
  readTime: number;
  image: string;
}

const blogPosts: BlogPost[] = [
  {
    id: "kut-ritual",
    title: "O Kut: O Ritual Sagrado do Musok Coreano",
    excerpt: "Descubra os mistérios do Kut, o ritual mais importante do xamanismo coreano, e como ele conecta o mundo espiritual com o humano.",
    content: `O Kut (굿) é o ritual xamânico mais importante da tradição Musok coreana. É uma cerimônia complexa que pode durar horas ou até dias, envolvendo cânticos, danças sagradas, oferendas e comunicação direta com entidades espirituais.

## Origens e Significado

O Kut tem raízes que remontam a milhares de anos na história coreana. A palavra "Kut" significa literalmente "diversão" ou "celebração", mas seu significado vai muito além. É um ato de devoção, cura e comunicação com o mundo espiritual.

## Estrutura do Ritual

Um Kut típico segue uma estrutura bem definida:

1. **Invocação Inicial** - O xamã (Mudang ou Paksu) invoca os espíritos e deidades
2. **Oferendas** - Comida, bebida e objetos são oferecidos aos espíritos
3. **Danças Sagradas** - Movimentos ritmados que induzem transe espiritual
4. **Cânticos Sagrados** - Mantras e hinos que elevam a energia espiritual
5. **Comunicação** - O xamã recebe mensagens dos espíritos para os participantes
6. **Cura e Bênção** - Rituais de cura e proteção são realizados

## Propósitos do Kut

O Kut é realizado para diversos propósitos:
- **Cura Espiritual** - Remover maldições e bloqueios energéticos
- **Proteção** - Afastar influências negativas
- **Celebração** - Honrar deidades e espíritos ancestrais
- **Adivinhação** - Receber orientações para o futuro
- **Transição** - Ajudar almas a passar para o outro mundo

## A Importância Contemporânea

Apesar da modernização da Coreia do Sul, o Kut permanece uma prática viva e respeitada. Muitas famílias ainda realizam Kuts para honrar seus ancestrais e buscar bênçãos espirituais.`,
    category: "ritual",
    author: "Especialista Musok (무속) coreano",
    date: "2026-03-01",
    readTime: 8,
    image: "🎭",
  },
  {
    id: "shinbyeong",
    title: "Shinbyeong: A Doença Espiritual que Transforma",
    excerpt: "Conheça o Shinbyeong, a experiência espiritual que marca o chamado de um novo xamã e transforma vidas.",
    content: `Shinbyeong (신병), literalmente "doença do espírito", é um fenômeno único na tradição Musok coreana. É uma experiência transformadora que marca o chamado de uma pessoa para se tornar xamã.

## O que é Shinbyeong?

Shinbyeong não é uma doença comum. É uma crise espiritual profunda que afeta pessoas escolhidas pelos espíritos para se tornarem xamãs. Os sintomas incluem:

- Sonhos vívidos e perturbadores
- Sensibilidade extrema a energias espirituais
- Mudanças de humor repentinas
- Sensação de presença espiritual
- Desejo irresistível de dançar e cantar

## A Jornada de Transformação

A experiência de Shinbyeong é dividida em fases:

1. **Crise Inicial** - O indivíduo experimenta sintomas perturbadores
2. **Isolamento** - Afastamento temporário da vida normal
3. **Iniciação** - Encontro com um xamã experiente
4. **Treinamento** - Aprendizado dos rituais e práticas
5. **Renascimento** - Aceitação da nova identidade como xamã

## Significado Espiritual

Shinbyeong é visto como um chamado divino. Os espíritos escolhem indivíduos com capacidades especiais para se tornarem intermediários entre os mundos. É uma honra e uma responsabilidade.

## Reconhecimento Moderno

Hoje, o Shinbyeong é reconhecido como uma experiência legítima de transformação espiritual. Muitas escolas de Musok oferecem programas para ajudar pessoas que passam por essa experiência.`,
    category: "historia",
    author: "Especialista Musok (무속) coreano",
    date: "2026-02-28",
    readTime: 7,
    image: "✨",
  },
  {
    id: "talismans",
    title: "Talismãs e Amuletos: Proteção Através da Magia Coreana",
    excerpt: "Aprenda sobre os talismãs sagrados do Musok e como usá-los para proteção e cura.",
    content: `Os talismãs (부적) são objetos sagrados na tradição Musok coreana, criados através de rituais específicos para oferecer proteção, cura e bênção.

## Tipos de Talismãs

### Talismãs de Proteção
Criados para afastar energias negativas e influências prejudiciais. Geralmente feitos com papel especial e símbolos sagrados.

### Talismãs de Cura
Usados para tratar doenças físicas e espirituais. Cada talismã é personalizado para a condição específica.

### Talismãs de Abundância
Atraem prosperidade, sucesso e oportunidades. Populares entre comerciantes e empreendedores.

### Talismãs de Amor
Fortalecem relacionamentos e atraem amor genuíno. Criados com intenção e rituais específicos.

## Como Usar Talismãs

1. **Purificação** - O talismã deve ser purificado antes do uso
2. **Intenção** - Estabeleça uma intenção clara ao usar
3. **Colocação** - Coloque em local apropriado (bolsa, casa, altar)
4. **Manutenção** - Renove a energia periodicamente

## Eficácia e Fé

A eficácia de um talismã depende da fé do usuário e da intenção do criador. No Musok, acredita-se que a energia espiritual flui através da intenção e da conexão com o divino.`,
    category: "pratica",
    author: "Especialista Musok (무속) coreano",
    date: "2026-02-25",
    readTime: 6,
    image: "🛡️",
  },
  {
    id: "adivinhacao",
    title: "Adivinhação no Musok: Lendo os Sinais do Universo",
    excerpt: "Explore as técnicas ancestrais de adivinhação usadas pelos xamãs coreanos para orientar decisões importantes.",
    content: `A adivinhação (점) é uma prática central no Musok coreano. Os xamãs usam várias técnicas para ler sinais do universo e orientar as pessoas em suas jornadas.

## Técnicas de Adivinhação

### Leitura de Espíritos
O xamã entra em transe e recebe mensagens diretas dos espíritos. É considerada a forma mais precisa de adivinhação.

### Leitura de Símbolos
Símbolos sagrados são interpretados para revelar mensagens ocultas sobre o futuro.

### Leitura de Energia
O xamã sente a energia ao redor de uma pessoa para compreender sua situação espiritual e física.

### Leitura de Sonhos
Os sonhos são analisados para revelar mensagens do inconsciente e do mundo espiritual.

## Preparação para uma Leitura

Antes de uma sessão de adivinhação:
- Limpe sua mente de expectativas
- Estabeleça uma intenção clara
- Abra-se para receber a mensagem
- Confie no processo

## Aplicação Prática

As orientações recebidas através da adivinhação podem ser aplicadas em:
- Decisões de carreira
- Relacionamentos
- Saúde e bem-estar
- Desenvolvimento espiritual
- Resolução de conflitos`,
    category: "guia",
    author: "Especialista Musok (무속) coreano",
    date: "2026-02-20",
    readTime: 7,
    image: "🔮",
  },
  {
    id: "mudang",
    title: "Mudang: As Mulheres Xamãs da Coreia",
    excerpt: "Conheça a história e o papel das Mudang na preservação da tradição Musok coreana.",
    content: `Mudang (무당) são as mulheres xamãs da tradição Musok coreana. Elas ocupam um papel central na preservação e transmissão dessa sabedoria ancestral.

## História das Mudang

As Mudang têm uma história que remonta aos tempos antigos da Coreia. Historicamente, eram respeitadas como intermediárias entre os mundos espiritual e humano.

## Papel na Comunidade

### Cura Espiritual
As Mudang realizam rituais de cura para indivíduos e comunidades.

### Orientação Espiritual
Oferecem orientações através de adivinhação e comunicação com espíritos.

### Preservação da Tradição
Transmitem conhecimentos ancestrais para novas gerações.

### Celebração Ritual
Conduzem cerimônias importantes como Kuts e rituais de passagem.

## Treinamento e Iniciação

O caminho para se tornar Mudang envolve:
1. Experiência de Shinbyeong
2. Aprendizado com uma Mudang experiente
3. Realização de rituais de iniciação
4. Desenvolvimento contínuo de habilidades espirituais

## Mudang Contemporâneas

Hoje, muitas Mudang combinam práticas tradicionais com abordagens modernas, oferecendo orientação espiritual para pessoas em busca de significado e cura.`,
    category: "historia",
    author: "Especialista Musok (무속) coreano",
    date: "2026-02-15",
    readTime: 8,
    image: "👩‍🔮",
  },
];

const categoryLabels = {
  ritual: "🎭 Rituais",
  pratica: "✨ Práticas",
  historia: "📚 História",
  guia: "🧭 Guia",
};

const categoryColors = {
  ritual: "bg-fire/10 text-fire border-fire/30",
  pratica: "bg-purple-light/10 text-purple-light border-purple-light/30",
  historia: "bg-wood/10 text-wood border-wood/30",
  guia: "bg-earth/10 text-earth border-earth/30",
};

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-border/30 py-12">
        <div className="container mx-auto px-4">
          <Link href="/">
            <Button variant="ghost" className="mb-6">← Voltar</Button>
          </Link>
          <div className="text-5xl mb-4">📚</div>
          <h1 className="text-4xl font-bold text-primary mb-2" style={{ fontFamily: "'Cinzel', serif" }}>
            Blog Pilares da Sabedoria
          </h1>
          <p className="text-xl text-muted-foreground">Conteúdo educativo sobre Musok, rituais e práticas ancestrais</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Buscar artigos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              onClick={() => setSelectedCategory(null)}
              size="sm"
            >
              Todos
            </Button>
            {Object.entries(categoryLabels).map(([key, label]) => (
              <Button
                key={key}
                variant={selectedCategory === key ? "default" : "outline"}
                onClick={() => setSelectedCategory(key)}
                size="sm"
              >
                {label}
              </Button>
            ))}
          </div>
        </div>

        {/* Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredPosts.map((post) => (
            <Link key={post.id} href={`/blog/${post.id}`}>
              <div className="bg-card border border-border/30 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
                {/* Image */}
                <div className="bg-primary/10 h-40 flex items-center justify-center text-6xl">
                  {post.image}
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                  {/* Category Badge */}
                  <div className={`inline-flex w-fit px-3 py-1 rounded-full text-xs font-semibold mb-3 border ${categoryColors[post.category]}`}>
                    {categoryLabels[post.category]}
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-2">
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-grow">
                    {post.excerpt}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-border/30">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(post.date).toLocaleDateString("pt-BR")}
                      </span>
                      <span>{post.readTime} min</span>
                    </div>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">Nenhum artigo encontrado.</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory(null);
              }}
              className="mt-4"
            >
              Limpar filtros
            </Button>
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="bg-primary/10 border-t border-border/30 py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-primary mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Quer aprender mais?
          </h2>
          <p className="text-muted-foreground mb-6">
            Explore nossos módulos educativos e comece sua jornada na sabedoria do Musok coreano.
          </p>
          <Link href="/">
            <Button size="lg" className="gap-2">
              Explorar Módulos <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
