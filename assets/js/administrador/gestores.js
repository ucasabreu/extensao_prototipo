/* ====================================================================
   LÓGICA DE GESTORES (ADMINISTRADOR)
   Arquivo: assets/js/administrador/gestores.js
   Referência: RF 003 - Cadastro de Perfis de Gestão
   ==================================================================== */

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
}

// Funções Internas
function renderizarTabela() {
    const tbody = document.getElementById("tabela-gestores-corpo");
    if (!tbody) return;

    tbody.innerHTML = gestoresDB.map(g => `
        <tr>
            <td>${g.nome}</td>
            <td>${g.email}</td>
            <td>${g.matricula}</td>
            <td><span class="badge badge-neutral">${g.perfil}</span></td>
            <td>${g.status === 'Ativo' ? '<span class="badge badge-success">Ativo</span>' : '<span class="badge badge-warning">Pendente</span>'}</td>
            <td class="actions">
                <button class="btn-small btn-small-info" onclick="editarGestor(${g.id})">✏️</button>
                <button class="btn-small btn-small-danger" onclick="removerGestor(${g.id})">🗑️</button>
            </td>
        </tr>
    `).join("");
}

// Tornando funções globais para o onclick do HTML funcionar
window.novoGestor = () => {
    alert("Abrir modal de cadastro (Implementar Form)");
};

window.editarGestor = (id) => {
    const gestor = gestoresDB.find(g => g.id === id);
    alert(`Editando: ${gestor.nome}`);
};

window.removerGestor = (id) => {
    if(confirm("Deseja remover este acesso?")) {
        gestoresDB = gestoresDB.filter(g => g.id !== id);
        renderizarTabela();
    }
};