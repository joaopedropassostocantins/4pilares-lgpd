# Painel de Degustação — 4 Pilares LGPD

## Resumo

O **Painel de Degustação** é uma ferramenta interativa que permite que clientes em potencial preencham informações básicas da empresa e indiquem suas demandas, riscos e nível atual de conformidade LGPD. O painel funciona como um **trial/demo** que coleta dados para diagnóstico inicial.

## 📍 Rotas

| Rota | Página | Descrição |
|------|--------|-----------|
| `/degustacao` | Degustacao.tsx | Formulário em 4 etapas |
| `/degustacao-sucesso` | DegustacaoSucesso.tsx | Página de sucesso com próximos passos |

## 🎯 Funcionalidades

### Formulário em 4 Etapas

#### **Etapa 1: Informações da Empresa**
- Razão Social (obrigatório)
- CNPJ (obrigatório, com máscara)
- Segmento (ex: Tecnologia, Saúde, Varejo)
- Tamanho (Micro, Pequena, Média, Grande, Multinacional)
- CEP, Estado, Cidade
- Responsável (nome, cargo)
- E-mail (obrigatório)
- Telefone

#### **Etapa 2: Demandas**
Seleção múltipla de 8 demandas:
- 🔍 Diagnóstico LGPD
- 📄 Política de Privacidade
- 📋 ROPA (Registro de Operações)
- 📊 RIPD (Relatório de Impacto)
- 🤝 Contratos DPA
- 🎓 Treinamento LGPD
- ⚖️ DPO as a Service
- ✅ Auditoria de Conformidade

#### **Etapa 3: Riscos**
Seleção múltipla de 6 riscos:
- 🔐 Tratamento de dados pessoais sensíveis
- 🌍 Transferência internacional de dados
- 👥 Compartilhamento com terceiros
- ⚠️ Vulnerabilidades de segurança
- ❌ Falta de conformidade regulatória
- 🚨 Histórico de incidentes de privacidade

