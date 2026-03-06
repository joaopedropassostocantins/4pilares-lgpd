import { useRoute } from "wouter";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";

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

const blogPosts: Record<string, BlogPost> = {
  "ralo-invisivel-dinheiro": {
    id: "ralo-invisivel-dinheiro",
    title: "O 'ralo invisível' do dinheiro: por que algumas pessoas acumulam e outras gastam tudo no mesmo mês",
    excerpt: "Não é falta de disciplina. O comportamento com dinheiro tem um padrão que aparece no seu mapa de nascimento.",
    content: `No sistema dos Quatro Pilares, cada pessoa nasce com uma configuração específica de elementos. O Elemento de Riqueza — o que você tem capacidade de acumular — pode estar forte e acessível, forte mas bloqueado, ou fraco ou ausente.

Quando o Elemento de Riqueza está em conflito com o Oficial Severo, o resultado é um "ralo invisível": você trabalha, ganha, e no final do mês não sabe para onde foi.

O autoboicote financeiro existe — mas na maioria dos casos, o que parece sabotagem é, na verdade, um padrão energético rodando em segundo plano desde que você nasceu.`,
    category: "pratica",
    author: "Especialista Musok (무속) coreano",
    date: "2026-03-06",
    readTime: 7,
    image: "💵",
  },
  "saju-casamento-empresa": {
    id: "saju-casamento-empresa",
    title: "Por que os coreanos consultam o SAJU antes de casar, abrir empresa ou mudar de cidade",
    excerpt: "Na Coreia, consultar o SAJU antes de decisões importantes não é superstição — é protocolo.",
    content: `Na Coreia do Sul, o SAJU é consultado antes de casamentos, abertura de empresas, contratos e mudanças. O sistema usa quatro pilares: ano, mês, dia e hora de nascimento.

Cada pilar carrega dois caracteres — um Tronco Celestial e um Ramo Terrestre — formando um mapa de 8 caracteres que descreve os elementos que regem sua vida.

Esses elementos (Madeira, Fogo, Terra, Metal, Água) interagem entre si de formas previsíveis. Quando o Elemento de Riqueza está em conflito com o Oficial Severo, por exemplo, o dinheiro escoa.`,
    category: "historia",
    author: "Especialista Musok (무속) coreano",
    date: "2026-03-05",
    readTime: 6,
    image: "🃶",
  },
  "por-que-repito-erros": {
    id: "por-que-repito-erros",
    title: "Você não é sabotador. Seu padrão de nascimento é que está no comando",
    excerpt: "A psicologia chama de compulsão à repetição. O SAJU chama de padrão dos 4 Pilares.",
    content: `O relacionamento termina. Você promete que da próxima vez vai ser diferente. E na próxima vez, é igual.

Sigmund Freud chamou de "compulsão à repetição": a tendência inconsciente de recriar situações dolorosas até que o padrão subjacente seja reconhecido.

O SAJU mapeou algo que a psicologia ocidental leva anos para nomear: o padrão de repetição está codificado na configuração dos seus elementos ao nascimento.`,
    category: "pratica",
    author: "Especialista Musok (무속) coreano",
    date: "2026-03-04",
    readTime: 8,
    image: "🔄",
  },
  "cetico-saju": {
    id: "cetico-saju",
    title: "Não acredito em misticismo — mas o SAJU me acertou em coisas que ninguém poderia saber",
    excerpt: "Um olhar cético sobre o SAJU. O que é, como funciona, e por que o sistema não exige fé.",
    content: `Eu não acredito em horóscopo. Nunca acreditei. Signo solar não faz sentido para mim.

O SAJU não usa o signo solar. Usa quatro variáveis: ano, mês, dia e hora de nascimento — cruzadas com um sistema de 10 Troncos Celestiais e 12 Ramos Terrestres.

Ceticismo de verdade não é rejeição automática. É abertura à evidência. O SAJU não pede fé. Pede que você observe se o padrão descrito corresponde à sua experiência.`,
    category: "guia",
    author: "Especialista Musok (무속) coreano",
    date: "2026-03-03",
    readTime: 7,
    image: "🔍",
  },
  "xamanismo-luto": {
    id: "xamanismo-luto",
    title: "O que o xamanismo coreano diz sobre as almas que partem sem despedida",
    excerpt: "Na tradição coreana, mortes abruptas deixam almas em transição. O ritual Gut existe para fechar o que ficou em aberto.",
    content: `Na tradição xamânica coreana, existe uma distinção fundamental entre duas formas de partir.

Quando alguém morre depois de uma vida longa, rodeado por quem ama — a alma percorre o caminho de transição com clareza.

O Gut é o ritual xamânico coreano conduzido por uma mudang para servir de ponte entre os mundos. Para os vivos que ficaram, o Gut oferece algo que nenhum processo de luto convencional consegue dar: a possibilidade de um fechamento.`,
    category: "ritual",
    author: "Especialista Musok (무속) coreano",
    date: "2026-03-02",
    readTime: 8,
    image: "🔮",
  },
  "battle-of-fates": {
    id: "battle-of-fates",
    title: "O Disney+ acabou de provar que o SAJU é real — e o mundo está prestando atenção",
    excerpt: "Battle of Fates (운명전쟁49) estreou no Disney+ e se tornou o reality mais assistido da história da plataforma na Coreia do Sul. 49 xamãs competem para provar quem realmente consegue ler o futuro.",
    content: `Há algumas semanas, o Disney+ estreou um reality show diferente de tudo que já foi feito: **Battle of Fates (운명전쟁49)**. Nenhum chef. Nenhum cantor. Nenhuma prova de resistência física.

49 leitores do destino — xamãs, tarólogos, fisiognomonistas e mestres do SAJO, a astrologia ancestral coreana — competindo para provar quem realmente consegue ler o futuro.

## O Fenômeno do Reality

O programa se tornou o reality mais assistido da história do Disney+ na Coreia do Sul, superando títulos com orçamentos milionários. E a razão é simples: as pessoas querem respostas que a lógica convencional não dá.

Os participantes foram submetidos a desafios perturbadoramente precisos:
- Identificar a causa da morte de desconhecidos
- Encontrar pessoas com determinado patrimônio
- Reconhecer casais com múltiplos filhos apenas pela energia

No episódio final, três famílias que perderam entes queridos buscaram mensagens dos que partiram. Os xamãs conduziram rituais para guiar as almas em paz.

## O Significado Cultural

Crença ou ceticismo à parte: quando um dos maiores estúdios do mundo decide apostar em xamanismo e SAJO como formato de entretenimento global, algo mudou.

Não é mais sobre crenças marginalizadas. É sobre reconhecimento de um sistema milenar que funciona.

## O que o SAJU Realmente É

O SAJU (四柱, "quatro pilares") não é adivinhação. É um sistema milenar de leitura de padrões baseado na sua data de nascimento — ano, mês, dia e hora — cruzados com os cinco elementos e os ciclos energéticos que governam cada período da sua vida.

Enquanto o reality mostra o espetáculo, o que fazemos aqui vai mais fundo: identificamos o padrão específico que se repete na sua vida — em dinheiro, amor, saúde ou decisões — e mostramos a janela exata para romper esse ciclo.

## Próximos Passos

Você não precisa acreditar. Precisa ver.

A análise gratuita leva 30 segundos. Sem cadastro. Revelar seu padrão agora.

Quer ir mais fundo? Os módulos especializados combinam sua análise dos 4 Pilares com acompanhamento ao vivo — uma videochamada por semana durante 90 dias.

---

**Referência:** Battle of Fates está disponível no Disney+. O programa marca um ponto de virada no reconhecimento global da sabedoria ancestral coreana.`,
    category: "historia",
    author: "Especialista Musok (무속) coreano",
    date: "2026-03-06",
    readTime: 6,
    image: "📺",
  },
  "kut-ritual": {
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
  "shinbyeong": {
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
};

export default function BlogPostPage() {
  const [, params] = useRoute("/blog/:id");
  const postId = params?.id;
  const post = postId ? blogPosts[postId] : null;

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Artigo não encontrado</h1>
          <Link href="/blog">
            <Button>Voltar ao Blog</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-border/30 py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <Link href="/blog">
            <Button variant="ghost" className="mb-6 gap-2">
              <ArrowLeft className="h-4 w-4" /> Voltar ao Blog
            </Button>
          </Link>

          {/* Category Badge */}
          <div className="inline-block px-3 py-1 rounded-full text-sm font-semibold mb-4 bg-primary/20 text-primary border border-primary/30">
            {post.category === "ritual" && "🎭 Rituais"}
            {post.category === "pratica" && "✨ Práticas"}
            {post.category === "historia" && "📚 História"}
            {post.category === "guia" && "🧭 Guia"}
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-foreground mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            {post.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              {post.author}
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {new Date(post.date).toLocaleDateString("pt-BR")}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {post.readTime} minutos de leitura
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        {/* Featured Image */}
        <div className="bg-primary/10 rounded-lg h-64 flex items-center justify-center text-8xl mb-12">
          {post.image}
        </div>

        {/* Article Content */}
        <div className="prose prose-invert max-w-none mb-12">
          <div className="text-foreground leading-relaxed space-y-4">
            {post.content.split("\n\n").map((paragraph, idx) => {
              if (paragraph.startsWith("##")) {
                return (
                  <h2 key={idx} className="text-2xl font-bold text-primary mt-8 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {paragraph.replace("## ", "")}
                  </h2>
                );
              }
              if (paragraph.startsWith("-")) {
                return (
                  <ul key={idx} className="list-disc list-inside space-y-2 text-muted-foreground">
                    {paragraph.split("\n").map((item, i) => (
                      <li key={i}>{item.replace("- ", "")}</li>
                    ))}
                  </ul>
                );
              }
              if (paragraph.match(/^\d+\./)) {
                return (
                  <ol key={idx} className="list-decimal list-inside space-y-2 text-muted-foreground">
                    {paragraph.split("\n").map((item, i) => (
                      <li key={i}>{item.replace(/^\d+\.\s*/, "")}</li>
                    ))}
                  </ol>
                );
              }
              return (
                <p key={idx} className="text-muted-foreground">
                  {paragraph}
                </p>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-primary/10 border border-primary/30 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-primary mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Pronto para aprender mais?
          </h3>
          <p className="text-muted-foreground mb-6">
            Explore nossos módulos educativos e comece sua jornada na sabedoria do Musok coreano.
          </p>
          <Link href="/">
            <Button size="lg">Explorar Módulos</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
