# Estratégia de Alinhamento Visual - Discente

## Objetivo
Alinhar o visual das páginas de **Discente** e **Discente Ofertante** com as páginas de **Docente** e **Coordenador**, mantendo elementos únicos como barras de progresso.

---

## Análise Comparativa

### Padrão Visual: Docente/Coordenador ✅

| Elemento | Implementação |
|----------|---------------|
| **Cards KPI** | `kpi-card` com borda esquerda bordô (`#7a1010`) |
| **Fundo cards** | Branco (`#ffffff`) com sombra sutil |
| **Tabelas** | `table-container` + `global-table` |
| **Seções laterais** | Div com `border: 1px solid #e3d8c7` e `border-radius: 12px` |
| **Layout** | Grid 2fr 1fr (conteúdo principal + sidebar) |
| **Títulos** | Cor `#5d0b0b`, fonte 16px |

### Padrão Visual: Discente (atual) ⚠️

| Elemento | Implementação | Problema |
|----------|---------------|----------|
| **Box externa** | Gradiente vermelho `#8b1d1d → #6f1414` | Muito pesado visualmente |
| **Box interna** | Fundo creme `#fbf6ea` | Diferente do padrão branco |
| **Títulos** | `box-titulo` uppercase 13px | Diferente do padrão |
| **Cards** | Borda `#e6dbc9` | Similar mas não idêntico |
| **Progress bar** | Gradiente verde/laranja | ✅ Único, manter |

---

## Estratégia de Alinhamento

### 1. Manter (elementos únicos do discente)
- ✅ **Progress bar** - visual próprio e funcional
- ✅ **Cards de atividade** - estrutura interna OK
- ✅ **Grid responsivo** - funcionando bem

### 2. Alinhar (usar componentes globais)
- ⬜ Usar `kpi-card` ao invés de box personalizado
- ⬜ Usar `table-container` para listas
- ⬜ Fundo branco em cards (não creme)
- ⬜ Borda esquerda bordô como padrão

### 3. Melhorar (evoluir visual próprio)
- ⬜ Progress bar - manter mas refinar sombras
- ⬜ Notificações - usar padrão de cards similar ao docente

---

## Fases de Implementação

### Fase 1: Discente - Visão Geral (ATUAL)
- [ ] Substituir `box-externa/box-interna` por layout grid 2fr 1fr
- [ ] Usar `kpi-card` para métricas principais
- [ ] Manter progress cards com melhorias
- [ ] Criar seção "Acesso Rápido" similar ao docente

### Fase 2: Discente - Outras Seções
- [ ] Oportunidades
- [ ] Solicitações
- [ ] Certificações

### Fase 3: Discente Ofertante
- [ ] Dashboard/Visão Geral
- [ ] Projetos
- [ ] Outras seções

---

## Proposta: Discente Visão Geral

### Antes (atual)
```
┌─────────────────────────────────────────┐
│ [BOX VERMELHA: Atividades Ativas]       │
│ ┌─────────────────────────────────────┐ │
│ │ BOX CREME com cards                 │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### Depois (proposto)
```
┌─────────────────────────────────────────────────────┐
│ [KPI] Em Andamento  [KPI] Concluídas  [KPI] Horas   │
├────────────────────────────────┬────────────────────┤
│ Minhas Atividades              │   Progresso        │
│ ┌────────────────────────────┐ │ ┌────────────────┐ │
│ │ Card atividade 1           │ │ │ Curso Python   │ │
│ │ Card atividade 2           │ │ │ ██████░░ 70%   │ │
│ └────────────────────────────┘ │ │ Monitoria      │ │
│                                │ │ █████████ 100% │ │
│                                │ └────────────────┘ │
├────────────────────────────────┴────────────────────┤
│ 🔔 Notificações     │     📰 Notícias               │
└─────────────────────────────────────────────────────┘
```

### Mudanças Específicas

1. **Adicionar KPIs no topo**
   - Total de atividades em andamento
   - Atividades concluídas
   - Horas de extensão acumuladas

2. **Layout grid 2fr 1fr**
   - Esquerda: Lista de atividades (tabela ou cards)
   - Direita: Progresso (manter visual atual, refinar)

3. **Cores alinhadas**
   - Fundo branco (`#fff`)
   - Borda `#e3d8c7`
   - Títulos `#5d0b0b`
   - Borda esquerda bordô em cards destacados

4. **Manter progress bar**
   - Gradiente atual funciona bem
   - Adicionar sombra sutil para profundidade

---

## Implementação: Seção Oportunidades

### Mudanças Visuais

| Antes | Depois |
|-------|--------|
| `box-externa` + `box-interna` vermelho/creme | `toolbar` branca + `section-card` |
| Filtros em grid 5 colunas | Toolbar flexbox com search-box |
| Cards com `kpi-card` (reuso incorreto) | Cards `oportunidade-card` dedicados |

