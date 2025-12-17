import { getCertificacoes } from "../services/discente.service.js";

/* ===============================
   CARREGA VIEW
================================ */
export async function carregarCertificacoesDiscenteOfertante () {
    const res = await fetch("../../pages/discenteOfertante/certificacoes.html");
    return await res.text();
}

/* ===============================
   ATIVAÇÃO
================================ */
export async function ativarCertificacoesDiscenteOfertante () {
    const certificacoes = await getCertificacoes();
    renderizarCertificacoesOfertante (certificacoes);
}

/* ===============================
   RENDERIZA
================================ */
function renderizarCertificacoesOfertante (certificacoes) {
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


/*// MOCK de certificações
const certificacoesMock = [
    {
        nome: "Fulano de Tal",
        atividade: "Projeto Robótica",
        documento: { url: "#", hash: "123abc" },
        carga: "40h",
        situacao: "Concluído"
    },
    {
        nome: "Ciclano",
        atividade: "Extensão Quilombo",
        documento: { url: "#", hash: "456def" },
        carga: "60h",
        situacao: "Em andamento"
    },
    {
        nome: "Beltrano",
        atividade: "Pesquisa PIBEX",
        documento: { url: "#", hash: "789ghi" },
        carga: "20h",
        situacao: "Concluído"
    }
];

// Função para renderizar os mini cards
function renderizarCertificacoes() {
    const container = document.getElementById("certificacoes");
    if (!container) return;

    container.innerHTML = "";

    certificacoesMock.forEach(c => {
        const card = document.createElement("div");
        card.classList.add("certificacao-card");

        card.innerHTML = `
            <div>${c.nome}</div>
            <div>${c.atividade}</div>
            <div><a href="${c.documento.url}" target="_blank">PDF</a> - ${c.documento.hash}</div>
            <div>${c.carga}</div>
            <div>${c.situacao}</div>
        `;

        container.appendChild(card);
    });
}

// Função de ativação para o dashboard
export function ativarCertificacoesDiscente() {
    renderizarCertificacoes();
}

// Função para carregar HTML da aba (certificacoes.html)
export async function carregarCertificacoesDiscente() {
    const response = await fetch("../../pages/discenteOfertante/certificacoes.html");
    return await response.text();
}*/
