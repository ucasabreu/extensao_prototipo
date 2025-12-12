/* ======================================
   DASHBOARD DO DISCENTE - SCRIPT COMPLETO
====================================== */

// Dados simulados — depois podem vir da API
const oportunidadesMock = [
    {
        titulo: "Projeto de Robótica Educacional",
        carga: "40h",
        status: "Em andamento"
    },
    {
        titulo: "Extensão Comunitária - Quilombo",
        carga: "60h",
        status: "Concluído"
    },
    {
        titulo: "Pesquisa Institucional - PIBEX",
        carga: "20h",
        status: "Pendente"
    }
];

const progressoMock = [
    { nome: "Horas concluídas", valor: 70 },
    { nome: "Horas pendentes", valor: 30 }
];

/* ==========================
   RENDERIZA OPORTUNIDADES
========================== */
function carregarOportunidades() {
    const div = document.getElementById("cards-container");

    div.innerHTML = oportunidadesMock
        .map(op => `
            <div class="card-op">
                <h3>${op.titulo}</h3>
                <p><strong>Carga horária:</strong> ${op.carga}</p>
                <p><strong>Status:</strong> ${op.status}</p>
            </div>
        `)
        .join("");
}

/* ==========================
   RENDERIZA PROGRESSO
========================== */
function carregarProgresso() {
    const div = document.getElementById("progress-container");

    div.innerHTML = progressoMock
        .map(item => `
            <div class="progress-card">
                <h3>${item.nome}</h3>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${item.valor}%;"></div>
                </div>
            </div>
        `)
        .join("");
}

/* ==========================
   INICIALIZA A PÁGINA
========================== */
window.onload = () => {
    carregarOportunidades();
    carregarProgresso();
};
