/* ====================================================================
   LÓGICA DE VALIDAÇÃO DE PROPOSTAS (COORDENADOR)
   Arquivo: assets/js/coordenador/validacao.js
   ==================================================================== */

// Mock de Dados (Simulando propostas enviadas por docentes)
let propostasDB = [
    { 
        id: 101, 
        titulo: "Inclusão Digital para Idosos", 
        docente: "Prof. Roberto Mendes", 
        tipo: "Projeto", 
        ch: 180, 
        vagas: 20, 
        status: "aguardando", 
        dataSubmissao: "2025-12-10",
        descricao: "Projeto visando letramento digital básico.",
        objetivos: "Capacitar 20 idosos no uso de smartphones e serviços bancários.",
        justificativa: "Alta demanda da comunidade local por inclusão digital.",
        metodologia: "Aulas práticas presenciais no laboratório 3.",
        publico: "Idosos acima de 60 anos da comunidade vizinha."
    },
    { 
        id: 102, 
        titulo: "Workshop de Python", 
        docente: "Profa. Carla Diaz", 
        tipo: "Curso", 
        ch: 8, 
        vagas: 40, 
        status: "aguardando",
        dataSubmissao: "2025-12-11",
        descricao: "Curso introdutório de Python.",
        objetivos: "Ensinar sintaxe básica.",
        justificativa: "Linguagem essencial para o mercado.",
        metodologia: "Aula expositiva e prática.",
        publico: "Alunos do 1º período."
    },
    { 
        id: 103, 
        titulo: "Semana da Engenharia", 
        docente: "Prof. Jorge Amado", 
        tipo: "Evento", 
        ch: 40, 
        vagas: 200, 
        status: "aprovada", 
        dataSubmissao: "2025-11-20",
        descricao: "Evento anual do curso.",
        objetivos: "Integrar alunos e mercado.",
        justificativa: "Calendário acadêmico.",
        metodologia: "Palestras e mesas redondas.",
        publico: "Toda a comunidade acadêmica."
    }
];

// Carrega o HTML (Apenas retorna a string)
export async function carregarViewValidacao() {
    try {
        const response = await fetch('../../pages/coordenador_curso/validacao.html');
        return await response.text();
    } catch (error) {
        console.error("Erro ao carregar view:", error);
        return "<div class='alert alert-danger'>Erro ao carregar módulo de validação.</div>";
    }
}

// (NOVO) Função de Inicialização exportada
export function initValidacao() {
    renderizarTabelaValidacao();
}

/* =======================
   RENDERIZAÇÃO
   ======================= */

function renderizarTabelaValidacao() {
    const tbody = document.getElementById("tabela-validacao-corpo");
    if (!tbody) return;

    // Filtros
    const inputBusca = document.getElementById("buscaValInput");
    const busca = inputBusca ? inputBusca.value.toLowerCase() : "";
    
    const selectStatus = document.getElementById("filtroValStatus");
    const fStatus = selectStatus ? selectStatus.value : "aguardando"; // Padrão
    
    const selectTipo = document.getElementById("filtroValTipo");
    const fTipo = selectTipo ? selectTipo.value : "todos";

    const filtrados = propostasDB.filter(p => {
        const matchTexto = p.titulo.toLowerCase().includes(busca) || p.docente.toLowerCase().includes(busca);
        const matchStatus = fStatus === "todos" || p.status === fStatus;
        const matchTipo = fTipo === "todos" || p.tipo === fTipo;
        return matchTexto && matchStatus && matchTipo;
    });

    if (filtrados.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:20px; color:#666;">Nenhuma proposta encontrada para os filtros.</td></tr>`;
        return;
    }

    tbody.innerHTML = filtrados.map(p => {
        let badgeClass = "badge-neutral";
        let label = p.status;
        
        if (p.status === "aguardando") { badgeClass = "badge-warning"; label = "Aguardando Validação"; }
        if (p.status === "aprovada") { badgeClass = "badge-success"; label = "Aprovada"; }
        if (p.status === "rejeitada") { badgeClass = "badge-danger"; label = "Rejeitada"; }

        let botoes = `<button class="btn-small btn-small-info" onclick="verValDetalhes(${p.id})" title="Analisar Detalhes">visualizar</button>`;

        if (p.status === "aguardando") {
            botoes += `
                <button class="btn-small btn-small-success" onclick="valAprovar(${p.id})" title="Aprovar">aprovar</button>
                <button class="btn-small btn-small-danger" onclick="valRejeitar(${p.id})" title="Rejeitar">rejeitar</button>
            `;
        }

        return `
            <tr>
                <td>${formatarData(p.dataSubmissao)}</td>
                <td><strong>${p.docente}</strong></td>
                <td>${p.titulo}</td>
                <td>${p.tipo}</td>
                <td>${p.ch}h</td>
                <td><span class="badge ${badgeClass}">${label}</span></td>
                <td class="actions">${botoes}</td>
            </tr>
        `;
    }).join("");
}

