/* ====================================================================
   GERENCIAR INSCRIÇÕES (DOCENTE)
   ==================================================================== */

// MOCK: Oportunidades que o docente gerencia
const oportunidadesDocente = [
    { id: 1, titulo: "Curso de Introdução ao Python", vagasTotal: 40, vagasOcupadas: 35 },
    { id: 2, titulo: "Monitoria de Algoritmos", vagasTotal: 2, vagasOcupadas: 2 } // Caso de Vagas Esgotadas
];

// MOCK: Inscrições
let inscricoesDB = [
    { id: 101, idOp: 1, aluno: "João Silva", matricula: "2023001", data: "10/02/2025", status: "pendente", conflito: false },
    { id: 102, idOp: 1, aluno: "Maria Oliveira", matricula: "2023002", data: "11/02/2025", status: "aprovada", conflito: false },
    { id: 103, idOp: 1, aluno: "Carlos Souza", matricula: "2023003", data: "12/02/2025", status: "pendente", conflito: true }, // CONFLITO DE HORÁRIO
    { id: 201, idOp: 2, aluno: "Ana Lima", matricula: "2021050", data: "01/02/2025", status: "aprovada", conflito: false },
    { id: 202, idOp: 2, aluno: "Pedro Santos", matricula: "2021051", data: "01/02/2025", status: "aprovada", conflito: false },
    { id: 203, idOp: 2, aluno: "Lucas Mendes", matricula: "2022010", data: "05/02/2025", status: "pendente", conflito: false }
];

export async function carregarViewInscricoes() {
    try {
        const response = await fetch('../../pages/docente/gerenciar_inscricoes.html');
        return await response.text();
    } catch (e) { return "Erro ao carregar módulo."; }
}

export function initInscricoes() {
    carregarSelectOportunidades();
    filtrarInscricoes(); // Carrega a tabela inicial
}

// Preenche o Select com as atividades do docente
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
        const percentual = (opDados.vagasOcupadas / opDados.vagasTotal) * 100;
        
        if (opDados.vagasOcupadas >= opDados.vagasTotal) {
            divAlerta.className = "alert alert-danger";
            divAlerta.innerHTML = `⚠️ <strong>Vagas Esgotadas!</strong> (${opDados.vagasOcupadas}/${opDados.vagasTotal}). Novas aprovações estão bloqueadas até que vagas sejam liberadas.`;
        } else {
            divAlerta.className = "alert alert-info";
            divAlerta.innerHTML = `Vagas preenchidas: <strong>${opDados.vagasOcupadas}</strong> de ${opDados.vagasTotal}.`;
        }
    }

    // 2. Filtragem de Dados
    const filtrados = inscricoesDB.filter(insc => {
        const matchOp = insc.idOp === idOpSelecionada;
        const matchStatus = statusFiltro === "todos" || insc.status === statusFiltro;
        const matchNome = insc.aluno.toLowerCase().includes(termo) || insc.matricula.includes(termo);
        return matchOp && matchStatus && matchNome;
    });

    // 3. Renderização
    if (filtrados.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" align="center">Nenhuma inscrição encontrada para os filtros.</td></tr>`;
        return;
    }

    tbody.innerHTML = filtrados.map(insc => {
        let badge = "";
        let acoes = "";
        let alertasSistema = "";

        // Lógica Visual de Status
        if (insc.status === "pendente") badge = `<span class="badge badge-warning">Pendente</span>`;
        if (insc.status === "aprovada") badge = `<span class="badge badge-success">Aprovada</span>`;
        if (insc.status === "rejeitada") badge = `<span class="badge badge-danger">Rejeitada</span>`;

        // RN002: Detecção de Conflitos
        if (insc.conflito && insc.status === "pendente") {
            alertasSistema = `<div style="color:#b01313; font-size:12px; font-weight:bold;">⛔ Conflito de Carga Horária</div>`;
        } else if (insc.status === "pendente") {
            alertasSistema = `<span style="color:#2e8b57; font-size:12px;">✅ Elegível</span>`;
        }

        // Lógica de Ações
        // Se estiver pendente: Aprovar / Rejeitar
        if (insc.status === "pendente") {
            const isVagasCheias = opDados.vagasOcupadas >= opDados.vagasTotal;
            const bloqueiaAprovacao = isVagasCheias || insc.conflito;

            // Botão Aprovar (Desabilitado se conflito ou sem vagas)
            if (bloqueiaAprovacao) {
                acoes += `<button class="btn-small btn-small-secondary" disabled title="Não é possível aprovar (Conflito ou Vagas esgotadas)" style="opacity: 0.5; cursor: not-allowed;">✅</button>`;
            } else {
                acoes += `<button class="btn-small btn-small-success" onclick="acaoAprovarInsc(${insc.id})" title="Aprovar">✅</button>`;
            }

            // Botão Rejeitar
            acoes += ` <button class="btn-small btn-small-danger" onclick="acaoRejeitarInsc(${insc.id})" title="Rejeitar">❌</button>`;
        }
        
        // Se estiver aprovada: Remover (RF017 - Substituição simplificada)
        if (insc.status === "aprovada") {
            acoes += `<button class="btn-small btn-small-danger" onclick="acaoRemoverInsc(${insc.id})" title="Cancelar Inscrição/Remover">🗑️</button>`;
        }

        // Se estiver rejeitada: Ver Motivo
        if (insc.status === "rejeitada") {
            acoes += `<button class="btn-small btn-small-info" onclick="alert('Justificativa: ' + '${insc.justificativa || 'N/A'}')">👁️ Motivo</button>`;
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
   AÇÕES OPERACIONAIS (RF015, RF017)
   ==================================================== */

window.acaoAprovarInsc = (id) => {
    const insc = inscricoesDB.find(i => i.id === id);
    const op = oportunidadesDocente.find(o => o.id === insc.idOp);

    if (op.vagasOcupadas >= op.vagasTotal) {
        return alert("Erro: Não há vagas disponíveis para aprovar este aluno.");
    }

    if (confirm(`Aprovar a inscrição de ${insc.aluno}?`)) {
        insc.status = "aprovada";
        op.vagasOcupadas++; // Atualiza vaga
        
        if(window.showToast) window.showToast("success", "Inscrição Aprovada! Aluno notificado.");
        filtrarInscricoes(); // Atualiza UI
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

    if (justificativa.trim().length < 5) {
        return alert("A justificativa é obrigatória (RF015).");
    }

    const insc = inscricoesDB.find(i => i.id === id);
    insc.status = "rejeitada";
    insc.justificativa = justificativa;

    // Se estava aprovada e foi rejeitada depois (cancelamento), libera vaga
    // Aqui estamos rejeitando pendente, mas a lógica se aplica
    
    document.getElementById("modalRejeicaoInscricao").style.display = "none";
    if(window.showToast) window.showToast("warning", "Inscrição Rejeitada.");
    filtrarInscricoes();
};

window.acaoRemoverInsc = (id) => {
    // RF017 - Remoção/Substituição
    if(confirm("Deseja cancelar a inscrição deste aluno? A vaga será liberada.")) {
        const insc = inscricoesDB.find(i => i.id === id);
        const op = oportunidadesDocente.find(o => o.id === insc.idOp);
        
        insc.status = "rejeitada";
        insc.justificativa = "Cancelamento administrativo pelo docente.";
        op.vagasOcupadas--; // Libera vaga

        if(window.showToast) window.showToast("info", "Aluno removido. Vaga liberada.");
        filtrarInscricoes();
    }
};

window.fecharModalInsc = (id) => document.getElementById(id).style.display = "none";