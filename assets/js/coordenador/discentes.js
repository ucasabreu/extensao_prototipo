/* ====================================================================
   GESTÃO DE DISCENTES E SOLICITAÇÕES
   Arquivo: assets/js/coordenador/discentes.js
   ==================================================================== */

// MOCK: Base de Alunos
const discentesDB = [
    { 
        id: 1, 
        nome: "Ana Clara Souza", 
        matricula: "2023001", 
        situacao: "regular", 
        horasConcluidas: 120, 
        horasPendentes: 240, 
        meta: 360, 
        historico: [
            { atividade: "Semana de Tecnologia", ch: 20, data: "10/05/2024", status: "Validado" },
            { atividade: "Monitoria Algoritmos", ch: 100, data: "12/12/2024", status: "Validado" }
        ]
    },
    { 
        id: 2, 
        nome: "João Pedro Alves", 
        matricula: "2020055", 
        situacao: "risco", 
        horasConcluidas: 40, 
        horasPendentes: 320, 
        meta: 360,
        historico: [
            { atividade: "Palestra IA", ch: 40, data: "20/03/2024", status: "Validado" }
        ]
    },
    { 
        id: 3, 
        nome: "Maria Helena", 
        matricula: "2019100", 
        situacao: "concluido", 
        horasConcluidas: 360, 
        horasPendentes: 0, 
        meta: 360,
        historico: [] 
    }
];

// MOCK: Fila de Solicitações
let solicitacoesDB = [
    { 
        id: 501, 
        alunoId: 1, 
        nomeAluno: "Ana Clara Souza", 
        atividade: "Curso Udemy: React Avançado", 
        ch: 40, 
        dataEnvio: new Date().toISOString().split('T')[0], // Data de Hoje (Recente)
        anexo: "certificado.pdf",
        status: "pendente" 
    },
    { 
        id: 502, 
        alunoId: 2, 
        nomeAluno: "João Pedro Alves", 
        atividade: "Estágio Voluntário ONG", 
        ch: 100, 
        dataEnvio: "2023-11-20", // DATA ANTIGA PARA GERAR ATRASO (> 10 dias)
        anexo: "declaracao.pdf",
        status: "pendente" 
    }
];

export async function carregarViewDiscentes() {
    try {
        const response = await fetch('../../pages/coordenador_curso/discentes.html');
        const html = await response.text();
        setTimeout(initDiscentes, 50);
        return html;
    } catch (error) {
        console.error("Erro view discentes:", error);
        return "Erro ao carregar.";
    }
}

function initDiscentes() {
    renderizarKPIs();
    renderizarTabelaDiscentes();
    renderizarTabelaSolicitacoes();
}

/* =======================
   TABELA DE DISCENTES (SEÇÃO 1)
   ======================= */
function renderizarTabelaDiscentes() {
    const tbody = document.getElementById("tb-discentes");
    if(!tbody) return; 

    const inputBusca = document.getElementById("buscaDiscente");
    const busca = inputBusca ? inputBusca.value.toLowerCase() : "";
    
    const selectFiltro = document.getElementById("filtroSituacao");
    const filtroSit = selectFiltro ? selectFiltro.value : "todos";

    const filtrados = discentesDB.filter(d => {
        const matchTexto = d.nome.toLowerCase().includes(busca) || d.matricula.includes(busca);
        const matchSit = filtroSit === "todos" || d.situacao === filtroSit;
        return matchTexto && matchSit;
    });

    tbody.innerHTML = filtrados.map(d => {
        const perc = Math.round((d.horasConcluidas / d.meta) * 100);
        
        let badge = `<span class="badge badge-neutral">Regular</span>`;
        if(d.situacao === "risco") badge = `<span class="badge badge-danger">Em Risco</span>`;
        if(d.situacao === "concluido") badge = `<span class="badge badge-success">Concluído</span>`;

        return `
            <tr>
                <td>${d.matricula}</td>
                <td><strong>${d.nome}</strong></td>
                <td>
                    <div style="display:flex; align-items:center; gap:8px;">
                        <div style="width:80px; height:8px; background:#ddd; border-radius:4px; overflow:hidden;">
                            <div style="width:${perc}%; height:100%; background:${perc < 50 ? '#d4a017' : '#2e8b57'};"></div>
                        </div>
                        <span style="font-size:12px;">${perc}%</span>
                    </div>
                </td>
                <td>${d.horasConcluidas}h / ${d.meta}h</td>
                <td>${badge}</td>
                <td class="actions">
                    <button class="btn-small btn-small-info" onclick="abrirPerfil(${d.id})">Ver Perfil</button>
                </td>
            </tr>
        `;
    }).join("");
}

/* =======================
   TABELA DE SOLICITAÇÕES (SEÇÃO 3)
   ======================= */
function renderizarTabelaSolicitacoes() {
    const tbody = document.getElementById("tb-solicitacoes");
    if(!tbody) return;
    
    const pendentes = solicitacoesDB.filter(s => s.status === "pendente");

    if (pendentes.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" align="center">Nenhuma solicitação pendente.</td></tr>`;
        return;
    }

    tbody.innerHTML = pendentes.map(s => {
        // Verifica atraso (Regra: > 10 dias)
        const dataEnvio = new Date(s.dataEnvio);
        const hoje = new Date();
        const diffTempo = Math.abs(hoje - dataEnvio);
        const diffDias = Math.ceil(diffTempo / (1000 * 60 * 60 * 24)); 
        const isAtrasado = diffDias > 10;
        
        let badgeStatus = `<span class="badge badge-warning">Pendente</span>`;
        if (isAtrasado) badgeStatus = `<span class="badge badge-danger">Atrasada (${diffDias} dias)</span>`;

        return `
            <tr>
                <td>${formatarData(s.dataEnvio)}</td>
                <td>${s.nomeAluno}</td>
                <td>${s.atividade}</td>
                <td>${s.ch}h</td>
                <td><a href="#" style="color:#7a1010">📄 PDF</a></td>
                <td>${badgeStatus}</td>
                <td class="actions">
                    <button class="btn-small btn-small-success" onclick="analisarSolicitacao(${s.id})">Analisar</button>
                </td>
            </tr>
        `;
    }).join("");
}

