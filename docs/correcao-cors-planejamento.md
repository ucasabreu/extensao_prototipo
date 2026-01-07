# Análise de Compatibilidade - GitHub Pages

## ✅ Status: CORRIGIDO (07/01/2026)

| Cenário | Status | Notas |
|---------|--------|-------|
| Abrir `file://` direto | ❌ Não funciona | CORS bloqueia fetch() e módulos ES6 |
| GitHub Pages | ✅ **Funciona** | Todas as correções aplicadas |

---

## Problemas Identificados e Soluções

### 1. Caminhos Absolutos em `loginscreen.js`

**Problema:** Caminhos `/pages/...` quebram no GitHub Pages.

**Solução:**
```javascript
// ANTES
discente: "/pages/discente/dashboard.html"
// DEPOIS
discente: "../discente/dashboard.html"
```

---

### 2. Case-Sensitivity no Git

**Problema:** Windows é case-insensitive, Git e GitHub Pages são case-sensitive. Renomear pasta de `DiscenteOfertante` para `discenteOfertante` não era detectado.

**Solução:**
```bash
git mv DiscenteOfertante temp
git mv temp discenteOfertante
```

---

### 3. Caminhos de fetch() em JavaScript

**Problema:** O `fetch()` resolve caminhos a partir da **página HTML**, não do arquivo JS.

```javascript
// ANTES (em assets/js/.../dashboard.js)
fetch("../../pages/discenteOfertante/dashboard_view.html")
// Resulta em: assets/pages/... (ERRADO)

// DEPOIS
fetch("./dashboard_view.html")  
// Resulta em: pages/discenteOfertante/... (CORRETO)
```

---

### 4. Arquitetura Incorreta no DiscenteOfertante

**Problema:** O `discenteOfertante` usava uma arquitetura diferente e incompatível:

| Aspecto | Docente (FUNCIONA) | DiscenteOfertante (QUEBRAVA) |
|---------|-------------------|------------------------------|
| HTML carregado | **ANTES** de `carregarLayout()` | DENTRO de `onRender()` |
| `content` passado | HTML string completo | String vazia `""` |
| Acesso ao DOM | Após layout pronto | Antes do layout estar pronto |

**Por que quebrava?**

```
┌─ dashboard.html chama carregarLayout()
│
├─ carregarLayout() começa a buscar layout.html via fetch()
│
├─ ENQUANTO ISSO, onRender() é chamado (em paralelo ou antes)
│  │
│  └─ Controller tenta acessar #layout-conteudo
│     │
│     └─ ❌ ERRO: elemento não existe ainda!
│
└─ layout.html finalmente é carregado (tarde demais)
```

**Solução:** Reescrever `dashboard.html` para usar o mesmo padrão do docente:

```javascript
// ANTES (ERRADO)
carregarLayout([{
    content: "",  // ← vazio!
    onRender: renderDashboardDiscenteOfertante  // ← tenta carregar HTML
}]);

// DEPOIS (CORRETO)
const htmlDashboard = await carregarDashboardDiscenteOfertante();  // ← carrega ANTES
carregarLayout([{
    content: htmlDashboard,  // ← HTML já carregado
    onRender: () => ativarDashboardDiscenteOfertante()  // ← só inicializa JS
}]);
```

---

### 5. Funções Não Definidas em `projetos.js`

**Problema:** Chamadas a funções inexistentes:
```javascript
inicializarSelecaoAtividadeGerenciar?.();  // não existe
inicializarGerenciarSubmenu?.();           // não existe
popularSelectGerenciar?.();                // não existe
```

**Solução:** Remover as chamadas (código legado/incompleto).

---

## Resumo por Perfil

| Perfil | Status | Observação |
|--------|--------|------------|
| Docente | ✅ OK | Arquitetura correta desde o início |
| Coordenador | ✅ OK | Arquitetura correta desde o início |
| Discente | ✅ OK | Usa CSS global apenas |
| DiscenteOfertante | ✅ **Corrigido** | Arquitetura reescrita |
| Administrador | ⚠️ Verificar | Pode ter mesmo problema |

---

## Verificação

```bash
# 1. Parar servidor anterior (Ctrl+C)

# 2. Reiniciar servidor
npx serve

# 3. No navegador, fazer HARD REFRESH para limpar cache:
#    - Windows/Linux: Ctrl + Shift + R
#    - Mac: Cmd + Shift + R
#    
#    Ou abrir DevTools (F12) > Network > marcar "Disable cache"
```

> [!IMPORTANT]
> Se ainda aparecer erro `inicializarSelecaoAtividadeGerenciar is not defined`, o navegador está usando **cache do arquivo JavaScript antigo**. Use Ctrl+Shift+R para forçar recarga.

---

## Lições Aprendidas

1. **Consistência de arquitetura** - Todos os perfis devem usar o mesmo padrão
2. **Case-sensitivity** - Sempre usar `git mv` para renomear no Windows
3. **Caminhos de fetch()** - São relativos à URL da página, não ao arquivo JS
4. **Carregar antes de renderizar** - HTML deve estar pronto antes de chamar layout
