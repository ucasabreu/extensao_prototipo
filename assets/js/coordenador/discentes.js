/* ====================================================================
   GESTÃO DE DISCENTES E SOLICITAÇÕES
   Arquivo: assets/js/coordenador/discentes.js
   Descrição: Lógica de gestão acadêmica e validação de horas.
   ==================================================================== */

// MOCK: Base de Alunos
const discentesDB = [
    {
        id: 1,
        nome: "Ana Clara Souza",
        matricula: "2023001",
        ppc: "BCC-2023",
        situacao: "regular",
        horasConcluidas: 120,
        horasPendentes: 240,
        meta: 360,
        historico: [
            { id: 10, atividade: "Semana de Tecnologia 2024", ch: 20, data: "10/05/2024", status: "Validado", obs: "" },
            { id: 11, atividade: "Curso Online de Python", ch: 40, data: "15/06/2024", status: "Rejeitado", obs: "Certificado sem código de autenticidade." }
        ]
    },
    {
        id: 2,
        nome: "João Pedro Alves",
        matricula: "2020055",
        ppc: "BCC-2018",
        situacao: "risco",
        horasConcluidas: 40,
        horasPendentes: 320,
        meta: 360,
        historico: [
            { id: 20, atividade: "Palestra IA", ch: 10, data: "20/03/2024", status: "Validado", obs: "" }
        ]
    },
    {
        id: 3,
        nome: "Maria Helena",
        matricula: "2019100",
        ppc: "BCC-2018",
        situacao: "concluido",
        horasConcluidas: 360,
        horasPendentes: 0,
        meta: 360,
        historico: [
            { id: 30, atividade: "Monitoria Algoritmos", ch: 120, data: "10/12/2023", status: "Validado", obs: "" },
            { id: 31, atividade: "Projeto de Extensão Robótica", ch: 240, data: "20/12/2024", status: "Validado", obs: "" }
        ]
    }
];

// MOCK: Fila de Solicitações
let solicitacoesDB = [
    {
        id: 501,
        alunoId: 1,
        nomeAluno: "Ana Clara Souza",
        atividade: "Workshop: Design Thinking",
        ch: 8,
        dataEnvio: new Date().toISOString().split('T')[0], // Hoje
        anexo: "certificado_workshop.pdf",
        status: "pendente"
    },
    {
        id: 502,
        alunoId: 2,
        nomeAluno: "João Pedro Alves",
        atividade: "Voluntariado Cruz Vermelha",
        ch: 60,
        dataEnvio: "2023-11-20", // DATA ANTIGA
        anexo: "declaracao_voluntario.pdf",
        status: "pendente"
    }
];

// Carrega o HTML da View
export async function carregarViewDiscentes() {
    try {
        const response = await fetch('../../pages/coordenador_curso/discentes.html');
        return await response.text();
    } catch (error) {
        console.error("Erro view discentes:", error);
        return "<div class='alert alert-danger'>Erro ao carregar módulo.</div>";
    }
}

// Inicializador chamado pelo Dashboard
export function initDiscentes() {
    renderizarKPIs();
    renderizarTabelaDiscentes();
    renderizarTabelaSolicitacoes();
}

/* =======================
   TABELA DE DISCENTES (ABA 1)
   ======================= */
