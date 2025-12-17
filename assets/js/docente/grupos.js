/* ====================================================================
   GESTÃO DE GRUPOS E LIGAS (DOCENTE)
   ==================================================================== */

// MOCK: Grupos sob responsabilidade do docente
const meusGruposDB = [
    { 
        id: 1, 
        nome: "Liga de Inteligência Artificial (LIA)", 
        atividade: "Projeto Robótica Social", 
        tipo: "Liga Acadêmica", 
        membrosCount: 12, 
        status: "Ativo" 
    },
    { 
        id: 2, 
        nome: "Núcleo de Desenvolvimento Web", 
        atividade: "Curso de Python", 
        tipo: "Grupo de Pesquisa", 
        membrosCount: 5, 
        status: "Ativo" 
    },
    { 
        id: 3, 
        nome: "Comissão da Semana Tech", 
        atividade: "Semana da Computação", 
        tipo: "Comissão Organizadora", 
        membrosCount: 8, 
        status: "Encerrado" // Grupos encerrados aparecem mas como leitura
    }
];

// MOCK: Membros e seus cargos (RF009)
let membrosDB = [
    { id: 101, grupoId: 1, nome: "João Silva", matricula: "2023001", cargo: "Presidente", inicio: "01/02/2024" },
    { id: 102, grupoId: 1, nome: "Maria Oliveira", matricula: "2023002", cargo: "Diretor de Projetos", inicio: "01/02/2024" },
    { id: 103, grupoId: 1, nome: "Carlos Souza", matricula: "2023003", cargo: "Membro Efetivo", inicio: "15/03/2024" },
    { id: 201, grupoId: 2, nome: "Ana Lima", matricula: "2021050", cargo: "Líder Técnica", inicio: "01/08/2024" }
];

// MOCK: Histórico de Cargos (RF010)
let historicoCargosDB = [
    { grupoId: 1, nome: "Roberto Costa", cargo: "Presidente", inicio: "01/02/2023", fim: "31/01/2024" }
];

// MOCK: Base geral de alunos da instituição (Para simular a busca)
const baseAlunosInstituicao = [
    { id: 901, nome: "Bruno Diaz", matricula: "2025101" },
    { id: 902, nome: "Diana Prince", matricula: "2025102" },
    { id: 903, nome: "Clark Kent", matricula: "2025103" },
    { id: 904, nome: "Barry Allen", matricula: "2025104" }
];

let idGrupoAtual = null;

export async function carregarViewGrupos() {
    try {
        const response = await fetch('../../pages/docente/grupos.html');
        return await response.text();
    } catch (e) { return "Erro ao carregar módulo."; }
}

export function initGrupos() {
    renderizarTabelaGrupos();
}

/* ====================================================
   LISTAGEM DE GRUPOS
   ==================================================== */
window.filtrarGrupos = renderizarTabelaGrupos;

function renderizarTabelaGrupos() {
    const tbody = document.getElementById("tb-grupos");
    const termo = document.getElementById("buscaGrupo")?.value.toLowerCase() || "";
    const tipo = document.getElementById("filtroTipoGrupo")?.value || "todos";

    const filtrados = meusGruposDB.filter(g => {
        const matchNome = g.nome.toLowerCase().includes(termo);
        const matchTipo = tipo === "todos" || g.tipo === tipo;
        return matchNome && matchTipo;
    });

    tbody.innerHTML = filtrados.map(g => {
        let badgeClass = g.status === "Ativo" ? "badge-success" : "badge-neutral";
        
        // Ações
        // Se encerrado, apenas vê. Se ativo, gerencia.
        let btnAcao = g.status === "Ativo" 
            ? `<button class="btn-small btn-small-primary" onclick="abrirGestaoMembros(${g.id})">Gerenciar Membros</button>`
            : `<button class="btn-small btn-small-info" onclick="abrirGestaoMembros(${g.id})">Ver Histórico</button>`;

        return `
            <tr>
                <td><strong>${g.nome}</strong></td>
                <td>${g.atividade}</td>
                <td>${g.tipo}</td>
                <td>${g.membrosCount} integrantes</td>
                <td><span class="badge ${badgeClass}">${g.status}</span></td>
                <td class="actions">${btnAcao}</td>
            </tr>
        `;
    }).join("");
}

