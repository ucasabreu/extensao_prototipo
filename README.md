# Portal de Extensão Acadêmica – Protótipo Web
Protótipo navegável do Sistema de Gestão de Extensão Acadêmica, desenvolvido como parte do projeto da disciplina Laboratório de Engenharia de Software.

Este repositório foca na estrutura visual, navegação e componentes globais de interface, utilizando HTML, CSS e JavaScript puros, sem frameworks, com o objetivo de validar requisitos, fluxos e apresentação dos dados.

## Objetivos do Projeto
* Criar um protótipo funcional e navegável do sistema de extensão.
* Demonstrar claramente:
   - funcionalidades por perfil,
   - fluxo de navegação,
   - organização das informações,
   - aplicação correta dos requisitos.
* Disponibilizar um Design System próprio (componentes globais reutilizáveis).
* Facilitar a avaliação técnica e visual do sistema pela equipe e docentes.

---
## Perfis do Sistema

O sistema contempla os seguintes perfis principais:

### Docente

  * Submissão de propostas de oportunidades.
  * Gestão de inscrições.
  * Registro de frequência.
  * Encerramento de atividades e certificação.
  * Gestão de grupos estudantis.

### Coordenador de Curso

  * Visão geral do curso (indicadores e alertas).
  * Validação de propostas.
  * Relatórios do curso.
  * Gestão de discentes.
  * Comunicados.
  * Auditoria e logs (escopo do curso).

### Coordenador de geral 

  * Visão institucional.
  * Atualização/valdação de PPC
  * Relatórios institucionais.
  * Relatórios de exceção (órfãos).
  * Logs e auditoria global..
  * Comunicados institucionais.

### Discente

### Dicente Ofertante

---

## Arquitetura do Protótipo
```bash
EXTENSAO_PROTOTIPO/
│
├── assets/
│   ├── css/
│   │   ├── common/        # Layouts base (header, menu, estrutura)
│   │   └── ui/            # Componentes globais (design system)
│   │
│   ├── js/
│   │   └── common/        # Scripts globais (modais, alerts, etc.)
│   │
│   ├── fonts/
│   └── img/
│
├── pages/
│   ├── common/
│   │   ├── login.html
│   │   ├── ui_preview.html
│   │   └── error.html
│   │
│   ├── coordenador_curso/
│   │   └── dashboard.html
│   │
│   ├── coordenador_geral/
│   └── docente/
│
├── data/                  # Dados mock (futuramente)
│
├── docs/                  # Documentação complementar
│
├── index.html              # Página inicial (login / UI Preview)
└── README.md
```
---
## Design System (Componentes Globais)
Todos os componentes reutilizáveis do sistema estão documentados e visualizáveis na página:
```bash
/pages/common/ui_preview.html
```
### Componentes implementados:
   * ✅ Botões globais
   * ✅ Badges de status (outlined)
   * ✅ Cards KPI (dashboards)
   * ✅ Tabelas institucionais
   * ✅ Modais universais
   * ✅ Inputs e formulários globais
   * ✅ Alertas inline
   * ✅ Toast notifications
     
**⚠️ Regra do projeto:**
- Todo novo componente criado DEVE ser adicionado ao ui_preview.html. Para todos visualisarem o que deve ser reusados.

---
## Navegação Inicial
Ao abrir o projeto (index.html), o usuário verá:
```bash
[ 🔐 Entrar no Sistema ]
[ 🔧 UI Preview – Componentes Globais ]
```
- **Entrar no Sistema** → leva para pages/common/login.html
- **UI Preview** → leva para a página de visualização dos componentes
Isso permite que a equipe acesse o Design System sem interferir no fluxo principal.

---
## Convenções do Projeto
- Estilos reutilizáveis ficam em:
```bash
assets/css/ui/
```
- Scripts globais ficam em:
```bash
assets/js/common/
```
- Cada perfil tem sua própria pasta em pages/.
- Os componentes globais não podem ser duplicados por perfil.
