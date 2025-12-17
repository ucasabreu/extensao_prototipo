/* ====================================================================
   VISÃO GERAL DO DOCENTE (DASHBOARD)
   ==================================================================== */

export async function carregarVisaoGeralDocente() {
    try {
        const response = await fetch('../../pages/docente/visao_geral.html');
        return await response.text();
    } catch (e) { return "Erro ao carregar visão geral."; }
}

export function initVisaoGeralDocente() {
    renderizarAtividadesRecentes();
    renderizarMiniNotificacoes();
}

/* ====================================================
   MOCKS DE DADOS (Resumo)
   ==================================================== */
const resumoAtividades = [
    { 
        id: 1, 
        titulo: "Curso de Introdução ao Python", 
        status: "Em Execução", 
        pendencia: "inscricao" // Flag para sugerir ação
    },
    { 
        id: 2, 
        titulo: "Monitoria de Algoritmos", 
        status: "Em Execução", 
        pendencia: "frequencia" 
    },
    { 
        id: 3, 
        titulo: "Workshop de IoT", 
        status: "Rascunho", 
        pendencia: "editar" 
    }
];

const ultimasNotificacoes = [
    { texto: "Nova inscrição em 'Curso Python'", tempo: "10 min atrás" },
    { texto: "Frequência pendente em 'Monitoria'", tempo: "1 dia atrás" },
    { texto: "Proposta devolvida p/ ajuste", tempo: "2 dias atrás" }
];

/* ====================================================
   RENDERIZAÇÃO
   ==================================================== */
function renderizarAtividadesRecentes() {
    const tbody = document.getElementById("tb-visao-atividades");
    if(!tbody) return;

    tbody.innerHTML = resumoAtividades.map(a => {
        let btnAcao = "";
        let badgeClass = "badge-neutral";

        if (a.status === "Em Execução") badgeClass = "badge-success";
        if (a.status === "Rascunho") badgeClass = "badge-warning";

        // Lógica inteligente de sugestão de ação
        if (a.pendencia === "inscricao") {
            btnAcao = `<button class="btn-small btn-small-info" onclick="navegarParaInscricoes(${a.id})">Validar Inscrições</button>`;
        } else if (a.pendencia === "frequencia") {
            btnAcao = `<button class="btn-small btn-small-primary" onclick="navegarParaFrequencia(${a.id})">Lançar Frequência</button>`;
        } else if (a.pendencia === "editar") {
            btnAcao = `<button class="btn-small btn-small-secondary" onclick="irParaMinhasOportunidades()">Continuar Edição</button>`;
        }

        return `
            <tr>
                <td><strong>${a.titulo}</strong></td>
                <td><span class="badge ${badgeClass}">${a.status}</span></td>
                <td class="actions">${btnAcao}</td>
            </tr>
        `;
    }).join("");
}

function renderizarMiniNotificacoes() {
    const div = document.getElementById("lista-mini-notificacoes");
    if(!div) return;

    div.innerHTML = ultimasNotificacoes.map(n => `
        <div style="border-bottom: 1px solid #eee; padding: 8px 0;">
            <p style="margin: 0; color: #333;">${n.texto}</p>
            <small style="color: #999;">${n.tempo}</small>
        </div>
    `).join("");
}

/* ====================================================
   NAVEGAÇÃO (LINKS ATIVOS)
   Usa as funções globais definidas no dashboard.html
   ==================================================== */

// 1. Ir para Minhas Oportunidades (Aba)
window.irParaMinhasOportunidades = () => {
    acionarAba("Minhas Oportunidades");
};

// 2. Ir para Criação (Abre aba Oportunidades -> Abre Modal é complexo, então vamos só para a aba)
window.irParaCriarProposta = () => {
    acionarAba("Minhas Oportunidades");
    if(window.showToast) window.showToast("info", "Clique em '+ Nova Proposta' na tela de oportunidades.");
};

// 3. Ir para Inscrições (Pega o primeiro ID com pendência do mock)
window.irParaInscricoesPendentes = () => {
    // Simula ir para o Curso de Python (ID 1)
    if(window.navegarParaInscricoes) window.navegarParaInscricoes(1);
};

// 4. Ir para Frequência
window.irParaFrequenciaHoje = () => {
    // Simula ir para Monitoria (ID 2)
    if(window.navegarParaFrequencia) window.navegarParaFrequencia(2);
};

// 5. Ir para Relatórios
window.irParaRelatoriosGeral = () => {
    acionarAba("Relatórios");
};

// 6. Ir para Notificações
window.irParaNotificacoes = () => {
    acionarAba("Notificações");
};

// Função auxiliar para clicar na aba pelo texto
function acionarAba(nomeAba) {
    const abas = document.querySelectorAll(".menu-item");
    const abaAlvo = Array.from(abas).find(aba => aba.textContent.includes(nomeAba));
    if (abaAlvo) {
        abaAlvo.click();
    } else {
        console.error(`Aba ${nomeAba} não encontrada.`);
    }
}