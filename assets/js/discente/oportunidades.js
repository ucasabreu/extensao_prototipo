import { getOportunidades } from "../services/discente.service.js";

/* =====================================================
   ESTADO LOCAL
===================================================== */
let oportunidadesData = [];

/* =====================================================
   CARREGA VIEW
===================================================== */
export async function carregarOportunidadesDiscente() {
    const response = await fetch("../../pages/discente/oportunidades.html");
    return await response.text();
}

/* =====================================================
   ATIVAÇÃO
===================================================== */
export async function ativarOportunidadesDiscente() {
    await carregarDados();
    bindFiltros();
    aplicarFiltros();
}

/* =====================================================
   CARREGAMENTO DE DADOS
===================================================== */
async function carregarDados() {
    oportunidadesData = await getOportunidades();
}

/* =====================================================
   FILTROS
===================================================== */
function bindFiltros() {
    ["pesquisa-oportunidade", "filtro-status", "filtro-semestre", "filtro-ano", "filtro-curso"]
        .forEach(id => document.getElementById(id)?.addEventListener("input", aplicarFiltros));
}

function aplicarFiltros() {
    const texto = document.getElementById("pesquisa-oportunidade")?.value?.toLowerCase() || "";
    const status = document.getElementById("filtro-status")?.value;
    const semestre = document.getElementById("filtro-semestre")?.value;
    const ano = document.getElementById("filtro-ano")?.value;
    const curso = document.getElementById("filtro-curso")?.value;

    const filtradas = oportunidadesData.filter(o => {
        if (texto && !o.titulo.toLowerCase().includes(texto)) return false;
        if (status && o.status !== status) return false;
        if (semestre && o.semestre !== semestre) return false;
        if (ano && o.ano !== ano) return false;
        if (curso && o.curso !== curso) return false;
        return true;
    });

    renderizarOportunidades(filtradas);
}

/* =====================================================
   RENDERIZAÇÃO
===================================================== */
function renderizarOportunidades(lista) {
    const container = document.querySelector(".oportunidades-disponiveis");
    if (!container) return;

    if (!lista.length) {
        container.innerHTML = `<p class="oportunidades-vazio">Nenhuma oportunidade encontrada.</p>`;
        return;
    }

    container.innerHTML = lista.map(op => {
        // Define classe da badge de acordo com status
        let badgeClass = '';
        if (op.status === "Aberta") badgeClass = "badge-success";
        else if (op.status === "Em andamento") badgeClass = "badge-warning";
        else if (op.status === "Encerrada") badgeClass = "badge-danger";

        // Botão de inscrição só aparece se estiver Aberta
        const botaoInscricao = (op.status === "Aberta") 
            ? `<button class="btn ${op.inscrito ? "btn-danger" : "btn-primary"} btn-small"
                    data-action="toggle"
                    data-id="${op.id}">
                    ${op.inscrito ? "Cancelar inscrição" : "Inscrever-se"}
               </button>`
            : "";

        return `
            <div class="kpi-card">
                <span class="kpi-title">${op.titulo}</span>
                <span class="badge ${badgeClass}">${op.status}</span>
                <span class="kpi-sub">Carga horária: ${op.carga}h</span>

                <button class="btn btn-secondary btn-small"
                    data-action="detalhes"
                    data-id="${op.id}">
                    Ver detalhes
                </button>

                ${botaoInscricao}
            </div>
        `;
    }).join("");

    bindAcoes();
}

/* =====================================================
   AÇÕES
===================================================== */
function bindAcoes() {
    document.querySelectorAll("[data-action]").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = Number(btn.dataset.id);
            const action = btn.dataset.action;
            if (action === "toggle") toggleInscricao(id);
            if (action === "detalhes") verDetalhes(id);
        });
    });
}

function toggleInscricao(id) {
    const op = oportunidadesData.find(o => o.id === id);
    if (!op) return;

    op.inscrito = !op.inscrito;
    op.status = op.inscrito ? "Em andamento" : "Aberta";

    mostrarToast(
        op.inscrito ? "success" : "info",
        op.inscrito ? "Inscrição realizada!" : "Inscrição cancelada."
    );

    aplicarFiltros();
}

function verDetalhes(id) {
    const op = oportunidadesData.find(o => o.id === id);
    if (!op) return;

    alert(`${op.titulo}\n\nDescrição: ${op.descricao}\nCarga horária: ${op.carga}h\nModalidade: ${op.modalidade}\nSemestre: ${op.semestre}\nAno: ${op.ano}`);
}

/* =====================================================
   NAVEGAÇÃO
===================================================== */
window.irParaSolicitacoes = function () {
    document.querySelectorAll(".menu-item").forEach(m => m.classList.remove("active"));
    document.querySelector(".menu-item:nth-child(3)")?.click();
};
