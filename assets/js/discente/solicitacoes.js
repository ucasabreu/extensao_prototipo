export const solicitacoesMock = [
    { titulo: "Projeto Robótica", status: "Aceita", motivo: "" },
    { titulo: "Extensão Quilombo", status: "Recusada", motivo: "Documentação incompleta" },
    { titulo: "Pesquisa PIBEX", status: "Em andamento", motivo: "" }
];



export async function carregarSolicitacoesDiscente() {
    return await fetch("../../pages/discente/solicitacoes.html").then(r => r.text());
}

export function ativarSolicitacoesDiscente() {
    const aceitas = document.getElementById("aceitas");
    const recusadas = document.getElementById("recusadas");
    const andamento = document.getElementById("andamento");

    aceitas.innerHTML = "";
    recusadas.innerHTML = "";
    andamento.innerHTML = "";

    solicitacoesMock.forEach(s => {
        const card = document.createElement("div");
        card.classList.add("solicitacoes-card");
        card.innerHTML = `
            <div class="solicitacoes-card-status">${s.status}</div>
            <div class="solicitacoes-card-titulo">${s.titulo}</div>
            ${s.motivo ? `<div class="solicitacoes-card-motivo">Motivo: ${s.motivo}</div>` : ""}
        `;

        if (s.status === "Aceita") aceitas.appendChild(card);
        else if (s.status === "Recusada") recusadas.appendChild(card);
        else if (s.status === "Em andamento") andamento.appendChild(card);
    });
}
