/* =====================================================
   DISCENTE OFERTANTE CONTROLLER
   Orquestra as páginas do Discente Ofertante
   compatível com o layout da develop
   ===================================================== */

import {
    carregarDashboardDiscente,
    ativarDashboardDiscente
} from "./dashboard.js";

import {
    carregarOportunidadesDiscente,
    ativarOportunidadesDiscente
} from "./oportunidades.js";

import {
    carregarSolicitacoesDiscente,
    ativarSolicitacoesDiscente
} from "./solicitacoes.js";

import {
    carregarProjetosDiscente,
    ativarProjetosDiscente
} from "./projetos.js";

import {
    carregarCertificacoesDiscente,
    ativarCertificacoesDiscente
} from "./certificacoes.js";

/* =====================================================
   FUNÇÃO GENÉRICA DE RENDERIZAÇÃO
   ===================================================== */
async function renderPage(carregarFn, ativarFn) {
    const container = document.getElementById("layout-conteudo");
    if (!container) {
        console.error("layout-conteudo não encontrado");
        return;
    }

    const html = await carregarFn();
    container.innerHTML = html;

    if (typeof ativarFn === "function") {
        ativarFn();
    }
}

/* =====================================================
   EXPORTS (usados pelo menu)
   ===================================================== */

export function renderDashboardDiscenteOfertante() {
    return renderPage(
        carregarDashboardDiscente,
        ativarDashboardDiscente
    );
}

export function renderOportunidadesDiscenteOfertante() {
    return renderPage(
        carregarOportunidadesDiscente,
        ativarOportunidadesDiscente
    );
}

export function renderSolicitacoesDiscenteOfertante() {
    return renderPage(
        carregarSolicitacoesDiscente,
        ativarSolicitacoesDiscente
    );
}

export function renderProjetosDiscenteOfertante() {
    return renderPage(
        carregarProjetosDiscente,
        ativarProjetosDiscente
    );
}

export function renderCertificacoesDiscenteOfertante() {
    return renderPage(
        carregarCertificacoesDiscente,
        ativarCertificacoesDiscente
    );
}
