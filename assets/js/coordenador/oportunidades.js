/* ====================================================================
   LÓGICA DE OPORTUNIDADES (COORDENADOR)
   Arquivo: assets/js/coordenador/oportunidades.js
   ==================================================================== */

// Mock de Dados Expandido
let oportunidadesDB = [
    { 
        id: 1, 
        titulo: "Monitoria de Algoritmos", 
        responsavel: "Prof. Carlos Silva", 
        tipo: "Monitoria", 
        ch: 60,
        vagas: 2, 
        status: "pendente",
        dataInicio: "2025-03-01",
        dataFim: "2025-07-01",
        descricao: "Auxílio aos alunos da disciplina de Algoritmos I."
    },
    { 
        id: 2, 
        titulo: "Semana de Tecnologia 2025", 
        responsavel: "Coordenação", 
        tipo: "Evento", 
        ch: 20,
        vagas: 150, 
        status: "publicada",
        dataInicio: "2025-05-10",
        dataFim: "2025-05-15",
        descricao: "Evento anual de tecnologia do curso."
    },
    { 
        id: 3, 
        titulo: "Projeto Robótica na Escola", 
        responsavel: "Profa. Ana Lima", 
        tipo: "Projeto", 
        ch: 120,
        vagas: 5, 
        status: "rejeitada",
        dataInicio: "2025-02-01",
        dataFim: "2025-12-01",
        descricao: "Ensino de robótica básica para escolas públicas."
    }
];

// 1. Carrega HTML (Apenas retorna o texto)
export async function carregarViewOportunidades() {
    try {
        const response = await fetch('../../pages/coordenador_curso/oportunidades.html');
        return await response.text();
    } catch (error) {
        console.error("Erro view oportunidades:", error);
        return "Erro ao carregar módulo.";
    }
}

// 2. Função de Inicialização (Chamada pelo Dashboard)
export function initOportunidades() {
    console.log("Iniciando Oportunidades...");
    atualizarTabela();
    atualizarKPIs(); // Se houver KPIs na tela de oportunidades
}

/* =======================
   RENDERIZAÇÃO E LÓGICA
   ======================= */

function atualizarTabela() {
    const tbody = document.getElementById("tabela-corpo");
    if (!tbody) return;

    // Captura Filtros
    const inputBusca = document.getElementById("buscaInput");
    const termo = inputBusca ? inputBusca.value.toLowerCase() : "";
    
    const selectStatus = document.getElementById("filtroStatus");
    const fStatus = selectStatus ? selectStatus.value : "todos";
    
    const selectTipo = document.getElementById("filtroTipo");
    const fTipo = selectTipo ? selectTipo.value : "todos";

    // Filtra Dados
    const filtrados = oportunidadesDB.filter(op => {
        const matchTexto = op.titulo.toLowerCase().includes(termo) || op.responsavel.toLowerCase().includes(termo);
        const matchStatus = fStatus === "todos" || op.status === fStatus;
        const matchTipo = fTipo === "todos" || op.tipo === fTipo;
        return matchTexto && matchStatus && matchTipo;
    });

    atualizarKPIs(); // Atualiza contadores

    if (filtrados.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:20px; color:#666;">Nenhuma oportunidade encontrada.</td></tr>`;
        return;
    }

    tbody.innerHTML = filtrados.map(op => {
        let badgeClass = "badge-neutral";
        let label = op.status;
        if (op.status === "publicada") { badgeClass = "badge-success"; label = "Publicada"; }
        if (op.status === "pendente") { badgeClass = "badge-warning"; label = "Aguardando"; }
        if (op.status === "rejeitada") { badgeClass = "badge-danger"; label = "Rejeitada"; }

        let botoes = `<button class="btn-small btn-small-info" onclick="verDetalhes(${op.id})" title="Ver Detalhes">visualizar</button>`;

        if (op.status === "pendente") {
            botoes += `
                <button class="btn-small btn-small-success" onclick="acaoAprovar(${op.id})" title="Aprovar">✅</button>
                <button class="btn-small btn-small-danger" onclick="acaoRejeitar(${op.id})" title="Rejeitar">❌</button>
            `;
        }

        return `
            <tr>
                <td><strong>${op.titulo}</strong></td>
                <td>${op.responsavel}</td>
                <td>${op.tipo}</td>
                <td>${op.ch}h</td>
                <td>${op.vagas}</td>
                <td><span class="badge ${badgeClass}">${label}</span></td>
                <td class="actions">${botoes}</td>
            </tr>
        `;
    }).join("");
}

