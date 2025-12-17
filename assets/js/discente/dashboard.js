import {
    getOportunidades,
    getSolicitacoes,
    getNoticias
} from "../services/discente.service.js";

/* =====================================================
   CARREGA VIEW
===================================================== */
export async function carregarDashboardDiscente() {
    const response = await fetch("../../pages/discente/dashboard_view.html");
    return await response.text();
}

/* =====================================================
   ATIVAÇÃO
===================================================== */
export async function ativarDashboardDiscente() {
    const oportunidades = await getOportunidades();
    const solicitacoes = await getSolicitacoes();
    const noticias = await getNoticias();

    renderizarAtividadesAtivas(oportunidades);
    renderizarProgresso(oportunidades);
    renderizarNotificacoes(oportunidades, solicitacoes);
    renderizarNoticias(noticias);
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
            `<p class="dashboard-vazio">Nenhuma atividade ativa.</p>`;
        return;
    }

    container.innerHTML = ativas.map(o => `
        <div class="kpi-card">
            <span class="kpi-title">${o.titulo}</span>
            <span class="badge badge-info">${o.status}</span>
            <span class="kpi-sub">Carga horária: ${o.carga}h</span>

            <button class="btn btn-secondary btn-small"
                onclick="irParaSolicitacoes()">
                Ver detalhes
            </button>
        </div>
    `).join("");
}

/* ===============================
   PROGRESSO
================================ */
function renderizarProgresso(oportunidades) {
    const container = document.getElementById("progress-container");
    if (!container) return;

    const ativas = oportunidades.filter(o => o.inscrito);

    container.innerHTML = ativas.map(o => `
        <div class="progress-card">
            <strong>${o.titulo}</strong>
            <div class="progress-bar">
                <div class="progress-fill"
                     style="width:${o.progresso || 0}%">
                </div>
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
            `<p class="dashboard-vazio">Nenhuma notificação.</p>`;
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
            `<p class="dashboard-vazio">Nenhuma notícia.</p>`;
        return;
    }

    container.innerHTML = noticias.map(n => `
        <div class="noticia-card">
            <strong>${n.titulo}</strong>
            <p>${n.descricao}</p>
        </div>
    `).join("");
}

/* ===============================
   NAVEGAÇÃO
================================ */
window.irParaSolicitacoes = function () {
    document.querySelectorAll(".menu-item")
        .forEach(m => m.classList.remove("active"));

    document.querySelector(".menu-item:nth-child(3)")?.click();
};
