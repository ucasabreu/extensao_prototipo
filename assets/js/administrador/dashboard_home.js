/* ===================================================
   VISÃO GERAL - ADMINISTRADOR
=================================================== */

// ===============================
// MOCKS - MÉTRICAS
// ===============================

const dashboardDB = {
    usuariosTotais: 42,
    discentesOfertantes: 8,
    solicitacoesPendentes: 3,
    projetos: 15
};

// ===============================
// CARREGA VIEW
// ===============================

export async function carregarViewVisaoGeral() {
    const response = await fetch("../../pages/administrador/dashboard_home.html");
    return await response.text();
}

// ===============================
// INIT
// ===============================

export function initVisaoGeral() {
    console.log("[ADMIN] Visão Geral carregada");
    renderIndicadores();
}

// ===============================
// RENDER INDICADORES
// ===============================

function renderIndicadores() {
    setValor("total-usuarios", dashboardDB.usuariosTotais);
    setValor("total-ofertantes", dashboardDB.discentesOfertantes);
    setValor("total-solicitacoes", dashboardDB.solicitacoesPendentes);
    setValor("total-projetos", dashboardDB.projetos);
}

function setValor(id, valor) {
    const el = document.getElementById(id);
    if (el) el.textContent = valor;
}
