/* =========================================================================
   MÓDULO: GESTÃO DE GRUPOS (LIGAS E NÚCLEOS)
   Requisito: RF 006 - Cadastro de Grupos e Vínculo Docente
   ========================================================================= */

// --- 1. FUNÇÃO DE CARREGAMENTO DA VIEW (HTML) ---
export async function carregarViewGrupos() {
    try {
        // Ajuste o caminho conforme sua estrutura de pastas real
        const resp = await fetch('../../pages/coordenador_curso/grupos.html');
        return await resp.text();
    } catch (error) {
        console.error("Erro ao carregar view de Grupos:", error);
        return "<div class='alert alert-danger'>Erro ao carregar módulo de grupos.</div>";
    }
}

// --- 2. DADOS MOCKADOS (Simulação de Banco de Dados) ---

// Lista de docentes disponíveis para assumir a responsabilidade (RF 006)
const docentesDisponiveis = [
    { id: 1, nome: "Prof. Dr. Carlos Mendes" },
    { id: 2, nome: "Profa. Dra. Ana Souza" },
    { id: 3, nome: "Prof. Ms. Roberto Campos" },
    { id: 4, nome: "Profa. Dra. Juliana Lima" },
    { id: 5, nome: "Prof. Dr. Marcos Vinicius" }
];

// Lista inicial de grupos já cadastrados
let grupos = [
    {
        id: 101,
        nome: "LAIS - Liga de I.A. e Saúde",
        tipo: "Liga Acadêmica",
        docente: "Profa. Dra. Ana Souza",
        email: "lais@ufma.br"
    },
    {
        id: 102,
        nome: "DevCommunity",
        tipo: "Núcleo de Pesquisa",
        docente: "Prof. Ms. Roberto Campos",
        email: "dev@ufma.br"
    }
];

// --- 3. FUNÇÃO DE INICIALIZAÇÃO (LÓGICA) ---
export function initGrupos() {
    console.log("Módulo Grupos: Inicializado.");

    // Carrega os dados iniciais na tela
    carregarSelectDocentes();
    renderizarTabelaGrupos();

    // --- DEFINIÇÃO DE FUNÇÕES GLOBAIS (Para funcionar com onclick no HTML) ---

    // Função para Salvar (RF 006)
    window.salvarGrupo = function () {
        // 1. Coleta os valores do formulário
        const nome = document.getElementById('grupo-nome').value.trim();
        const tipo = document.getElementById('grupo-tipo').value;
        const email = document.getElementById('grupo-email').value.trim();
        const docente = document.getElementById('grupo-docente').value;
        const descricao = document.getElementById('grupo-desc').value;

        // 2. Validações de Regra de Negócio

        // RF 006: Docente Responsável é OBRIGATÓRIO [cite: 49]
        if (!docente) {
            alert("⚠️ Atenção: É obrigatório vincular um Docente Responsável para criar o grupo.");
            document.getElementById('grupo-docente').focus();
            return;
        }

        // Validação de campos vazios [cite: 51]
        if (!nome || !email) {
            alert("Preencha o Nome e o E-mail do grupo.");
            return;
        }

        // RF 006 (CT003): Validação de Duplicidade de Nome [cite: 57]
        const nomeDuplicado = grupos.some(g => g.nome.toLowerCase() === nome.toLowerCase());
        if (nomeDuplicado) {
            alert("⚠️ Erro: Já existe um grupo cadastrado com este nome.");
            return;
        }

        // 3. Cria o objeto do novo grupo
        const novoGrupo = {
            id: Date.now(), // Gera ID único baseado no tempo
            nome: nome,
            tipo: tipo,
            email: email,
            docente: docente,
            descricao: descricao
        };

        // 4. Salva e Atualiza a Interface
        grupos.push(novoGrupo); // Adiciona ao array (simulando banco)
        renderizarTabelaGrupos(); // Redesenha a tabela

        // 5. Feedback e Limpeza
        alert(`✅ Sucesso! O grupo "${nome}" foi criado.`);
        document.getElementById('form-grupo').reset();
    };

    // Função para Excluir
    window.excluirGrupo = function (id) {
        if (confirm("Tem certeza que deseja dissolver este grupo?")) {
            grupos = grupos.filter(g => g.id !== id);
            renderizarTabelaGrupos();
        }
    };
}

// --- 4. FUNÇÕES AUXILIARES INTERNAS ---

function carregarSelectDocentes() {
    const select = document.getElementById('grupo-docente');
    if (!select) return; // Segurança caso o HTML não tenha carregado

    // Mantém a primeira opção (placeholder) e limpa o resto
    select.innerHTML = '<option value="">Selecione um professor...</option>';

    docentesDisponiveis.forEach(doc => {
        const option = document.createElement('option');
        option.value = doc.nome; // Salvando o nome para simplificar a demo
        option.textContent = doc.nome;
        select.appendChild(option);
    });
}

function renderizarTabelaGrupos() {
    const tbody = document.getElementById('lista-grupos-body');
    const contador = document.getElementById('total-grupos');

    if (!tbody) return;

    tbody.innerHTML = ''; // Limpa tabela atual

    // Atualiza contador
    if (contador) contador.textContent = `${grupos.length} ativos`;

    // Preenche linhas
    grupos.forEach(grupo => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
           <td>
        <div style="font-weight: 600; color: #333;">${grupo.nome}</div>
        <small style="color: #777;">${grupo.email}</small>
    </td>
    <td>
        <span class="badge badge-neutral">${grupo.tipo}</span>
    </td>
    <td style="color: #5d0b0b; font-weight: 600;">
        🎓 ${grupo.docente}
    </td>
    <td class="actions" style="text-align: right;">
        <button class="btn btn-small btn-danger" onclick="excluirGrupo(${grupo.id})" title="Dissolver Grupo">
            🗑️
        </button>
    </td>
        `;
        tbody.appendChild(tr);
    });
}