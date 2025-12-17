/* ===================================================
   CONTEÚDO - FAQ & DOCUMENTAÇÃO (ADMINISTRADOR)
   Atualizado para CRUD (Create, Read, Update, Delete)
=================================================== */

// ===============================
// MOCK - FAQ (Adicionado IDs para gestão)
// ===============================
 const faqDB = [
    {
        pergunta: "O que é um projeto de extensão?",
        resposta:
            "Projetos de extensão são ações acadêmicas que promovem a interação entre a universidade e a comunidade externa, aplicando conhecimentos teóricos na prática."
    },
    {
        pergunta: "Quem pode criar projetos no sistema?",
        resposta:
            "A criação de projetos é permitida para Docentes e Discentes Ofertantes, conforme as permissões definidas pelo administrador."
    },
    {
        pergunta: "Como me tornar um Discente Ofertante?",
        resposta:
            "O discente deve solicitar a mudança de perfil pelo sistema. A solicitação será analisada e aprovada ou recusada por um administrador."
    },
    {
        pergunta: "O que acontece após minha solicitação ser aprovada?",
        resposta:
            "Após a aprovação, sua conta passa a ter o perfil de Discente Ofertante, permitindo criar e gerenciar projetos de extensão."
    },
    {
        pergunta: "O que acontece se minha solicitação for negada?",
        resposta:
            "Caso a solicitação seja negada, o discente permanece com o perfil padrão e pode realizar uma nova solicitação futuramente."
    },
    {
        pergunta: "Como funcionam as permissões de acesso?",
        resposta:
            "As permissões são definidas por perfil e módulo. O administrador pode permitir ou bloquear acessos conforme a função do usuário no sistema."
    },
    {
        pergunta: "Quem pode gerenciar usuários e permissões?",
        resposta:
            "Apenas usuários com perfil de Administrador possuem acesso às funcionalidades de gestão de usuários, perfis e permissões."
    },
    {
        pergunta: "Onde posso encontrar ajuda para usar o sistema?",
        resposta:
            "Na seção de Conteúdo e FAQ, estão disponíveis perguntas frequentes, guias e documentos para auxiliar no uso da plataforma."
    },
    {
        pergunta: "Os documentos do sistema são públicos?",
        resposta:
            "Alguns documentos são públicos, enquanto outros possuem acesso restrito, dependendo do perfil do usuário."
    },
    {
        pergunta: "Posso editar ou excluir um projeto depois de criado?",
        resposta:
            "Sim. Usuários com permissão adequada podem editar ou gerenciar seus projetos conforme as regras definidas pelo sistema."
    }
];

// ===============================
// MOCK - DOCUMENTAÇÃO
// ===============================
let docsDB = [
    {
        id: 1,
        titulo: "Guia do Discente",
        categoria: "Usuário",
        acesso: "Público",
        link: "#"
    },
    {
        id: 2,
        titulo: "Manual do Discente Ofertante",
        categoria: "Projetos",
        acesso: "Restrito",
        link: "#"
    },
    {
        id: 3,
        titulo: "Política de Uso do Sistema",
        categoria: "Institucional",
        acesso: "Público",
        link: "#"
    }
];

// ===============================
// CARREGA VIEW
// ===============================
export async function carregarViewConteudo() {
    const response = await fetch("../../pages/administrador/conteudo.html");
    return await response.text();
}

// ===============================
// INIT
// ===============================
export function initConteudo() {
    console.log("[ADMIN] Conteúdo & FAQ carregado com funções de gestão");
    renderFAQ();
    renderDocs();
}

// ===============================
// LÓGICA DE FAQ (RENDER + CRUD)
// ===============================

function renderFAQ() {
    const container = document.getElementById("faq-container");
    if (!container) return;

    if (faqDB.length === 0) {
        container.innerHTML = '<div style="padding: 20px; text-align: center; color: #666;">Nenhuma pergunta cadastrada.</div>';
        return;
    }

    container.innerHTML = faqDB.map(f => `
        <div class="faq-item" style="margin-bottom:15px; background: #fff; padding: 15px; border: 1px solid #eee; border-radius: 6px; display: flex; justify-content: space-between; align-items: flex-start;">
            <div style="flex: 1; padding-right: 15px;">
                <strong style="color: #5d0b0b; display: block; margin-bottom: 5px;">${f.pergunta}</strong>
                <p style="margin:0; color:#555; font-size: 14px; line-height: 1.5;">${f.resposta}</p>
            </div>
            <div style="display: flex; gap: 8px; min-width: 70px;">
                <button class="btn-small btn-small-info" title="Editar" onclick="abrirModalFaq(${f.id})">editar</button>
                <button class="btn-small btn-small-danger" title="Excluir" onclick="deletarFAQ(${f.id})">excluir</button>
            </div>
        </div>
    `).join("");
}

