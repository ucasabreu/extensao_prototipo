extensao-prototipo/
├─ index.html
├─ README.md
│
├─ assets/
│  ├─ css/
│  │  ├─ base.css          # Reset, fontes, cores padrão
│  │  ├─ layout.css        # Grid, header, sidebar, containers
│  │  ├─ components.css    # Cards, tabelas, badges, botões, modais
│  │  └─ pages.css         # Ajustes específicos de páginas
│  │
│  ├─ js/
│  │  ├─ main.js           # Inicialização geral, navegação básica
│  │  ├─ router.js         # (opcional) “troca” de telas simulada
│  │  ├─ ui/
│  │  │  ├─ tabs.js        # Lógica de abas (Meus Projetos, etc.)
│  │  │  ├─ modals.js      # Abrir/fechar modais de justificativa, etc.
│  │  │  ├─ tables.js      # Renderizar tabelas dinâmicas
│  │  │  └─ filters.js     # Filtros de relatórios, buscas, etc.
│  │  │
│  │  ├─ docente/
│  │  │  ├─ meusProjetos.js        # Carregar dados e interações da tela "Meus Projetos"
│  │  │  ├─ validarPropostas.js    # Fluxo de aprovação/rejeição de propostas
│  │  │  └─ gruposEstudantis.js    # Gestão de grupos, cargos e membros
│  │  │
│  │  ├─ coordenadorCurso/
│  │  │  ├─ dashboardCurso.js      # Indicadores do coordenador de curso
│  │  │  ├─ oportunidadesCurso.js  # Listagem e gestão de oportunidades do curso
│  │  │  └─ relatoriosCurso.js     # Relatórios operacionais/gerenciais do curso
│  │  │
│  │  ├─ coordenadorGeral/
│  │  │  ├─ dashboardGeral.js      # Painel institucional
│  │  │  ├─ validacaoExterna.js    # Tela de validação de certificados externos
│  │  │  ├─ administracao.js       # Cursos sem coord, destaques órfãos, etc.
│  │  │  └─ relatoriosGerais.js    # Relatórios institucionais
│  │  │
│  │  └─ common/
│  │     ├─ auth.js                # Simulação de login e troca de perfil
│  │     └─ state.js               # “Estado fake” (usuário logado, dados carregados, etc.)
│  │
│  ├─ img/
│  │  ├─ logos/
│  │  ├─ icons/
│  │  └─ mockups/
│  │
│  └─ fonts/                        # (opcional) fontes customizadas
│
├─ data/
│  ├─ common/
│  │  ├─ cursos.json                # Lista de cursos
│  │  ├─ usuarios.json              # Perfis fake (docente, coord, discente)
│  │  └─ grupos.json                # Tipos de grupos, etc.
│  │
│  ├─ docente/
│  │  ├─ projetos.json              # “Meus Projetos” (estado, carga, etc.)
│  │  ├─ propostas.json             # Propostas enviadas por discentes
│  │  ├─ gruposEstudantis.json      # Grupos sob responsabilidade do docente
│  │  └─ frequencias.json           # Frequência e carga horária por projeto
│  │
│  ├─ coordenadorCurso/
│  │  ├─ oportunidades.json         # Oportunidades por curso
│  │  ├─ relatorios.json            # Dados talvez agregados p/ gráficos
│  │  └─ pendencias.json            # Inscrições, documentos, etc.
│  │
│  └─ coordenadorGeral/
│     ├─ cursosSemCoordenador.json # RF-R22
│     ├─ destaquesOrfaos.json      # RF-R23
│     ├─ depoimentosOrfaos.json    # RF-R24
│     ├─ indicadoresGerais.json    # KPIs institucionais
│     └─ validacoesExternas.json   # Lista de certificados/solicitações externas
│
├─ pages/
│  ├─ common/
│  │  ├─ login.html                 # Escolha de perfil + login fake
│  │  └─ erro.html                  # Página genérica de erro/404 (se quiser)
│  │
│  ├─ docente/
│  │  ├─ dashboard-docente.html     # Visão geral: projetos, pendências, etc.
│  │  ├─ meus-projetos.html         # Tela com abas: Inscritos, Plano, Frequência, Encerramento
│  │  ├─ validar-propostas.html     # Lista + detalhes + modal de rejeição com justificativa
│  │  └─ grupos-estudantis.html     # Gestão de grupos, cargos, histórico
│  │
│  ├─ coordenador-curso/
│  │  ├─ dashboard-coordenador-curso.html
│  │  ├─ oportunidades-coordenador-curso.html
│  │  └─ relatorios-coordenador-curso.html
│  │
│  └─ coordenador-geral/
│     ├─ dashboard-coordenador-geral.html
│     ├─ validacao-externa.html           # Já alinhado com sua tela atual
│     ├─ administrativo.html              # Cursos sem coord, destaques/depoimentos órfãos
│     └─ relatorios-coordenador-geral.html
│
└─ docs/
   ├─ requisitos/
   │  └─ mapa-requisitos-telas.md   # (opcional) documento ligando telas ↔ RFs do PDF
   └─ diagramas/                    # (opcional) prints, plantuml, etc.
