# Análise de Compatibilidade - GitHub Pages

## ✅ Status: CORRIGIDO (07/01/2026)

| Cenário | Status | Notas |
|---------|--------|-------|
| Abrir `file://` direto | ❌ Não funciona | CORS bloqueia fetch() e módulos ES6 |
| GitHub Pages (raiz) | ✅ **Funciona** | Correções aplicadas |
| GitHub Pages (subpasta) | ✅ **Funciona** | Todos os caminhos agora são relativos |

---

## Problemas e Soluções

### 1. [CORRIGIDO] Caminhos em `loginscreen.js`

**Problema:** Caminhos absolutos `/pages/...` quebravam no GitHub Pages.

**Solução:**
```javascript
// ANTES (ERRO)
discente: "/pages/discente/dashboard.html"

// DEPOIS (CORRIGIDO)
discente: "../discente/dashboard.html"
```

---

### 2. [CORRIGIDO] Case-Sensitivity no Git

**Problema:** No Windows, renomear uma pasta de `DiscenteOfertante` para `discenteOfertante` não é detectado pelo Git porque Windows é **case-insensitive**. 

Quando o código é publicado no GitHub Pages (Linux, **case-sensitive**), a pasta mantém o nome original `DiscenteOfertante`, mas o HTML referencia `discenteOfertante` (d minúsculo), causando **404**.

```
📁 Git rastreia:     DiscenteOfertante/dashboard.css
📄 HTML referencia:  discenteOfertante/dashboard.css
❌ Resultado:        404 Not Found
```

**Solução:** Usar `git mv` para renomear em duas etapas:

```bash
git mv "assets/css/ui/DiscenteOfertante" "assets/css/ui/temp"
git mv "assets/css/ui/temp" "assets/css/ui/discenteOfertante"
```

---

### 3. [CORRIGIDO] Caminhos de fetch() em JavaScript

**Problema:** Os arquivos JS usavam caminhos que eram relativos ao arquivo JS, mas o `fetch()` resolve caminhos relativos ao **contexto da página HTML**.

```javascript
// ANTES (ERRO) - em assets/js/discenteOfertante/dashboard.js
fetch("../../pages/discenteOfertante/dashboard_view.html")
// Isso tenta acessar: assets/pages/discenteOfertante/... (NÃO EXISTE)

// DEPOIS (CORRETO)
fetch("./dashboard_view.html")
// Isso acessa: pages/discenteOfertante/dashboard_view.html (CORRETO)
```

Arquivos corrigidos:
- `dashboard.js`
- `oportunidades.js`
- `solicitacoes.js`
- `projetos.js`
- `certificacoes.js`

---

### 4. [CORRIGIDO] Caminhos em `home.html`

**Problema:** O arquivo `home.html` é carregado via `fetch()` pelo `index.html`, então seus caminhos relativos são resolvidos a partir da **raiz** (onde está `index.html`).

```html
<!-- ANTES (ERRO) -->
<img src="../../assets/img/logo.png">
<!-- Resolve para: ../assets/img/logo.png (não existe) -->

<!-- DEPOIS (CORRETO) -->
<img src="./assets/img/logo.png">
<!-- Resolve para: assets/img/logo.png (correto) -->
```

---

## Por que Docente/Coordenador Funcionam?

As páginas de docente e coordenador **não importam CSS específicos** das suas pastas. Eles usam apenas:
- `../../assets/css/common/layout.css`
- `../../assets/css/global/*.css`

Já o `discenteOfertante` importa CSS específicos:
- `../../assets/css/ui/discenteOfertante/dashboard.css`
- `../../assets/css/ui/discenteOfertante/oportunidades.css`
- etc.

Por isso o problema de case-sensitivity **só afetava** o discenteOfertante.

---

## Resumo das Arquiteturas

### Padrão 1: Docente/Coordenador (SEM CSS específico)
```
pages/docente/dashboard.html
├── CSS: ../../assets/css/global/*.css  (FUNCIONA)
└── JS: carrega HTML via fetch() antes de inicializar layout
```

### Padrão 2: DiscenteOfertante (COM CSS específico)
```
pages/discenteOfertante/dashboard.html
├── CSS: ../../assets/css/ui/discenteOfertante/*.css  (PRECISA CASE CORRETO)
└── JS: carrega HTML via fetch("./view.html") (RELATIVO À PÁGINA)
```

---

## Verificação

```bash
# Testar localmente
npx serve

# Verificar no console (F12) que não há erros 404
```

Testar no GitHub Pages:
1. `git add .`
2. `git commit -m "fix: case sensitivity e caminhos"`
3. `git push`
4. Acessar: `https://usuario.github.io/extensao_prototipo/`

---

## Nota sobre `file://`

O projeto **não funciona** ao abrir `index.html` diretamente (`file://`) por limitações de segurança do navegador (CORS). Para desenvolvimento local, usar um servidor HTTP:

```bash
# Python 3
python -m http.server 8000

# Node.js
npx serve
```
