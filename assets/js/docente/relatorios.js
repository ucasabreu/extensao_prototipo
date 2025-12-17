/* ====================================================================
   MÓDULO DE RELATÓRIOS E PRESTAÇÃO DE CONTAS (DOCENTE)
   ==================================================================== */

// MOCK: Dados consolidados das atividades (Simulando integração com Frequência/Inscrições)
// Status possiveis: Pendente, Rascunho, Enviado, Aprovado, Devolvido
let relatoriosDB = [
    {
        id: 1,
        atividade: "Curso de Introdução ao Python",
        periodo: "01/02/2025 a 28/02/2025",
        statusExecucao: "Em Execução", // Ainda não finalizou, relatório é parcial ou rascunho
        statusRelatorio: "Rascunho",
        ch: 40,
        // Dados automáticos (viriam do módulo Frequência)
        metricas: {
            inscritos: 40,
            aptos: 35,
            taxaConclusao: 87.5,
            alertas: "5 alunos com baixa frequência"
        },
        conteudo: {
            resumo: "O curso está seguindo o cronograma...",
            resultados: ""
        }
    },
    {
        id: 3,
        atividade: "Workshop de IoT",
        periodo: "01/08/2025 a 02/08/2025",
        statusExecucao: "Encerrada",
        statusRelatorio: "Pendente", // Docente ainda não começou
        ch: 8,
        metricas: {
            inscritos: 50,
            aptos: 0,
            taxaConclusao: 0,
            alertas: "Frequência não consolidada"
        },
        conteudo: { resumo: "", resultados: "" }
    },
    {
        id: 6,
        atividade: "Palestras Tech 2024",
        periodo: "Dez/2024",
        statusExecucao: "Encerrada",
        statusRelatorio: "Aprovado", // Já validado, permite certificação
        ch: 4,
        metricas: {
            inscritos: 100,
            aptos: 98,
            taxaConclusao: 98,
            alertas: "Nenhum"
        },
        conteudo: {
            resumo: "Evento realizado com sucesso.",
            resultados: "Grande engajamento da comunidade."
        }
    }
];

let idRelatorioAberto = null;

export async function carregarViewRelatorios() {
    try {
        const response = await fetch('../../pages/docente/relatorios.html');
        return await response.text();
    } catch (e) { return "Erro ao carregar módulo."; }
}

export function initRelatorios() {
    renderizarTabelaRelatorios();

    // Deep Linking (Vindo de Minhas Oportunidades ou Frequência)
    if (window.idOportunidadeRelatorio) {
        abrirEditorRelatorio(window.idOportunidadeRelatorio);
        window.idOportunidadeRelatorio = null;
    }
}

/* ====================================================
   RENDERIZAÇÃO DA TABELA
   ==================================================== */
window.filtrarRelatorios = renderizarTabelaRelatorios;

function renderizarTabelaRelatorios() {
    const tbody = document.getElementById("tb-relatorios");
    const termo = document.getElementById("buscaRelatorio")?.value.toLowerCase() || "";
    const filtroStatus = document.getElementById("filtroStatusRelatorio")?.value || "todos";

    const filtrados = relatoriosDB.filter(r => {
        const matchNome = r.atividade.toLowerCase().includes(termo);
        const matchStatus = filtroStatus === "todos" || r.statusRelatorio === filtroStatus;
        return matchNome && matchStatus;
    });

    tbody.innerHTML = filtrados.map(r => {
        let badgeClass = "badge-neutral";
        if (r.statusRelatorio === "Aprovado") badgeClass = "badge-success";
        if (r.statusRelatorio === "Enviado") badgeClass = "badge-info";
        if (r.statusRelatorio === "Devolvido") badgeClass = "badge-danger";
        if (r.statusRelatorio === "Rascunho") badgeClass = "badge-warning";

        let botoes = "";
        
        if (r.statusRelatorio === "Aprovado") {
            botoes = `
                <button class="btn-small btn-small-secondary" onclick="exportarIndividualUCE(${r.id})" style="width:100%">UCE</button>
                <button class="btn-small btn-small-info" onclick="abrirEditorRelatorio(${r.id}, true)" style="width:100%">Vesualizar</button>
            `;
        } else if (r.statusRelatorio === "Enviado") {
            // CORREÇÃO VISUAL AQUI:
            // Transforma o texto simples em um Card Informativo estruturado
            botoes = `
                <div style="
                    background: #eef6fc; 
                    border: 1px dashed #2c75b9; 
                    color: #1e5282; 
                    padding: 8px 10px; 
                    border-radius: 6px; 
                    font-size: 12px; 
                    font-weight: 600; 
                    text-align: center; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    gap: 6px; 
                    cursor: help;" title="Aguardando parecer da Coordenação">
                    <span>⏳</span>
                    <span>Em Análise...</span>
                </div>`;
        } else {
            // Pendente, Rascunho ou Devolvido -> Pode Editar
            botoes = `
                <button class="btn-small btn-small-primary" onclick="abrirEditorRelatorio(${r.id})" style="width:100%">Editar</button>
            `;
        }

        return `
            <tr>
                <td><strong>${r.atividade}</strong></td>
                <td>${r.periodo}</td>
                <td>${r.statusExecucao}</td>
                <td><span class="badge ${badgeClass}">${r.statusRelatorio}</span></td>
                <td class="actions" style="display:flex; flex-direction:column; gap:5px; min-width: 140px;">
                    ${botoes}
                </td>
            </tr>
        `;
    }).join("");
}
/* ====================================================
   LÓGICA DO EDITOR (MODAL)
   ==================================================== */
