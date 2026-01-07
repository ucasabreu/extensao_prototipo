# Portal de Extensão Acadêmica – Protótipo Web

Protótipo navegável do Sistema de Gestão de Extensão Acadêmica, desenvolvido como parte do projeto da disciplina Laboratório de Engenharia de Software.

Este repositório foca na estrutura visual, navegação e componentes globais de interface, utilizando **HTML, CSS e JavaScript puros**, sem frameworks, com o objetivo de validar requisitos, fluxos e apresentação dos dados.

---

## 🚀 Como Acessar o Projeto

### Opção 1: GitHub Pages (Recomendado)

Acesse diretamente pelo navegador, sem instalação:

👉 **https://ucasabreu.github.io/extensao_prototipo/**

### Opção 2: Localmente com Servidor HTTP

> ⚠️ **Importante:** O projeto **NÃO funciona** abrindo o `index.html` diretamente (`file://`) devido a restrições de CORS em `fetch()` e módulos ES6.

```bash
# 1. Clone o repositório
git clone https://github.com/ucasabreu/extensao_prototipo.git
cd extensao_prototipo

# 2. Inicie um servidor HTTP local (escolha uma opção):

# Opção A: Node.js (npx)
npx serve

# Opção B: Python 3
python -m http.server 8000

# Opção C: VS Code Live Server Extension
# Instale a extensão "Live Server" e clique em "Go Live"

# 3. Acesse no navegador:
# http://localhost:3000 (serve) ou http://localhost:8000 (python)

# 4. No navegador abra o projeto pelo link:
  https://ucasabreu.github.io/extensao_prototipo/
```

---

## 🎯 Objetivos do Projeto

* Criar um protótipo funcional e navegável do sistema de extensão
* Demonstrar claramente:
  - Funcionalidades por perfil
  - Fluxo de navegação
  - Organização das informações
  - Aplicação correta dos requisitos
* Disponibilizar um Design System próprio (componentes globais reutilizáveis)
* Facilitar a avaliação técnica e visual do sistema pela equipe e docentes

---

## 👥 Perfis do Sistema

O sistema contempla os seguintes perfis:

### Docente
* Submissão de propostas de oportunidades
* Gestão de inscrições
* Registro de frequência
* Plano de atividades
* Gestão de grupos estudantis (Ligas, D.A.)
* Relatórios e prestação de contas

### Coordenador de Curso
* Dashboard com KPIs e indicadores
* Validação de propostas
* Gestão de discentes
* Relatórios gerenciais
* Gestão do PPC (carga horária mínima)
* Comunicados oficiais

### Coordenador Geral
* Visão institucional
* Validação de PPC
* Relatórios institucionais
* Auditoria e logs globais
* Comunicados institucionais

### Discente
* Visualização de oportunidades disponíveis
* Inscrição em atividades
* Acompanhamento de solicitações
* Certificações obtidas

### Discente Ofertante
* Todas as funcionalidades do Discente
* Criação de oportunidades próprias
* Gestão de projetos
* Convite de outros discentes

### Administrador
* Gestão de usuários
* Configurações do sistema
* Logs de auditoria

---

## 🔐 Credenciais de Teste

Para testar o sistema, use as seguintes credenciais:

| Perfil | Email | Senha |
|--------|-------|-------|
| Discente | `discente@teste.com` | `123456` |
| Discente Ofertante | `ofertante@teste.com` | `123456` |
| Docente | `docente@teste.com` | `123456` |
| Coordenador | `coord@teste.com` | `123456` |
| Administrador | `admin@teste.com` | `admin123456` |

**Acesso Rápido (sem login):** Na página inicial, clique em "Admin" e use a senha `PPC@dev` para acessar o seletor de perfis.

---

## 📁 Arquitetura do Projeto

