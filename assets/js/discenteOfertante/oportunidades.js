import { getOportunidades } from "../services/discente.service.js";

/* =====================================================
   ESTADO LOCAL
===================================================== */
let oportunidadesData = [];
let oportunidadeSelecionada = null;

/* =====================================================
   CARREGA VIEW
===================================================== */
export async function carregarOportunidadesDiscenteOfertante() {
    const response = await fetch("./oportunidades.html");
    return await response.text();
}

/* =====================================================
   ATIVACAO
===================================================== */
export async function ativarOportunidadesDiscenteOfertante() {
    await carregarDados();
    renderizarKPIs();
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
   KPIS
===================================================== */
function renderizarKPIs() {
    const disponiveis = oportunidadesData.filter(o => o.status === "Aberta").length;
    const inscrito = oportunidadesData.filter(o => o.inscrito).length;
    const andamento = oportunidadesData.filter(o => o.status === "Em andamento").length;
    const encerradas = oportunidadesData.filter(o => o.status === "Encerrada" || o.status === "Concluído").length;

    document.getElementById("kpi-disponiveis")?.textContent && (document.getElementById("kpi-disponiveis").textContent = disponiveis);
    document.getElementById("kpi-inscrito")?.textContent && (document.getElementById("kpi-inscrito").textContent = inscrito);
    document.getElementById("kpi-andamento")?.textContent && (document.getElementById("kpi-andamento").textContent = andamento);
    document.getElementById("kpi-encerradas")?.textContent && (document.getElementById("kpi-encerradas").textContent = encerradas);
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
   RENDERIZACAO
===================================================== */
function renderizarOportunidades(lista) {
    const container = document.querySelector(".oportunidades-disponiveis");
    const totalEl = document.getElementById("total-oportunidades");

    if (!container) return;

    if (totalEl) {
        totalEl.textContent = `${lista.length} resultado${lista.length !== 1 ? "s" : ""}`;
    }

    if (!lista.length) {
        container.innerHTML = `
            <div class="oportunidades-vazio">
                <p>Nenhuma oportunidade encontrada.</p>
                <p style="font-size: 12px; margin-top: 8px;">Tente ajustar os filtros ou aguarde novas publicacoes.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = lista.map(op => {
        let badgeClass = "badge-info";
        if (op.status === "Aberta") badgeClass = "badge-success";
        else if (op.status === "Em andamento") badgeClass = "badge-warning";
        else if (op.status === "Encerrada" || op.status === "Concluído") badgeClass = "badge-neutral";

        let botaoInscricao = "";
        if (op.status === "Aberta") {
            botaoInscricao = `
                <button class="btn-small ${op.inscrito ? "btn-small-danger" : "btn-small-primary"}"
                    data-action="toggle" data-id="${op.id}">
                    ${op.inscrito ? "Cancelar" : "Inscrever-se"}
                </button>
            `;
        }

        return `
            <div class="oportunidade-card">
                <span class="titulo">${op.titulo}</span>
                <div class="meta">
                    <span class="badge ${badgeClass}">${op.status}</span>
                    <span>CH ${op.carga}h</span>
                    <span>Sem. ${op.semestre}/${op.ano}</span>
                </div>
                <p class="descricao">${op.descricao || "Sem descricao disponivel."}</p>
                <div class="acoes">
                    <button class="btn-small btn-small-secondary" data-action="detalhes" data-id="${op.id}">
                        Ver detalhes
                    </button>
                    ${botaoInscricao}
                </div>
            </div>
        `;
    }).join("");

    bindAcoes();
}

/* =====================================================
   ACOES
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

    if (op.inscrito) {
        op.status = "Em andamento";
    } else {
        op.status = "Aberta";
    }

    mostrarToast(
        op.inscrito ? "success" : "info",
        op.inscrito ? "Inscricao realizada com sucesso!" : "Inscricao cancelada."
    );

    renderizarKPIs();
    aplicarFiltros();
}

/* =====================================================
   MODAL DE DETALHES
===================================================== */
function verDetalhes(id) {
    const op = oportunidadesData.find(o => o.id === id);
    if (!op) return;

    oportunidadeSelecionada = op;

    document.getElementById("modal-titulo").textContent = op.titulo;
    document.getElementById("modal-status").innerHTML = `<span class="badge ${getBadgeClass(op.status)}">${op.status}</span>`;
    document.getElementById("modal-carga").textContent = `${op.carga} horas`;
    document.getElementById("modal-modalidade").textContent = op.modalidade || "Presencial";
    document.getElementById("modal-periodo").textContent = `Semestre ${op.semestre} / ${op.ano}`;
    document.getElementById("modal-vagas").textContent = op.vagas || "Ilimitadas";
    document.getElementById("modal-responsavel").textContent = op.responsavel || "A definir";
    document.getElementById("modal-descricao").textContent = op.descricao || "Sem descricao disponivel.";

    const btnInscricao = document.getElementById("modal-btn-inscricao");
    if (btnInscricao) {
        if (op.status === "Aberta") {
            btnInscricao.style.display = "block";
            btnInscricao.textContent = op.inscrito ? "Cancelar Inscricao" : "Inscrever-se";
            btnInscricao.className = op.inscrito ? "btn btn-danger" : "btn btn-primary";
        } else {
            btnInscricao.style.display = "none";
        }
    }

    document.getElementById("modalDetalhesOportunidade").style.display = "flex";
}

function getBadgeClass(status) {
    if (status === "Aberta") return "badge-success";
    if (status === "Em andamento") return "badge-warning";
    if (status === "Encerrada" || status === "Concluído") return "badge-neutral";
    return "badge-info";
}

window.fecharModalDetalhes = function () {
    document.getElementById("modalDetalhesOportunidade").style.display = "none";
    oportunidadeSelecionada = null;
};

window.inscreverDoModal = function () {
    if (!oportunidadeSelecionada) return;
    toggleInscricao(oportunidadeSelecionada.id);
    fecharModalDetalhes();
};

function mostrarToast(tipo, mensagem) {
    if (window.showToast) {
        window.showToast(tipo, mensagem);
    } else {
        console.log(`[${tipo.toUpperCase()}] ${mensagem}`);
    }
}

/* =====================================================
   NAVEGACAO
===================================================== */
window.irParaSolicitacoes = function () {
    const abas = document.querySelectorAll(".menu-item");
    const alvo = normalizarTexto("Solicitacoes");
    const abaAlvo = Array.from(abas).find(aba => normalizarTexto(aba.textContent).includes(alvo));
    if (abaAlvo) abaAlvo.click();
};

function normalizarTexto(texto) {
    return (texto || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}
