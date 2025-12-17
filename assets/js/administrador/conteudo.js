/* ===================================================
   CONTEÚDO - FAQ & DOCUMENTAÇÃO
=================================================== */

// ===============================
// MOCK - FAQ
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

const docsDB = [
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
// CARREGA VIEW (OBRIGATÓRIO)
// ===============================

export async function carregarViewConteudo() {
    const response = await fetch("../../pages/administrador/conteudo.html");
    return await response.text();
}

// ===============================
// INIT
// ===============================

export function initConteudo() {
    console.log("[ADMIN] Conteúdo & FAQ carregado");
    renderFAQ();
    renderDocs();
}

// ===============================
// RENDER FAQ
// ===============================

function renderFAQ() {
    const container = document.getElementById("faq-container");
    if (!container) return;

    container.innerHTML = faqDB.map(f => `
        <div class="faq-item" style="margin-bottom:16px;">
            <strong>${f.pergunta}</strong>
            <p style="margin-top:6px; color:#555;">
                ${f.resposta}
            </p>
        </div>
    `).join("");
}

// ===============================
// RENDER DOCUMENTAÇÃO
// ===============================

function renderDocs() {
    const tbody = document.getElementById("tabela-docs");
    if (!tbody) return;

    tbody.innerHTML = docsDB.map(d => `
        <tr>
            <td>${d.titulo}</td>
            <td>${d.categoria}</td>
            <td>
                <span class="badge ${
                    d.acesso === "Público"
                        ? "badge-success"
                        : "badge-warning"
                }">
                    ${d.acesso}
                </span>
            </td>
            <td>
                <a href="${d.link}"
                   class="btn-small btn-small-info"
                   target="_blank">
                    Abrir
                </a>
            </td>
        </tr>
    `).join("");
}
