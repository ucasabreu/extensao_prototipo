/* =====================================================
   DISCENTE CONTROLLER
   Usa os módulos EXISTENTES do projeto
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
   EXPORTS USADOS NO MENU
   ===================================================== */

export function renderDashboardDiscente() {
    return renderPage(
        carregarDashboardDiscente,
        ativarDashboardDiscente
    );
}

export function renderOportunidadesDiscente() {
    return renderPage(
        carregarOportunidadesDiscente,
        ativarOportunidadesDiscente
    );
}

export function renderSolicitacoesDiscente() {
    return renderPage(
        carregarSolicitacoesDiscente,
        ativarSolicitacoesDiscente
    );
}

export function renderCertificacoesDiscente() {
    return renderPage(
        carregarCertificacoesDiscente,
        ativarCertificacoesDiscente
    );
}
