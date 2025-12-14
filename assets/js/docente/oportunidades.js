/* ====================================================================
   HUB GERENCIAL DE OPORTUNIDADES (DOCENTE)
   Arquivo: assets/js/docente/oportunidades.js
   Descrição: Painel de visualização e navegação para módulos operacionais.
   ==================================================================== */

// MOCK: Dados Iniciais (Status acadêmicos conforme imagem image_ce86ae.png)
let minhasOportunidadesDB = [
    {
        id: 1,
        titulo: "Curso de Introdução ao Python",
        tipo: "Curso",
        inicio: "2025-02-01",
        fim: "2025-02-28",
        ch: 40,
        vagasTotal: 40,
        vagasOcupadas: 35,
        inscricoesPendentes: 5, 
        status: "Publicada", // Permite acessar gestão de inscrições
        alerta: null
    },
    {
        id: 2,
        titulo: "Monitoria de Algoritmos",
        tipo: "Monitoria",
        inicio: "2025-03-01",
        fim: "2025-07-01",
        ch: 60,
        vagasTotal: 2,
        vagasOcupadas: 2,
        inscricoesPendentes: 0, 
        status: "Em Execução", // Permite acessar Frequência e Plano
        alerta: "Plano de atividades pendente"
    },
    {
        id: 3,
        titulo: "Workshop de IoT",
        tipo: "Evento",
        inicio: "2025-08-01",
        fim: "2025-08-02",
        ch: 8,
        vagasTotal: 50,
        vagasOcupadas: 0,
        inscricoesPendentes: 0,
        status: "Rascunho", // Permite Edição
        alerta: null
    },
    {
        id: 4,
        titulo: "Semana da Computação",
        tipo: "Evento",
        inicio: "2025-10-01",
        fim: "2025-10-05",
        ch: 20,
        vagasTotal: 200,
        vagasOcupadas: 0,
        inscricoesPendentes: 0,
        status: "Em Análise", // Somente leitura
        alerta: null
    },
    {
        id: 5,
        titulo: "Projeto Robótica Social",
        tipo: "Projeto",
        inicio: "2025-02-01",
        fim: "2025-12-01",
        ch: 100,
        vagasTotal: 10,
        vagasOcupadas: 0,
        inscricoesPendentes: 0,
        status: "Rejeitada", // Permite ver parecer e editar
        justificativa: "Carga horária incompatível com a modalidade.",
        alerta: "Necessário correção"
    },
    {
        id: 6,
        titulo: "Palestras Tech",
        tipo: "Evento",
        inicio: "2024-12-01",
        fim: "2024-12-02",
        ch: 4,
        vagasTotal: 100,
        vagasOcupadas: 90,
        inscricoesPendentes: 0,
        status: "Encerrada", // Permite relatórios
        alerta: null
    }
];

let idEdicao = null;
let idJustificativaAtual = null;

export async function carregarViewMinhasOportunidades() {
    try {
        const response = await fetch('../../pages/docente/minhas_oportunidades.html');
        return await response.text();
    } catch (error) {
        console.error("Erro view:", error);
        return "Erro ao carregar.";
    }
}

export function initMinhasOportunidades() {
    renderizarTabela();
    renderizarKPIsOp();
}

/* ====================================================
   LÓGICA DE NAVEGAÇÃO (HUB GERENCIAL)
   Conforme e
   ==================================================== */

// Simula o redirecionamento para outra seção do sistema
window.acessarModulo = (modulo, idOportunidade) => {
    // Em um sistema real, isso alteraria a rota (router)
    // Aqui simulamos com um alert informativo sobre o fluxo correto
    const mensagens = {
        'inscricoes': `🔄 Redirecionando para o módulo "Gerenciar Inscrições" (ID: ${idOportunidade})...`,
        'frequencia': `🔄 Redirecionando para o módulo "Frequência" (ID: ${idOportunidade})...`,
        'plano': `🔄 Redirecionando para o módulo "Plano de Atividades" (ID: ${idOportunidade})...`,
        'relatorios': `🔄 Redirecionando para o módulo "Relatórios" (ID: ${idOportunidade})...`
    };

    alert(mensagens[modulo]);
    // window.location.hash = `#/${modulo}/${idOportunidade}`; // Exemplo de rota real
};

/* ====================================================
   RENDERIZAÇÃO DA TABELA
   ==================================================== */

/* ====================================================
   RENDERIZAÇÃO DA TABELA (COM CORREÇÃO DE DESIGN)
   ==================================================== */

