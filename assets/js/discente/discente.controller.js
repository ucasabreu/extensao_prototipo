/* =====================================================
   IMPORTS DOS MÓDULOS
===================================================== */
import { 
    carregarDashboardDiscente, ativarDashboardDiscente 
} from "./dashboard.js";

import { 
    carregarOportunidadesDiscente, ativarOportunidadesDiscente 
} from "./oportunidades.js";

import { 
    carregarSolicitacoesDiscente, ativarSolicitacoesDiscente 
} from "./solicitacoes.js";

import { 
    carregarCertificacoesDiscente, ativarCertificacoesDiscente 
} from "./certificacoes.js";

/* =====================================================
   FUNÇÃO GENÉRICA DE RENDERIZAÇÃO DE PÁGINA
===================================================== */
async function renderPage(carregarFn, ativarFn) {
    const container = document.getElementById("layout-conteudo");
    if (!container) {
        console.error("layout-conteudo não encontrado");
        return;
    }

    // Carrega HTML da aba
    const html = await carregarFn();
    container.innerHTML = html;

    // Ativa JS da aba
    if (typeof ativarFn === "function") {
        ativarFn();
    }
}

/* =====================================================
   FUNÇÕES DE RENDER PARA CADA ABA
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

/* =====================================================
   MENU DE NAVEGAÇÃO
===================================================== */
document.querySelectorAll(".menu-item").forEach(item => {
    item.addEventListener("click", e => {
        e.preventDefault();

        // Remove ativo de todos
        document.querySelectorAll(".menu-item").forEach(m => m.classList.remove("active"));
        item.classList.add("active");

        // Qual aba carregar
        const aba = item.dataset.aba;
        switch(aba) {
            case "dashboard":
                renderDashboardDiscente();
                break;
            case "oportunidades":
                renderOportunidadesDiscente();
                break;
            case "solicitacoes":
                renderSolicitacoesDiscente();
                break;
            case "certificacoes":
                renderCertificacoesDiscente();
                break;
            default:
                console.warn("Aba desconhecida:", aba);
        }
    });
});

/* =====================================================
   CARREGA ABA INICIAL AO ABRIR
===================================================== */
document.addEventListener("DOMContentLoaded", () => {
    renderDashboardDiscente();
});
