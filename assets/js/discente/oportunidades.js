/* ===============================
   CARREGA VIEW
================================ */
export async function carregarOportunidadesDiscente() {
    const response = await fetch("../../pages/discente/oportunidades.html");
    return await response.text();
}

/* ===============================
   MOCKS – DADOS
================================ */
const oportunidadesMock = [
    {
        id: 1,
        titulo: "Projeto de Robótica Educacional",
        descricao: "Participação em atividades de robótica voltadas para ensino básico.",
        carga: "40h",
        status: "Aberta",
        modalidade: "Presencial",
        semestre: "1",
        ano: "2025",
        curso: "CC",
        inscrito: false
    },
    {
        id: 2,
        titulo: "Extensão Comunitária – Quilombo",
        descricao: "Atividades de apoio educacional e cultural em comunidades quilombolas.",
        carga: "60h",
        status: "Encerrada",
        modalidade: "Presencial",
        semestre: "2",
        ano: "2025",
        curso: "EC",
        inscrito: true
    },
    {
        id: 3,
        titulo: "Pesquisa Institucional – PIBEX",
        descricao: "Pesquisa acadêmica com bolsa de extensão PIBEX.",
        carga: "20h",
        status: "Aberta",
        modalidade: "Remota",
        semestre: "1",
        ano: "2026",
        curso: "CC",
        inscrito: false
    },
    {
        id: 2,
        titulo: "Monitoria voluntaria - Estrutura de dados 2",
        descricao: "Atuação como monitor voluntário na disciplina de Estrutura de Dados 2.",
        carga: "30h",
        status: "Aberta",
        modalidade: "Presencial",
        semestre: "2",
        ano: "2026",
        curso: "CC",
        inscrito: true
    }
];

/* ===============================
   FUNÇÃO DE RENDERIZAÇÃO
================================ */
function renderizarOportunidades() {
    const container = document.querySelector(".oportunidades-disponiveis");
    if (!container) return;

    container.innerHTML = ""; // limpa antes de renderizar

    oportunidadesMock.forEach(op => {
        const card = document.createElement("div");
        card.classList.add("card-op");

        card.innerHTML = `
            <strong>${op.titulo}</strong>
            <p><strong>Status:</strong> ${op.status}</p>
            <p><strong>Modalidade:</strong> ${op.modalidade}</p>

            <div class="card-botoes">
                <button class="btn-inscricao ${op.inscrito ? "cancelar" : "solicitar"}">
                    ${op.inscrito ? "Cancelar Inscrição" : "Solicitar Inscrição"}
                </button>
                <button class="btn-saiba-mais">Saiba Mais</button>
            </div>
        `;

        // Botão de inscrição
        const btn = card.querySelector(".btn-inscricao");
        btn.addEventListener("click", () => {
            op.inscrito = !op.inscrito;
            btn.textContent = op.inscrito ? "Cancelar Inscrição" : "Solicitar Inscrição";
            btn.classList.toggle("cancelar", op.inscrito);
            btn.classList.toggle("solicitar", !op.inscrito);
        });

        // Botão Saiba Mais
        const btnSaibaMais = card.querySelector(".btn-saiba-mais");
        btnSaibaMais.addEventListener("click", () => {
            abrirDetalhes(op);
        });

        container.appendChild(card);
    });
}

/* ===============================
   FUNÇÃO PARA MODAL DETALHES
================================ */
function abrirDetalhes(op) {
    const modal = document.createElement("div");
    modal.classList.add("modal-detalhes");

    modal.innerHTML = `
        <div class="modal-conteudo">
            <span class="fechar">&times;</span>
            <h2>${op.titulo}</h2>
            <p>${op.descricao}</p>
            <p><strong>Carga horária:</strong> ${op.carga}</p>
            <p><strong>Status:</strong> ${op.status}</p>
            <p><strong>Modalidade:</strong> ${op.modalidade}</p>
            <p><strong>Semestre:</strong> ${op.semestre || "-"}</p>
            <p><strong>Ano:</strong> ${op.ano || "-"}</p>
            <p><strong>Curso:</strong> ${op.curso || "-"}</p>
        </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector(".fechar").addEventListener("click", () => {
        modal.remove();
    });
}

/* ===============================
   FUNÇÃO DE ATIVAÇÃO
================================ */
export function ativarOportunidadesDiscente() {
    renderizarOportunidades();
    aplicarFiltros(); // se você já tiver a função
}