/* =======================
   AÇÕES E MODAIS
   ======================= */

window.abrirPerfil = (id) => {
    const d = discentesDB.find(x => x.id === id);
    if(!d) return;

    const linhasHist = d.historico.map(h => `
        <tr>
            <td>${h.data}</td>
            <td>${h.atividade}</td>
            <td>${h.ch}h</td>
            <td><span class="badge badge-success">${h.status}</span></td>
        </tr>
    `).join("") || "<tr><td colspan='4'>Nenhuma atividade registrada.</td></tr>";

    const html = `
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:15px; margin-bottom:20px;">
            <div>
                <h3 style="color:#5d0b0b;">${d.nome}</h3>
                <p>Matrícula: ${d.matricula}</p>
                <p>Status: ${d.situacao.toUpperCase()}</p>
            </div>
            <div style="background:#f8efda; padding:15px; border-radius:8px;">
                <strong>Progresso Total:</strong>
                <div style="font-size:24px; font-weight:bold; color:#7a1010;">${d.horasConcluidas}h / ${d.meta}h</div>
                <small>Restam ${d.horasPendentes}h para concluir</small>
            </div>
        </div>
        
        <h4 class="table-title">Histórico de Atividades</h4>
        <table class="global-table">
            <thead><tr><th>Data</th><th>Atividade</th><th>C.H.</th><th>Status</th></tr></thead>
            <tbody>${linhasHist}</tbody>
        </table>
    `;

    const corpoModal = document.getElementById("corpoPerfilAluno");
    if(corpoModal) {
        corpoModal.innerHTML = html;
        document.getElementById("modalPerfilAluno").style.display = "flex";
    }
}

window.analisarSolicitacao = (id) => {
    const s = solicitacoesDB.find(x => x.id === id);
    if(!s) return;

    document.getElementById("descSolicitacao").textContent = `${s.nomeAluno} - ${s.atividade} (${s.ch}h)`;
    document.getElementById("idSolicTemp").value = id;
    document.getElementById("txtParecer").value = "";
    document.getElementById("modalAnaliseSolic").style.display = "flex";
}

window.confirmarAnalise = (decisao) => {
    const id = parseInt(document.getElementById("idSolicTemp").value);
    const parecer = document.getElementById("txtParecer").value.trim();
    const s = solicitacoesDB.find(x => x.id === id);

    if(decisao === 'indeferir' && parecer.length < 5) {
        alert("O parecer é obrigatório para indeferir a solicitação.");
        return;
    }

    s.status = decisao === 'deferir' ? 'aprovada' : 'rejeitada';
    
    if(decisao === 'deferir') {
        const aluno = discentesDB.find(a => a.id === s.alunoId);
        if(aluno) {
            aluno.horasConcluidas += s.ch;
            aluno.horasPendentes -= s.ch;
            aluno.historico.push({
                atividade: s.atividade + " (Externo)",
                ch: s.ch,
                data: new Date().toLocaleDateString(),
                status: "Aprovado"
            });
        }
    }

    document.getElementById("modalAnaliseSolic").style.display = "none";
    initDiscentes(); 
    if(window.showToast) showToast(decisao === 'deferir' ? 'success' : 'warning', `Solicitação ${decisao === 'deferir' ? 'Deferida' : 'Indeferida'}!`);
}

function renderizarKPIs() {
    const kpiRisco = document.getElementById("kpi-risco");
    const kpiSolicitacoes = document.getElementById("kpi-solicitacoes");
    const kpiTotal = document.getElementById("kpi-total-alunos");

    if(kpiRisco) kpiRisco.textContent = discentesDB.filter(d => d.situacao === 'risco').length;
    if(kpiSolicitacoes) kpiSolicitacoes.textContent = solicitacoesDB.filter(s => s.status === 'pendente').length;
    if(kpiTotal) kpiTotal.textContent = discentesDB.length;
}

window.filtrarDiscentes = renderizarTabelaDiscentes;
window.fecharModalD = (id) => document.getElementById(id).style.display = "none";

window.alternarAbaDiscente = (aba) => {
    document.getElementById("view-lista-discentes").style.display = aba === 'lista' ? 'block' : 'none';
    document.getElementById("view-solicitacoes").style.display = aba === 'solicitacoes' ? 'block' : 'none';
    
    document.getElementById("btnTabLista").className = aba === 'lista' ? 'btn btn-secondary active-tab-btn' : 'btn btn-ghost';
    document.getElementById("btnTabSolicitacoes").className = aba === 'solicitacoes' ? 'btn btn-secondary active-tab-btn' : 'btn btn-ghost';
}

function formatarData(dataStr) {
    if(!dataStr) return "-";
    const [ano, mes, dia] = dataStr.split("-");
    return `${dia}/${mes}/${ano}`;
}