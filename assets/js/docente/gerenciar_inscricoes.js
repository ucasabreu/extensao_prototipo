/* ====================================================================
   GERENCIAR INSCRIÇÕES (DOCENTE) - MOCK EXPANDIDO
   Arquivo: assets/js/docente/gerenciar_inscricoes.js
   ==================================================================== */

// MOCK: Oportunidades que o docente gerencia
// Adicionei mais tipos e variados níveis de ocupação para teste visual
const oportunidadesDocente = [
    { 
        id: 1, 
        titulo: "Curso de Introdução ao Python", 
        vagasTotal: 40, 
        vagasOcupadas: 38 // Quase cheio (2 vagas restantes)
    },
    { 
        id: 2, 
        titulo: "Monitoria de Algoritmos", 
        vagasTotal: 2, 
        vagasOcupadas: 2 // CHEIO (Teste de bloqueio)
    },
    { 
        id: 3, 
        titulo: "Workshop de IoT e Sensores", 
        vagasTotal: 50, 
        vagasOcupadas: 15 // Bastante vaga (Teste de lista longa)
    },
    { 
        id: 5, 
        titulo: "Projeto Robótica Social", 
        vagasTotal: 10, 
        vagasOcupadas: 5 // Meio termo
    }
];

// MOCK: Inscrições (Expandido para cobrir RF015, RF017 e RN002)
let inscricoesDB = [
    // --- OPORTUNIDADE 1: Python (Quase cheia) ---
    { id: 101, idOp: 1, aluno: "João Silva", matricula: "2023001", data: "10/02/2025", status: "pendente", conflito: false },
    { id: 102, idOp: 1, aluno: "Maria Oliveira", matricula: "2023002", data: "11/02/2025", status: "aprovada", conflito: false },
    { id: 103, idOp: 1, aluno: "Carlos Souza", matricula: "2023003", data: "12/02/2025", status: "pendente", conflito: true }, // CASO DE TESTE: Conflito
    { id: 104, idOp: 1, aluno: "Ana Clara", matricula: "2023004", data: "13/02/2025", status: "aprovada", conflito: false },
    { id: 105, idOp: 1, aluno: "Roberto Costa", matricula: "2023005", data: "14/02/2025", status: "pendente", conflito: true }, // CASO DE TESTE: Conflito
    { id: 106, idOp: 1, aluno: "Fernanda Lima", matricula: "2023006", data: "10/02/2025", status: "rejeitada", conflito: false, justificativa: "Aluno não atende aos pré-requisitos de lógica." }, // CASO DE TESTE: Ver Justificativa

    // --- OPORTUNIDADE 2: Monitoria (LOTADA - Testar Bloqueio) ---
    { id: 201, idOp: 2, aluno: "Pedro Santos", matricula: "2021050", data: "01/02/2025", status: "aprovada", conflito: false },
    { id: 202, idOp: 2, aluno: "Lucas Mendes", matricula: "2021051", data: "01/02/2025", status: "aprovada", conflito: false },
    { id: 203, idOp: 2, aluno: "Juliana Paes", matricula: "2022010", data: "05/02/2025", status: "pendente", conflito: false }, // CASO DE TESTE: Botão Aprovar deve estar DESABILITADO (Vagas Esgotadas)

    // --- OPORTUNIDADE 3: Workshop IoT (Lista Longa) ---
    { id: 301, idOp: 3, aluno: "Marcos Vinicius", matricula: "2024100", data: "20/02/2025", status: "pendente", conflito: false },
    { id: 302, idOp: 3, aluno: "Patricia Abravanel", matricula: "2024101", data: "20/02/2025", status: "pendente", conflito: false },
    { id: 303, idOp: 3, aluno: "Silvio Santos", matricula: "2024102", data: "21/02/2025", status: "aprovada", conflito: false },
    { id: 304, idOp: 3, aluno: "Fausto Silva", matricula: "2024103", data: "21/02/2025", status: "aprovada", conflito: false },
    { id: 305, idOp: 3, aluno: "Gugu Liberato", matricula: "2024104", data: "22/02/2025", status: "rejeitada", justificativa: "Documentação pendente." },
    { id: 306, idOp: 3, aluno: "Eliana Michaelichen", matricula: "2024105", data: "22/02/2025", status: "pendente", conflito: false },
    { id: 307, idOp: 3, aluno: "Celso Portiolli", matricula: "2024106", data: "23/02/2025", status: "pendente", conflito: false },

    // --- OPORTUNIDADE 5: Robótica (Projeto) ---
    { id: 501, idOp: 5, aluno: "Tony Stark", matricula: "2020999", data: "15/01/2025", status: "aprovada", conflito: false },
    { id: 502, idOp: 5, aluno: "Bruce Banner", matricula: "2020998", data: "16/01/2025", status: "pendente", conflito: true } // Conflito em projeto longo
];