function renderizarTabelaDiscentes() {
    const tbody = document.getElementById("tb-discentes");
    if (!tbody) return;

    const inputBusca = document.getElementById("buscaDiscente");
    const busca = inputBusca ? inputBusca.value.toLowerCase() : "";

    const selectFiltro = document.getElementById("filtroSituacao");
    const filtroSit = selectFiltro ? selectFiltro.value : "todos";

    const filtrados = discentesDB.filter(d => {
        const matchTexto = d.nome.toLowerCase().includes(busca) || d.matricula.includes(busca);
        const matchSit = filtroSit === "todos" || d.situacao === filtroSit;
        return matchTexto && matchSit;
    });

    if (filtrados.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" align="center" style="padding:20px; color:#666;">Nenhum discente encontrado.</td></tr>`;
        return;
    }

    tbody.innerHTML = filtrados.map(d => {
        const perc = Math.round((d.horasConcluidas / d.meta) * 100);

        let badge = `<span class="badge badge-neutral">Regular</span>`;
        if (d.situacao === "risco") badge = `<span class="badge badge-danger">Em Risco</span>`;
        if (d.situacao === "concluido") badge = `<span class="badge badge-success">Concluído</span>`;

        return `
            <tr>
                <td>${d.matricula}</td>
                <td><strong>${d.nome}</strong></td>
                <td><span class="badge badge-info" style="font-size:11px;">${d.ppc}</span></td> <td>
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
   TABELA DE SOLICITAÇÕES (ABA 2)
   ======================= */
function renderizarTabelaSolicitacoes() {
    const tbody = document.getElementById("tb-solicitacoes");
    if (!tbody) return;

    const pendentes = solicitacoesDB.filter(s => s.status === "pendente");

    if (pendentes.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" align="center" style="padding:20px;">🎉 Nenhuma solicitação pendente no momento!</td></tr>`;
        return;
    }

    tbody.innerHTML = pendentes.map(s => {
        const dataEnvio = new Date(s.dataEnvio);
        const hoje = new Date();
        const diffTempo = Math.abs(hoje - dataEnvio);
        const diffDias = Math.floor(diffTempo / (1000 * 60 * 60 * 24));
        const isAtrasado = diffDias > 10;

        let badgeStatus = `<span class="badge badge-warning">Pendente</span>`;
        if (isAtrasado) badgeStatus = `<span class="badge badge-danger" title="Acima de 10 dias">Atrasada (${diffDias} dias)</span>`;

        return `
            <tr>
                <td>${formatarData(s.dataEnvio)}</td>
                <td>${s.nomeAluno}</td>
                <td>${s.atividade}</td>
                <td>${s.ch}h</td>
                <td>${badgeStatus}</td>
                <td><span style="font-size:18px;">📎</span></td>
                <td>
                    <button class="btn-small btn-small-success" onclick="analisarSolicitacao(${s.id})">Analisar</button>
                </td>
            </tr>
        `;
    }).join("");
}

/* =======================
   AÇÕES E MODAIS
   ======================= */

// Abre Perfil Completo
window.abrirPerfil = (id) => {
    const d = discentesDB.find(x => x.id === id);
    if (!d) return;

    // Gera linhas do histórico com BOTÃO DE DETALHES
    const linhasHist = d.historico.map(h => {
        let statusBadge = `<span class="badge badge-success">Validado</span>`;
        let obsRow = "";

        if (h.status === "Rejeitado") {
            statusBadge = `<span class="badge badge-danger">Rejeitado</span>`;
            obsRow = `<div style="font-size:12px; color:#b01313; margin-top:4px;">Motivo: ${h.obs}</div>`;
        }

        return `
            <tr>
                <td>${h.data}</td>
                <td>
                    <div>${h.atividade}</div>
                    ${obsRow}
                </td>
                <td>${h.ch}h</td>
                <td>${statusBadge}</td>
                <td align="center">
                    <button class="btn-small btn-small-secondary" onclick="alert('Simulação: Abrindo PDF do certificado...')">📄 Ver</button>
                </td>
            </tr>
        `;
    }).join("") || "<tr><td colspan='5' align='center'>Nenhuma atividade registrada.</td></tr>";

    const html = `
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:25px; background:#f8efda; padding:20px; border-radius:10px;">
            <div>
                <h2 style="margin:0; color:#5d0b0b;">${d.nome}</h2>
                <div style="color:#666; margin-top:5px;">Matrícula: <strong>${d.matricula}</strong></div>
                <div style="margin-top:10px;">Status: <span class="badge ${d.situacao === 'risco' ? 'badge-danger' : 'badge-success'}">${d.situacao.toUpperCase()}</span></div>
            </div>
            <div style="text-align:right;">
                <div style="font-size:14px; color:#666;">Carga Horária Total</div>
                <div style="font-size:32px; font-weight:bold; color:#7a1010;">${d.horasConcluidas}h <span style="font-size:16px; color:#999;">/ ${d.meta}h</span></div>
                <div style="font-size:12px; color:#d4a017;">Pendentes: ${d.meta - d.horasConcluidas}h</div>
            </div>
        </div>
        
        <h3 style="font-size:16px; margin-bottom:10px; border-bottom:2px solid #ddd; padding-bottom:5px;">Histórico de Atividades</h3>
        <table class="global-table">
            <thead>
                <tr>
                    <th width="100">Data</th>
                    <th>Atividade / Justificativa</th>
                    <th width="60">C.H.</th>
                    <th width="90">Status</th>
                    <th width="80" align="center">Doc.</th>
                </tr>
            </thead>
            <tbody>${linhasHist}</tbody>
        </table>
    `;

    const corpoModal = document.getElementById("corpoPerfilAluno");
    if (corpoModal) {
        corpoModal.innerHTML = html;
        document.getElementById("modalPerfilAluno").style.display = "flex";
    }
}

window.analisarSolicitacao = (id) => {
    const s = solicitacoesDB.find(x => x.id === id);
    if (!s) return;

    document.getElementById("descSolicitacao").innerHTML = `
        Solicitante: <span style="color:#333">${s.nomeAluno}</span><br>
        Atividade: <span style="color:#333">${s.atividade}</span> (${s.ch}h)
    `;
    document.getElementById("idSolicTemp").value = id;
    document.getElementById("txtParecer").value = "";
    document.getElementById("modalAnaliseSolic").style.display = "flex";
}

window.confirmarAnalise = (decisao) => {
    const id = parseInt(document.getElementById("idSolicTemp").value);
    const parecer = document.getElementById("txtParecer").value.trim();
    const s = solicitacoesDB.find(x => x.id === id);

    if (decisao === 'indeferir' && parecer.length < 5) {
        alert("Para indeferir, é OBRIGATÓRIO informar o parecer/motivo.");
        return;
    }

    s.status = decisao === 'deferir' ? 'aprovada' : 'rejeitada';

    if (decisao === 'deferir') {
        const aluno = discentesDB.find(a => a.id === s.alunoId);
        if (aluno) {
            aluno.horasConcluidas += s.ch;
            aluno.horasPendentes -= s.ch;
            aluno.historico.push({
                id: Date.now(),
                atividade: s.atividade + " (Externo)",
                ch: s.ch,
                data: new Date().toLocaleDateString(),
                status: "Validado",
                obs: ""
            });
        }
    } else {
        const aluno = discentesDB.find(a => a.id === s.alunoId);
        if (aluno) {
            aluno.historico.push({
                id: Date.now(),
                atividade: s.atividade + " (Externo)",
                ch: s.ch,
                data: new Date().toLocaleDateString(),
                status: "Rejeitado",
                obs: parecer
            });
        }
    }

    document.getElementById("modalAnaliseSolic").style.display = "none";
    initDiscentes();
    if (window.showToast) {
        const msg = decisao === 'deferir' ? 'Horas validadas com sucesso!' : 'Solicitação indeferida.';
        const tipo = decisao === 'deferir' ? 'success' : 'warning';
        showToast(tipo, msg);
    }
}

function renderizarKPIs() {
    const kpiRisco = document.getElementById("kpi-risco");
    const kpiSolicitacoes = document.getElementById("kpi-solicitacoes");
    const kpiTotal = document.getElementById("kpi-total-alunos");

    if (kpiRisco) kpiRisco.textContent = discentesDB.filter(d => d.situacao === 'risco').length;
    if (kpiSolicitacoes) kpiSolicitacoes.textContent = solicitacoesDB.filter(s => s.status === 'pendente').length;
    if (kpiTotal) kpiTotal.textContent = discentesDB.length;
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
    if (!dataStr) return "-";
    const [ano, mes, dia] = dataStr.split("-");
    return `${dia}/${mes}/${ano}`;
}