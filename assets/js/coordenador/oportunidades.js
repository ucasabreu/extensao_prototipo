/* ====================================================================
   LÓGICA DE OPORTUNIDADES (COORDENADOR)
   ==================================================================== */

// Mock de Dados
let oportunidadesDB = [
    { id: 1, titulo: "Monitoria de Algoritmos", responsavel: "Prof. Carlos Silva", tipo: "Monitoria", vagas: 2, status: "pendente" },
    { id: 2, titulo: "Semana de Tecnologia 2025", responsavel: "Coordenação", tipo: "Evento", vagas: 150, status: "publicada" },
    { id: 3, titulo: "Projeto Robótica na Escola", responsavel: "Profa. Ana Lima", tipo: "Extensão", vagas: 5, status: "rejeitada" }
];

/**
 * Busca o arquivo HTML separado e retorna seu conteúdo como texto
 */
export async function carregarViewOportunidades() {
    try {
        const response = await fetch('../../pages/coordenador_curso/oportunidades.html');
        const html = await response.text();
        
        // Inicia a lógica assim que o HTML for retornado (mas espera o DOM renderizar no dashboard)
        setTimeout(atualizarTabela, 100);
        
        return html;
    } catch (error) {
        console.error("Erro ao carregar view:", error);
        return "<h3>Erro ao carregar o módulo de oportunidades.</h3>";
    }
}

/* =======================
   FUNÇÕES INTERNAS
   ======================= */

function atualizarTabela() {
    const tbody = document.getElementById("tabela-corpo");
    if (!tbody) return; // Se o HTML ainda não estiver na tela, para.

    const filtroTexto = document.getElementById("buscaInput")?.value.toLowerCase() || "";
    const filtroStatus = document.getElementById("filtroStatus")?.value || "todos";

    tbody.innerHTML = oportunidadesDB
        .filter(op => {
            const matchTexto = op.titulo.toLowerCase().includes(filtroTexto) || op.responsavel.toLowerCase().includes(filtroTexto);
            const matchStatus = filtroStatus === "todos" || op.status === filtroStatus;
            return matchTexto && matchStatus;
        })
        .map(op => {
            let badgeClass = "badge-neutral";
            let labelStatus = op.status;
            
            if (op.status === "publicada") { badgeClass = "badge-success"; labelStatus = "Publicada"; }
            if (op.status === "pendente") { badgeClass = "badge-warning"; labelStatus = "Aguardando Aprovação"; }
            if (op.status === "rejeitada") { badgeClass = "badge-danger"; labelStatus = "Rejeitada"; }

            let botoes = `<button class="btn-small btn-small-info">👁️</button>`;

            if (op.status === "pendente") {
                botoes += `
                    <button class="btn-small btn-small-success" onclick="acaoAprovar(${op.id})">✅</button>
                    <button class="btn-small btn-small-danger" onclick="acaoRejeitar(${op.id})">❌</button>
                `;
            }

            return `
                <tr>
                    <td><strong>${op.titulo}</strong></td>
                    <td>${op.responsavel}</td>
                    <td>${op.tipo}</td>
                    <td>${op.vagas}</td>
                    <td><span class="badge ${badgeClass}">${labelStatus}</span></td>
                    <td class="actions">${botoes}</td>
                </tr>
            `;
        })
        .join("");
}

/* =======================
   FUNÇÕES GLOBAIS (Expostas para o onclick do HTML)
   ======================= */

window.filtrarTabela = atualizarTabela;

window.acaoAprovar = (id) => {
    const op = oportunidadesDB.find(o => o.id === id);
    if (!op.responsavel) return alert("Docente Responsável obrigatório."); [cite_start]// [cite: 441]
    
    if (confirm(`Publicar "${op.titulo}"?`)) {
        op.status = "publicada";
        atualizarTabela();
        if(window.showToast) window.showToast("success", "Oportunidade Publicada!");
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
    if (justificativa.length < 5) return alert("Justificativa obrigatória."); [cite_start]// [cite: 104]

    const op = oportunidadesDB.find(o => o.id === id);
    op.status = "rejeitada";
    document.getElementById("modalRejeicao").style.display = "none";
    atualizarTabela();
    if(window.showToast) window.showToast("warning", "Oportunidade rejeitada.");
};

window.salvarNovaOportunidade = () => {
    // Lógica simplificada de cadastro
    const titulo = document.getElementById("novoTitulo").value;
    if(!titulo) return alert("Preencha o título.");
    
    oportunidadesDB.unshift({
        id: Date.now(),
        titulo: titulo,
        responsavel: document.getElementById("novoResp").value,
        tipo: document.getElementById("novoTipo").value,
        vagas: document.getElementById("novasVagas").value,
        status: "publicada"
    });
    document.getElementById("modalNova").style.display = "none";
    atualizarTabela();
};

window.abrirModalNova = () => document.getElementById("modalNova").style.display = "flex";
window.fecharModal = (id) => document.getElementById(id).style.display = "none";