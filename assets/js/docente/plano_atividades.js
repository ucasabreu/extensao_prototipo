/* ====================================================================
   MÓDULO DE PLANO DE ATIVIDADES (DOCENTE)
   ==================================================================== */

// MOCK: Lista de Planos
let planosDB = [
    {
        id: 1,
        atividade: "Curso de Introdução ao Python",
        tipo: "Curso",
        atualizacao: "10/01/2025",
        status: "Aprovado",
        conteudo: {
            objGeral: "Capacitar alunos em lógica de programação.",
            objEsp: "- Ensinar sintaxe Python\n- Criar scripts básicos",
            metodologia: "Aulas práticas em laboratório.",
            cronograma: "4 Semanas intensivas.",
            avaliacao: "Frequência e Prova."
        },
        parecer: null
    },
    {
        id: 3,
        atividade: "Workshop de IoT",
        tipo: "Evento",
        atualizacao: "12/02/2025",
        status: "Devolvido", //
        conteudo: {
            objGeral: "Demonstrar sensores.",
            objEsp: "",
            metodologia: "Exposição.",
            cronograma: "1 dia.",
            avaliacao: "Presença."
        },
        parecer: "O cronograma está muito vago. Detalhe os horários das palestras."
    },
    {
        id: 5,
        atividade: "Projeto Robótica Social",
        tipo: "Projeto",
        atualizacao: "Hoje",
        status: "Rascunho",
        conteudo: { objGeral: "", objEsp: "", metodologia: "", cronograma: "", avaliacao: "" },
        parecer: null
    }
];

export async function carregarViewPlanos() {
    try {
        const response = await fetch('../../pages/docente/plano_atividades.html');
        return await response.text();
    } catch (e) { return "Erro ao carregar módulo."; }
}

export function initPlanos() {
    renderizarTabelaPlanos();
}

/* ====================================================
   LISTAGEM
   ==================================================== */
window.filtrarPlanos = renderizarTabelaPlanos;

function renderizarTabelaPlanos() {
    const tbody = document.getElementById("tb-planos");
    const termo = document.getElementById("buscaPlano")?.value.toLowerCase() || "";
    const filtroStatus = document.getElementById("filtroStatusPlano")?.value || "todos";

    const filtrados = planosDB.filter(p => {
        const matchNome = p.atividade.toLowerCase().includes(termo);
        const matchStatus = filtroStatus === "todos" || p.status === filtroStatus;
        return matchNome && matchStatus;
    });

    tbody.innerHTML = filtrados.map(p => {
        let badgeClass = "badge-neutral";
        if (p.status === "Aprovado") badgeClass = "badge-success";
        if (p.status === "Enviado") badgeClass = "badge-info";
        if (p.status === "Devolvido") badgeClass = "badge-danger";
        if (p.status === "Rascunho") badgeClass = "badge-warning";

        let acao = "";
        if (p.status === "Aprovado" || p.status === "Enviado") {
            acao = `<button class="btn-small btn-small-info" onclick="abrirEditor(${p.id}, true)">👁️ Visualizar</button>`;
        } else {
            acao = `<button class="btn-small btn-small-primary" onclick="abrirEditor(${p.id}, false)">✏️ Editar / Ajustar</button>`;
        }

        return `
            <tr>
                <td><strong>${p.atividade}</strong></td>
                <td>${p.tipo}</td>
                <td>${p.atualizacao}</td>
                <td><span class="badge ${badgeClass}">${p.status}</span></td>
                <td class="actions">${acao}</td>
            </tr>
        `;
    }).join("");
}

/* ====================================================
   EDITOR COMPLETO (VIEW SWAP)
   ==================================================== */
window.abrirEditor = (id, readonly) => {
    const plano = planosDB.find(p => p.id === id);
    if (!plano) return;

    // Preenche campos
    document.getElementById("idPlanoAtual").value = id;
    document.getElementById("subtituloEditor").textContent = "Atividade: " + plano.atividade;
    document.getElementById("badgeStatusEditor").textContent = plano.status;
    
    document.getElementById("txtObjetivoGeral").value = plano.conteudo.objGeral;
    document.getElementById("txtObjetivosEsp").value = plano.conteudo.objEsp;
    document.getElementById("txtMetodologia").value = plano.conteudo.metodologia;
    document.getElementById("txtCronograma").value = plano.conteudo.cronograma;
    document.getElementById("txtAvaliacao").value = plano.conteudo.avaliacao;

    // Lógica do Parecer (Devolvido)
    const boxParecer = document.getElementById("boxParecer");
    if (plano.status === "Devolvido" && plano.parecer) {
        boxParecer.style.display = "block";
        document.getElementById("textoParecer").textContent = plano.parecer;
    } else {
        boxParecer.style.display = "none";
    }

    // Controle de Leitura/Escrita
    const inputs = document.querySelectorAll("#view-editor-plano textarea");
    const botoes = document.querySelector(".footer-editor");
    
    if (readonly) {
        inputs.forEach(i => i.disabled = true);
        botoes.style.display = "none";
        document.getElementById("tituloEditor").textContent = "Visualizando Plano";
    } else {
        inputs.forEach(i => i.disabled = false);
        botoes.style.display = "flex";
        document.getElementById("tituloEditor").textContent = plano.status === "Devolvido" ? "Corrigir Plano" : "Editar Plano";
    }

    // Troca de Tela (Lista -> Editor)
    document.getElementById("view-lista-planos").style.display = "none";
    document.getElementById("view-editor-plano").style.display = "block";
    window.scrollTo(0,0);
};

window.fecharEditorPlano = () => {
    document.getElementById("view-editor-plano").style.display = "none";
    document.getElementById("view-lista-planos").style.display = "block";
    renderizarTabelaPlanos();
};

window.salvarRascunhoPlano = () => {
    atualizarObjetoPlano("Rascunho");
    if(window.showToast) window.showToast("success", "Rascunho salvo.");
};

window.enviarPlanoCoordenacao = () => {
    // Validação simples
    const cronograma = document.getElementById("txtCronograma").value;
    if (cronograma.length < 10) return alert("O cronograma é obrigatório e precisa ser detalhado.");

    if (confirm("Enviar plano para análise da Coordenação? Você não poderá editar até receber o parecer.")) {
        atualizarObjetoPlano("Enviado");
        window.fecharEditorPlano();
        if(window.showToast) window.showToast("success", "Plano enviado com sucesso!");
    }
};

function atualizarObjetoPlano(novoStatus) {
    const id = parseInt(document.getElementById("idPlanoAtual").value);
    const plano = planosDB.find(p => p.id === id);
    
    plano.conteudo.objGeral = document.getElementById("txtObjetivoGeral").value;
    plano.conteudo.objEsp = document.getElementById("txtObjetivosEsp").value;
    plano.conteudo.metodologia = document.getElementById("txtMetodologia").value;
    plano.conteudo.cronograma = document.getElementById("txtCronograma").value;
    plano.conteudo.avaliacao = document.getElementById("txtAvaliacao").value;
    
    plano.status = novoStatus;
    plano.atualizacao = "Hoje";
}