function atualizarKPIs() {
    const elPendentes = document.getElementById("kpi-pendentes");
    const elAtivas = document.getElementById("kpi-ativas");
    const elTotal = document.getElementById("kpi-total");

    if(elPendentes) elPendentes.textContent = oportunidadesDB.filter(op => op.status === "pendente").length;
    if(elAtivas) elAtivas.textContent = oportunidadesDB.filter(op => op.status === "publicada").length;
    if(elTotal) elTotal.textContent = oportunidadesDB.length;
}

/* =======================
   AÇÕES GLOBAIS
   ======================= */

window.filtrarTabela = atualizarTabela;

window.verDetalhes = (id) => {
    const op = oportunidadesDB.find(o => o.id === id);
    if(!op) return;

    const htmlDetalhes = `
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
            <div><strong>Status:</strong> <span class="badge badge-neutral">${op.status.toUpperCase()}</span></div>
            <div><strong>Tipo:</strong> ${op.tipo}</div>
            <div><strong>Responsável:</strong> ${op.responsavel}</div>
            <div><strong>Carga Horária:</strong> ${op.ch} horas</div>
            <div><strong>Período:</strong> ${formatarData(op.dataInicio)} a ${formatarData(op.dataFim)}</div>
            <div><strong>Vagas:</strong> ${op.vagas}</div>
        </div>
        <hr style="border:0; border-top:1px solid #ddd; margin:10px 0;">
        <p><strong>Descrição:</strong></p>
        <div style="background:#f9f9f9; padding:10px; border-radius:6px; font-size:14px; color:#444;">
            ${op.descricao || "Sem descrição informada."}
        </div>
    `;

    document.getElementById("conteudoDetalhes").innerHTML = htmlDetalhes;
    document.getElementById("modalDetalhes").style.display = "flex";
};

window.acaoAprovar = (id) => {
    const op = oportunidadesDB.find(o => o.id === id);
    if (confirm(`Aprovar e Publicar "${op.titulo}"?`)) {
        op.status = "publicada";
        atualizarTabela();
        if(window.showToast) showToast("success", "Oportunidade publicada com sucesso!");
    }
};

window.acaoRejeitar = (id) => {
    document.getElementById("idRejeicaoTemp").value = id;
    document.getElementById("txtJustificativa").value = "";
    document.getElementById("modalRejeicao").style.display = "flex";
};

window.confirmarRejeicao = () => {
    const id = parseInt(document.getElementById("idRejeicaoTemp").value);
    const justificativa = document.getElementById("txtJustificativa").value.trim();
    
    if (justificativa.length < 5) {
        alert("Justificativa é obrigatória.");
        return;
    }

    const op = oportunidadesDB.find(o => o.id === id);
    op.status = "rejeitada";
    
    document.getElementById("modalRejeicao").style.display = "none";
    atualizarTabela();
    if(window.showToast) showToast("warning", "Oportunidade rejeitada.");
};

window.salvarNovaOportunidade = () => {
    const titulo = document.getElementById("novoTitulo").value;
    const tipo = document.getElementById("novoTipo").value;
    const ch = document.getElementById("novaCH").value;
    const vagas = document.getElementById("novasVagas").value;
    const inicio = document.getElementById("novaDataInicio").value;
    const fim = document.getElementById("novaDataFim").value;
    const desc = document.getElementById("novaDescricao").value;

    if(!titulo || !ch) {
        alert("Preencha os campos obrigatórios.");
        return;
    }

    oportunidadesDB.unshift({
        id: Date.now(),
        titulo: titulo,
        responsavel: "Coordenação",
        tipo: tipo,
        ch: parseInt(ch),
        vagas: parseInt(vagas),
        status: "publicada",
        dataInicio: inicio,
        dataFim: fim,
        descricao: desc
    });

    document.getElementById("modalNova").style.display = "none";
    atualizarTabela();
    if(window.showToast) showToast("success", "Atividade Institucional criada!");
};

window.abrirModalNova = () => document.getElementById("modalNova").style.display = "flex";
window.fecharModal = (id) => document.getElementById(id).style.display = "none";

function formatarData(dataStr) {
    if(!dataStr) return "-";
    const [ano, mes, dia] = dataStr.split("-");
    return `${dia}/${mes}/${ano}`;
}