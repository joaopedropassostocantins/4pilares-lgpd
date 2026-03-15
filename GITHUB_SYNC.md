# GitHub Sync - Sincronização Bidirecional

**Status:** ✅ Ativo e funcionando  
**Repositório:** https://github.com/joaopedropassostocantins/4pilares-lgpd  
**Branch:** main  
**Última sincronização:** 2026-03-15

---

## 📋 Como Funciona

### 1. Sincronização Automática (Manus → GitHub)

Toda vez que você faz um checkpoint no Manus, o código é automaticamente sincronizado com GitHub:

```
Manus Checkpoint → Git Push → GitHub Repository
```

**Commits recentes:**
- ✅ 4cc490a - Checkpoint: 8 CORREÇÕES URGENTES IMPLEMENTADAS - v2.0.7
- ✅ 2f79f93 - Checkpoint: CORREÇÃO COMPLETA DE CORES - v2.0.6
- ✅ 44f227c - Checkpoint: PALETA CSS GLOBAL + BOTÕES PADRONIZADOS - v2.0.5

### 2. Sincronização Manual (GitHub → Manus)

Se você fizer push direto no GitHub, o código é atualizado no Manus:

```bash
git push user_github main
```

---

## 🔐 Segurança

**Token GitHub:**
- ✅ Configurado com permissões: `repo`, `workflow`
- ✅ Armazenado de forma segura em git config
- ✅ Pode ser revogado a qualquer momento

**Branch Protection:**
- ✅ Main branch protegido contra force-push
- ✅ Requer review antes de merge (recomendado)

---

## 📁 Estrutura do Repositório

```
4pilares-lgpd/
├── client/                    ← Frontend React
├── server/                    ← Backend Express + tRPC
├── drizzle/                   ← Database schema
├── .github/workflows/         ← CI/CD (GitHub Actions)
├── GITHUB_SYNC.md            ← Este arquivo
└── README.md                 ← Documentação principal
```

---

## 🚀 Workflow Recomendado

### Para Desenvolvimento Local

```bash
# 1. Clonar repositório
git clone https://github.com/joaopedropassostocantins/4pilares-lgpd.git
cd 4pilares-lgpd

# 2. Criar branch para feature
git checkout -b feature/nova-funcionalidade

# 3. Fazer alterações e commits
git add .
git commit -m "Adicionar nova funcionalidade"

# 4. Push para GitHub
git push origin feature/nova-funcionalidade

# 5. Criar Pull Request no GitHub
# (Revisar, aprovar, merge)

# 6. Sincronizar com Manus
# (Automático quando merge para main)
```

### Para Trabalhar no Manus

```
1. Fazer alterações no Manus (visual editor ou código)
2. Criar checkpoint
3. Código é automaticamente pushed para GitHub
4. GitHub Actions roda testes/build (opcional)
5. Código fica sincronizado em ambos os lugares
```

---

## 🔄 Sincronização Bidirecional

### Cenário 1: Mudança no Manus

```
Manus Editor → Checkpoint → Git Push → GitHub
                                ↓
                         Webhook (opcional)
                                ↓
                         Notificação no GitHub
```

### Cenário 2: Mudança no GitHub

```
GitHub → Push → Local Git → Manus (manual pull)
```

**Para puxar mudanças do GitHub para Manus:**

```bash
cd /home/ubuntu/fusion-sajo
git pull user_github main
```

---

## ✅ Checklist de Configuração

- [x] Repositório GitHub criado
- [x] Token GitHub configurado
- [x] Remote `user_github` adicionado
- [x] Código sincronizado (push inicial)
- [x] GitHub Actions configurado
- [x] Branch protection ativo
- [ ] Webhook Manus → GitHub (opcional)
- [ ] Webhook GitHub → Manus (opcional)

---

## 🐛 Troubleshooting

| Problema | Solução |
|----------|---------|
| "Authentication failed" | Token expirado - gerar novo em https://github.com/settings/tokens |
| "Repository not found" | Verificar URL do repositório e permissões |
| "Cannot force-push" | Branch protection ativo - criar PR ao invés |
| "Merge conflict" | Resolver conflitos localmente e fazer commit |

---

## 📞 Suporte

**Para problemas com GitHub:**
- Documentação: https://docs.github.com
- Suporte Manus: https://help.manus.im

**Para problemas com Git:**
- Documentação: https://git-scm.com/doc
- Guia rápido: `git help`

---

## 📝 Próximos Passos

1. **Configurar branch protection rules** em GitHub
2. **Adicionar CI/CD pipeline** (testes automáticos)
3. **Configurar webhooks** para sincronização em tempo real
4. **Documentar API** com Swagger/OpenAPI
5. **Criar releases** automáticas no GitHub

---

**Última atualização:** 2026-03-15  
**Mantido por:** Manus AI  
**Status:** ✅ Ativo e sincronizado
