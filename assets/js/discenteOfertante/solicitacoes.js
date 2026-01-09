import { getOportunidades, getSolicitacoes } from "../services/discente.service.js";

/* =====================================================
   ESTADO LOCAL
===================================================== */
let oportunidadesData = [];
let solicitacoesData = [];
let filtroAtual = "todas";
let solicitacaoSelecionada = null;

/* =====================================================
   CARREGA VIEW
===================================================== */
export async function carregarSolicitacoesDiscenteOfertante() {
    const res = await fetch("./solicitacoes.html");
    return await res.text();
}

/* =====================================================
   ATIVACAO
===================================================== */
export async function ativarSolicitacoesDiscenteOfertante() {
    oportunidadesData = await getOportunidades();
    solicitacoesData = await getSolicitacoes();

    renderizarKPIs();
    bindTabs();
    aplicarFiltro("todas");
}

/* =====================================================
   KPIS
===================================================== */
function renderizarKPIs() {
    const pendentes = solicitacoesData.filter(s => s.status === "Pendente" || s.status === "Em andamento").length;
    const aprovadas = solicitacoesData.filter(s => s.status === "Aceita" || s.status === "Aprovada").length;
    const recusadas = solicitacoesData.filter(s => s.status === "Recusada").length;
    const total = solicitacoesData.length;

    document.getElementById("kpi-pendentes")?.textContent && (document.getElementById("kpi-pendentes").textContent = pendentes);
    document.getElementById("kpi-aprovadas")?.textContent && (document.getElementById("kpi-aprovadas").textContent = aprovadas);
    document.getElementById("kpi-recusadas")?.textContent && (document.getElementById("kpi-recusadas").textContent = recusadas);
    document.getElementById("kpi-total")?.textContent && (document.getElementById("kpi-total").textContent = total);
}

/* =====================================================
   TABS
===================================================== */
function bindTabs() {
    document.querySelectorAll(".tab-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            aplicarFiltro(btn.dataset.tab);
        });
    });
}

function aplicarFiltro(tab) {
    filtroAtual = tab;
    let filtradas = solicitacoesData;

    if (tab === "pendentes") {
        filtradas = solicitacoesData.filter(s => s.status === "Pendente" || s.status === "Em andamento");
    } else if (tab === "aprovadas") {
        filtradas = solicitacoesData.filter(s => s.status === "Aceita" || s.status === "Aprovada");
    } else if (tab === "recusadas") {
        filtradas = solicitacoesData.filter(s => s.status === "Recusada");
    }

    renderizarSolicitacoes(filtradas);
}

