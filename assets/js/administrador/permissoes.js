/* ===================================================
   PERMISSÕES - ADMINISTRADOR
=================================================== */

// ===============================
// MOCKS - SOLICITAÇÕES
// ===============================

let solicitacoesDB = [
    {
        id: 1,
        nome: "João Pereira",
        matricula: "202312345",
        curso: "Ciência da Computação"
    },
    {
        id: 2,
        nome: "Maria Santos",
        matricula: "202311111",
        curso: "Engenharia"
    }
    
];


let permissoesDB = [
    {
        id: 1,
        nome: "Prof. Carlos Almeida",
        perfil: "Coordenador",
        modulo: "Projetos",
        acesso: "Permitido"
    },
    {
        id: 2,
        nome: "Profa. Juliana Costa",
        perfil: "Docente",
        modulo: "Projetos",
        acesso: "Bloqueado"
    }
];

let permissaoEmEdicao = null;
// ===============================
// DIScentes
// ===============================

let discentesDB = [
    {
        nome: "Ana Oliveira",
        matricula: "202300001",
        tipo: "Discente",
        status: "Ativo"
    }
];

// ===============================
// LOG DE DECISÕES
// ===============================

let logDecisoes = [];

// ===============================
// CARREGA HTML
// ===============================

export async function carregarViewPermissoes() {
    const response = await fetch("../../pages/administrador/permissoes.html");
    return await response.text();
}

// ===============================
// INIT
// ===============================

export function initPermissoes() {
    console.log("[ADMIN] Módulo Permissões iniciado");
    renderPerfis();
    renderSolicitacoes();
    renderLog();
    renderDiscentes();
}


// ===============================
// RENDER SOLICITAÇÕES
// ===============================

function renderSolicitacoes() {
    const tbody = document.getElementById("tabela-solicitacoes");
    if (!tbody) return;

    if (solicitacoesDB.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align:center">
                    Nenhuma solicitação pendente
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = solicitacoesDB.map(s => `
        <tr>
            <td>${s.nome}</td>
            <td>${s.matricula}</td>
            <td>${s.curso}</td>
            <td>
                <span class="badge badge-warning">Pendente</span>
            </td>
            <td class="actions">
                <button class="btn-small btn-small-success"
                        onclick="window.aprovarSolicitacao(${s.id})">
                    Aprovar
                </button>
                <button class="btn-small btn-small-danger"
                        onclick="window.negarSolicitacao(${s.id})">
                    Negar
                </button>
            </td>
        </tr>
    `).join("");
}

// ===============================
// RENDER LOG
// ===============================

function renderLog() {
    const tbody = document.getElementById("tabela-log");
    if (!tbody) return;

    if (logDecisoes.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="3" style="text-align:center">
                    Nenhuma decisão registrada
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = logDecisoes.map(l => `
        <tr>
            <td>${l.nome}</td>
            <td>${l.matricula}</td>
            <td>
                <span class="badge ${l.decisao === "Aprovado"
                    ? "badge-success"
                    : "badge-danger"}">
                    ${l.decisao}
                </span>
            </td>
        </tr>
    `).join("");
}
// ===============================
// RENDER DISCENTES
// ===============================

function renderDiscentes() {
    const tbody = document.getElementById("tabela-discentes");
    if (!tbody) return;

    if (discentesDB.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" style="text-align:center">
                    Nenhum discente cadastrado
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = discentesDB.map(d => `
        <tr>
            <td>${d.nome}</td>
            <td>${d.matricula}</td>
            <td>${d.tipo}</td>
            <td>
                <span class="badge badge-success">${d.status}</span>
            </td>
        </tr>
    `).join("");
}
// ===============================
// RENDER PERFIS / PERMISSÕES
// ===============================

function renderPerfis() {
    const tbody = document.getElementById("tabela-perfis");
    if (!tbody) return;

    tbody.innerHTML = permissoesDB.map(p => `
        <tr>
            <td>${p.nome}</td>
            <td>${p.perfil}</td>
            <td>${p.modulo}</td>
            <td>
                <span class="badge ${
                    p.acesso === "Permitido"
                        ? "badge-success"
                        : "badge-danger"
                }">
                    ${p.acesso}
                </span>
            </td>
            <td>
                <button class="btn-small btn-small-info"
                        onclick="window.editarPermissao(${p.id})">
                    Editar
                </button>
            </td>
        </tr>
    `).join("");
}

// ===============================
// EDITAR PERMISSÃO
// ===============================

window.editarPermissao = function (id) {
    const p = permissoesDB.find(x => x.id === id);
    if (!p) return;

    permissaoEmEdicao = p;

    document.getElementById("edit-perfil").value = p.perfil;
    document.getElementById("edit-modulo").value = p.modulo;
    document.getElementById("edit-acesso").value = p.acesso;

    document.getElementById("modal-editar-permissao").style.display = "flex";
};

window.fecharModalPermissao = function () {
    document.getElementById("modal-editar-permissao").style.display = "none";
    permissaoEmEdicao = null;
};

window.salvarPermissao = function () {
    if (!permissaoEmEdicao) return;

    permissaoEmEdicao.perfil =
        document.getElementById("edit-perfil").value;

    permissaoEmEdicao.modulo =
        document.getElementById("edit-modulo").value;

    permissaoEmEdicao.acesso =
        document.getElementById("edit-acesso").value;

    fecharModalPermissao();
    renderPerfis();
};


// ===============================
// AÇÕES GLOBAIS
// ===============================

window.aprovarSolicitacao = function (id) {
    const s = solicitacoesDB.find(x => x.id === id);
    if (!s) return;

    // Log
    logDecisoes.push({
        nome: s.nome,
        matricula: s.matricula,
        decisao: "Aprovado"
    });

    // Promove para Discente Ofertante
    discentesDB.push({
        nome: s.nome,
        matricula: s.matricula,
        tipo: "Discente Ofertante",
        status: "Ativo"
    });

    // Remove da fila
    solicitacoesDB = solicitacoesDB.filter(x => x.id !== id);

    renderSolicitacoes();
    renderLog();
    renderDiscentes();
};


window.negarSolicitacao = function (id) {
    const s = solicitacoesDB.find(x => x.id === id);
    if (!s) return;

    logDecisoes.push({
        nome: s.nome,
        matricula: s.matricula,
        decisao: "Negado"
    });

    solicitacoesDB = solicitacoesDB.filter(x => x.id !== id);

    renderSolicitacoes();
    renderLog();
};
