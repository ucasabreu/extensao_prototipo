# Atualizacoes de dados - perfis discente

## Escopo
- Preenchimento de dados nas paginas de discente ofertante (dashboard, oportunidades, solicitacoes, certificacoes, projetos).
- Ajustes equivalentes nas paginas do perfil discente para refletir os novos dados mockados.

## O que foi feito
- Atualizado o mock central com oportunidades, solicitacoes, certificacoes e noticias mais completos.
- Padronizada a renderizacao das abas do discente ofertante (KPIs, cards, modais e filtros) no mesmo estilo do perfil discente.
- Enriquecido o mock de projetos do discente ofertante e exposto acesso aos dados para uso no dashboard.

## Arquivos alterados
- `assets/js/services/discente.service.js`
- `assets/js/discente/dashboard.js`
- `assets/js/discente/oportunidades.js`
- `assets/js/discenteOfertante/dashboard.js`
- `assets/js/discenteOfertante/oportunidades.js`
- `assets/js/discenteOfertante/solicitacoes.js`
- `assets/js/discenteOfertante/certificacoes.js`
- `assets/js/discenteOfertante/projetos.js`

## Detalhes das mudancas
- Oportunidades agora incluem campos como `vagas` e `responsavel` para alimentar o modal de detalhes.
- Solicitacoes receberam novos status e datas para alimentar KPIs e timeline.
- Certificacoes foram expandidas para gerar progresso de meta e filtros realistas.
- Dashboard do discente ofertante agora calcula KPIs e lista projetos/atividades com dados reais.
