import {
    getOportunidades,
    getSolicitacoes,
    getCertificacoes
} from "../services/discente.service.js";

import { getProjetosDiscenteOfertante } from "./projetos.js";

/* =====================================================
   CARREGA VIEW
===================================================== */
export async function carregarDashboardDiscenteOfertante() {
    const response = await fetch("./dashboard_view.html");
    return await response.text();
}

/* =====================================================
   ATIVACAO
===================================================== */
export async function ativarDashboardDiscenteOfertante() {
    const [oportunidades, solicitacoes, certificacoes, projetos] = await Promise.all([
        getOportunidades(),
        getSolicitacoes(),
        getCertificacoes(),
        getProjetosDiscenteOfertante()
    ]);

    renderizarKPIs(oportunidades, solicitacoes, certificacoes, projetos);
    renderizarProjetos(projetos);
    renderizarAtividadesAtivas(oportunidades);
    renderizarProgresso(oportunidades);
    renderizarNotificacoes(oportunidades, solicitacoes);
}

/* ===============================
   KPIS
================================ */
function renderizarKPIs(oportunidades, solicitacoes, certificacoes, projetos) {
    const projetosAtivos = projetos.filter(p => p.status !== "Encerrado").length;
    const atividadesAtivas = oportunidades.filter(o => o.status === "Em andamento").length;
    const inscricoesPendentes = solicitacoes.filter(s => s.status === "Pendente" || s.status === "Em andamento").length;
    const horasConcluidas = certificacoes
        .filter(c => c.status === "Aprovada")
        .reduce((acc, c) => acc + (c.carga || 0), 0);

    document.getElementById("kpi-projetos")?.textContent && (document.getElementById("kpi-projetos").textContent = projetosAtivos);
    document.getElementById("kpi-atividades")?.textContent && (document.getElementById("kpi-atividades").textContent = atividadesAtivas);
    document.getElementById("kpi-inscricoes")?.textContent && (document.getElementById("kpi-inscricoes").textContent = inscricoesPendentes);
    document.getElementById("kpi-horas")?.textContent && (document.getElementById("kpi-horas").textContent = `${horasConcluidas}h`);
}

/* ===============================
   MEUS PROJETOS
================================ */
function renderizarProjetos(projetos) {
    const container = document.getElementById("projetos-container");
    if (!container) return;

    container.classList.add("atividades-grid");

    if (!projetos.length) {
        container.innerHTML = `<p class="dashboard-vazio">Nenhum projeto cadastrado.</p>`;
        return;
    }

    const ordenados = [...projetos].sort((a, b) => {
        const aEncerrado = a.status === "Encerrado";
        const bEncerrado = b.status === "Encerrado";
        return Number(aEncerrado) - Number(bEncerrado);
    });

    container.innerHTML = ordenados.slice(0, 3).map(p => `
        <div class="atividade-card">
            <span class="titulo">${p.titulo}</span>
            <div class="meta">
                <span class="badge ${badgePorStatusProjeto(p.status)}">${p.status}</span>
                <span>${p.tipo}</span>
                <span>${formatarPeriodo(p.inicio, p.fim)}</span>
            </div>
            <div class="acoes">
                <button class="btn btn-secondary btn-small" onclick="irParaProjetos()">Ver detalhes</button>
            </div>
        </div>
    `).join("");
}

function badgePorStatusProjeto(status) {
    if (status === "Em Execucao" || status === "Em Execução") return "badge-success";
    if (status === "Aprovado") return "badge-info";
    if (status === "Encerrado") return "badge-neutral";
    return "badge-danger";
}

function formatarPeriodo(inicio, fim) {
    return `${formatarData(inicio)} a ${formatarData(fim)}`;
}

function formatarData(data) {
    if (!data) return "N/A";
    const [a, m, d] = data.split("-");
    return `${d}/${m}/${a}`;
}

/* ===============================
   ATIVIDADES ATIVAS
================================ */
function renderizarAtividadesAtivas(oportunidades) {
    const container = document.getElementById("atividades-container");
    if (!container) return;

    const ativas = oportunidades.filter(o => o.inscrito);

    if (!ativas.length) {
        container.innerHTML =
            `<p class="dashboard-vazio">Nenhuma atividade ativa. <a href="#" onclick="irParaOportunidades()">Buscar oportunidades</a></p>`;
        return;
    }

    container.innerHTML = ativas.map(o => `
        <div class="atividade-card">
            <span class="titulo">${o.titulo}</span>
            <div class="meta">
                <span class="badge ${badgePorStatusAtividade(o.status)}">${o.status}</span>
                <span>${o.carga}h</span>
            </div>
            <div class="acoes">
                <button class="btn btn-secondary btn-small" onclick="irParaSolicitacoes()">Ver detalhes</button>
            </div>
        </div>
    `).join("");
}

function badgePorStatusAtividade(status) {
    if (status === "Aberta") return "badge-success";
    if (status === "Em andamento") return "badge-warning";
    if (status === "Encerrada" || status === "Concluído") return "badge-neutral";
    return "badge-info";
}

/* ===============================
   PROGRESSO
================================ */
function renderizarProgresso(oportunidades) {
    const container = document.getElementById("progress-container");
    if (!container) return;

    container.classList.add("progress-lista");

    const ativas = oportunidades.filter(o => o.inscrito);

    if (!ativas.length) {
        container.innerHTML = `<p class="dashboard-vazio">Nenhum progresso registrado.</p>`;
        return;
    }

    container.innerHTML = ativas.map(o => `
        <div class="progress-card">
            <strong>${o.titulo}</strong>
            <div class="progress-bar">
                <div class="progress-fill" style="width:${o.progresso || 0}%"></div>
            </div>
            <span class="kpi-sub">${o.progresso || 0}% concluido</span>
        </div>
    `).join("");
}

/* ===============================
   NOTIFICACOES
================================ */
function renderizarNotificacoes(oportunidades, solicitacoes) {
    const container = document.getElementById("notificacoes-container");
    if (!container) return;

    if (!solicitacoes.length) {
        container.innerHTML = `<p class="dashboard-vazio">Nenhuma notificacao.</p>`;
        return;
    }

    container.innerHTML = solicitacoes.map(s => {
        const atividade = oportunidades.find(o => o.id === s.atividadeId);

        return `
            <div class="notificacao-card">
                <strong>Solicitacao ${s.status}</strong>
                <p>${atividade?.titulo || "Atividade desconhecida"}</p>
            </div>
        `;
    }).join("");
}

/* ===============================
   NAVEGACAO
================================ */
window.irParaSolicitacoes = function () {
    acionarAba("Solicitacoes");
};

window.irParaOportunidades = function () {
    acionarAba("Oportunidades");
};

window.irParaCertificacoes = function () {
    acionarAba("Certificacoes");
};

window.irParaProjetos = function () {
    acionarAba("Meus Projetos");
};

function acionarAba(nomeAba) {
    const abas = document.querySelectorAll(".menu-item");
    const alvo = normalizarTexto(nomeAba);
    const abaAlvo = Array.from(abas).find(aba => normalizarTexto(aba.textContent).includes(alvo));
    if (abaAlvo) {
        abaAlvo.click();
    }
}

function normalizarTexto(texto) {
    return (texto || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}