/* ====================================================
   GESTÃO DE MEMBROS (RF009)
   ==================================================== */
window.abrirGestaoMembros = (idGrupo) => {
    idGrupoAtual = idGrupo;
    const grupo = meusGruposDB.find(g => g.id === idGrupo);
    document.getElementById("tituloGrupoModal").textContent = grupo.nome;
    
    renderizarTabelaMembros();
    document.getElementById("modalMembros").style.display = "flex";
};

function renderizarTabelaMembros() {
    const tbody = document.getElementById("tb-membros-modal");
    const membros = membrosDB.filter(m => m.grupoId === idGrupoAtual);

    tbody.innerHTML = membros.map(m => `
        <tr>
            <td>${m.nome}</td>
            <td>${m.matricula}</td>
            <td>
                <select class="select" style="padding: 4px; height: 30px; font-size: 13px;" 
                        onchange="alterarCargo(${m.id}, this.value)">
                    <option value="Presidente" ${m.cargo === 'Presidente' ? 'selected' : ''}>Presidente</option>
                    <option value="Vice-Presidente" ${m.cargo === 'Vice-Presidente' ? 'selected' : ''}>Vice-Presidente</option>
                    <option value="Diretor de Projetos" ${m.cargo === 'Diretor de Projetos' ? 'selected' : ''}>Diretor</option>
                    <option value="Líder Técnica" ${m.cargo === 'Líder Técnica' ? 'selected' : ''}>Líder</option>
                    <option value="Membro Efetivo" ${m.cargo === 'Membro Efetivo' ? 'selected' : ''}>Membro Efetivo</option>
                    <option value="Voluntário" ${m.cargo === 'Voluntário' ? 'selected' : ''}>Voluntário</option>
                </select>
            </td>
            <td>${m.inicio}</td>
            <td>
                <button class="btn-small btn-small-danger" onclick="removerMembro(${m.id})" title="Remover do grupo">remover</button>
            </td>
        </tr>
    `).join("");
}

/* ====================================================
   AÇÕES DE CARGO E HISTÓRICO (RF010)
   ==================================================== */

window.alterarCargo = (idMembro, novoCargo) => {
    const membro = membrosDB.find(m => m.id === idMembro);
    const cargoAntigo = membro.cargo;

    if (cargoAntigo !== novoCargo) {
        // 1. Registra no histórico o cargo anterior (RF010)
        historicoCargosDB.push({
            grupoId: idGrupoAtual,
            nome: membro.nome,
            cargo: cargoAntigo,
            inicio: membro.inicio,
            fim: new Date().toLocaleDateString('pt-BR')
        });

        // 2. Atualiza cargo atual
        membro.cargo = novoCargo;
        membro.inicio = new Date().toLocaleDateString('pt-BR'); // Reseta data de início no novo cargo

        if(window.showToast) window.showToast("success", `Cargo de ${membro.nome} alterado para ${novoCargo}.`);
    }
};

window.removerMembro = (idMembro) => {
    if(confirm("Remover este membro do grupo? O histórico será preservado.")) {
        const index = membrosDB.findIndex(m => m.id === idMembro);
        const membro = membrosDB[index];

        // Salva histórico final
        historicoCargosDB.push({
            grupoId: idGrupoAtual,
            nome: membro.nome,
            cargo: membro.cargo,
            inicio: membro.inicio,
            fim: new Date().toLocaleDateString('pt-BR')
        });

        membrosDB.splice(index, 1); // Remove da lista ativa
        renderizarTabelaMembros();
        
        // Atualiza contagem na lista principal
        const grupo = meusGruposDB.find(g => g.id === idGrupoAtual);
        grupo.membrosCount--;
        renderizarTabelaGrupos();
    }
};

window.adicionarMembroSimulado = () => {
    const nome = prompt("Digite o nome do novo integrante (Simulação):");
    if(nome) {
        membrosDB.push({
            id: Date.now(),
            grupoId: idGrupoAtual,
            nome: nome,
            matricula: "2025" + Math.floor(Math.random() * 1000),
            cargo: "Membro Efetivo", // Cargo padrão
            inicio: new Date().toLocaleDateString('pt-BR')
        });
        
        const grupo = meusGruposDB.find(g => g.id === idGrupoAtual);
        grupo.membrosCount++;
        
        renderizarTabelaMembros();
        renderizarTabelaGrupos();
        if(window.showToast) window.showToast("success", "Membro adicionado!");
    }
};

