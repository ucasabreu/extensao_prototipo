/* ====================================================================
   LÓGICA DA VISÃO GERAL (DASHBOARD)
   Arquivo: assets/js/coordenador/dashboard_home.js
   ==================================================================== */

// MOCK: Dados consolidados do sistema
const dadosDashboard = {
    validacaoPendente: 3,
    discentesRisco: 5,
    atividadesAtivas: 12,
    solicitacoesAtrasadas: 2,
    
    // [NOVO] Dados Operacionais do Coordenador
    resumoCoordenador: {
        propostasPendentes: 3,      // Sincronizado com validacaoPendente
        solicitacoesExternas: 4,    // Fila total de solicitações
        ultimaAcao: "10/05/2025",   // Registro de log
        status: "Dentro do prazo",  // SLA calculado
        analisadasMes: 15           // Indicador de produtividade
    }
};

export async function carregarViewVisaoGeral() {
    try {
        const response = await fetch('../../pages/coordenador_curso/visao_geral.html');
        return await response.text();
    } catch (error) {
        console.error("Erro view visao geral:", error);
        return "Erro ao carregar dashboard.";
    }
}

export function initVisaoGeral() {
    renderizarKPIsHome();
    renderizarResumoCoordenador(); // [NOVO]
    renderizarAlertas();
}

/* =======================
   RENDERIZAÇÃO
   ======================= */

function renderizarKPIsHome() {
    const elValidacao = document.getElementById("dash-validacao");
    const elRisco = document.getElementById("dash-risco");
    const elAtivas = document.getElementById("dash-ativas");

    if(elValidacao) elValidacao.textContent = dadosDashboard.validacaoPendente;
    if(elRisco) elRisco.textContent = dadosDashboard.discentesRisco;
    if(elAtivas) elAtivas.textContent = dadosDashboard.atividadesAtivas;
}

// [NOVO] Renderiza o Bloco "Minha Atuação"
function renderizarResumoCoordenador() {
    const dados = dadosDashboard.resumoCoordenador;
    
    // Preenche valores
    document.getElementById("resumo-propostas-pend").textContent = dados.propostasPendentes;
    document.getElementById("resumo-solicitacoes-ext").textContent = dados.solicitacoesExternas;
    document.getElementById("resumo-ultima-acao").textContent = dados.ultimaAcao;
    document.getElementById("resumo-analisadas").textContent = dados.analisadasMes;
    
    // Configura Badge de Status
    const elStatus = document.getElementById("resumo-status");
    elStatus.textContent = dados.status;
    
    // Lógica visual simples para o status
    if (dados.status === "Dentro do prazo") {
        elStatus.className = "badge badge-success";
    } else {
        elStatus.className = "badge badge-warning";
    }
}

function renderizarAlertas() {
    const container = document.getElementById("lista-alertas");
    if(!container) return;

    let htmlAlertas = "";

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

// Navegação rápida
window.irParaAba = (labelAba) => {
    const botoesMenu = document.querySelectorAll(".menu-item");
    botoesMenu.forEach(btn => {
        if (btn.textContent.trim() === labelAba) {
            btn.click();
        }
    });
};