#### **Etapa 4: Conformidade**
Avaliação do nível de conformidade (0-100%) em cada pilar:
- **Pilar 1: Lei** (azul #1D4ED8)
- **Pilar 2: Regras** (verde #059669)
- **Pilar 3: Conformidade** (laranja #EA580C)
- **Pilar 4: Titular** (roxo #7C3AED)

Mais campo de observações livres.

## 💾 Armazenamento

Os dados são armazenados na tabela `tastings` do banco de dados:

```typescript
export const tastings = mysqlTable("tastings", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id"),
  email: varchar("email", { length: 320 }).notNull(),
  razaoSocial: varchar("razao_social", { length: 255 }).notNull(),
  cnpj: varchar("cnpj", { length: 18 }).notNull().unique(),
  segmento: varchar("segmento", { length: 100 }),
  tamanho: mysqlEnum("tamanho", ["micro", "pequena", "media", "grande", "multinacional"]),
  cep: varchar("cep", { length: 9 }),
  estado: varchar("estado", { length: 2 }),
  cidade: varchar("cidade", { length: 100 }),
  responsavel: varchar("responsavel", { length: 255 }),
  cargo: varchar("cargo", { length: 100 }),
  telefone: varchar("telefone", { length: 20 }),
  demandas: json("demandas").$type<string[]>(),
  riscos: json("riscos").$type<string[]>(),
  statusLei: int("status_lei").notNull(),
  statusRegras: int("status_regras").notNull(),
  statusConformidade: int("status_conformidade").notNull(),
  statusTitular: int("status_titular").notNull(),
  observacoes: text("observacoes"),
  status: mysqlEnum("status", ["draft", "submitted", "converted", "expired"]).default("draft"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  submittedAt: timestamp("submitted_at"),
});
```

## 🎨 Design

### Estética
- **Tema**: Light com destaque em azul (#1D4ED8)
- **Tipografia**: DM Serif Display (títulos), DM Sans (corpo)
- **Componentes**: Botões, inputs, sliders, checkboxes customizados
- **Animações**: Framer Motion com fade-up suave

### Responsividade
- ✅ Desktop: Layout completo com sidebar
- ✅ Tablet: Ajustes de grid
- ✅ Mobile: Stack vertical, inputs full-width

## 📊 Página de Sucesso

Após submissão, o usuário é redirecionado para `/degustacao-sucesso` que exibe:

1. **Confirmação visual** com ícone de sucesso
2. **3 próximos passos** com timeline:
   - E-mail de confirmação (imediato)
   - Acesso ao painel (até 1 hora)
   - Contato do especialista (até 24 horas)
3. **Dicas para aproveitar** a degustação
4. **FAQ** com 4 perguntas frequentes
5. **CTA** para WhatsApp e e-mail

## 🔧 Próximas Etapas para Produção

### 1. Backend de Coleta
```typescript
// server/routers.ts
tastings: router({
  create: publicProcedure
    .input(z.object({
      email: z.string().email(),
      razaoSocial: z.string(),
      cnpj: z.string(),
      // ... outros campos
    }))
    .mutation(async ({ input }) => {
      // 1. Validar CNPJ
      // 2. Verificar se já existe
      // 3. Inserir no banco
      // 4. Enviar e-mail de confirmação
      // 5. Retornar ID da degustação
    }),
}),
```

### 2. Painel de Visualização
Criar dashboard onde clientes podem visualizar:
- Status de conformidade em tempo real
- Módulos dos 4 pilares
- Documentos base para download
- Progresso da degustação

### 3. Integração com Checkout
- Converter degustação em assinatura paga
- Pré-preencher dados do checkout com informações da degustação
- Oferecer desconto para conversão rápida

### 4. E-mail de Confirmação
- Template HTML com branding
- Link para acessar painel de degustação
- Instruções de próximos passos
- Contato do suporte

### 5. Notificações Internas
- Alertar time de vendas quando nova degustação é criada
- Dashboard admin para gerenciar degustações
- Filtros por status, data, segmento, etc.

## 📱 Navegação

- **Navbar**: Link "Teste Grátis" leva a `/degustacao`
- **Home**: CTA principal "Iniciar Diagnóstico" pode redirecionar para degustação
- **Planos**: Botão "Testar Grátis" em cada plano
- **Footer**: Link "Teste Grátis" na seção de navegação

## 🔐 Segurança

✅ **Implementado:**
- Validação de e-mail
- Máscara de CNPJ (validação básica)
- Sem armazenamento de dados sensíveis
- Sem exposição de dados de outros usuários

⏳ **Pendente:**
- Validação de CNPJ com algoritmo de dígitos verificadores
- Rate limiting para evitar spam
- Verificação de e-mail (confirmation link)
- Criptografia de dados sensíveis

## 📊 Métricas

Para acompanhar o sucesso do painel:
- Total de degustações iniciadas
- Taxa de conclusão (draft → submitted)
- Taxa de conversão (degustação → assinatura)
- Demandas mais solicitadas
- Riscos mais identificados
- Segmentos com maior engajamento

## 🎯 Critérios de Aceite ✅

- ✅ Formulário em 4 etapas navegável
- ✅ Validação de campos obrigatórios
- ✅ Seleção múltipla de demandas e riscos
- ✅ Sliders para conformidade por pilar
- ✅ Página de sucesso com próximos passos
- ✅ Links de navegação na navbar e footer
- ✅ Responsividade mobile
- ✅ Animações suaves
- ✅ Sem erros de TypeScript

## 📚 Referências

- Tabela `tastings` em `drizzle/schema.ts`
- Páginas em `client/src/pages/Degustacao.tsx` e `DegustacaoSucesso.tsx`
- Rotas em `client/src/App.tsx`
- Layout em `client/src/components/Layout.tsx`