window.verHistoricoCargos = () => {
    const lista = document.getElementById("listaHistorico");
    const historico = historicoCargosDB.filter(h => h.grupoId === idGrupoAtual);

    if (historico.length === 0) {
        lista.innerHTML = "<li style='padding:10px; color:#666;'>Nenhum registro histórico encontrado.</li>";
    } else {
        lista.innerHTML = historico.map(h => `
            <li style="border-bottom: 1px solid #eee; padding: 10px;">
                <strong>${h.nome}</strong> foi <em>${h.cargo}</em> <br>
                <span style="font-size:12px; color:#666;">De ${h.inicio} até ${h.fim}</span>
            </li>
        `).join("");
    }
    
    document.getElementById("modalHistoricoCargos").style.display = "flex";
};

window.fecharModalGrupo = (id) => document.getElementById(id).style.display = "none";

/* ====================================================
   NOVAS FUNÇÕES DE ADIÇÃO (SUBSTITUI O PROMPT)
   ==================================================== */

// 1. Abre o Modal Limpo
window.abrirModalAdicao = () => {
    document.getElementById("inputBuscaDiscente").value = "";
    document.getElementById("resultadoBusca").style.display = "none";
    document.getElementById("selCargoNovo").disabled = true;
    document.getElementById("btnConfirmarAdicao").disabled = true;
    document.getElementById("modalAdicionarMembro").style.display = "flex";
};

// 2. Simula a busca no banco de dados da instituição
window.buscarDiscenteSimulado = () => {
    const termo = document.getElementById("inputBuscaDiscente").value.toLowerCase();
    const resultadoDiv = document.getElementById("resultadoBusca");
    
    if (termo.length < 3) return alert("Digite pelo menos 3 caracteres.");

    // Busca na base geral
    const aluno = baseAlunosInstituicao.find(a => 
        a.nome.toLowerCase().includes(termo) || a.matricula.includes(termo)
    );

    if (aluno) {
        // Verifica se já está no grupo atual
        const jaNoGrupo = membrosDB.some(m => m.grupoId === idGrupoAtual && m.matricula === aluno.matricula);

        if (jaNoGrupo) {
            alert("Este discente já é membro deste grupo.");
            resultadoDiv.style.display = "none";
            return;
        }

        // Exibe resultado
        document.getElementById("nomeDiscenteEncontrado").textContent = aluno.nome;
        document.getElementById("matriculaDiscenteEncontrada").textContent = aluno.matricula;
        document.getElementById("idDiscenteEncontrado").value = aluno.id; // Guarda ID temporário
        
        resultadoDiv.style.display = "block";
        document.getElementById("selCargoNovo").disabled = false;
        document.getElementById("btnConfirmarAdicao").disabled = false;
    } else {
        alert("Discente não encontrado na base institucional.");
        resultadoDiv.style.display = "none";
        document.getElementById("btnConfirmarAdicao").disabled = true;
    }
};

// 3. Confirma a inclusão (RF009 + RF010)
window.confirmarAdicaoMembro = () => {
    const nome = document.getElementById("nomeDiscenteEncontrado").textContent;
    const matricula = document.getElementById("matriculaDiscenteEncontrada").textContent;
    const cargo = document.getElementById("selCargoNovo").value;
    const hoje = new Date().toLocaleDateString('pt-BR');

    // Adiciona ao Mock de Membros
    membrosDB.push({
        id: Date.now(),
        grupoId: idGrupoAtual,
        nome: nome,
        matricula: matricula,
        cargo: cargo,
        inicio: hoje // RF010: Data de início registrada
    });

    // Atualiza contagem do grupo
    const grupo = meusGruposDB.find(g => g.id === idGrupoAtual);
    if(grupo) grupo.membrosCount++;

    // Atualiza UI
    renderizarTabelaMembros();
    renderizarTabelaGrupos();
    fecharModalGrupo('modalAdicionarMembro');
    
    if(window.showToast) window.showToast("success", `${nome} adicionado como ${cargo}!`);
};