import {
    getOportunidades,
    getSolicitacoes,
    getNoticias
} from "../services/discente.service.js";

/* =====================================================
   CARREGA VIEW
===================================================== */
export async function carregarDashboardDiscente() {
    const response = await fetch("./dashboard_view.html");
    return await response.text();
}

/* =====================================================
   ATIVAÇÃO
===================================================== */
export async function ativarDashboardDiscente() {
    const oportunidades = await getOportunidades();
    const solicitacoes = await getSolicitacoes();
    const noticias = await getNoticias();

    renderizarKPIs(oportunidades, solicitacoes);
    renderizarAtividadesAtivas(oportunidades);
    renderizarProgresso(oportunidades);
    renderizarNotificacoes(oportunidades, solicitacoes);
    renderizarNoticias(noticias);
}

/* ===============================
   KPIs (NOVO)
================================ */
function renderizarKPIs(oportunidades, solicitacoes) {
    const ativas = oportunidades.filter(o => o.inscrito);
    const concluidas = oportunidades.filter(o =>
        o.status === "Concluído" || o.status === "Concluída" || o.status === "Encerrada"
    );
    const horasTotais = oportunidades
        .filter(o => o.inscrito || o.status === "Concluído" || o.status === "Encerrada")
        .reduce((acc, o) => acc + (o.carga || 0), 0);
    const pendencias = solicitacoes.filter(s => s.status === "Pendente").length;

    const elAndamento = document.getElementById("kpi-andamento");
    const elConcluidas = document.getElementById("kpi-concluidas");
    const elHoras = document.getElementById("kpi-horas");
    const elPendencias = document.getElementById("kpi-pendencias");

    if (elAndamento) elAndamento.textContent = ativas.length;
    if (elConcluidas) elConcluidas.textContent = concluidas.length;
    if (elHoras) elHoras.textContent = `${horasTotais}h`;
    if (elPendencias) elPendencias.textContent = pendencias;
}

/* ===============================
   ATIVIDADES ATIVAS
================================ */
function renderizarAtividadesAtivas(oportunidades) {
    const container = document.querySelector(".oportunidades-lista");
    if (!container) return;

    const ativas = oportunidades.filter(o => o.inscrito);

    if (!ativas.length) {
        container.innerHTML =
            `<p class="dashboard-vazio" style="grid-column: span 2; text-align: center; color: #888;">Nenhuma atividade ativa. <a href="#" onclick="irParaOportunidades()">Buscar oportunidades</a></p>`;
        return;
    }

    container.innerHTML = ativas.map(o => {
        let badgeClass = "badge-info";
        if (o.status === "Em andamento") badgeClass = "badge-success";
        if (o.status === "Pendente") badgeClass = "badge-warning";
        if (o.status === "Encerrada" || o.status === "Concluído") badgeClass = "badge-neutral";

        return `
        <div class="atividade-card">
            <span class="titulo">${o.titulo}</span>
            <div class="meta">
                <span class="badge ${badgeClass}">${o.status}</span>
                <span>⏱ ${o.carga}h</span>
            </div>
            <div class="acoes">
                <button class="btn-small btn-small-secondary" onclick="irParaSolicitacoes()">
                    Ver detalhes
                </button>
            </div>
        </div>
    `}).join("");
}

/* ===============================
   PROGRESSO
================================ */
function renderizarProgresso(oportunidades) {
    const container = document.getElementById("progress-container");
    if (!container) return;

    const ativas = oportunidades.filter(o => o.inscrito);

    if (!ativas.length) {
        container.innerHTML = `<p style="color: #888; font-size: 13px;">Nenhuma atividade em progresso.</p>`;
        return;
    }

    container.innerHTML = ativas.map(o => `
        <div class="progress-card">
            <strong>${o.titulo}</strong>
            <div class="progress-bar">
                <div class="progress-fill" style="width:${o.progresso || 0}%"></div>
            </div>
            <span class="kpi-sub">${o.progresso || 0}% concluído</span>
        </div>
    `).join("");
}

/* ===============================
   NOTIFICAÇÕES
================================ */
function renderizarNotificacoes(oportunidades, solicitacoes) {
    const container = document.getElementById("notificacoes-container");
    if (!container) return;

    if (!solicitacoes.length) {
        container.innerHTML =
            `<p style="color: #888; font-size: 13px;">Nenhuma notificação.</p>`;
        return;
    }

    container.innerHTML = solicitacoes.map(s => {
        const atividade = oportunidades.find(o => o.id === s.atividadeId);

        return `
            <div class="notificacao-card">
                <strong>Solicitação ${s.status}</strong>
                <p>${atividade?.titulo || "Atividade desconhecida"}</p>
            </div>
        `;
    }).join("");
}

/* ===============================
   NOTÍCIAS
================================ */
function renderizarNoticias(noticias) {
    const container = document.getElementById("noticias-container");
    if (!container) return;

    if (!noticias.length) {
        container.innerHTML =
            `<p style="color: #888; font-size: 13px;">Nenhuma notícia.</p>`;
        return;
    }

    container.innerHTML = noticias.map(n => `
        <div class="noticia-card">
            <strong>${n.titulo}</strong>
            <p>${n.resumo}</p>
        </div>
    `).join("");
}

/* ===============================
   NAVEGAÇÃO
================================ */
window.irParaSolicitacoes = function () {
    acionarAba("Solicitações");
};

window.irParaOportunidades = function () {
    acionarAba("Oportunidades");
};

window.irParaCertificacoes = function () {
    acionarAba("Certificações");
};

function acionarAba(nomeAba) {
    const abas = document.querySelectorAll(".menu-item");
    const abaAlvo = Array.from(abas).find(aba => aba.textContent.includes(nomeAba));
    if (abaAlvo) {
        abaAlvo.click();
    }
}
