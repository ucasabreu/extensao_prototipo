/* =========================================================================
   MÓDULO: GESTÃO DE GRUPOS
   Arquivo: assets/js/coordenador/grupos.js
   ========================================================================= */

// --- 1. CARREGAMENTO DA VIEW ---
export async function carregarViewGrupos() {
    try {
        const resp = await fetch('../../pages/coordenador_curso/grupos.html');
        return await resp.text();
    } catch (error) {
        console.error("Erro ao carregar view:", error);
        return "<div class='alert alert-danger'>Erro ao carregar módulo.</div>";
    }
}

// --- 2. DADOS MOCKADOS ---
const docentesDisponiveis = [
    { id: 1, nome: "Prof. Dr. Carlos Mendes" },
    { id: 2, nome: "Profa. Dra. Ana Souza" },
    { id: 3, nome: "Prof. Ms. Roberto Campos" },
    { id: 4, nome: "Profa. Dra. Juliana Lima" },
    { id: 5, nome: "Prof. Dr. Marcos Vinicius" }
];

let gruposAtivos = [
    { id: 101, nome: "LAIS - Liga de I.A. e Saúde", tipo: "Liga Acadêmica", docente: "Profa. Dra. Ana Souza", email: "lais@ufma.br" },
    { id: 102, nome: "DevCommunity", tipo: "Núcleo de Pesquisa", docente: "Prof. Ms. Roberto Campos", email: "dev@ufma.br" }
];

let solicitacoesPendentes = [
    { id: 901, nome: "Liga de Robótica Educacional", tipo: "Liga Acadêmica", docente: "Prof. Dr. Marcos Vinicius", data: "14/12/2025" },
    { id: 902, nome: "Núcleo de Segurança Cibernética", tipo: "Núcleo de Pesquisa", docente: "Prof. Dr. Carlos Mendes", data: "15/12/2025" }
];

// --- 3. INICIALIZAÇÃO ---
export function initGrupos() {
    window.salvarGrupo = salvarGrupoInterno;
    window.excluirGrupo = excluirGrupoInterno;
    window.alternarAbaGrupos = alternarAbaGrupos;
    window.carregarSolicitacao = carregarSolicitacao; // Mudamos o nome da função
    window.rejeitarSolicitacao = rejeitarSolicitacao;

    carregarSelectDocentes();
    renderizarTabelaAtivos();
    renderizarTabelaSolicitacoes();
}

// --- 4. FUNÇÕES DE INTERFACE ---
function alternarAbaGrupos(aba) {
    const btnAtivos = document.getElementById('tab-ativos');
    const btnSolic = document.getElementById('tab-solicitacoes');
    const viewAtivos = document.getElementById('view-ativos');
    const viewSolic = document.getElementById('view-solicitacoes');

    if (aba === 'ativos') {
        viewAtivos.style.display = 'block';
        viewSolic.style.display = 'none';
        btnAtivos.classList.replace('btn-ghost', 'btn-secondary');
        btnSolic.classList.replace('btn-secondary', 'btn-ghost');
    } else {
        viewAtivos.style.display = 'none';
        viewSolic.style.display = 'block';
        btnAtivos.classList.replace('btn-secondary', 'btn-ghost');
        btnSolic.classList.replace('btn-ghost', 'btn-secondary');
    }
}

// --- 5. LÓGICA DE NEGÓCIO (CORRIGIDA - RF 006) ---

// Em vez de "Aprovar Automaticamente", nós "Carregamos para Edição"
function carregarSolicitacao(id) {
    const solicitacao = solicitacoesPendentes.find(s => s.id === id);
    if (!solicitacao) return;

    // 1. Preenche o formulário da direita com os dados da solicitação
    document.getElementById('grupo-nome').value = solicitacao.nome;
    document.getElementById('grupo-tipo').value = solicitacao.tipo;
    
    // Tenta selecionar o docente no combo
    const selectDocente = document.getElementById('grupo-docente');
    for (let i = 0; i < selectDocente.options.length; i++) {
        if (selectDocente.options[i].text === solicitacao.docente) {
            selectDocente.selectedIndex = i;
            break;
        }
    }

    // 2. Feedback visual
    document.getElementById('grupo-email').focus(); // Foca no campo que falta (E-mail)
    
    // Removemos da lista de pendentes pois agora está em "Processamento"
    solicitacoesPendentes = solicitacoesPendentes.filter(s => s.id !== id);
    renderizarTabelaSolicitacoes();

    if(window.showToast) window.showToast("info", "Dados carregados no formulário. Revise e confirme o cadastro.");
}

