# 4 Pilares LGPD

Plataforma de adequação à Lei Geral de Proteção de Dados (Lei 13.709/2018) para empresas brasileiras.

## Sobre o Projeto

O **4 Pilares LGPD** é uma plataforma web que guia empresas através dos 4 pilares fundamentais do processo de adequação à LGPD:

| Pilar | Descrição |
|-------|-----------|
| **Lei** | Compreensão da Lei 13.709/2018: bases legais, obrigações e penalidades |
| **Regras** | Políticas internas, documentação e normas da ANPD |
| **Conformidade** | Diagnóstico, plano de adequação e implementação técnica e jurídica |
| **Titular** | Gestão dos direitos dos titulares: acesso, correção, exclusão e portabilidade |

## Stack

- **Frontend:** React + TypeScript + Vite + Tailwind CSS + shadcn/ui
- **Backend:** Node.js + Express + tRPC
- **Banco de dados:** PostgreSQL + Drizzle ORM
- **Pagamentos:** Stripe + Mercado Pago
- **Auth:** Sessões server-side

## Pré-requisitos

- Node.js 20+
- pnpm
- PostgreSQL

## Instalação

```bash
# Instalar dependências
pnpm install

# Configurar variáveis de ambiente
cp .env.example .env
# Edite o .env com suas credenciais

# Criar e migrar banco de dados
pnpm db:push

# Iniciar em desenvolvimento
pnpm dev
```

## Variáveis de Ambiente

```env
DATABASE_URL=postgresql://user:password@localhost:5432/4pilares_lgpd
SESSION_SECRET=sua_chave_secreta_aqui
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
MERCADOPAGO_ACCESS_TOKEN=...
```

## Scripts

| Comando | Descrição |
|---------|-----------|
| `pnpm dev` | Inicia servidor de desenvolvimento |
| `pnpm build` | Build de produção |
| `pnpm start` | Inicia em produção |
| `pnpm test` | Executa testes |
| `pnpm check` | Verificação de tipos TypeScript |
| `pnpm db:push` | Gera e aplica migrações do banco |

## Estrutura do Projeto

```
├── client/          # Frontend React
│   └── src/
│       ├── pages/   # Páginas da aplicação
│       ├── components/ # Componentes reutilizáveis
│       ├── data/    # Dados estáticos (módulos, conteúdo)
│       └── lib/     # Utilitários e configurações
├── server/          # Backend Node.js
│   ├── _core/       # Configuração central do servidor
│   └── routes/      # Rotas da API
├── shared/          # Tipos e schemas compartilhados
└── drizzle/         # Migrações do banco de dados
```

## Rotas Principais

| Rota | Descrição |
|------|-----------|
| `/` | Página inicial |
| `/lei` | Pilar da Lei |
| `/regras` | Pilar das Regras |
| `/conformidade` | Pilar da Conformidade |
| `/titular` | Pilar do Titular |
| `/planos` | Planos e preços |
| `/blog` | Blog sobre LGPD |
| `/portal` | Portal do cliente (autenticado) |
| `/admin` | Painel administrativo (autenticado) |

## Licença

Proprietário — todos os direitos reservados.