/* =====================================================
   RENDERIZACAO
===================================================== */
function renderizarSolicitacoes(lista) {
    const container = document.getElementById("lista-solicitacoes");
    const totalEl = document.getElementById("total-solicitacoes");

    if (!container) return;

    if (totalEl) {
        totalEl.textContent = `${lista.length} resultado${lista.length !== 1 ? "s" : ""}`;
    }

    if (!lista.length) {
        container.innerHTML = `
            <div class="solicitacoes-vazio">
                <div class="icon">*</div>
                <p>Nenhuma solicitacao encontrada.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = lista.map(s => {
        const atividade = oportunidadesData.find(o => o.id === s.atividadeId);
        const statusClass = getStatusClass(s.status);
        const iconClass = getIconClass(s.status);
        const icon = getStatusIcon(s.status);

        return `
            <div class="solicitacao-card ${statusClass}" onclick="abrirModalSolicitacao(${s.id})">
                <div class="solicitacao-icon ${iconClass}">${icon}</div>
                <div class="solicitacao-content">
                    <div class="solicitacao-titulo">${atividade?.titulo || "Atividade desconhecida"}</div>
                    <div class="solicitacao-meta">
                        <span>CH ${atividade?.carga || 0}h</span>
                        <span>Data ${s.dataSolicitacao || "Sem data"}</span>
                    </div>
                </div>
                <div class="solicitacao-status">
                    <span class="badge ${getBadgeClass(s.status)}">${s.status}</span>
                    <span class="solicitacao-data">${s.dataAtualizacao || ""}</span>
                </div>
            </div>
        `;
    }).join("");
}

/* =====================================================
   HELPERS DE STATUS
===================================================== */
function getStatusClass(status) {
    if (status === "Pendente" || status === "Em andamento") return "status-pendente";
    if (status === "Aceita" || status === "Aprovada") return "status-aprovada";
    if (status === "Recusada") return "status-recusada";
    return "";
}

function getIconClass(status) {
    if (status === "Pendente" || status === "Em andamento") return "pendente";
    if (status === "Aceita" || status === "Aprovada") return "aprovada";
    if (status === "Recusada") return "recusada";
    return "";
}

function getStatusIcon(status) {
    if (status === "Pendente" || status === "Em andamento") return "P";
    if (status === "Aceita" || status === "Aprovada") return "OK";
    if (status === "Recusada") return "X";
    return "!";
}

function getBadgeClass(status) {
    if (status === "Pendente" || status === "Em andamento") return "badge-warning";
    if (status === "Aceita" || status === "Aprovada") return "badge-success";
    if (status === "Recusada") return "badge-danger";
    return "badge-info";
}

/* =====================================================
   MODAL DE DETALHES
===================================================== */
window.abrirModalSolicitacao = function (id) {
    const s = solicitacoesData.find(sol => sol.id === id);
    if (!s) return;

    solicitacaoSelecionada = s;
    const atividade = oportunidadesData.find(o => o.id === s.atividadeId);

    document.getElementById("modal-sol-titulo").textContent = atividade?.titulo || "Solicitacao";
    document.getElementById("modal-sol-atividade").textContent = atividade?.titulo || "-";
    document.getElementById("modal-sol-status").innerHTML = `<span class="badge ${getBadgeClass(s.status)}">${s.status}</span>`;
    document.getElementById("modal-sol-data").textContent = s.dataSolicitacao || "-";
    document.getElementById("modal-sol-carga").textContent = `${atividade?.carga || 0} horas`;

    renderizarTimeline(s.status);

    const parecerBox = document.getElementById("modal-parecer-box");
    if (s.parecer && s.status === "Recusada") {
        parecerBox.style.display = "block";
        document.getElementById("modal-sol-parecer").textContent = s.parecer;
    } else {
        parecerBox.style.display = "none";
    }

    const btnCancelar = document.getElementById("modal-btn-cancelar");
    const btnTentar = document.getElementById("modal-btn-tentar");

    btnCancelar.style.display = (s.status === "Pendente" || s.status === "Em andamento") ? "block" : "none";
    btnTentar.style.display = s.status === "Recusada" ? "block" : "none";

    document.getElementById("modalDetalhesSolicitacao").style.display = "flex";
};

function renderizarTimeline(status) {
    const timeline = document.getElementById("modal-timeline");
    if (!timeline) return;

    const steps = [
        { label: "Solicitacao", icon: "1" },
        { label: "Analise", icon: "2" },
        { label: "Resultado", icon: "3" }
    ];

    let stepStatus = ["completed", "current", ""];
    if (status === "Aceita" || status === "Aprovada") {
        stepStatus = ["completed", "completed", "completed"];
    } else if (status === "Recusada") {
        stepStatus = ["completed", "completed", "rejected"];
    }

    timeline.innerHTML = steps.map((step, i) => `
        <div class="timeline-step">
            <div class="timeline-dot ${stepStatus[i]}">${step.icon}</div>
            <span class="timeline-label">${step.label}</span>
        </div>
    `).join("");
}

window.fecharModalSolicitacao = function () {
    document.getElementById("modalDetalhesSolicitacao").style.display = "none";
    solicitacaoSelecionada = null;
};

window.cancelarSolicitacao = function () {
    if (!solicitacaoSelecionada) return;
    solicitacaoSelecionada.status = "Cancelada";
    mostrarToast("info", "Solicitacao cancelada.");
    fecharModalSolicitacao();
    renderizarKPIs();
    aplicarFiltro(filtroAtual);
};

/* =====================================================
   MODAL DE JUSTIFICATIVA (TENTAR NOVAMENTE)
===================================================== */
window.abrirModalJustificativa = function () {
    if (!solicitacaoSelecionada) return;

    const textarea = document.getElementById("input-justificativa");
    if (textarea) textarea.value = "";

    document.getElementById("modalJustificativa").style.display = "flex";
};

window.fecharModalJustificativa = function () {
    document.getElementById("modalJustificativa").style.display = "none";
};

window.enviarNovaJustificativa = function () {
    const textarea = document.getElementById("input-justificativa");
    const justificativa = textarea?.value?.trim();

    if (!justificativa) {
        mostrarToast("warning", "Por favor, preencha a justificativa.");
        return;
    }

    if (!solicitacaoSelecionada) return;

    solicitacaoSelecionada.status = "Pendente";
    solicitacaoSelecionada.justificativa = justificativa;
    solicitacaoSelecionada.dataSolicitacao = new Date().toLocaleDateString("pt-BR");

    mostrarToast("success", "Nova solicitacao enviada com sucesso!");

    fecharModalJustificativa();
    fecharModalSolicitacao();

    renderizarKPIs();
    aplicarFiltro(filtroAtual);
};

/* =====================================================
   TOAST
===================================================== */
function mostrarToast(tipo, mensagem) {
    if (window.showToast) {
        window.showToast(tipo, mensagem);
    } else {
        console.log(`[${tipo.toUpperCase()}] ${mensagem}`);
    }
}