function rejeitarSolicitacao(id) {
    if (confirm("Rejeitar esta solicitação de abertura?")) {
        solicitacoesPendentes = solicitacoesPendentes.filter(s => s.id !== id);
        renderizarTabelaSolicitacoes();
        if(window.showToast) window.showToast("warning", "Solicitação removida.");
    }
}

function salvarGrupoInterno() {
    const nome = document.getElementById('grupo-nome').value.trim();
    const tipo = document.getElementById('grupo-tipo').value;
    const email = document.getElementById('grupo-email').value.trim();
    const docente = document.getElementById('grupo-docente').value; // Valor do Select (Nome)

    // RF 006: Validação Obrigatória
    if (!docente || docente === "") {
        alert("⚠️ O campo 'Docente Responsável' é obrigatório.");
        return;
    }
    if (!nome || !email) {
        alert("Preencha todos os campos obrigatórios (Nome e E-mail).");
        return;
    }

    gruposAtivos.push({
        id: Date.now(),
        nome: nome,
        tipo: tipo,
        email: email,
        docente: docente // Salva o nome selecionado
    });

    renderizarTabelaAtivos();
    document.getElementById('form-grupo').reset();
    
    // Volta para a aba de ativos para ver o resultado
    alternarAbaGrupos('ativos');
    
    if(window.showToast) window.showToast("success", "Grupo cadastrado com sucesso!");
}

function excluirGrupoInterno(id) {
    if (confirm("Deseja dissolver este grupo? Esta ação é irreversível.")) {
        gruposAtivos = gruposAtivos.filter(g => g.id !== id);
        renderizarTabelaAtivos();
    }
}

// --- 6. RENDERIZAÇÃO ---

function renderizarTabelaAtivos() {
    const tbody = document.getElementById('lista-grupos-body');
    const contador = document.getElementById('total-grupos');
    
    if(!tbody) return;
    tbody.innerHTML = '';
    contador.textContent = gruposAtivos.length;

    gruposAtivos.forEach(grupo => {
        let badgeClass = "badge-neutral";
        if (grupo.tipo === "Liga Acadêmica") badgeClass = "badge-info";
        if (grupo.tipo === "Núcleo de Pesquisa") badgeClass = "badge-warning";

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <span style="font-weight: 600; color: #333;">${grupo.nome}</span><br>
                <small style="color:#777;">${grupo.email}</small>
            </td>
            <td><span class="badge ${badgeClass}">${grupo.tipo}</span></td>
            <td><span style="color: #5d0b0b; font-weight: 500;">🎓 ${grupo.docente}</span></td>
            <td style="text-align: center;">
                <button class="btn-small btn-small-danger" onclick="excluirGrupo(${grupo.id})" title="Dissolver">🗑️</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function renderizarTabelaSolicitacoes() {
    const tbody = document.getElementById('lista-solicitacoes-body');
    if(!tbody) return;
    tbody.innerHTML = '';

    if (solicitacoesPendentes.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" align="center" style="padding:20px; color:#999;">Nenhuma solicitação pendente.</td></tr>`;
        return;
    }

    solicitacoesPendentes.forEach(solic => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td style="font-weight: 600;">${solic.nome}</td>
            <td>${solic.docente}</td>
            <td>${solic.data}</td>
            <td style="text-align: center;">
                <button class="btn-small btn-small-info" onclick="carregarSolicitacao(${solic.id})" title="Processar Cadastro">
                    📝 Processar
                </button>
                <button class="btn-small btn-small-danger" onclick="rejeitarSolicitacao(${solic.id})" title="Rejeitar">
                    ❌
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function carregarSelectDocentes() {
    const select = document.getElementById('grupo-docente');
    if(!select) return;
    select.innerHTML = '<option value="">Selecione um professor...</option>';
    docentesDisponiveis.forEach(doc => {
        const opt = document.createElement('option');
        opt.value = doc.nome;
        opt.textContent = doc.nome;
        select.appendChild(opt);
    });
}