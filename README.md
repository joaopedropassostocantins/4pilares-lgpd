<div align="center">

# 4 Pilares LGPD

**Plataforma de adequação à Lei Geral de Proteção de Dados para empresas brasileiras**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-22-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Drizzle_ORM-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://orm.drizzle.team/)
[![License](https://img.shields.io/badge/Licença-Proprietária-red?style=flat-square)](./LICENSE)

</div>

---

## Sobre

O **4 Pilares LGPD** é uma plataforma web SaaS que guia empresas brasileiras no processo de adequação à [Lei 13.709/2018 (LGPD)](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm). A plataforma estrutura o processo de conformidade em 4 pilares fundamentais, oferecendo diagnóstico, plano de adequação, materiais e suporte especializado.

## Os 4 Pilares

| # | Pilar | O que cobre |
|---|-------|-------------|
| 1 | **Lei** | Bases legais, obrigações do Art. 7º, dados sensíveis e sanções da ANPD |
| 2 | **Regras** | Políticas de privacidade, ROPA, contratos com operadores e treinamento de equipes |
| 3 | **Conformidade** | Diagnóstico de maturidade, data mapping, DPIA e plano de adequação com roadmap |
| 4 | **Titular** | Canal de atendimento, fluxos de resposta, portabilidade e direito ao esquecimento |

## Stack Técnica

### Frontend
- **React 18** + **TypeScript** — SPA com tipagem estática
- **Vite** — bundler e dev server
- **Tailwind CSS** + **shadcn/ui** — design system baseado em Radix UI
- **Wouter** — roteamento leve client-side
- **React Hook Form** + **Zod** — formulários com validação de schema
- **Framer Motion** — animações de interface

### Backend
- **Node.js 22** + **Express** — servidor HTTP
- **tRPC** — API type-safe end-to-end
- **Drizzle ORM** + **PostgreSQL** — banco de dados relacional
- **AWS S3** — armazenamento de arquivos

### Pagamentos
- **Stripe** — cartão de crédito (mercado internacional)
- **Mercado Pago** — PIX, boleto e cartão (mercado brasileiro)

### Infraestrutura
- **Sessões server-side** com autenticação segura
- **Webhooks** para confirmação de pagamentos
- **Vitest** — testes unitários e de integração

## Pré-requisitos

- Node.js 20+
- pnpm 9+
- PostgreSQL 14+

## Instalação

```bash
# 1. Clonar o repositório
git clone https://github.com/joaopedropassostocantins/4pilares-lgpd.git
cd 4pilares-lgpd

# 2. Instalar dependências
pnpm install

# 3. Configurar variáveis de ambiente
cp .env.example .env
# Edite o .env com suas credenciais

# 4. Criar e migrar banco de dados
pnpm db:push

# 5. Iniciar em desenvolvimento
pnpm dev
```

O servidor estará disponível em `http://localhost:5000`.

## Variáveis de Ambiente

```env
# Banco de dados
DATABASE_URL=postgresql://user:password@localhost:5432/4pilares_lgpd

# Sessão
SESSION_SECRET=chave_secreta_longa_e_aleatoria

# Stripe (pagamentos internacionais)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Mercado Pago (pagamentos brasileiros)
MERCADOPAGO_ACCESS_TOKEN=APP_USR-...

# AWS S3 (armazenamento de arquivos)
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1
AWS_S3_BUCKET=...
```

## Scripts

| Comando | Descrição |
|---------|-----------|
| `pnpm dev` | Inicia servidor de desenvolvimento (frontend + backend) |
| `pnpm build` | Gera build de produção |
| `pnpm start` | Inicia a aplicação em modo produção |
| `pnpm test` | Executa testes com Vitest |
| `pnpm check` | Verificação de tipos TypeScript |
| `pnpm format` | Formata o código com Prettier |
| `pnpm db:push` | Gera e aplica migrações do banco de dados |

## Estrutura do Projeto

```
4pilares-lgpd/
├── client/                  # Frontend React
│   └── src/
│       ├── pages/           # Páginas da aplicação
│       │   ├── Home.tsx
│       │   ├── PilarLei.tsx
│       │   ├── PilarRegras.tsx
│       │   ├── PilarConformidade.tsx
│       │   ├── PilarTitular.tsx
│       │   ├── CheckoutFlow.tsx
│       │   ├── Portal.tsx   # Área do cliente
│       │   └── Admin/       # Painel administrativo
│       ├── components/      # Componentes reutilizáveis
│       ├── data/            # Conteúdo dos módulos
│       ├── hooks/           # Custom React hooks
│       ├── lib/             # Utilitários (trpc, tracking)
│       └── contexts/        # Contextos React (tema, auth)
├── server/                  # Backend Node.js
│   ├── _core/               # Bootstrap e configuração central
│   ├── routes/              # Endpoints da API
│   ├── stripe.ts            # Integração Stripe
│   ├── webhook.ts           # Handler de webhooks de pagamento
│   └── db/                  # Queries e schema do banco
├── shared/                  # Tipos e schemas compartilhados (cliente + servidor)
├── drizzle/                 # Migrações do banco de dados
└── public/                  # Assets estáticos
```

## Rotas da Aplicação

### Públicas
| Rota | Página |
|------|--------|
| `/` | Home |
| `/sobre` | Sobre a empresa |
| `/planos` | Planos e preços |
| `/preco` | Preços detalhados |
| `/faq` | Perguntas frequentes |
| `/contato` | Contato |
| `/blog` | Blog sobre LGPD |
| `/lei` | Pilar da Lei |
| `/regras` | Pilar das Regras |
| `/conformidade` | Pilar da Conformidade |
| `/titular` | Pilar do Titular |
| `/checkout` | Fluxo de checkout |
| `/privacidade` | Política de Privacidade |
| `/termos` | Termos de Uso |

### Autenticadas
| Rota | Descrição |
|------|-----------|
| `/portal` | Portal do cliente |
| `/dashboard` | Dashboard do cliente |
| `/subscription` | Gestão de assinatura |
| `/admin` | Painel administrativo |
| `/admin/clientes` | Gestão de clientes |
| `/admin/financeiro` | Relatórios financeiros |
| `/admin/incidentes` | Registro de incidentes |

## Contribuição

Este é um repositório privado. Para reportar bugs ou sugerir melhorias, abra uma issue ou entre em contato diretamente com a equipe.

---

<div align="center">
  <sub>Desenvolvido com foco em conformidade, segurança e experiência do usuário.</sub>
</div>
