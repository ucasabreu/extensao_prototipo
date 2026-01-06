# Análise de Compatibilidade - GitHub Pages

## Resumo

| Cenário | Funciona? | Motivo |
|---------|-----------|--------|
| Abrir `file://` direto | ❌ Não | CORS bloqueia fetch() e módulos ES6 |
| GitHub Pages (raiz) | ✅ Sim* | Servidor HTTP resolve CORS, mas precisa corrigir caminhos |
| GitHub Pages (subpasta) | ⚠️ Parcial | Caminhos absolutos `/assets/` quebram |

---

## Problemas Identificados

### 1. [CRÍTICO] Caminhos Absolutos `/assets/...`

**26+ arquivos** usam caminhos que começam com `/` (absolutos). No GitHub Pages com repositório em subpasta (`usuario.github.io/repo/`), esses caminhos apontam para a raiz do domínio.

**Arquivos afetados:**
- `pages/home/home.html` (linhas 8-15, 38)
- `pages/login/loginscreen.html` (linhas 6-7, 14, 53)
- `pages/login/registerscreen.html` (linhas 6-7, 17, 71)
- `pages/login/activatescreen.html` (linhas 6-7, 42)
- `pages/login/passrecoverscreen.html` (linhas 6-7, 53)
- `pages/login/resetpassscreen.html` (linhas 6-7, 56)

**Solução:** Mudar de `/assets/...` para caminhos relativos `../../assets/...` ou `../assets/...` dependendo da profundidade.

---

### 2. [MÉDIO] Caminhos Errados em JavaScript

**Arquivos com problemas:**
- `routerPerfil.js` linha 11: `/index.html` → deve ser relativo
- Vários arquivos usam `../../pages/` que está correto

---

### 3. [INFO] fetch() e Módulos ES6

O projeto usa `fetch()` para carregar HTML e `import/export` para módulos. Isso **funciona** no GitHub Pages porque é servido via HTTP/HTTPS.

**NÃO funciona** ao abrir `file://` diretamente por CORS.

---

## Opções de Solução

### Opção A: Manter fetch() + Corrigir Caminhos (GitHub Pages)
- ✅ Funciona no GitHub Pages
- ❌ Não funciona via `file://`
- Esforço: Médio (corrigir ~30 referências)

### Opção B: Eliminar fetch() + HTML Inline (Acesso Local)
- ✅ Funciona via `file://`
- ✅ Funciona no GitHub Pages
- Esforço: Alto (reestruturar todo o projeto)

### Opção C: Usar `<base href>` (Recomendada)
- ✅ Funciona no GitHub Pages
- ❌ Não funciona via `file://`
- Esforço: Baixo (adicionar 1 linha + corrigir caminhos absolutos)

---

## Plano de Correção Recomendado (Opção C)

### Passo 1: Corrigir caminhos absolutos em HTML

Mudar todos os `/assets/...` para `../../assets/...` nos arquivos:

| Arquivo | Alteração |
|---------|-----------|
| `pages/home/home.html` | `/assets/` → `../../assets/` |
| `pages/login/*.html` (5 arquivos) | `/assets/` → `../../assets/` |
| `pages/home/home.html` linha 38 | `/pages/` → `../../pages/` |

### Passo 2: Corrigir `routerPerfil.js`

```javascript
// Linha 11: mudar de
window.location.href = "/index.html";
// Para:
window.location.href = "../../index.html";
```

### Passo 3: Verificar outros caminhos JS

Os demais arquivos já usam caminhos relativos corretos.

---

## Verificação

1. Fazer push para GitHub
2. Ativar GitHub Pages (Settings → Pages → Branch: main)
3. Acessar `https://usuario.github.io/extensao_prototipo/`
4. Testar navegação entre páginas

