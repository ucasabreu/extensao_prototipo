import { getCertificacoes } from "../services/discente.service.js";

/* =====================================================
   ESTADO LOCAL
===================================================== */
let certificacoesData = [];
let certificacaoSelecionada = null;
const META_HORAS = 360;

/* =====================================================
   CARREGA VIEW
===================================================== */
export async function carregarCertificacoesDiscenteOfertante() {
    const res = await fetch("./certificacoes.html");
    return await res.text();
}

/* =====================================================
   ATIVACAO
===================================================== */
export async function ativarCertificacoesDiscenteOfertante() {
    certificacoesData = await getCertificacoes();

    renderizarKPIs();
    renderizarProgressoMeta();
    bindFiltros();
    aplicarFiltros();
}

/* =====================================================
   KPIS
===================================================== */
function renderizarKPIs() {
    const horasConcluidas = certificacoesData
        .filter(c => c.status === "Aprovada")
        .reduce((acc, c) => acc + (c.carga || 0), 0);

    const certificados = certificacoesData.filter(c => c.status === "Aprovada").length;
    const emAnalise = certificacoesData.filter(c => c.status === "Em análise" || c.status === "Em analise").length;
    const progresso = Math.min(100, Math.round((horasConcluidas / META_HORAS) * 100));

    const elHoras = document.getElementById("kpi-horas-concluidas");
    const elCertificados = document.getElementById("kpi-certificados");
    const elEmAnalise = document.getElementById("kpi-em-analise");
    const elMeta = document.getElementById("kpi-meta");
    const elMetaTexto = document.getElementById("kpi-meta-texto");

    if (elHoras) elHoras.textContent = `${horasConcluidas}h`;
    if (elCertificados) elCertificados.textContent = certificados;
    if (elEmAnalise) elEmAnalise.textContent = emAnalise;
    if (elMeta) elMeta.textContent = `${progresso}%`;
    if (elMetaTexto) {
        if (progresso >= 100) {
            elMetaTexto.textContent = "Meta atingida!";
            elMetaTexto.className = "kpi-sub kpi-positive";
        } else {
            elMetaTexto.textContent = `Faltam ${META_HORAS - horasConcluidas}h`;
        }
    }
}

/* =====================================================
   PROGRESSO DA META
===================================================== */
function renderizarProgressoMeta() {
    const horasConcluidas = certificacoesData
        .filter(c => c.status === "Aprovada")
        .reduce((acc, c) => acc + (c.carga || 0), 0);

    const progresso = Math.min(100, Math.round((horasConcluidas / META_HORAS) * 100));

    const elValor = document.getElementById("progresso-valor");
    const elFill = document.getElementById("progresso-fill");

    if (elValor) elValor.textContent = `${horasConcluidas} / ${META_HORAS} horas`;
    if (elFill) elFill.style.width = `${progresso}%`;
}

/* =====================================================
   FILTROS
===================================================== */
function bindFiltros() {
    document.getElementById("pesquisa-certificacao")?.addEventListener("input", aplicarFiltros);
    document.getElementById("filtro-status-cert")?.addEventListener("change", aplicarFiltros);
}

function aplicarFiltros() {
    const texto = document.getElementById("pesquisa-certificacao")?.value?.toLowerCase() || "";
    const status = document.getElementById("filtro-status-cert")?.value;

    let filtradas = certificacoesData;

    if (texto) {
        filtradas = filtradas.filter(c => c.nome.toLowerCase().includes(texto));
    }
    if (status) {
        filtradas = filtradas.filter(c => c.status === status);
    }

    renderizarCertificacoes(filtradas);
}

/* =====================================================
   RENDERIZACAO
===================================================== */
function renderizarCertificacoes(lista) {
    const container = document.getElementById("lista-certificacoes");
    const totalEl = document.getElementById("total-certificacoes");

    if (!container) return;

    if (totalEl) {
        totalEl.textContent = `${lista.length} certificado${lista.length !== 1 ? "s" : ""}`;
    }

    if (!lista.length) {
        container.innerHTML = `
            <div class="certificacoes-vazio">
                <div class="icon">C</div>
                <p>Nenhuma certificacao encontrada.</p>
                <p style="margin-top: 8px; font-size: 12px;">Conclua atividades para obter certificados.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = lista.map(c => {
        const statusClass = c.status === "Aprovada" ? "aprovada" : "analise";
        const icon = c.status === "Aprovada" ? "OK" : "A";
        const statusBadge = c.status === "Aprovada" ? "badge-success" : "badge-warning";

        return `
            <div class="certificacao-card ${statusClass}" onclick="abrirModalCertificacao(${c.id})">
                <div class="certificacao-card-header">
                    <div class="certificacao-icon ${statusClass}">${icon}</div>
                    <div class="certificacao-info">
                        <div class="certificacao-nome">${c.nome}</div>
                        <div class="certificacao-provedor">${c.provedor}</div>
                    </div>
                </div>
                <div class="certificacao-card-body">
                    <div class="certificacao-horas">
                        ${c.carga}h <small>de extensao</small>
                    </div>
                    <div class="certificacao-acoes">
                        <span class="badge ${statusBadge}">${c.status}</span>
                    </div>
                </div>
            </div>
        `;
    }).join("");
}

/* =====================================================
   MODAL DE DETALHES
===================================================== */
window.abrirModalCertificacao = function (id) {
    const c = certificacoesData.find(cert => cert.id === id);
    if (!c) return;

    certificacaoSelecionada = c;

    document.getElementById("modal-cert-titulo").textContent = c.nome;
    document.getElementById("modal-cert-atividade").textContent = c.nome;
    document.getElementById("modal-cert-provedor").textContent = c.provedor;
    document.getElementById("modal-cert-carga").textContent = `${c.carga} horas`;
    document.getElementById("modal-cert-status").innerHTML =
        `<span class="badge ${c.status === "Aprovada" ? "badge-success" : "badge-warning"}">${c.status}</span>`;

    const icon = c.status === "Aprovada" ? "OK" : "A";
    document.getElementById("modal-cert-icon").textContent = icon;

    const statusBadge = document.getElementById("modal-cert-status-badge");
    statusBadge.textContent = c.status === "Aprovada" ? "Certificado disponivel" : "Aguardando validacao";
    statusBadge.className = `certificacao-status-badge ${c.status === "Aprovada" ? "aprovada" : "analise"}`;

    const btnDownload = document.getElementById("modal-btn-download");
    if (btnDownload) {
        btnDownload.style.display = c.status === "Aprovada" ? "block" : "none";
    }

    document.getElementById("modalDetalhesCertificacao").style.display = "flex";
};

window.fecharModalCertificacao = function () {
    document.getElementById("modalDetalhesCertificacao").style.display = "none";
    certificacaoSelecionada = null;
};

window.baixarCertificado = function () {
    if (!certificacaoSelecionada) return;

    mostrarToast("success", `Certificado de "${certificacaoSelecionada.nome}" baixado com sucesso!`);
    fecharModalCertificacao();
};

window.gerarHistorico = function () {
    mostrarToast("info", "Gerando historico completo de extensao...");
    setTimeout(() => {
        mostrarToast("success", "Historico gerado! Verifique seus downloads.");
    }, 1500);
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