/* =======================
   AÇÕES DO COORDENADOR
   ======================= */

window.filtrarValidacao = renderizarTabelaValidacao;

window.verValDetalhes = (id) => {
    const p = propostasDB.find(item => item.id === id);
    if (!p) return;

    const html = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
            <div><strong>Docente:</strong> ${p.docente}</div>
            <div><strong>Status:</strong> ${p.status.toUpperCase()}</div>
            <div><strong>Carga Horária:</strong> ${p.ch}h</div>
            <div><strong>Vagas:</strong> ${p.vagas}</div>
            <div><strong>Data Submissão:</strong> ${formatarData(p.dataSubmissao)}</div>
            <div><strong>Tipo:</strong> ${p.tipo}</div>
        </div>
        
        <div class="form-group">
            <label class="form-label">Justificativa Acadêmica:</label>
            <div style="background:#f4f4f4; padding:10px; border-radius:6px; font-size:14px;">${p.justificativa}</div>
        </div>

        <div class="form-group">
            <label class="form-label">Objetivos:</label>
            <div style="background:#f4f4f4; padding:10px; border-radius:6px; font-size:14px;">${p.objetivos}</div>
        </div>

        <div class="form-group">
            <label class="form-label">Metodologia:</label>
            <div style="background:#f4f4f4; padding:10px; border-radius:6px; font-size:14px;">${p.metodologia}</div>
        </div>
    `;

    const conteudoModal = document.getElementById("conteudoValDetalhes");
    const footerModal = document.getElementById("footerValDetalhes");
    
    if(conteudoModal) conteudoModal.innerHTML = html;
    
    if (footerModal) {
        if (p.status === "aguardando") {
            footerModal.innerHTML = `
                <button class="btn btn-danger" onclick="fecharModalVal('modalValDetalhes'); valRejeitar(${p.id})">Rejeitar</button>
                <button class="btn btn-success" onclick="fecharModalVal('modalValDetalhes'); valAprovar(${p.id})">Aprovar</button>
                <button class="btn btn-secondary" onclick="fecharModalVal('modalValDetalhes')">Fechar</button>
            `;
        } else {
            footerModal.innerHTML = `<button class="btn btn-primary" onclick="fecharModalVal('modalValDetalhes')">Fechar</button>`;
        }
    }

    document.getElementById("modalValDetalhes").style.display = "flex";
};

window.valAprovar = (id) => {
    if (confirm("Confirma a aprovação desta proposta?\nEla ficará disponível para publicação.")) {
        const p = propostasDB.find(item => item.id === id);
        p.status = "aprovada";
        renderizarTabelaValidacao();
        if(window.showToast) showToast("success", "Proposta Aprovada com Sucesso!");
    }
};

window.valRejeitar = (id) => {
    document.getElementById("idValRejeicaoTemp").value = id;
    document.getElementById("txtValJustificativa").value = "";
    document.getElementById("modalValRejeicao").style.display = "flex";
};

window.confirmarValRejeicao = () => {
    const id = parseInt(document.getElementById("idValRejeicaoTemp").value);
    const justificativa = document.getElementById("txtValJustificativa").value.trim();

    if (justificativa.length < 10) {
        alert("A justificativa é obrigatória e deve ser detalhada.");
        return;
    }

    const p = propostasDB.find(item => item.id === id);
    p.status = "rejeitada";

    document.getElementById("modalValRejeicao").style.display = "none";
    renderizarTabelaValidacao();
    if(window.showToast) showToast("warning", "Proposta Rejeitada e Docente Notificado.");
};

window.fecharModalVal = (id) => document.getElementById(id).style.display = "none";

function formatarData(dataStr) {
    if (!dataStr) return "-";
    const [ano, mes, dia] = dataStr.split("-");
    return `${dia}/${mes}/${ano}`;
}