/* =====================================================
   VALIDAÇÃO DE PLANOS DE ATIVIDADES - COORDENADOR
===================================================== */

// CORREÇÃO: Usar a mesma Store que o docente usa para salvar
import { oportunidadesStore } from "../services/domain/oportunidadesStore.js";
import { eventBus } from "../services/shared/eventBus.js";

/* =======================
   INIT
======================= */

export function initValidacaoPlanos() {
    // Inicializa a store correta
    oportunidadesStore.initStore();
    renderizarTabelaPlanos();

    // Ouve eventos de atualização da store principal
    eventBus.on("oportunidade:atualizada", () => {
        renderizarTabelaPlanos();
    });
}

/* =======================
   RENDERIZAÇÃO
======================= */

function renderizarTabelaPlanos() {
    const tbody = document.getElementById("tabela-validacao-planos");
    if (!tbody) return;

    const termo = document.getElementById("buscaPlanoInput")?.value?.toLowerCase() || "";
    const filtroStatus = document.getElementById("filtroPlanoStatus")?.value || "todos";

    // CORREÇÃO: Busca dados da store compartilhada
    const oportunidades = oportunidadesStore.getAll();

    const planos = oportunidades.filter(op => {
        // Só mostra se tiver um plano existenter
        if (!op.plano) return false;

        // Se o plano for rascunho, o coordenador não deve ver ainda
        if (op.plano.status === "rascunho") return false;

        const matchStatus =
            filtroStatus === "todos" || op.plano.status === filtroStatus;

        const matchTexto =
            op.titulo.toLowerCase().includes(termo) ||
            (op.proponenteNome || "").toLowerCase().includes(termo);

        return matchStatus && matchTexto;
    });

    tbody.innerHTML = planos.length
        ? planos.map(montarLinhaPlano).join("")
        : `
          <tr>
            <td colspan="6" style="text-align:center; padding: 40px; color: #999;">
              <div style="font-size: 24px; margin-bottom: 10px;">📭</div>
              Nenhum plano aguardando validação no momento.
            </td>
          </tr>`;
}

function montarLinhaPlano(op) {
    const badge = getBadgePlano(op.plano.status);

    return `
      <tr>
        <td><strong>${op.titulo}</strong></td>
        <td>${op.proponenteNome || "-"}</td>
        <td style="text-align: center;">${op.tipo}</td>
        <td style="text-align: center;">${op.ch}h</td>
        <td style="text-align: center;">
          <span class="badge ${badge.class}">
            ${badge.label}
          </span>
        </td>
        <td class="actions" style="text-align: center;">
          <button class="btn-small btn-small-info"
                  onclick="verDetalhesPlano(${op.id})">
            visualizar
          </button>
        </td>
      </tr>
    `;
}

/* =======================
   AÇÕES
======================= */

window.verDetalhesPlano = (id) => {
    // CORREÇÃO: Busca pela store correta
    const op = oportunidadesStore.getById(id);
    if (!op || !op.plano) return;

    const p = op.plano.conteudo;

    document.getElementById("conteudoValDetalhes").innerHTML = `
      <h4 style="margin-top:0">${op.titulo}</h4>
      <p><b>Docente:</b> ${op.proponenteNome} | <b>Tipo:</b> ${op.tipo} | <b>CH:</b> ${op.ch}h</p>
      <hr>
      <div style="max-height: 300px; overflow-y: auto;">
          <p><b>Objetivo Geral:</b><br> ${p.objGeral || "-"}</p>
          <p><b>Objetivos Específicos:</b><br> ${p.objEsp || "-"}</p>
          <p><b>Metodologia:</b><br> ${p.metodologia || "-"}</p>
          <p><b>Cronograma:</b><br> ${p.cronograma || "-"}</p>
          <p><b>Avaliação:</b><br> ${p.avaliacao || "-"}</p>
      </div>
    `;

    // Define botões baseados no status atual
    let botoes = '';
    if (op.plano.status === 'em_analise') {
        botoes = `
          <button class="btn-danger" onclick="devolverPlano(${id})">Devolver (Correção)</button>
          <button class="btn-success" onclick="aprovarPlano(${id})">Aprovar Plano</button>
        `;
    }

    document.getElementById("footerValDetalhes").innerHTML = `
      ${botoes}
      <button class="btn-outline" onclick="fecharModalVal('modalValDetalhes')">Fechar</button>
    `;

    document.getElementById("modalValDetalhes").style.display = "flex";
};

window.aprovarPlano = (id) => {
    const op = oportunidadesStore.getById(id);
    if (!op || !op.plano) return;

    // Atualiza o objeto plano
    const planoAtualizado = { ...op.plano, status: 'aprovado', parecer: null };
    
    // Persiste na store compartilhada
    oportunidadesStore.editar(id, { plano: planoAtualizado });

    alert("Plano aprovado com sucesso! As inscrições para esta atividade agora podem ser abertas.");
    fecharModalVal("modalValDetalhes");
    renderizarTabelaPlanos();
};

window.devolverPlano = (id) => {
    const motivo = prompt("Por favor, informe o motivo da devolução para o docente:");
    if (!motivo) return; // Cancelou

    const op = oportunidadesStore.getById(id);
    if (!op || !op.plano) return;

    // Atualiza status e adiciona parecer
    const planoAtualizado = { 
        ...op.plano, 
        status: 'devolvido', 
        parecer: motivo 
    };

    // Persiste na store compartilhada
    oportunidadesStore.editar(id, { plano: planoAtualizado });

    alert("Plano devolvido ao docente para correções.");
    fecharModalVal("modalValDetalhes");
    renderizarTabelaPlanos();
};

/* =======================
   FILTRAGEM
======================= */
window.filtrarPlanos = () => {
    renderizarTabelaPlanos();
};


/* =======================
   UTIL
======================= */

function getBadgePlano(status) {
    return {
        em_analise: { class: "badge-warning", label: "AGUARDANDO VALIDAÇÃO" },
        aprovado: { class: "badge-success", label: "APROVADO" },
        devolvido: { class: "badge-danger", label: "DEVOLVIDO" }
    }[status] || { class: "badge-neutral", label: status.toUpperCase() };
}