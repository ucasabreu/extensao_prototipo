/* ====================================================================
   MÓDULO DE COMUNICADOS (COORDENADOR)
   Arquivo: assets/js/coordenador/comunicados.js
   Requisitos: RF042, RF043
   ==================================================================== */

// MOCK: Histórico de Comunicados
// Inclui status de erro para atender ao requisito de "Falha de envio"
let comunicadosDB = [
    {
        id: 1,
        data: "12/12/2025",
        titulo: "Prazo para Relatório Final UCE",
        mensagem: "Prezados, o prazo final para submissão é dia 20/12. Não haverá prorrogação.",
        publico: "Formandos",
        canais: ["Sistema", "Email"],
        status: "Enviado", // Sucesso total
        autor: "Coordenação"
    },
    {
        id: 2,
        data: "10/11/2025",
        titulo: "Abertura de Edital PIBEX",
        mensagem: "O edital para bolsas de extensão está aberto. Consultem o site da PROEC.",
        publico: "Todo o Curso",
        canais: ["Sistema", "Email"],
        status: "Falha Parcial", // Simulação de erro (RF043)
        detalheErro: "5 emails retornaram (caixa cheia)",
        autor: "Coordenação"
    },
    {
        id: 3,
        data: "01/11/2025",
        titulo: "Manutenção no SIGAA",
        mensagem: "Sistema ficará indisponível no final de semana.",
        publico: "Institucional",
        canais: ["Sistema"],
        status: "Recebido", // Vindo da Reitoria
        autor: "Reitoria / TI"
    }
];

let abaAtual = 'enviados'; // 'enviados' ou 'recebidos'

export async function carregarViewComunicados() {
    try {
        const response = await fetch('../../pages/coordenador_curso/comunicados.html');
        return await response.text();
    } catch (error) {
        console.error("Erro view comunicados:", error);
        return "Erro ao carregar módulo.";
    }
}

export function initComunicados() {
    renderizarTabelaComunicados();
}

/* =======================
   LÓGICA DE RENDERIZAÇÃO
   ======================= */

window.renderizarTabelaComunicados = () => {
    const tbody = document.getElementById("tb-comunicados");
    if(!tbody) return;

    const termo = document.getElementById("buscaComunicado").value.toLowerCase();
    
    // Filtra por aba (Enviados x Recebidos) e Busca
    const filtrados = comunicadosDB.filter(c => {
        // Lógica da Aba
        let pertenceAba = false;
        if (abaAtual === 'enviados') pertenceAba = c.autor === "Coordenação";
        if (abaAtual === 'recebidos') pertenceAba = c.autor !== "Coordenação";

        // Lógica da Busca
        const matchTexto = c.titulo.toLowerCase().includes(termo);

        return pertenceAba && matchTexto;
    });

    if (filtrados.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" align="center" style="padding:20px; color:#666;">Nenhum registro encontrado nesta categoria.</td></tr>`;
        return;
    }

    tbody.innerHTML = filtrados.map(c => {
        // Badges de Status
        let badgeStatus = `<span class="badge badge-success">Enviado</span>`;
        if (c.status === "Falha Parcial") badgeStatus = `<span class="badge badge-danger" title="${c.detalheErro}">⚠️ Falha Parcial</span>`;
        if (c.status === "Recebido") badgeStatus = `<span class="badge badge-info">Recebido</span>`;

        // Formata canais
        const canaisStr = c.canais.join(" + ");

        return `
            <tr>
                <td>${c.data}</td>
                <td><strong>${c.titulo}</strong></td>
                <td>${c.publico}</td>
                <td>${canaisStr}</td>
                <td>${badgeStatus}</td>
                <td class="actions">
                    <button class="btn-small btn-small-secondary" onclick="verDetalheComunicado(${c.id})">Ler</button>
                </td>
            </tr>
        `;
    }).join("");
};

/* =======================
   AÇÕES (ENVIO E VISUALIZAÇÃO)
   ======================= */

// Enviar Comunicado (RF043)
window.enviarComunicado = () => {
    const titulo = document.getElementById("comTitulo").value;
    const mensagem = document.getElementById("comMensagem").value;
    const destinoSelect = document.getElementById("comDestino");
    const destinoTexto = destinoSelect.options[destinoSelect.selectedIndex].text;
    const enviaEmail = document.getElementById("chkEmail").checked;

    if (!titulo || !mensagem) {
        alert("Preencha o título e a mensagem.");
        return;
    }

    // Mock de Envio
    const canais = ["Sistema"];
    if (enviaEmail) canais.push("Email");

    comunicadosDB.unshift({
        id: Date.now(),
        data: new Date().toLocaleDateString(),
        titulo: titulo,
        mensagem: mensagem,
        publico: destinoTexto,
        canais: canais,
        status: "Enviado", // Sucesso por padrão no mock
        autor: "Coordenação"
    });

    fecharModalC("modalNovoComunicado");
    
    // Força a aba para "Enviados" e atualiza
    window.filtrarTipoComunicado('enviados');
    
    if(window.showToast) showToast("success", "Comunicado enviado com sucesso para " + destinoTexto);
};

// Ver Detalhes (Modal de Leitura)
window.verDetalheComunicado = (id) => {
    const c = comunicadosDB.find(x => x.id === id);
    if (!c) return;

    let alertaErro = "";
    if (c.status === "Falha Parcial") {
        alertaErro = `<div class="alert alert-danger" style="margin-bottom:15px;">
            <strong>Erro no envio:</strong> ${c.detalheErro}.<br>
            <a href="#" style="text-decoration:underline; font-weight:bold;">Reenviar para pendentes</a>
        </div>`;
    }

    const html = `
        ${alertaErro}
        <div style="margin-bottom:15px; border-bottom:1px solid #ddd; padding-bottom:10px;">
            <h3 style="color:#5d0b0b; margin:0;">${c.titulo}</h3>
            <div style="font-size:12px; color:#666; margin-top:5px;">
                Data: ${c.data} | Destino: ${c.publico} | Via: ${c.canais.join(", ")}
            </div>
        </div>
        <div style="background:#f9f9f9; padding:15px; border-radius:8px; line-height:1.5;">
            ${c.mensagem}
        </div>
    `;

    document.getElementById("corpoDetalheComunicado").innerHTML = html;
    document.getElementById("modalDetalheComunicado").style.display = "flex";
};

// Controle de Abas
window.filtrarTipoComunicado = (tipo) => {
    abaAtual = tipo;
    
    // Atualiza botões
    const btnEnviados = document.getElementById("btnTabEnviados");
    const btnRecebidos = document.getElementById("btnTabRecebidos");
    
    if (tipo === 'enviados') {
        btnEnviados.className = "btn btn-secondary active-tab-btn";
        btnRecebidos.className = "btn btn-ghost";
    } else {
        btnEnviados.className = "btn btn-ghost";
        btnRecebidos.className = "btn btn-secondary active-tab-btn";
    }

    renderizarTabelaComunicados();
};

// Utilitários
window.abrirModalComunicado = () => document.getElementById("modalNovoComunicado").style.display = "flex";
window.fecharModalC = (id) => document.getElementById(id).style.display = "none";