/* ====================================================================
   LÓGICA DA VISÃO GERAL (DASHBOARD)
   Arquivo: assets/js/coordenador/dashboard_home.js
   Refatorado para usar: coordenador.service.js
   ==================================================================== */

// 1. IMPORTAÇÃO DO SERVICE
import { getDashboardStats } from "../services/coordenador.service.js";

// 2. ESTADO LOCAL (Inicialmente vazio, será preenchido pelo Service)
let dadosDashboard = {};

export async function carregarViewVisaoGeral() {
    try {
        const response = await fetch('../../pages/coordenador_curso/visao_geral.html');
        return await response.text();
    } catch (error) {
        console.error("Erro view visao geral:", error);
        return "Erro ao carregar dashboard.";
    }
}

// 3. INIT AGORA É ASYNC
export async function initVisaoGeral() {
    try {
        // Busca os dados consolidados do Service
        dadosDashboard = await getDashboardStats();
        
        // Renderiza apenas após ter os dados
        renderizarKPIsHome();
        renderizarResumoCoordenador();
        renderizarAlertas();
    } catch (error) {
        console.error("Falha ao carregar dados do dashboard:", error);
    }
}

/* =======================
   RENDERIZAÇÃO
   ======================= */

function renderizarKPIsHome() {
    // Verifica se os elementos existem antes de tentar preencher
    const elValidacao = document.getElementById("dash-validacao");
    const elRisco = document.getElementById("dash-risco");
    const elAtivas = document.getElementById("dash-ativas");

    // Usa os dados vindos do Service
    if(elValidacao) elValidacao.textContent = dadosDashboard.validacaoPendente || 0;
    if(elRisco) elRisco.textContent = dadosDashboard.discentesRisco || 0;
    if(elAtivas) elAtivas.textContent = dadosDashboard.atividadesAtivas || 0;
}

function renderizarResumoCoordenador() {
    const dados = dadosDashboard.resumoCoordenador;
    
    // Proteção caso o objeto venha vazio
    if (!dados) return;

    // Preenche valores
    const elProp = document.getElementById("resumo-propostas-pend");
    const elSolic = document.getElementById("resumo-solicitacoes-ext");
    const elAcao = document.getElementById("resumo-ultima-acao");
    const elAnalise = document.getElementById("resumo-analisadas");

    if(elProp) elProp.textContent = dados.propostasPendentes;
    if(elSolic) elSolic.textContent = dados.solicitacoesExternas;
    if(elAcao) elAcao.textContent = dados.ultimaAcao;
    if(elAnalise) elAnalise.textContent = dados.analisadasMes;
    
    // Configura Badge de Status
    const elStatus = document.getElementById("resumo-status");
    if (elStatus) {
        elStatus.textContent = dados.status;
        
        // Lógica visual simples para o status
        if (dados.status === "Dentro do prazo") {
            elStatus.className = "badge badge-success";
        } else {
            elStatus.className = "badge badge-warning";
        }
    }
}

function renderizarAlertas() {
    const container = document.getElementById("lista-alertas");
    if(!container) return;

    let htmlAlertas = "";

    // Usa dadosDashboard para decidir se mostra alertas
    if (dadosDashboard.validacaoPendente > 0) {
        htmlAlertas += `
            <div class="alert alert-warning" style="margin-bottom: 10px; font-size: 12px; padding: 10px;">
                <strong>${dadosDashboard.validacaoPendente} propostas</strong> aguardando validação docente.
            </div>`;
    }

    if (dadosDashboard.solicitacoesAtrasadas > 0) {
        htmlAlertas += `
            <div class="alert alert-danger" style="margin-bottom: 10px; font-size: 12px; padding: 10px;">
                <strong>${dadosDashboard.solicitacoesAtrasadas} solicitações</strong> de horas externas com prazo crítico.
            </div>`;
    }

    if (htmlAlertas === "") {
        htmlAlertas = `<div style="color: #2e8b57; font-size: 13px;">✅ Nenhuma pendência crítica.</div>`;
    }

    container.innerHTML = htmlAlertas;
}

// Navegação rápida (Mantida inalterada pois é lógica de UI)
window.irParaAba = (labelAba) => {
    const botoesMenu = document.querySelectorAll(".menu-item");
    botoesMenu.forEach(btn => {
        if (btn.textContent.trim() === labelAba) {
            btn.click();
        }
    });
};