/* ====================================================================
   MÓDULO DE NOTIFICAÇÕES (ESTILO INSTITUCIONAL)
   ==================================================================== */

// MOCK: Dados (Mesma lógica, conteúdo ajustado)
let notificacoesDB = [
    {
        id: 1,
        tipo: "inscricao",
        titulo: "Nova Inscrição Pendente",
        mensagem: "O discente <strong>Carlos Souza</strong> solicitou inscrição no curso 'Introdução ao Python'.",
        data: "Hoje, 10:30",
        lida: false,
        acao: { texto: "Avaliar Inscrição", target: "inscricoes", idRef: 1 }
    },
    {
        id: 2,
        tipo: "frequencia",
        titulo: "Pendente: Frequência",
        mensagem: "A atividade 'Monitoria de Algoritmos' não possui registro há 15 dias.",
        data: "Ontem, 14:00",
        lida: false,
        acao: { texto: "Registrar Agora", target: "frequencia", idRef: 2 }
    },
    {
        id: 3,
        tipo: "oportunidade",
        titulo: "Proposta Devolvida",
        mensagem: "A coordenação devolveu 'Workshop IoT'. Motivo: Carga horária insuficiente.",
        data: "12/02/2025",
        lida: true,
        acao: { texto: "Corrigir Proposta", target: "oportunidades", idRef: 3 }
    },
    {
        id: 4,
        tipo: "sistema",
        titulo: "Comunicado Institucional",
        mensagem: "Manutenção programada para o dia 25/02 das 00h às 06h.",
        data: "10/02/2025",
        lida: true,
        acao: null
    }
];

export async function carregarViewNotificacoes() {
    try {
        const response = await fetch('../../pages/docente/notificacoes.html');
        return await response.text();
    } catch (e) { return "Erro ao carregar módulo."; }
}

export function initNotificacoes() {
    filtrarNotificacoes('todas');
    atualizarContadorBadge();
}

/* ====================================================
   RENDERIZAÇÃO
   ==================================================== */
window.filtrarNotificacoes = (filtro) => {
    const container = document.getElementById("lista-notificacoes");
    
    // Atualiza botões
    document.querySelectorAll(".btn-filter").forEach(btn => btn.classList.remove("active"));
    if(filtro === 'todas') document.getElementById("filtro-todas").classList.add("active");
    if(filtro === 'nao_lida') document.getElementById("filtro-nao-lidas").classList.add("active");
    if(filtro === 'acao') document.getElementById("filtro-pendencias").classList.add("active");

    const filtrados = notificacoesDB.filter(n => {
        if (filtro === 'todas') return true;
        if (filtro === 'nao_lida') return !n.lida;
        if (filtro === 'acao') return n.acao !== null && !n.lida;
        return true;
    });

    if (filtrados.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 50px; color: #aaa;">
                <div style="font-size: 32px; margin-bottom: 10px; opacity: 0.4;">📭</div>
                <p>Nenhuma notificação encontrada.</p>
            </div>`;
        return;
    }

    container.innerHTML = filtrados.map(n => {
        // Mapeamento de Ícones e Cores Institucionais
        let iconClass = "icon-neutro";
        let iconSymbol = "ℹ️";

        if (n.tipo === "inscricao") { iconClass = "icon-institucional"; iconSymbol = "👤"; } // Bordô
        if (n.tipo === "frequencia") { iconClass = "icon-alerta"; iconSymbol = "⏱️"; }        // Amarelo
        if (n.tipo === "oportunidade") { iconClass = "icon-sucesso"; iconSymbol = "📄"; }     // Verde
        if (n.tipo === "sistema") { iconClass = "icon-neutro"; iconSymbol = "📢"; }           // Cinza

        const unreadClass = !n.lida ? "notif-unread" : "";
        
        let actionHTML = "";
        if (n.acao) {
            actionHTML = `
                <button class="btn-notif-action" onclick="executarAcaoNotificacao(${n.id}, '${n.acao.target}', ${n.acao.idRef})">
                    ${n.acao.texto} ➜
                </button>
            `;
        }

        return `
            <div class="notif-card ${unreadClass}" onclick="marcarComoLida(${n.id})">
                
                <div class="notif-icon-box ${iconClass}">
                    ${iconSymbol}
                </div>

                <div class="notif-content">
                    <div class="notif-header">
                        <span class="notif-title">${n.titulo}</span>
                        <span class="notif-time">${n.data}</span>
                    </div>
                    <p class="notif-msg">${n.mensagem}</p>
                    ${actionHTML}
                </div>

                ${!n.lida ? `<div style="width: 8px; height: 8px; background: #d4a017; border-radius: 50%; margin-top: 5px;" title="Não lida"></div>` : ''}
            </div>
        `;
    }).join("");
};

// ... Funções de Ação (executarAcaoNotificacao, marcarComoLida, etc.) mantidas iguais ...
// (Reutilize o bloco de funções do código anterior)

window.executarAcaoNotificacao = (idNotificacao, target, idRef) => {
    marcarComoLida(idNotificacao, false);
    if (target === "inscricoes" && window.navegarParaInscricoes) window.navegarParaInscricoes(idRef);
    else if (target === "frequencia" && window.navegarParaFrequencia) window.navegarParaFrequencia(idRef);
    else if (target === "oportunidades") {
        const aba = Array.from(document.querySelectorAll(".menu-item")).find(el => el.textContent.includes("Oportunidades"));
        if (aba) aba.click();
    }
};

window.marcarComoLida = (id, render = true) => {
    const notif = notificacoesDB.find(n => n.id === id);
    if (notif && !notif.lida) {
        notif.lida = true;
        if (render) filtrarNotificacoes('todas'); 
        atualizarContadorBadge();
    }
};

window.marcarTodasComoLidas = () => {
    notificacoesDB.forEach(n => n.lida = true);
    filtrarNotificacoes('todas');
    atualizarContadorBadge();
    if(window.showToast) window.showToast("success", "Todas marcadas como lidas.");
};

function atualizarContadorBadge() {
    const naoLidas = notificacoesDB.filter(n => !n.lida).length;
    // Opcional: Atualizar badge no menu principal
}