window.abrirEditorRelatorio = (id, readonly = false) => {
    idRelatorioAberto = id;
    const rel = relatoriosDB.find(r => r.id === id);
    if (!rel) return;

    // 1. Popula Métricas Automáticas (Bloco Read-only)
    document.getElementById("lblInscritos").textContent = rel.metricas.inscritos;
    document.getElementById("lblAptos").textContent = rel.metricas.aptos;
    document.getElementById("lblTaxa").textContent = rel.metricas.taxaConclusao + "%";
    document.getElementById("lblCH").textContent = rel.ch + "h";
    document.getElementById("lblAlertas").textContent = rel.metricas.alertas;

    // 2. Popula Campos Editáveis
    document.getElementById("txtResumo").value = rel.conteudo.resumo;
    document.getElementById("txtResultados").value = rel.conteudo.resultados;

    // 3. Controle de Edição
    const campos = ["txtResumo", "txtResultados", "fileEvidencias"];
    const botoesAcao = document.querySelectorAll(".modal-footer .btn-primary, .modal-footer .btn-secondary");
    
    if (readonly) {
        campos.forEach(id => document.getElementById(id).disabled = true);
        botoesAcao.forEach(btn => btn.style.display = "none");
    } else {
        campos.forEach(id => document.getElementById(id).disabled = false);
        botoesAcao.forEach(btn => btn.style.display = "inline-block");
    }

    document.getElementById("modalRelatorio").style.display = "flex";
};

window.salvarRascunhoRelatorio = () => {
    const rel = relatoriosDB.find(r => r.id === idRelatorioAberto);
    rel.conteudo.resumo = document.getElementById("txtResumo").value;
    rel.conteudo.resultados = document.getElementById("txtResultados").value;
    rel.statusRelatorio = "Rascunho";
    
    renderizarTabelaRelatorios();
    if(window.showToast) window.showToast("success", "Rascunho salvo com sucesso.");
};

window.enviarRelatorioFinal = () => {
    const resumo = document.getElementById("txtResumo").value;
    if (resumo.length < 10) return alert("Preencha o resumo da execução antes de enviar.");

    if(confirm("Confirmar envio para a Coordenação? Após enviar, você não poderá editar até receber um parecer.")) {
        const rel = relatoriosDB.find(r => r.id === idRelatorioAberto);
        rel.statusRelatorio = "Enviado";
        
        // Simulação de atualização automática
        renderizarTabelaRelatorios();
        window.fecharModalRel("modalRelatorio");
        
        if(window.showToast) window.showToast("info", "Relatório enviado para análise (OR005).");
    }
};

window.exportarGeralUCE = () => {
    // Simula OR006
    alert("Gerando arquivo .XLSX compatível com padrão UCE contendo todas as atividades aprovadas...");
};

window.exportarIndividualUCE = (id) => {
    alert(`Exportando dados da atividade ID ${id} para padrão UCE...`);
};

window.gerarPDFPreview = () => {
    alert("Gerando prévia do Relatório em PDF...");
};

window.fecharModalRel = (id) => document.getElementById(id).style.display = "none";