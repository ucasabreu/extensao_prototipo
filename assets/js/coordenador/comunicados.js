/* ====================================================================
   MÓDULO DE COMUNICADOS (COORDENADOR)
   Arquivo: assets/js/coordenador/comunicados.js
   Refatorado para usar: coordenador.service.js
   ==================================================================== */

// 1. IMPORTAÇÃO DO SERVICE
import { getComunicados, criarComunicado } from "../services/coordenador.service.js";

// 2. ESTADO LOCAL (Substitui o array fixo antigo)
let listaLocal = []; 
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

// 3. INIT AGORA É ASYNC (Para buscar dados)
export async function initComunicados() {
    // Busca dados do serviço antes de renderizar
    listaLocal = await getComunicados();
    renderizarTabelaComunicados();
}

/* =======================
   LÓGICA DE RENDERIZAÇÃO
   ======================= */

window.renderizarTabelaComunicados = () => {
    const tbody = document.getElementById("tb-comunicados");
    if(!tbody) return;

    const termoInput = document.getElementById("buscaComunicado");
    const termo = termoInput ? termoInput.value.toLowerCase() : "";
    
    // Filtra usando a listaLocal (que veio do Service)
    const filtrados = listaLocal.filter(c => {
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
        // Badges de Status (Mantido igual)
        let badgeStatus = `<span class="badge badge-success">Enviado</span>`;
        if (c.status === "Falha Parcial") badgeStatus = `<span class="badge badge-danger" title="${c.detalheErro || ''}">⚠️ Falha Parcial</span>`;
        if (c.status === "Recebido") badgeStatus = `<span class="badge badge-info">Recebido</span>`;

        // Formata canais
        const canaisStr = c.canais ? c.canais.join(" + ") : "-";

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

// Enviar Comunicado (Agora chama o Service)
window.enviarComunicado = async () => {
    const titulo = document.getElementById("comTitulo").value;
    const mensagem = document.getElementById("comMensagem").value;
    const destinoSelect = document.getElementById("comDestino");
    const destinoTexto = destinoSelect.options[destinoSelect.selectedIndex].text;
    const enviaEmail = document.getElementById("chkEmail").checked;

    if (!titulo || !mensagem) {
        alert("Preencha o título e a mensagem.");
        return;
    }

    const canais = ["Sistema"];
    if (enviaEmail) canais.push("Email");

    // Cria objeto temporário
    const novoComunicado = {
        data: new Date().toLocaleDateString(),
        titulo: titulo,
        mensagem: mensagem,
        publico: destinoTexto,
        canais: canais,
        status: "Enviado",
        autor: "Coordenação"
    };

    // 4. CHAMADA AO SERVICE
    try {
        await criarComunicado(novoComunicado); // Service salva e gera ID
        
        // Atualiza lista local com a versão mais recente
        listaLocal = await getComunicados();
        
        fecharModalC("modalNovoComunicado");
        
        // Força a aba para "Enviados" e atualiza
        window.filtrarTipoComunicado('enviados');
        
        if(window.showToast) showToast("success", "Comunicado enviado com sucesso para " + destinoTexto);

    } catch (e) {
        console.error(e);
        alert("Erro ao enviar comunicado.");
    }
};

// Ver Detalhes (Lê de listaLocal)
window.verDetalheComunicado = (id) => {
    // Busca na lista local atualizada
    const c = listaLocal.find(x => x.id === id);
    if (!c) return;

    let alertaErro = "";
    if (c.status === "Falha Parcial") {
        alertaErro = `<div class="alert alert-danger" style="margin-bottom:15px;">
            <strong>Erro no envio:</strong> ${c.detalheErro || 'Erro desconhecido'}.<br>
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

// Controle de Abas (Lógica visual inalterada)
window.filtrarTipoComunicado = (tipo) => {
    abaAtual = tipo;
    
    const btnEnviados = document.getElementById("btnTabEnviados");
    const btnRecebidos = document.getElementById("btnTabRecebidos");
    
    if (tipo === 'enviados') {
        if(btnEnviados) btnEnviados.className = "btn btn-secondary active-tab-btn";
        if(btnRecebidos) btnRecebidos.className = "btn btn-ghost";
    } else {
        if(btnEnviados) btnEnviados.className = "btn btn-ghost";
        if(btnRecebidos) btnRecebidos.className = "btn btn-secondary active-tab-btn";
    }

    renderizarTabelaComunicados();
};

// Utilitários
window.abrirModalComunicado = () => document.getElementById("modalNovoComunicado").style.display = "flex";
window.fecharModalC = (id) => document.getElementById(id).style.display = "none";