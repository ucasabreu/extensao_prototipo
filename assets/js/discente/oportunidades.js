import { getOportunidades } from "../services/discente.service.js";

/* =====================================================
   ESTADO LOCAL
===================================================== */
let oportunidadesData = [];

/* =====================================================
   CARREGA VIEW
===================================================== */
export async function carregarOportunidadesDiscente() {
    const response = await fetch("./oportunidades.html");
    return await response.text();
}

/* =====================================================
   ATIVAÇÃO
===================================================== */
export async function ativarOportunidadesDiscente() {
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
   KPIs
===================================================== */
function renderizarKPIs() {
    const disponiveis = oportunidadesData.filter(o => o.status === "Aberta").length;
    const inscrito = oportunidadesData.filter(o => o.inscrito).length;
    const andamento = oportunidadesData.filter(o => o.status === "Em andamento").length;
    const encerradas = oportunidadesData.filter(o => o.status === "Encerrada" || o.status === "Concluído").length;

    const elDisponiveis = document.getElementById("kpi-disponiveis");
    const elInscrito = document.getElementById("kpi-inscrito");
    const elAndamento = document.getElementById("kpi-andamento");
    const elEncerradas = document.getElementById("kpi-encerradas");

    if (elDisponiveis) elDisponiveis.textContent = disponiveis;
    if (elInscrito) elInscrito.textContent = inscrito;
    if (elAndamento) elAndamento.textContent = andamento;
    if (elEncerradas) elEncerradas.textContent = encerradas;
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
    const totalEl = document.getElementById("total-oportunidades");

    if (!container) return;

    // Atualiza contador
    if (totalEl) {
        totalEl.textContent = `${lista.length} resultado${lista.length !== 1 ? 's' : ''}`;
    }

    if (!lista.length) {
        container.innerHTML = `
            <div class="oportunidades-vazio">
                <p>Nenhuma oportunidade encontrada.</p>
                <p style="font-size: 12px; margin-top: 8px;">Tente ajustar os filtros ou aguarde novas publicações.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = lista.map(op => {
        // Define classe da badge
        let badgeClass = 'badge-info';
        if (op.status === "Aberta") badgeClass = "badge-success";
        else if (op.status === "Em andamento") badgeClass = "badge-warning";
        else if (op.status === "Encerrada" || op.status === "Concluído") badgeClass = "badge-neutral";

        // Botão de inscrição
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
                    <span>⏱ ${op.carga}h</span>
                    <span>📅 ${op.semestre}º/${op.ano}</span>
                </div>
                <p class="descricao">${op.descricao || 'Sem descrição disponível.'}</p>
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

    if (op.inscrito) {
        op.status = "Em andamento";
    } else {
        op.status = "Aberta";
    }

    mostrarToast(
        op.inscrito ? "success" : "info",
        op.inscrito ? "Inscrição realizada com sucesso!" : "Inscrição cancelada."
    );

    renderizarKPIs();
    aplicarFiltros();
}

/* =====================================================
   MODAL DE DETALHES
===================================================== */
let oportunidadeSelecionada = null;

function verDetalhes(id) {
    const op = oportunidadesData.find(o => o.id === id);
    if (!op) return;

    oportunidadeSelecionada = op;

    // Preenche os campos do modal
    document.getElementById("modal-titulo").textContent = op.titulo;
    document.getElementById("modal-status").innerHTML = `<span class="badge ${getBadgeClass(op.status)}">${op.status}</span>`;
    document.getElementById("modal-carga").textContent = `${op.carga} horas`;
    document.getElementById("modal-modalidade").textContent = op.modalidade || "Presencial";
    document.getElementById("modal-periodo").textContent = `${op.semestre}º Semestre / ${op.ano}`;
    document.getElementById("modal-vagas").textContent = op.vagas || "Ilimitadas";
    document.getElementById("modal-responsavel").textContent = op.responsavel || "A definir";
    document.getElementById("modal-descricao").textContent = op.descricao || "Sem descrição disponível.";

    // Atualiza botão de inscrição
    const btnInscricao = document.getElementById("modal-btn-inscricao");
    if (btnInscricao) {
        if (op.status === "Aberta") {
            btnInscricao.style.display = "block";
            btnInscricao.textContent = op.inscrito ? "Cancelar Inscrição" : "Inscrever-se";
            btnInscricao.className = op.inscrito ? "btn btn-danger" : "btn btn-primary";
        } else {
            btnInscricao.style.display = "none";
        }
    }

    // Abre o modal
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
   NAVEGAÇÃO
===================================================== */
window.irParaSolicitacoes = function () {
    const abas = document.querySelectorAll(".menu-item");
    const abaAlvo = Array.from(abas).find(aba => aba.textContent.includes("Solicitações"));
    if (abaAlvo) abaAlvo.click();
};