export async function carregarViewInscricoes() {
    try {
        const response = await fetch('../../pages/docente/gerenciar_inscricoes.html');
        return await response.text();
    } catch (e) { return "Erro ao carregar módulo."; }
}

export function initInscricoes() {
    carregarSelectOportunidades();

    // LÓGICA DE LIGAÇÃO (DEEP LINKING)
    if (window.idOportunidadePreSelecionada) {
        const select = document.getElementById("filtroOportunidade");
        if (select) {
            select.value = window.idOportunidadePreSelecionada;
            window.idOportunidadePreSelecionada = null;
        }
    }

    filtrarInscricoes(); 
}

function carregarSelectOportunidades() {
    const select = document.getElementById("filtroOportunidade");
    if(!select) return;

    select.innerHTML = oportunidadesDocente.map(op => 
        `<option value="${op.id}">${op.titulo}</option>`
    ).join("");
}

/* ====================================================
   RENDERIZAÇÃO DA TABELA
   ==================================================== */
window.filtrarInscricoes = () => {
    const tbody = document.getElementById("tb-inscricoes");
    const idOpSelecionada = parseInt(document.getElementById("filtroOportunidade").value);
    const statusFiltro = document.getElementById("filtroStatusInscricao").value;
    const termo = document.getElementById("buscaAluno").value.toLowerCase();

    // 1. Atualizar Alerta de Vagas
    const opDados = oportunidadesDocente.find(o => o.id === idOpSelecionada);
    const divAlerta = document.getElementById("alertaVagas");
    
    if (opDados) {
        divAlerta.style.display = "block";
        // Lógica visual para vagas
        if (opDados.vagasOcupadas >= opDados.vagasTotal) {
            divAlerta.className = "alert alert-danger";
            divAlerta.innerHTML = `⚠️ <strong>Vagas Esgotadas!</strong> (${opDados.vagasOcupadas}/${opDados.vagasTotal}). Aprovações bloqueadas.`;
        } else if (opDados.vagasOcupadas >= (opDados.vagasTotal * 0.9)) {
            // Alerta amarelo se estiver > 90% cheio
            divAlerta.className = "alert alert-warning";
            divAlerta.innerHTML = `⚠️ <strong>Atenção: Últimas vagas!</strong> (${opDados.vagasOcupadas}/${opDados.vagasTotal}).`;
        } else {
            divAlerta.className = "alert alert-info";
            divAlerta.innerHTML = `Vagas preenchidas: <strong>${opDados.vagasOcupadas}</strong> de ${opDados.vagasTotal}.`;
        }
    }

    // 2. Filtragem
    const filtrados = inscricoesDB.filter(insc => {
        const matchOp = insc.idOp === idOpSelecionada;
        const matchStatus = statusFiltro === "todos" || insc.status === statusFiltro;
        const matchNome = insc.aluno.toLowerCase().includes(termo) || insc.matricula.includes(termo);
        return matchOp && matchStatus && matchNome;
    });

    if (filtrados.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" align="center" style="padding: 20px;">Nenhuma inscrição encontrada para os filtros.</td></tr>`;
        return;
    }

    tbody.innerHTML = filtrados.map(insc => {
        let badge = "";
        let acoes = "";
        let alertasSistema = "";

        if (insc.status === "pendente") badge = `<span class="badge badge-warning">Pendente</span>`;
        if (insc.status === "aprovada") badge = `<span class="badge badge-success">Aprovada</span>`;
        if (insc.status === "rejeitada") badge = `<span class="badge badge-danger">Rejeitada</span>`;

        // RN002: Detecção de Conflitos
        if (insc.conflito && insc.status === "pendente") {
            alertasSistema = `<div style="color:#b01313; font-size:11px; font-weight:bold; display:flex; align-items:center; gap:4px;">⛔ Conflito de Horário</div>`;
        } else if (insc.status === "pendente") {
            alertasSistema = `<span style="color:#2e8b57; font-size:11px;">✅ Elegível</span>`;
        }

        // Lógica de Ações
        if (insc.status === "pendente") {
            const isVagasCheias = opDados.vagasOcupadas >= opDados.vagasTotal;
            const bloqueiaAprovacao = isVagasCheias || insc.conflito;

            if (bloqueiaAprovacao) {
                // Botão desabilitado com tooltip explicando o motivo
                let motivo = isVagasCheias ? "Vagas Esgotadas" : "Conflito de Horário";
                acoes += `<button class="btn-small btn-small-secondary" disabled title="${motivo}" style="opacity: 0.5; cursor: not-allowed;">aprovar</button>`;
            } else {
                acoes += `<button class="btn-small btn-small-success" onclick="acaoAprovarInsc(${insc.id})" title="Aprovar">aprovar</button>`;
            }
            acoes += ` <button class="btn-small btn-small-danger" onclick="acaoRejeitarInsc(${insc.id})" title="Rejeitar">rejeitar</button>`;
        }
        
        if (insc.status === "aprovada") {
            acoes += `<button class="btn-small btn-small-danger" onclick="acaoRemoverInsc(${insc.id})" title="Cancelar Inscrição">cancelar</button>`;
        }

        if (insc.status === "rejeitada") {
            // Escapar aspas para evitar erro no onclick
            const just = (insc.justificativa || 'N/A').replace(/'/g, "\\'");
            acoes += `<button class="btn-small btn-small-info" onclick="alert('Justificativa: ${just}')">Motivo</button>`;
        }

        return `
            <tr>
                <td><strong>${insc.aluno}</strong></td>
                <td>${insc.matricula}</td>
                <td>${insc.data}</td>
                <td>${badge}</td>
                <td>${alertasSistema}</td>
                <td class="actions">${acoes}</td>
            </tr>
        `;
    }).join("");
};

/* ====================================================
   AÇÕES OPERACIONAIS
   ==================================================== */

window.acaoAprovarInsc = (id) => {
    const insc = inscricoesDB.find(i => i.id === id);
    const op = oportunidadesDocente.find(o => o.id === insc.idOp);

    if (op.vagasOcupadas >= op.vagasTotal) {
        return alert("Erro: Não há vagas disponíveis.");
    }

    if (confirm(`Aprovar a inscrição de ${insc.aluno}?`)) {
        insc.status = "aprovada";
        op.vagasOcupadas++; 
        if(window.showToast) window.showToast("success", "Inscrição Aprovada!");
        filtrarInscricoes(); 
    }
};

window.acaoRejeitarInsc = (id) => {
    const insc = inscricoesDB.find(i => i.id === id);
    document.getElementById("idInscricaoRejeitar").value = id;
    document.getElementById("nomeAlunoRejeicao").textContent = insc.aluno;
    document.getElementById("txtJustificativaInsc").value = "";
    document.getElementById("modalRejeicaoInscricao").style.display = "flex";
};

window.confirmarRejeicaoInsc = () => {
    const id = parseInt(document.getElementById("idInscricaoRejeitar").value);
    const justificativa = document.getElementById("txtJustificativaInsc").value;

    if (justificativa.trim().length < 5) return alert("Justificativa obrigatória.");

    const insc = inscricoesDB.find(i => i.id === id);
    insc.status = "rejeitada";
    insc.justificativa = justificativa;
    
    document.getElementById("modalRejeicaoInscricao").style.display = "none";
    if(window.showToast) window.showToast("warning", "Inscrição Rejeitada.");
    filtrarInscricoes();
};

window.acaoRemoverInsc = (id) => {
    if(confirm("Deseja cancelar a inscrição? Vaga será liberada.")) {
        const insc = inscricoesDB.find(i => i.id === id);
        const op = oportunidadesDocente.find(o => o.id === insc.idOp);
        
        insc.status = "rejeitada";
        insc.justificativa = "Cancelamento administrativo.";
        op.vagasOcupadas--; 

        if(window.showToast) window.showToast("info", "Inscrição cancelada.");
        filtrarInscricoes();
    }
};

window.fecharModalInsc = (id) => document.getElementById(id).style.display = "none";