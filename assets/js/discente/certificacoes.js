import { getCertificacoes } from "../services/discente.service.js";

/* ===============================
   CARREGA VIEW
================================ */
export async function carregarCertificacoesDiscente() {
    const res = await fetch("../../pages/discente/certificacoes.html");
    return await res.text();
}

/* ===============================
   ATIVAÇÃO
================================ */
export async function ativarCertificacoesDiscente() {
    const certificacoes = await getCertificacoes();
    renderizarCertificacoes(certificacoes);
}

/* ===============================
   RENDERIZA
================================ */
function renderizarCertificacoes(certificacoes) {
    const container = document.getElementById("certificacoes");
    if (!container) return;

    if (!certificacoes.length) {
        container.innerHTML =
            `<p class="certificacoes-vazio">Nenhuma certificação encontrada.</p>`;
        return;
    }

    container.innerHTML = certificacoes.map(c => `
        <div class="certificacao-card">
            <div>${c.nome}</div>
            <div>${c.provedor}</div>
            <div>
                <button class="btn btn-secondary btn-small">Baixar</button>
            </div>
            <div>${c.carga}h</div>
            <div>
                <span class="badge ${getBadgeClass(c.status)}">${c.status}</span>
            </div>
        </div>
    `).join("");
}

function getBadgeClass(status) {
    if (status === "Aprovada") return "badge-success";
    if (status === "Em análise") return "badge-warning";
    return "badge-info";
}
