/* ====================================================================
   LÓGICA DE OPORTUNIDADES (COORDENADOR)
   Arquivo: assets/js/coordenador/oportunidades.js
   ==================================================================== */

// Mock de Dados Expandido (Com Datas, CH e Descrição)
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

export async function carregarViewOportunidades() {
    try {
        const response = await fetch('../../pages/coordenador_curso/oportunidades.html');
        const html = await response.text();
        setTimeout(atualizarTabela, 50); // Inicia renderização
        return html;
    } catch (error) {
        console.error("Erro ao carregar view:", error);
        return "<div class='alert alert-danger'>Erro ao carregar módulo.</div>";
    }
}

/* =======================
   RENDERIZAÇÃO E LÓGICA
   ======================= */

function atualizarTabela() {
    const tbody = document.getElementById("tabela-corpo");
    if (!tbody) return;

    // 1. Captura Filtros
    const termo = document.getElementById("buscaInput").value.toLowerCase();
    const fStatus = document.getElementById("filtroStatus").value;
    const fTipo = document.getElementById("filtroTipo").value;

    // 2. Filtra Dados
    const filtrados = oportunidadesDB.filter(op => {
        const matchTexto = op.titulo.toLowerCase().includes(termo) || op.responsavel.toLowerCase().includes(termo);
        const matchStatus = fStatus === "todos" || op.status === fStatus;
        const matchTipo = fTipo === "todos" || op.tipo === fTipo;
        return matchTexto && matchStatus && matchTipo;
    });

    // 3. Atualiza KPIs (Baseado nos dados totais, não filtrados, para visão sistêmica)
    atualizarKPIs();

    // 4. Renderiza Linhas
    if (filtrados.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:20px; color:#666;">Nenhuma oportunidade encontrada.</td></tr>`;
        return;
    }

    tbody.innerHTML = filtrados.map(op => {
        // Badge de Status
        let badgeClass = "badge-neutral";
        let label = op.status;
        if (op.status === "publicada") { badgeClass = "badge-success"; label = "Publicada"; }
        if (op.status === "pendente") { badgeClass = "badge-warning"; label = "Aguardando"; }
        if (op.status === "rejeitada") { badgeClass = "badge-danger"; label = "Rejeitada"; }

        // Botões de Ação (Lógica da NOTA 3)
        // Sempre mostra visualizar
        let botoes = `<button class="btn-small btn-small-info" onclick="verDetalhes(${op.id})" title="Ver Detalhes">visualizar</button>`;

        // Aprovar/Rejeitar APENAS se estiver pendente
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
                <td>${op.ch}h</td> <td>${op.vagas}</td>
                <td><span class="badge ${badgeClass}">${label}</span></td>
                <td class="actions">${botoes}</td>
            </tr>
        `;
    }).join("");
}

function atualizarKPIs() {
    // KPI Lógica Simples
    const pendentes = oportunidadesDB.filter(op => op.status === "pendente").length;
    const ativas = oportunidadesDB.filter(op => op.status === "publicada").length;
    const total = oportunidadesDB.length;

    document.getElementById("kpi-pendentes").textContent = pendentes;
    document.getElementById("kpi-ativas").textContent = ativas;
    document.getElementById("kpi-total").textContent = total;
}

/* =======================
   AÇÕES GLOBAIS
   ======================= */

window.filtrarTabela = atualizarTabela;

// VISUALIZAR DETALHES (NOTA 3 e 7)
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

// APROVAR
window.acaoAprovar = (id) => {
    const op = oportunidadesDB.find(o => o.id === id);
    if (confirm(`Aprovar e Publicar "${op.titulo}"?`)) {
        op.status = "publicada";
        atualizarTabela();
        showToast("success", "Oportunidade publicada com sucesso!");
    }
};

// REJEITAR (Fluxo com Modal)
window.acaoRejeitar = (id) => {
    document.getElementById("idRejeicaoTemp").value = id;
    document.getElementById("txtJustificativa").value = "";
    document.getElementById("modalRejeicao").style.display = "flex";
};

window.confirmarRejeicao = () => {
    const id = parseInt(document.getElementById("idRejeicaoTemp").value);
    const justificativa = document.getElementById("txtJustificativa").value.trim();
    
    if (justificativa.length < 5) return alert("Justificativa é obrigatória.");

    const op = oportunidadesDB.find(o => o.id === id);
    op.status = "rejeitada";
    // op.justificativa = justificativa; // Salvaria no banco
    
    document.getElementById("modalRejeicao").style.display = "none";
    atualizarTabela();
    showToast("warning", "Oportunidade rejeitada.");
};

// NOVA OPORTUNIDADE INSTITUCIONAL
window.salvarNovaOportunidade = () => {
    // Captura campos
    const titulo = document.getElementById("novoTitulo").value;
    const tipo = document.getElementById("novoTipo").value;
    const ch = document.getElementById("novaCH").value;
    const vagas = document.getElementById("novasVagas").value;
    const inicio = document.getElementById("novaDataInicio").value;
    const fim = document.getElementById("novaDataFim").value;
    const desc = document.getElementById("novaDescricao").value;

    // Validação Básica
    if(!titulo || !ch || !inicio || !fim) {
        return alert("Preencha todos os campos obrigatórios.");
    }

    oportunidadesDB.unshift({
        id: Date.now(),
        titulo: titulo,
        responsavel: "Coordenação", // Travado conforme Nota 2
        tipo: tipo,
        ch: parseInt(ch),
        vagas: parseInt(vagas),
        status: "publicada", // Institucional já nasce publicada ou em validação superior
        dataInicio: inicio,
        dataFim: fim,
        descricao: desc
    });

    document.getElementById("modalNova").style.display = "none";
    atualizarTabela();
    showToast("success", "Atividade Institucional criada!");
};

// UTILITÁRIOS
window.abrirModalNova = () => document.getElementById("modalNova").style.display = "flex";
window.fecharModal = (id) => document.getElementById(id).style.display = "none";
function formatarData(dataStr) {
    if(!dataStr) return "-";
    const [ano, mes, dia] = dataStr.split("-");
    return `${dia}/${mes}/${ano}`;
}