function renderizarTabela() {
    const tbody = document.getElementById("tb-minhas-oportunidades");
    if (!tbody) return;

    const termo = document.getElementById("buscaOpDocente").value.toLowerCase();
    const filtroStatus = document.getElementById("filtroStatusOp").value;

    const filtrados = minhasOportunidadesDB.filter(op => {
        const matchTexto = op.titulo.toLowerCase().includes(termo);
        const matchStatus = filtroStatus === "todos" || op.status === filtroStatus;
        return matchTexto && matchStatus;
    });

    tbody.innerHTML = filtrados.map(op => {
        let badgeClass = "badge-neutral";
        let acoesNavegacao = ""; 

        // Lógica de Status e Ações
        switch (op.status) {
            case "Rascunho":
                badgeClass = "badge-neutral";
                acoesNavegacao = `
                    <button class="btn-small btn-small-primary" onclick="editarRascunho(${op.id})" style="width: 100%;">✏️ Editar</button>
                    <button class="btn-small btn-small-success" onclick="enviarAprovacao(${op.id})" style="width: 100%;">🚀 Enviar</button>`;
                break;
            
            case "Em Análise":
                badgeClass = "badge-warning";
                // CORREÇÃO DE DESIGN:
                // Substituído o texto solto por um container estilizado (Card Informativo)
                // Isso mantém a altura da linha consistente com as outras que possuem botões.
                acoesNavegacao = `
                    <div style="
                        background: #fffbf0; 
                        border: 1px dashed #d4a017; 
                        color: #b08d26; 
                        padding: 8px 10px; 
                        border-radius: 6px; 
                        font-size: 12px; 
                        font-weight: 600;
                        text-align: center;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 6px;
                        cursor: help;" title="Aguardando análise da coordenação">
                        <span>⏳</span>
                        <span>Em Análise...</span>
                    </div>`;
                break;

            case "Rejeitada":
                badgeClass = "badge-danger";
                acoesNavegacao = `
                    <button class="btn-small btn-small-danger" onclick="verJustificativa(${op.id})" style="width: 100%;">👁️ Ver Parecer</button>
                    <button class="btn-small btn-small-primary" onclick="editarRascunho(${op.id})" style="width: 100%;">✏️ Corrigir</button>`;
                break;

            case "Publicada":
                badgeClass = "badge-info";
                acoesNavegacao = `
                    <button class="btn-small btn-small-info" onclick="acessarModulo('inscricoes', ${op.id})" style="width: 100%;">👥 Inscrições ↗</button>
                `;
                break;

            case "Em Execução":
                badgeClass = "badge-success";
                acoesNavegacao = `
                    <button class="btn-small btn-small-primary" onclick="acessarModulo('frequencia', ${op.id})" style="width: 100%;">📝 Frequência ↗</button>
                    <button class="btn-small btn-small-secondary" onclick="acessarModulo('plano', ${op.id})" style="width: 100%;">📋 Plano ↗</button>
                `;
                break;

            case "Encerrada":
                badgeClass = "badge-neutral";
                acoesNavegacao = `
                    <button class="btn-small btn-small-info" onclick="acessarModulo('relatorios', ${op.id})" style="width: 100%;">📊 Relatórios ↗</button>
                `;
                break;
        }

        let alertaHTML = op.alerta ? `<div style="font-size:11px; color:#d4a017; font-weight:bold; margin-top:4px;">⚠️ ${op.alerta}</div>` : "";

        return `
            <tr>
                <td><strong>${op.titulo}</strong>${alertaHTML}</td>
                <td>${op.tipo}</td>
                <td>${formatarData(op.inicio)} a ${formatarData(op.fim)}</td>
                <td>${op.ch}h</td>
                <td>
                    ${op.vagasOcupadas} / ${op.vagasTotal}
                </td>
                <td><span class="badge ${badgeClass}">${op.status}</span></td>
                <td class="actions" style="display:flex; flex-direction:column; gap:6px; min-width: 140px;">
                    ${acoesNavegacao}
                </td>
            </tr>
        `;
    }).join("");
}

function renderizarKPIsOp() {
    // KPIs Informativos
    const emExecucao = minhasOportunidadesDB.filter(o => o.status === "Em Execução").length;
    const emAnalise = minhasOportunidadesDB.filter(o => o.status === "Em Análise").length;
    const pendentes = minhasOportunidadesDB.reduce((acc, o) => acc + (o.inscricoesPendentes || 0), 0);
    
    // Cálculo de ocupação total
    const totalVagas = minhasOportunidadesDB.reduce((acc, o) => acc + (o.vagasTotal || 0), 0);
    const totalOcupadas = minhasOportunidadesDB.reduce((acc, o) => acc + (o.vagasOcupadas || 0), 0);
    
    document.getElementById("kpi-op-execucao").textContent = emExecucao;
    document.getElementById("kpi-op-analise").textContent = emAnalise;
    document.getElementById("kpi-op-inscricoes").textContent = pendentes;
    document.getElementById("kpi-op-vagas").textContent = `${totalOcupadas} / ${totalVagas}`;
}

