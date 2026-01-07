import { getOportunidades, getSolicitacoes } from "../services/discente.service.js";

/* =====================================================
   CARREGA VIEW
===================================================== */
export async function carregarSolicitacoesDiscenteOfertante() {
    const res = await fetch("./solicitacoes.html");
    return await res.text();
}

/* =====================================================
   RENDER DE COLUNA COM CARDS
===================================================== */
function renderizarColuna(colunaId, status, oportunidades, solicitacoes) {
    const container = document.getElementById(colunaId);
    if (!container) return;

    const filtradas = solicitacoes.filter(s => s.status === status);
    if (!filtradas.length) {
        container.innerHTML = `<p class="solicitacoes-vazio">Nenhuma solicitação.</p>`;
        return;
    }

    container.innerHTML = filtradas.map(s => {
        const atividade = oportunidades.find(o => o.id === s.atividadeId);

        const btnCancelar = s.status === "Aceita"
            ? `<button class="btn btn-danger btn-small" data-action="toggle" data-id="${s.id}">Cancelar inscrição</button>`
            : "";

        const btnTentar = s.status === "Recusada"
            ? `<button class="btn btn-primary btn-small" data-action="tentar" data-id="${s.id}">Tentar novamente</button>`
            : "";

        // badge de status usando classes globais
        let badgeClass = "badge-info";
        if (s.status === "Aceita") badgeClass = "badge-success";
        else if (s.status === "Recusada") badgeClass = "badge-danger";
        else if (s.status === "Em andamento") badgeClass = "badge-warning";

        return `
            <div class="kpi-card">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span class="kpi-title">${atividade?.titulo || "Atividade desconhecida"}</span>
                    <span class="badge ${badgeClass}">${s.status}</span>
                </div>
                <div class="kpi-sub">${atividade?.descricao || ""}</div>
                <div class="actions">
                    <button class="btn btn-secondary btn-small" data-action="detalhes" data-id="${s.id}">Ver detalhes</button>
                    ${btnCancelar}${btnTentar}
                </div>
            </div>
        `;
    }).join("");

    bindAcoes(container, oportunidades, solicitacoes);
}


/* =====================================================
   AÇÕES DOS BOTÕES
===================================================== */
function bindAcoes(container, oportunidades, solicitacoes) {
    container.querySelectorAll("[data-action]").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = Number(btn.dataset.id);
            const action = btn.dataset.action;
            const solicitacao = solicitacoes.find(s => s.id === id);
            if (!solicitacao) return;

            if (action === "detalhes") verDetalhes(solicitacao, oportunidades);
            if (action === "toggle") toggleInscricao(solicitacao, oportunidades, container);
            if (action === "tentar") abrirModalTentarNovamente(solicitacao, oportunidades, solicitacoes, container);
        });
    });
}

/* =====================================================
   MODAL TENTAR NOVAMENTE
===================================================== */
function abrirModalTentarNovamente(solicitacao, oportunidades, solicitacoes, container) {
    const atividade = oportunidades.find(o => o.id === solicitacao.atividadeId);
    if (!atividade) return;

    const modal = document.createElement("div");
    modal.classList.add("modal-overlay");
    modal.innerHTML = `
        <div class="modal">
            <div class="modal-header">
                <h2>Tentar novamente: ${atividade.titulo}</h2>
                <span class="modal-close">&times;</span>
            </div>
            <div class="modal-body">
                <textarea id="novo-motivo" placeholder="Escreva seu motivo aqui..." class="textarea"></textarea>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" id="enviar-tentativa">Enviar</button>
                <button class="btn btn-secondary modal-close">Cancelar</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    modal.style.display = "flex";

    modal.querySelectorAll(".modal-close").forEach(el => el.addEventListener("click", () => modal.remove()));

    modal.querySelector("#enviar-tentativa").addEventListener("click", () => {
        const motivo = modal.querySelector("#novo-motivo").value.trim();
        if (!motivo) { alert("Digite o motivo"); return; }

        solicitacao.status = "Em andamento";
        mostrarToast("success", "Solicitação enviada novamente!");
        modal.remove();

        renderizarColuna(container.id, "Recusada", oportunidades, solicitacoes);
        renderizarColuna(container.id, "Em andamento", oportunidades, solicitacoes);
    });
}

/* =====================================================
   DETALHES
===================================================== */
function verDetalhes(solicitacao, oportunidades) {
    const atividade = oportunidades.find(o => o.id === solicitacao.atividadeId);
    if (!atividade) return;

    const modal = document.createElement("div");
    modal.classList.add("modal-overlay");
    modal.innerHTML = `
        <div class="modal">
            <div class="modal-header">
                <h2>${atividade.titulo}</h2>
                <span class="modal-close">&times;</span>
            </div>
            <div class="modal-body">
                <p><strong>Descrição:</strong> ${atividade.descricao}</p>
                <p><strong>Carga horária:</strong> ${atividade.carga}h</p>
                <p><strong>Modalidade:</strong> ${atividade.modalidade}</p>
                <p><strong>Semestre:</strong> ${atividade.semestre}</p>
                <p><strong>Ano:</strong> ${atividade.ano}</p>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary modal-close">Fechar</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    modal.style.display = "flex";
    modal.querySelectorAll(".modal-close").forEach(el => el.addEventListener("click", () => modal.remove()));
}

