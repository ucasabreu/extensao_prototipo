
/* =====================================================
   IMPORTS DOS MÓDULOS
===================================================== */
import { 
    carregarDashboardDiscenteOfertante, ativarDashboardDiscenteOfertante 
} from "./dashboard.js";

import { 
    carregarOportunidadesDiscenteOfertante , ativarOportunidadesDiscenteOfertante 
} from "./oportunidades.js";

import { 
    carregarSolicitacoesDiscenteOfertante , ativarSolicitacoesDiscenteOfertante  
} from "./solicitacoes.js";

import {
    carregarProjetosDiscenteOfertante , ativarProjetosDiscenteOfertante 
} from "./projetos.js";

import { 
    carregarCertificacoesDiscenteOfertante , ativarCertificacoesDiscenteOfertante  
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
export function renderDashboardDiscenteOfertante () {
    return renderPage(
        carregarDashboardDiscenteOfertante ,
        ativarDashboardDiscenteOfertante 
    );
}

export function renderOportunidadesDiscenteOfertante () {
    return renderPage(
        carregarOportunidadesDiscenteOfertante ,
        ativarOportunidadesDiscenteOfertante 
    );
}

export function renderSolicitacoesDiscenteOfertante () {
    return renderPage(
        carregarSolicitacoesDiscenteOfertante ,
        ativarSolicitacoesDiscenteOfertante 
    );
}

export function renderProjetosDiscenteOfertante () {
    return renderPage(
        carregarProjetosDiscenteOfertante ,
        ativarProjetosDiscenteOfertante 
    );
}

export function renderCertificacoesDiscenteOfertante () {
    return renderPage(
        carregarCertificacoesDiscenteOfertante ,
        ativarCertificacoesDiscenteOfertante 
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
                renderDashboardDiscenteOfertante ();
                break;
            case "oportunidades":
                renderOportunidadesDiscenteOfertante ();
                break;
            case "solicitacoes":
                renderSolicitacoesDiscenteOfertante ();
                break;
            case "certificacoes":
                renderCertificacoesDiscenteOfertante ();
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
    renderDashboardDiscenteOfertante ();
});