/* ====================================================
   AÇÕES DE CADASTRO (Contexto Local Permitido)
   ==================================================== */

window.abrirModalCriacao = () => {
    idEdicao = null;
    document.getElementById("propTitulo").value = "";
    document.getElementById("propTipo").value = "Curso";
    document.getElementById("propCH").value = "";
    document.getElementById("propVagas").value = "20";
    document.getElementById("propInicio").value = "";
    document.getElementById("propFim").value = "";
    document.getElementById("tituloModalProposta").textContent = "Nova Proposta";
    document.getElementById("modalNovaProposta").style.display = "flex";
};

window.editarRascunho = (id) => {
    const op = minhasOportunidadesDB.find(o => o.id === id);
    if (!op) return;
    idEdicao = id;
    document.getElementById("propTitulo").value = op.titulo;
    document.getElementById("propTipo").value = op.tipo;
    document.getElementById("propCH").value = op.ch;
    document.getElementById("propVagas").value = op.vagasTotal;
    document.getElementById("propInicio").value = op.inicio;
    document.getElementById("propFim").value = op.fim;
    document.getElementById("tituloModalProposta").textContent = "Editar Proposta";
    document.getElementById("modalNovaProposta").style.display = "flex";
};

window.salvarProposta = () => {
    const titulo = document.getElementById("propTitulo").value;
    const tipo = document.getElementById("propTipo").value;
    const ch = document.getElementById("propCH").value;
    const vagas = document.getElementById("propVagas").value;
    const inicio = document.getElementById("propInicio").value;
    const fim = document.getElementById("propFim").value;

    if (!titulo || !ch || !inicio || !fim) return alert("Preencha os campos obrigatórios.");

    if (idEdicao) {
        // Atualiza Rascunho
        const index = minhasOportunidadesDB.findIndex(o => o.id === idEdicao);
        if (index !== -1) {
            minhasOportunidadesDB[index].titulo = titulo;
            minhasOportunidadesDB[index].tipo = tipo;
            minhasOportunidadesDB[index].ch = parseInt(ch);
            minhasOportunidadesDB[index].vagasTotal = parseInt(vagas);
            minhasOportunidadesDB[index].inicio = inicio;
            minhasOportunidadesDB[index].fim = fim;
            // Se estava rejeitada, volta para rascunho
            if (minhasOportunidadesDB[index].status === "Rejeitada") {
                minhasOportunidadesDB[index].status = "Rascunho";
                minhasOportunidadesDB[index].alerta = null;
            }
        }
        if(window.showToast) showToast("success", "Rascunho atualizado.");
    } else {
        // Novo Rascunho
        minhasOportunidadesDB.unshift({
            id: Date.now(),
            titulo: titulo,
            tipo: tipo,
            inicio: inicio,
            fim: fim,
            ch: parseInt(ch),
            vagasTotal: parseInt(vagas),
            vagasOcupadas: 0,
            status: "Rascunho",
            alerta: null
        });
        if(window.showToast) showToast("success", "Rascunho criado.");
    }
    fecharModalOp('modalNovaProposta');
    renderizarTabela();
    renderizarKPIsOp();
};

window.enviarAprovacao = (id) => {
    if(confirm("Enviar para análise da coordenação?")) {
        const op = minhasOportunidadesDB.find(o => o.id === id);
        op.status = "Em Análise";
        renderizarTabela();
        renderizarKPIsOp();
        if(window.showToast) showToast("info", "Proposta enviada para análise.");
    }
};

window.verJustificativa = (id) => {
    const op = minhasOportunidadesDB.find(o => o.id === id);
    if (op && op.justificativa) {
        idJustificativaAtual = id;
        document.getElementById("textoJustificativa").textContent = op.justificativa;
        document.getElementById("modalJustificativa").style.display = "flex";
    }
};

window.editarApartirDaRejeicao = () => {
    fecharModalOp('modalJustificativa');
    if (idJustificativaAtual) editarRascunho(idJustificativaAtual);
};

window.filtrarMinhasOportunidades = renderizarTabela;
window.fecharModalOp = (id) => document.getElementById(id).style.display = "none";

function formatarData(dataStr) {
    if(!dataStr) return "-";
    const [ano, mes, dia] = dataStr.split("-");
    return `${dia}/${mes}/${ano}`;
}