// Expor funções para o HTML
window.abrirModalFaq = (id = null) => {
    document.getElementById("modalFaq").style.display = "flex";
    const titulo = document.getElementById("tituloModalFaq");
    
    if (id) {
        // Modo Edição
        const item = faqDB.find(f => f.id === id);
        if (item) {
            titulo.innerText = "Editar Pergunta";
            document.getElementById("faqId").value = item.id;
            document.getElementById("faqPergunta").value = item.pergunta;
            document.getElementById("faqResposta").value = item.resposta;
        }
    } else {
        // Modo Criação
        titulo.innerText = "Nova Pergunta";
        document.getElementById("faqId").value = "";
        document.getElementById("faqPergunta").value = "";
        document.getElementById("faqResposta").value = "";
    }
};

window.salvarFAQ = () => {
    const id = document.getElementById("faqId").value;
    const pergunta = document.getElementById("faqPergunta").value;
    const resposta = document.getElementById("faqResposta").value;

    if (!pergunta || !resposta) return alert("Preencha todos os campos.");

    if (id) {
        // Atualizar existente
        const index = faqDB.findIndex(f => f.id == id);
        if (index !== -1) {
            faqDB[index] = { ...faqDB[index], pergunta, resposta };
            if (window.showToast) window.showToast("success", "Pergunta atualizada com sucesso!");
        }
    } else {
        // Criar nova
        const novoId = faqDB.length > 0 ? Math.max(...faqDB.map(f => f.id)) + 1 : 1;
        faqDB.push({ id: novoId, pergunta, resposta });
        if (window.showToast) window.showToast("success", "Pergunta criada com sucesso!");
    }

    window.fecharModalCont('modalFaq');
    renderFAQ();
};

window.deletarFAQ = (id) => {
    if (confirm("Tem certeza que deseja excluir esta pergunta?")) {
        faqDB = faqDB.filter(f => f.id !== id);
        renderFAQ();
        if (window.showToast) window.showToast("success", "Item removido.");
    }
};


// ===============================
// LÓGICA DE DOCUMENTOS (RENDER + CRUD)
// ===============================

function renderDocs() {
    const tbody = document.getElementById("tabela-docs");
    if (!tbody) return;

    if (docsDB.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding: 20px;">Nenhum documento disponível.</td></tr>';
        return;
    }

    tbody.innerHTML = docsDB.map(d => `
        <tr>
            <td>
                <span style="font-weight: 500;">${d.titulo}</span>
                <div style="font-size: 11px; color: #888;">PDF • 250kb</div>
            </td>
            <td>${d.categoria}</td>
            <td style="text-align: center;">
                <span class="badge ${d.acesso === "Público" ? "badge-success" : "badge-warning"}">
                    ${d.acesso}
                </span>
            </td>
            <td style="text-align: center;">
                <button class="btn-small btn-small-info" title="Editar" onclick="abrirModalDoc(${d.id})">editar</button>
                <button class="btn-small btn-small-danger" title="Excluir" onclick="deletarDoc(${d.id})">excluir</button>
            </td>
        </tr>
    `).join("");
}

window.abrirModalDoc = (id = null) => {
    document.getElementById("modalDoc").style.display = "flex";
    const titulo = document.getElementById("tituloModalDoc");
    
    if (id) {
        const item = docsDB.find(d => d.id === id);
        if (item) {
            titulo.innerText = "Editar Documento";
            document.getElementById("docId").value = item.id;
            document.getElementById("docTitulo").value = item.titulo;
            document.getElementById("docCategoria").value = item.categoria;
            document.getElementById("docAcesso").value = item.acesso;
        }
    } else {
        titulo.innerText = "Upload de Documento";
        document.getElementById("docId").value = "";
        document.getElementById("docTitulo").value = "";
        document.getElementById("docCategoria").value = "Usuário";
        document.getElementById("docAcesso").value = "Público";
        document.getElementById("docArquivo").value = ""; // Limpa input file
    }
};

window.salvarDoc = () => {
    const id = document.getElementById("docId").value;
    const titulo = document.getElementById("docTitulo").value;
    const categoria = document.getElementById("docCategoria").value;
    const acesso = document.getElementById("docAcesso").value;

    if (!titulo) return alert("Informe o título do documento.");

    if (id) {
        // Atualizar
        const index = docsDB.findIndex(d => d.id == id);
        if (index !== -1) {
            docsDB[index] = { ...docsDB[index], titulo, categoria, acesso };
            if (window.showToast) window.showToast("success", "Metadados atualizados!");
        }
    } else {
        // Novo Upload (Simulado)
        const novoId = docsDB.length > 0 ? Math.max(...docsDB.map(d => d.id)) + 1 : 1;
        docsDB.push({ 
            id: novoId, 
            titulo, 
            categoria, 
            acesso, 
            link: "#" 
        });
        if (window.showToast) window.showToast("success", "Documento enviado com sucesso!");
    }

    window.fecharModalCont('modalDoc');
    renderDocs();
};

window.deletarDoc = (id) => {
    if (confirm("Deseja remover este documento? Esta ação não pode ser desfeita.")) {
        docsDB = docsDB.filter(d => d.id !== id);
        renderDocs();
        if (window.showToast) window.showToast("success", "Documento removido.");
    }
};

// ===============================
// UTILITÁRIOS
// ===============================
window.fecharModalCont = (idModal) => {
    document.getElementById(idModal).style.display = "none";
};