```
extensao_prototipo/
│
├── index.html                 # Página inicial (Home pública)
│
├── assets/
│   ├── css/
│   │   ├── common/            # Layout base (header, menu, sidebar)
│   │   │   └── layout.css
│   │   ├── global/            # Componentes do Design System
│   │   │   ├── button.css
│   │   │   ├── cards.css
│   │   │   ├── tables.css
│   │   │   ├── badges.css
│   │   │   ├── forms.css
│   │   │   ├── modal.css
│   │   │   └── alerts.css
│   │   └── ui/                # Estilos específicos por perfil/página
│   │       ├── home/
│   │       ├── login/
│   │       ├── discente/
│   │       ├── discenteOfertante/
│   │       ├── docente/
│   │       └── coordenador/
│   │
│   ├── js/
│   │   ├── common/            # Scripts compartilhados
│   │   │   ├── layout.js      # Gerenciador de layout e abas
│   │   │   ├── perfil.js      # Página de perfil
│   │   │   └── alerts.js      # Sistema de notificações
│   │   ├── services/          # Serviços de dados (mock)
│   │   ├── strategies/        # Estratégias de perfil
│   │   ├── home/              # JavaScript da home pública
│   │   ├── login/             # JavaScript de autenticação
│   │   ├── discente/
│   │   ├── discenteOfertante/
│   │   ├── docente/
│   │   ├── coordenador/
│   │   └── administrador/
│   │
│   └── img/                   # Imagens e logos
│
├── pages/
│   ├── home/                  # Home pública (carregada via fetch)
│   │   └── home.html
│   ├── login/                 # Telas de autenticação
│   │   ├── loginscreen.html
│   │   ├── registerscreen.html
│   │   ├── activatescreen.html
│   │   ├── passrecoverscreen.html
│   │   └── resetpassscreen.html
│   ├── common/                # Páginas compartilhadas
│   │   ├── layout.html        # Template do layout
│   │   ├── perfil.html        # Página de perfil
│   │   └── routerPerfil.html  # Seletor de perfil (acesso rápido)
│   ├── discente/
│   ├── discenteOfertante/
│   ├── docente/
│   ├── coordenador_curso/
│   └── administrador/
│
└── docs/                      # Documentação
    └── correcao-cors-planejamento.md
```

---

## 🏗️ Arquitetura de Carregamento

O projeto usa uma arquitetura baseada em **fetch()** para carregar HTML dinamicamente:

```
┌─ index.html (raiz)
│
├─ Carrega home.html via fetch()
│  └─ Injeta conteúdo em #main-content
│
├─ Login → pages/login/loginscreen.html
│  └─ Redireciona para dashboard do perfil
│
└─ Dashboard (ex: pages/docente/dashboard.html)
   │
   ├─ Carrega layout.html via layout.js
   │
   ├─ Carrega views de cada aba via fetch()
   │  (ex: visao_geral.html, oportunidades.html)
   │
   └─ Inicializa JavaScript de cada aba via onRender()
```

### Padrão de Carregamento (Docente/Coordenador)

```javascript
async function init() {
    // 1. Carrega HTML ANTES de iniciar o layout
    const htmlVisaoGeral = await carregarVisaoGeralDocente();
    const htmlOportunidades = await carregarViewMinhasOportunidades();
    
    // 2. Configura o layout com HTML já carregado
    carregarLayout([
        {
            label: "Visão Geral",
            content: htmlVisaoGeral,        // HTML pré-carregado
            onRender: () => initVisaoGeral() // Inicializa JS
        },
        // ...
    ]);
}
```

---

## 🎨 Design System

Todos os componentes reutilizáveis estão em `assets/css/global/`:

| Componente | Arquivo | Descrição |
|------------|---------|-----------|
| Botões | `button.css` | Primário, secundário, ghost, small |
| Cards | `cards.css` | KPI, cursos, perfil |
| Tabelas | `tables.css` | Estilo institucional |
| Badges | `badges.css` | Status (success, warning, danger, neutral) |
| Formulários | `forms.css` | Inputs, selects, labels |
| Modais | `modal.css` | Modal universal |
| Alertas | `alerts.css` | Inline e toast notifications |

### Visualização dos Componentes

Acesse a página de preview:
```
/pages/common/ui_preview.html
```

> **⚠️ Regra:** Todo novo componente criado DEVE ser adicionado ao `ui_preview.html` para visualização da equipe.

---

## 📋 Convenções do Projeto

### Estrutura de Arquivos
- **Estilos globais**: `assets/css/global/`
- **Estilos por perfil**: `assets/css/ui/[perfil]/`
- **Scripts globais**: `assets/js/common/`
- **Scripts por perfil**: `assets/js/[perfil]/`
- **Páginas por perfil**: `pages/[perfil]/`

### Nomenclatura
- Arquivos CSS/JS: `nome_funcionalidade.css` ou `camelCase.js`
- Pastas de perfil: `camelCase` (ex: `discenteOfertante`)
- IDs HTML: `kebab-case` (ex: `layout-conteudo`)

### Caminhos Relativos
- Sempre usar caminhos relativos (`../`, `./`)
- Nunca usar caminhos absolutos (`/assets/...`) - quebram no GitHub Pages

---

## ⚠️ Problemas Conhecidos

### CORS ao abrir via `file://`
O projeto não funciona abrindo `index.html` diretamente no navegador. Use um servidor HTTP local.

### Cache do Navegador
Após alterações, use `Ctrl + Shift + R` para limpar cache.

### Documentação Técnica
Consulte `docs/correcao-cors-planejamento.md` para detalhes sobre correções de compatibilidade.

---

## 👨‍💻 Equipe

Desenvolvido como projeto da disciplina **Laboratório de Engenharia de Software**.

---

## 📄 Licença

Este projeto é para fins acadêmicos.
