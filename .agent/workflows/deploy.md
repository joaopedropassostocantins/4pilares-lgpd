---
description: como fazer deploy das mudanças para o site pilaresdasabedoria.club via GitHub
---

# Deploy: Antigravity → GitHub → Manus → pilaresdasabedoria.club

## Pré-requisitos
- Repositório local: `c:\Users\55639\Downloads\PILARES_NAY`
- Remoto configurado: `https://github.com/joaopedropassos/fusion-sajo.git`

## Passos

1. Fazer as alterações no código normalmente no Antigravity

// turbo
2. Adicionar todos os arquivos modificados ao stage:
```
git -C "c:\Users\55639\Downloads\PILARES_NAY" add .
```

3. Criar o commit com mensagem descritiva (substitua a mensagem conforme as mudanças):
```
git -C "c:\Users\55639\Downloads\PILARES_NAY" commit -m "Melhorias na home"
```

// turbo
4. Enviar para o GitHub:
```
git -C "c:\Users\55639\Downloads\PILARES_NAY" push origin main
```

5. Aguardar o Manus detectar o push e fazer o deploy automático no `pilaresdasabedoria.club`.