### Novos Componentes CSS

#### 1. Toolbar (padrão docente)
```css
.toolbar {
    background: #ffffff;
    padding: 15px 20px;
    border-radius: 8px;
    border: 1px solid #e3d8c7;
    display: flex;
    gap: 15px;
    flex-wrap: wrap;
}
```

#### 2. Search-box
```css
.search-box {
    flex: 1;
    min-width: 250px;
    position: relative;
}

.search-box input:focus {
    border-color: #7a1010;
    box-shadow: 0 0 0 2px rgba(122, 16, 16, 0.1);
}
```

#### 3. Grid de Cards Responsivo
```css
.oportunidades-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 16px;
}
```

#### 4. Card de Oportunidade
```css
.oportunidade-card {
    border-left: 4px solid #7a1010;  /* borda bordô padrão */
    border-radius: 10px;
    padding: 16px;
}

.oportunidade-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 16px rgba(122, 16, 16, 0.12);
}
```

### KPIs Adicionados

| KPI | Cor | Descrição |
|-----|-----|-----------|
| Disponíveis | Verde | Oportunidades abertas |
| Minha Inscrição | Azul | Atividades que participo |
| Em Andamento | Amarelo | Atividades ativas |
| Encerradas | Cinza | Finalizadas este semestre |

### Modal de Detalhes (usando modal.css global)

O botão "Ver detalhes" agora abre um modal estilizado usando os estilos globais:

**Estrutura HTML:**
```html
<div id="modalDetalhesOportunidade" class="modal-overlay">
    <div class="modal">
        <div class="modal-header">...</div>
        <div class="modal-body">
            <div class="detalhes-grid">
                <div class="detalhe-item">...</div>
            </div>
        </div>
        <div class="modal-footer">...</div>
    </div>
</div>
```

**Novos estilos CSS:**
```css
.detalhes-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
}

.detalhe-label {
    font-size: 12px;
    text-transform: uppercase;
    color: #888;
}

.detalhe-valor {
    font-size: 15px;
    color: #333;
    font-weight: 500;
}
```

**Melhorias visuais adicionais:**
- Cards inscritos têm borda verde e fundo levemente esverdeado
- Títulos truncados com `line-clamp: 2`
- Badges com tamanho reduzido nos cards


## Bugs Corrigidos

### 1. Perfil Exibido Incorretamente

**Problema:** Ao navegar para a página de discente, o perfil exibido no header era "Coordenador de Curso" ao invés de "Discente".

**Causa:** O `localStorage.setItem("perfil", "discente")` estava sendo chamado dentro da função assíncrona `init()`. Quando o usuário navegava de outra página (ex: coordenador), o perfil antigo permanecia no localStorage até a função `init()` ser executada.

**Solução:** Mover o `localStorage.setItem` para o início do script, **antes** dos imports e de qualquer código assíncrono:

```javascript
<script type="module">
    // IMPORTANTE: Define o perfil IMEDIATAMENTE
    localStorage.setItem("perfil", "discente");
    localStorage.setItem("nome", "Discente Teste");
    localStorage.setItem("email", "discente@teste.com");

    import { carregarLayout } from "../../assets/js/common/layout.js";
    // ... resto do código
</script>
```

**Arquivos alterados:**
- `pages/discente/dashboard.html`

---

### 2. Modal de Justificativa Faltante

**Problema:** Ao clicar em "Tentar Novamente" em uma solicitação recusada, a ação era executada diretamente sem pedir justificativa ao discente.

**Solução:** Adicionar um modal intermediário com campo de textarea para o discente explicar sua motivação:

```html
<div id="modalJustificativa" class="modal-overlay">
    <div class="modal">
        <div class="modal-header">
            <h2>Nova Solicitação</h2>
        </div>
        <div class="modal-body">
            <div class="alert alert-info">
                💡 Dica: Explique por que deseja participar...
            </div>
            <textarea id="input-justificativa" placeholder="Descreva sua motivação..."></textarea>
        </div>
        <div class="modal-footer">
            <button onclick="fecharModalJustificativa()">Cancelar</button>
            <button onclick="enviarNovaJustificativa()">Enviar</button>
        </div>
    </div>
</div>
```

**Arquivos alterados:**
- `pages/discente/solicitacoes.html` - Adicionado modal de justificativa
- `assets/js/discente/solicitacoes.js` - Funções `abrirModalJustificativa`, `fecharModalJustificativa`, `enviarNovaJustificativa`

---

## Próximos Passos

1. Implementar seção **Certificações** do discente
2. Aplicar mesmo padrão visual ao **Discente Ofertante**
3. Testar responsividade em todas as páginas

