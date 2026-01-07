# Análise de Compatibilidade - GitHub Pages

## ✅ Status: CORRIGIDO (07/01/2026)

| Cenário | Status | Notas |
|---------|--------|-------|
| Abrir `file://` direto | ❌ Não funciona | CORS bloqueia fetch() e módulos ES6 |
| GitHub Pages (raiz) | ✅ **Funciona** | Correções aplicadas |
| GitHub Pages (subpasta) | ✅ **Funciona** | Todos os caminhos agora são relativos |

---

## Correções Aplicadas

### 1. [CORRIGIDO] Caminhos em `loginscreen.js`

O arquivo usava caminhos absolutos `/pages/...` que quebravam no GitHub Pages.

**Alteração:**
```javascript
// ANTES (ERRO)
const rotas = {
    discente: "/pages/discente/dashboard.html",
    // ...
};

// DEPOIS (CORRIGIDO)
const rotas = {
    discente: "../discente/dashboard.html",
    // ...
};
```

### 2. [CORRIGIDO] HTML inválido em `resetpassscreen.html`

Removida tag `<body>` duplicada.

### 3. [JÁ ESTAVA OK] Arquivos HTML

Todos os arquivos HTML já usavam caminhos relativos `../../assets/...`:
- `pages/home/home.html` ✅
- `pages/login/loginscreen.html` ✅
- `pages/login/registerscreen.html` ✅
- `pages/login/activatescreen.html` ✅
- `pages/login/passrecoverscreen.html` ✅
- `pages/login/resetpassscreen.html` ✅

### 4. [JÁ ESTAVA OK] `routerPerfil.js`

Já usava caminhos relativos `../discente/dashboard.html`.

---

## Arquitetura de Navegação

```
index.html (raiz)
│
├── Botão "Entrar" → pages/login/loginscreen.html
│   └── Login OK → ../discente/dashboard.html (relativo à pasta login)
│
└── Botão "Admin" → pages/common/routerPerfil.html
    └── Seleciona perfil → ../discente/dashboard.html (relativo à pasta common)
```

---

## Verificação

Para testar no GitHub Pages:

1. Push para repositório
2. Settings → Pages → Branch: main
3. Acessar `https://usuario.github.io/extensao_prototipo/`
4. Testar:
   - [ ] Home carrega corretamente
   - [ ] Login funciona (email: `discente@teste.com`, senha: `123456`)
   - [ ] Redirecionamento após login funciona
   - [ ] Acesso Admin funciona (senha: `PPC@dev`)
   - [ ] Navegação entre abas funciona

---

## Nota sobre `file://`

O projeto **não funciona** ao abrir `index.html` diretamente (`file://`) por limitações de segurança do navegador (CORS). Para desenvolvimento local, usar um servidor HTTP:

```bash
# Python 3
python -m http.server 8000

# Node.js
npx serve
```
