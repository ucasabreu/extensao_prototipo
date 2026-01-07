import {
    getOportunidades,
    getSolicitacoes,
    getNoticias
} from "../services/discente.service.js";

/* =====================================================
   CARREGA VIEW
===================================================== */
export async function carregarDashboardDiscenteOfertante() {
    const response = await fetch("./dashboard_view.html");
    return await response.text();
}

/* =====================================================
   ATIVAÇÃO
===================================================== */
export async function ativarDashboardDiscenteOfertante() {
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



/* 
const oportunidadesMock = [
    { id: 1, titulo: "Projeto de Robótica Educacional", carga: "40h", status: "Em andamento" },
    { id: 2, titulo: "Extensão Comunitária – Quilombo", carga: "60h", status: "Concluído" },
    { id: 3, titulo: "Pesquisa Institucional – PIBEX", carga: "20h", status: "Pendente" },
    { id: 2, titulo: "Monitoria Voluntaria - Estrutura de dados 2", carga: "30h", status: "Em andamento" }
];

const progressoMock = [
    { titulo: "Robótica Educacional", percentual: 70 },
    { titulo: "Extensão – Quilombo", percentual: 100 },
    { titulo: "Monitoria Volutaria - Estrutura de dados 2", percentual: 30 },
];

const notificacoesMock = [
    { titulo: "Inscrição aprovada", descricao: "Projeto de Robótica Educacional" },
    { titulo: "Inscrição aprovada", descricao: "onitoria Voluntaria - Estrutura de dados 2" },
    { titulo: "Inscrição aprovada", descricao: "Extensão Comunitária – Quilombo" },
    { titulo: "Incrição sendo avaliada", descricao: "Pesquisa Institucional – PIBEX" },
];

const noticiasMock = [
    { titulo: "Novo edital de extensão", descricao: "Inscrições abertas até 30/09" },
    { titulo: "Novo PPC 2025 a caminho", descricao: " se preparem!" },
    { titulo: "Estágio Disponível", descricao: "Inscrições abertas até 16/12" },
    { titulo: "Recesso de Natal", descricao: " Começa 20/12/2025 até 04/01/2026 " }
];

/* ===============================
   CARREGA VIEW (HTML PURO)
================================ 

export async function carregarDashboardDiscente() {
    const response = await fetch("./dashboard_view.html");

   
    return await response.text();
}


/* ===============================
   ATIVAÇÃO DA VIEW
   (chamada SEMPRE ao clicar na aba)
================================ 

export function ativarDashboardDiscente() {
    renderizarOportunidades();
    renderizarProgresso();
    renderizarNotificacoes();
    renderizarNoticias();
}

/* ===============================
   RENDERIZAÇÕES
================================

/* OPORTUNIDADES INSCRITAS 
function renderizarOportunidades() {
    const container = document.querySelector(".oportunidades-lista");
    if (!container) return;

    container.innerHTML = ""; // limpa antes de renderizar

    if (!oportunidadesMock.length) {
        container.innerHTML = `<p class="vazio">Nenhuma oportunidade inscrita.</p>`;
        return;
    }

    oportunidadesMock.forEach(op => {
        container.innerHTML += `
            <div class="card-op">
                <strong>${op.titulo}</strong>
                <p><strong>Carga horária:</strong> ${op.carga}</p>
                <p><strong>Status:</strong> ${op.status}</p>
            </div>
        `;
    });
}

/* PROGRESSO 
function renderizarProgresso() {
    const container = document.getElementById("progress-container");
    if (!container) return;

    container.innerHTML = ""; // limpa antes

    if (!progressoMock.length) {
        container.innerHTML = `<p class="vazio">Sem progresso registrado.</p>`;
        return;
    }

    progressoMock.forEach(item => {
        container.innerHTML += `
            <div class="progress-card">
                <strong>${item.titulo}</strong>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${item.percentual}%"></div>
                </div>
            </div>
        `;
    });
}

/* NOTIFICAÇÕES 
function renderizarNotificacoes() {
    const container = document.querySelector(".notificacoes-box .box-scroll");
    if (!container) return;

    container.innerHTML = "";

    if (!notificacoesMock.length) {
        container.innerHTML = `<p class="vazio">Nenhuma notificação.</p>`;
        return;
    }

    notificacoesMock.forEach(n => {
        container.innerHTML += `
            <div class="notificacao-card">
                <strong>${n.titulo}</strong>
                <p>${n.descricao}</p>
            </div>
        `;
    });
}

/* NOTÍCIAS 
function renderizarNoticias() {
    const container = document.querySelector(".noticias-box .box-scroll");
    if (!container) return;

    container.innerHTML = "";

    if (!noticiasMock.length) {
        container.innerHTML = `<p class="vazio">Sem notícias no momento.</p>`;
        return;
    }

    noticiasMock.forEach(n => {
        container.innerHTML += `
            <div class="noticia-card">
                <strong>${n.titulo}</strong>
                <p>${n.descricao}</p>
            </div>
        `;
    });
}
*/