/* =====================================================
   TOGGLE INSCRIÇÃO
===================================================== */
function toggleInscricao(solicitacao, oportunidades, container) {
    if (solicitacao.status !== "Aceita") return;
    solicitacao.status = "Aberta";
    mostrarToast("info", "Inscrição cancelada.");

    renderizarColuna(container.id, "Aceita", oportunidades, solicitacoes);
    renderizarColuna(container.id, "Em andamento", oportunidades, solicitacoes);
}

/* =====================================================
   TOASTS
===================================================== */
function mostrarToast(tipo, mensagem) {
    let container = document.getElementById("toast-container");
    if (!container) {
        container = document.createElement("div");
        container.id = "toast-container";
        document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `toast toast-${tipo}`;
    toast.textContent = mensagem;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = "toastHide 0.3s forwards";
        toast.addEventListener("animationend", () => toast.remove());
    }, 2000);
}

/* =====================================================
   ATIVAÇÃO
===================================================== */
export async function ativarSolicitacoesDiscenteOfertante() {
    const oportunidades = await getOportunidades();
    const solicitacoes = await getSolicitacoes();

    renderizarColuna("aceitas", "Aceita", oportunidades, solicitacoes);
    renderizarColuna("recusadas", "Recusada", oportunidades, solicitacoes);
    renderizarColuna("andamento", "Em andamento", oportunidades, solicitacoes);
}

//versão anterior
/*export const solicitacoesMock = [
    { titulo: "Projeto Robótica", status: "Aceita", motivo: "" },
    { titulo: "Extensão Quilombo", status: "Recusada", motivo: "Documentação incompleta" },
    { titulo: "Pesquisa PIBEX", status: "Em andamento", motivo: "" }
];



export async function carregarSolicitacoesDiscente() {
    return await fetch("./solicitacoes.html").then(r => r.text());
}

export function ativarSolicitacoesDiscente() {
    const aceitas = document.getElementById("aceitas");
    const recusadas = document.getElementById("recusadas");
    const andamento = document.getElementById("andamento");

    aceitas.innerHTML = "";
    recusadas.innerHTML = "";
    andamento.innerHTML = "";

    solicitacoesMock.forEach(s => {
        const card = document.createElement("div");
        card.classList.add("solicitacoes-card");
        card.innerHTML = `
            <div class="solicitacoes-card-status">${s.status}</div>
            <div class="solicitacoes-card-titulo">${s.titulo}</div>
            ${s.motivo ? `<div class="solicitacoes-card-motivo">Motivo: ${s.motivo}</div>` : ""}
        `;

        if (s.status === "Aceita") aceitas.appendChild(card);
        else if (s.status === "Recusada") recusadas.appendChild(card);
        else if (s.status === "Em andamento") andamento.appendChild(card);
    });
}
*/

