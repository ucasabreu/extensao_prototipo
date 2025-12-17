/* ====================================================================
   LÓGICA DE GESTORES (ADMINISTRADOR)
   Arquivo: assets/js/administrador/gestores.js
   Referência: RF 003 - Cadastro de Perfis de Gestão
   ==================================================================== */
let gestorEditandoId = null;

// Mock de Dados
let gestoresDB = [
    { id: 1, nome: "Ana Lima", email: "ana.lima@univ.edu.br", matricula: "SIAPE123", perfil: "Docente", status: "Ativo" },
    { id: 2, nome: "Carlos Silva", email: "carlos.silva@univ.edu.br", matricula: "SIAPE456", perfil: "Coordenador", status: "Ativo" },
    { id: 3, nome: "Mariana Souza", email: "mariana.s@univ.edu.br", matricula: "SIAPE789", perfil: "Secretária", status: "Pendente" }
];

// 1. Carrega HTML da View
export async function carregarViewGestores() {
    try {
        const response = await fetch('../../pages/administrador/gestores.html');
        return await response.text();
    } catch (error) {
        console.error("Erro view gestores:", error);
        return "<p>Erro ao carregar módulo de gestores.</p>";
    }
}

// 2. Inicialização (Chamado pelo Dashboard)
export function initGestores() {
    console.log("Iniciando Módulo Gestores...");
    renderizarTabela();

    const inputBusca = document.getElementById("busca-gestor");
    if (!inputBusca) return;

    inputBusca.addEventListener("input", () => {
        const termo = inputBusca.value.toLowerCase();

        const filtrados = gestoresDB.filter(g =>
            g.nome.toLowerCase().includes(termo) ||
            g.matricula.toLowerCase().includes(termo)
        );

        renderizarTabela(filtrados);
    });
}


// Funções Internas
function renderizarTabela(lista = gestoresDB) {
    const tbody = document.getElementById("tabela-gestores-corpo");
    if (!tbody) return;

    if (lista.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center">Nenhum gestor encontrado</td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = lista.map(g => `
        <tr>
            <td>${g.nome}</td>
            <td>${g.email}</td>
            <td>${g.matricula}</td>
            <td><span class="badge badge-neutral">${g.perfil}</span></td>
            <td>${g.status === 'Ativo'
                ? '<span class="badge badge-success">Ativo</span>'
                : '<span class="badge badge-warning">Pendente</span>'}
            </td>
            <td class="actions">
                <button class="btn-small btn-small-info" onclick="editarGestor(${g.id})">editar</button>
                <button class="btn-small btn-small-danger" onclick="removerGestor(${g.id})">excluir</button>
            </td>
        </tr>
    `).join("");
}

// Tornando funções globais para o onclick do HTML funcionar
window.novoGestor = () => {
    gestorEditandoId = null;
    document.getElementById("modal-titulo").innerText = "Novo Gestor";
    limparFormulario();
    abrirModal();
};


window.editarGestor = (id) => {
    const gestor = gestoresDB.find(g => g.id === id);
    if (!gestor) return;

    gestorEditandoId = id;
    document.getElementById("modal-titulo").innerText = "Editar Gestor";

    document.getElementById("gestor-nome").value = gestor.nome;
    document.getElementById("gestor-email").value = gestor.email;
    document.getElementById("gestor-matricula").value = gestor.matricula;
    document.getElementById("gestor-perfil").value = gestor.perfil;
    document.getElementById("gestor-status").value = gestor.status;

    abrirModal();
};

window.salvarGestor = () => {
    const nome = gestorNome().value.trim();
    const email = gestorEmail().value.trim();
    const matricula = gestorMatricula().value.trim();
    const perfil = gestorPerfil().value;
    const status = gestorStatus().value;

    if (!nome || !email || !matricula) {
        alert("Preencha todos os campos obrigatórios.");
        return;
    }

    if (gestorEditandoId) {
        const gestor = gestoresDB.find(g => g.id === gestorEditandoId);
        gestor.nome = nome;
        gestor.email = email;
        gestor.matricula = matricula;
        gestor.perfil = perfil;
        gestor.status = status;
    } else {
        gestoresDB.push({
            id: Date.now(),
            nome,
            email,
            matricula,
            perfil,
            status
        });
    }

    fecharModalGestor();
    renderizarTabela();
};

function abrirModal() {
    document.getElementById("modal-gestor").style.display = "flex";
}

window.fecharModalGestor = () => {
    document.getElementById("modal-gestor").style.display = "none";
};

function limparFormulario() {
    gestorNome().value = "";
    gestorEmail().value = "";
    gestorMatricula().value = "";
    gestorPerfil().value = "Docente";
    gestorStatus().value = "Ativo";
}

// shortcuts
const gestorNome = () => document.getElementById("gestor-nome");
const gestorEmail = () => document.getElementById("gestor-email");
const gestorMatricula = () => document.getElementById("gestor-matricula");
const gestorPerfil = () => document.getElementById("gestor-perfil");
const gestorStatus = () => document.getElementById("gestor-status");



window.removerGestor = (id) => {
    if(confirm("Deseja remover este acesso?")) {
        gestoresDB = gestoresDB.filter(g => g.id !== id);
        renderizarTabela();
    }
};