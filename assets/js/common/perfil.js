/* ====================================================================
   MOTOR DE PERFIL GERAL (ATUALIZADO COM ABAS OBRIGATÓRIAS)
   Arquivo: assets/js/common/perfil.js
   ==================================================================== */

let currentStrategy = null;
let abasConfig = [];

// Carrega o HTML base
export async function carregarViewPerfil() {
    try {
        const response = await fetch('../../pages/common/perfil.html');
        return await response.text();
    } catch (e) { return "<h3>Erro ao carregar perfil.</h3>"; }
}

export function initPerfil(strategy) {
    if (!strategy) return console.error("Estratégia não fornecida!");
    currentStrategy = strategy;

    // 1. Popula Sidebar
    const header = strategy.getHeaderData();
    document.getElementById("p-nome").textContent = header.nome;
    document.getElementById("p-email").textContent = header.email;
    document.getElementById("p-matricula").textContent = header.matricula;
    document.getElementById("p-avatar").textContent = header.avatar;

    // 2. Monta Abas
    montarAbas();

    // 3. Renderiza Botões
    renderizarBotoesAbas();

    // 4. Ativa a primeira
    ativarAba(abasConfig[0].id);
}

function montarAbas() {
    // === ABAS PADRÃO (GLOBAL) ===
    // Definimos aqui as funções de preenchimento (fillData) para cada uma
    const abasPadrao = [
        { id: "editar", label: "Editar Dados", templateId: "tpl-editar", fillData: preencherEditar },
        { 
            id: "configuracoes",
            label: "Configurações",
            templateId: "tpl-configuracoes",
            fillData: preencherConfiguracoes
        }
    ];


    if (currentStrategy.getVinculosData) {
        abasPadrao.push({
            id: "vinculos",
            label: "Vínculos",
            templateId: "tpl-vinculos",
            fillData: preencherVinculos
        });
    }

    if (currentStrategy.getComunicados) {
        abasPadrao.push({
            id: "comunicacao",
            label: "Avisos",
            templateId: "tpl-comunicacao",
            fillData: preencherComunicacao
        });
    }

    if (currentStrategy.getHistorico) {
        abasPadrao.push({
            id: "historico",
            label: "Auditoria",
            templateId: "tpl-historico",
            fillData: preencherHistorico
        });
    }

    // Abas Específicas da Estratégia (inseridas na posição 1, após Editar)
    const abasExtras = currentStrategy.getExtraTabs ? currentStrategy.getExtraTabs() : [];

    abasConfig = [...abasPadrao];
    if (abasExtras.length > 0) {
        abasConfig.splice(1, 0, ...abasExtras);
    }
}

// ... (renderizarBotoesAbas e ativarAba mantidos iguais ao anterior) ...
function renderizarBotoesAbas() {
    const container = document.getElementById("perfil-tabs-container");
    container.innerHTML = "";
    abasConfig.forEach(aba => {
        const btn = document.createElement("button");
        btn.className = "tab-btn";
        btn.id = `btn-${aba.id}`;
        btn.textContent = aba.label;
        btn.onclick = () => ativarAba(aba.id);
        container.appendChild(btn);
    });
}

function ativarAba(id) {
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    document.getElementById(`btn-${id}`).classList.add("active");

    const containerPanes = document.getElementById("perfil-panes-container");
    containerPanes.innerHTML = "";

    const config = abasConfig.find(a => a.id === id);
    const template = document.getElementById(config.templateId);

    if (template) {
        const clone = template.content.cloneNode(true);
        if (config.fillData) config.fillData(clone);
        containerPanes.appendChild(clone);
    }
}

// === FUNÇÕES DE PREENCHIMENTO (Lógica que busca dados da estratégia) ===

function preencherEditar(clone) {
    const dados = currentStrategy.getBasicData();
    const header = currentStrategy.getHeaderData();
    clone.getElementById("edit-nome").value = header.nome;
    clone.getElementById("edit-email").value = header.email;
    clone.getElementById("edit-telefone").value = dados.telefone;
    clone.getElementById("edit-endereco").value = dados.endereco;
}

function preencherVinculos(clone) {
    // Busca dados específicos da estratégia (Docente ou Coordenador)
    const dados = currentStrategy.getVinculosData ? currentStrategy.getVinculosData() : {};

    clone.getElementById("vinc-status").textContent = dados.status || "-";
    clone.getElementById("vinc-data").textContent = dados.desde || "-";
    clone.getElementById("vinc-papel").value = dados.papel || "-";
    clone.getElementById("vinc-unidade").value = dados.unidade || "-";

    const ul = clone.getElementById("vinc-lista-grupos");
    if (ul && dados.grupos) {
        dados.grupos.forEach(g => {
            const li = document.createElement("li");
            li.textContent = g;
            ul.appendChild(li);
        });
    }
}

function preencherComunicacao(clone) {
    // Se a estratégia não tiver comunicados, usa lista vazia
    const msgs = currentStrategy.getComunicados ? currentStrategy.getComunicados() : [];
    const lista = clone.getElementById("lista-comunicados");

    if (msgs.length === 0) {
        lista.innerHTML = "<div style='padding:20px; text-align:center; color:#999'>Nenhum comunicado recente.</div>";
        return;
    }

    msgs.forEach(c => {
        lista.innerHTML += `
            <div class="comunicado-card">
                <div class="comunicado-header"><strong>${c.origem}</strong> <span>${c.data}</span></div>
                <span class="comunicado-title">${c.titulo}</span>
                <p style="margin:0; font-size:13px;">${c.msg}</p>
            </div>`;
    });
}

function preencherHistorico(clone) {
    const logs = currentStrategy.getHistorico ? currentStrategy.getHistorico() : [];
    const lista = clone.getElementById("lista-auditoria");

    if (logs.length === 0) {
        lista.innerHTML = "<li>Sem histórico recente.</li>";
        return;
    }

    logs.forEach(log => {
        lista.innerHTML += `
            <li class="timeline-item">
                <span class="timeline-date">${log.data}</span>
                <div class="timeline-content">
                    <strong>${log.acao}</strong>
                    ${log.detalhe ? `<br><span style="opacity:0.8">${log.detalhe}</span>` : ''}
                </div>
            </li>`;
    });
}

window.fecharPerfilVoltar = () => location.reload();
window.salvarPerfilGeral = () => { if (window.showToast) window.showToast("success", "Salvo!"); };


function preencherConfiguracoes(clone) {

    // Preferências
    const prefTpl = document.getElementById("tpl-preferencias");
    if (prefTpl) {
        clone.querySelector("#cfg-preferencias")
             .appendChild(prefTpl.content.cloneNode(true));
    }

    // Acessibilidade
    const acessTpl = document.getElementById("tpl-acessibilidade");
    if (acessTpl) {
        clone.querySelector("#cfg-acessibilidade")
             .appendChild(acessTpl.content.cloneNode(true));
    }

    // Segurança
    const segTpl = document.getElementById("tpl-seguranca");
    if (segTpl) {
        clone.querySelector("#cfg-seguranca")
             .appendChild(segTpl.content.cloneNode(true));
    }
}
