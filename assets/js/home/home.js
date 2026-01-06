/* =====================================================
   HOME JS - PORTAL PÚBLICO INTEGRADO (COM FAQ)
   ===================================================== */
console.log("✅ home.js carregado (versão integrada)");

// ===============================
// MOCK - OPORTUNIDADES (HOME)
// ===============================
const oportunidadesDB = [
    {
        id: 1,
        titulo: "Curso de Introdução ao Python",
        modalidade: "Curso",
        status: "Abertas",
        carga: "40h",
        prazo: "20/12/2025",
        imagem: "🐍"
    },
    {
        id: 2,
        titulo: "Semana de Tecnologia e Inovação",
        modalidade: "Evento",
        status: "Em Breve",
        carga: "20h",
        prazo: "15/01/2026",
        imagem: "🚀"
    },
    {
        id: 3,
        titulo: "Projeto Robótica nas Escolas",
        modalidade: "Projeto",
        status: "Encerrado",
        carga: "120h",
        prazo: "01/10/2025",
        imagem: "🤖"
    },
    {
        id: 4,
        titulo: "Workshop de Escrita Científica",
        modalidade: "Curso",
        status: "Abertas",
        carga: "8h",
        prazo: "18/12/2025",
        imagem: "📝"
    }
];

// ===============================
// MOCK - FAQ (INTEGRADO)
// ===============================
const faqDB = [
    { pergunta: "O que é um projeto de extensão?", resposta: "Projetos de extensão são ações acadêmicas que promovem a interação entre a universidade e a comunidade externa." },
    { pergunta: "Quem pode criar projetos no sistema?", resposta: "A criação de projetos é permitida para Docentes e Discentes Ofertantes, conforme as permissões do administrador." },
    { pergunta: "Como me tornar um Discente Ofertante?", resposta: "O discente deve solicitar a mudança de perfil pelo sistema. A solicitação será analisada pela administração." },
    { pergunta: "Onde posso encontrar ajuda?", resposta: "Nesta seção de Conteúdo e FAQ estão disponíveis perguntas frequentes e documentos para auxiliar no uso." },
    { pergunta: "Como recuperar minha senha?", resposta: "Na tela de login, clique em 'Esqueci minha senha' e informe seu e-mail institucional." }
];

// ===============================
// MOCK - DOCUMENTAÇÃO (INTEGRADO)
// ===============================
const docsDB = [
    { id: 1, titulo: "Guia do Discente", categoria: "Usuário", acesso: "Público", link: "#" },
    { id: 2, titulo: "Manual do Discente Ofertante", categoria: "Projetos", acesso: "Público", link: "#" },
    { id: 3, titulo: "Política de Uso do Sistema", categoria: "Institucional", acesso: "Público", link: "#" }
];

// ===============================
// INICIALIZAÇÃO
// ===============================
export function initHomeJS() {

    // 1. RENDERIZAÇÃO INICIAL DAS SEÇÕES
    renderizarOportunidades(oportunidadesDB);
    renderFAQ();
    renderDocs();

    // 2. LISTENERS DE FILTRO (OPORTUNIDADES)
    document.getElementById("filtro-modalidade")?.addEventListener("change", aplicarFiltros);
    document.getElementById("filtro-status")?.addEventListener("change", aplicarFiltros);
    document.getElementById("input-busca")?.addEventListener("keyup", aplicarFiltros);

    // 3. LISTENERS DE NAVEGAÇÃO E SCROLL
    setupBotoesNavegacao();
    setupAcessoRapido();
}

// ===============================
// LÓGICA DE FILTROS E RENDERIZAÇÃO
// ===============================
function aplicarFiltros() {
    const modalidade = document.getElementById("filtro-modalidade").value;
    const status = document.getElementById("filtro-status").value;
    const busca = document.getElementById("input-busca").value.toLowerCase();

    const filtrados = oportunidadesDB.filter(item => {
        const matchMod = modalidade ? item.modalidade === modalidade : true;
        const matchStat = status ? item.status.includes(status) : true;
        const matchBusca = item.titulo.toLowerCase().includes(busca);
        return matchMod && matchStat && matchBusca;
    });

    renderizarOportunidades(filtrados);
}

function renderizarOportunidades(lista) {
    const grid = document.getElementById("opportunities-grid");
    if (!grid) return;

    if (lista.length === 0) {
        grid.innerHTML = `<div style="width:100%; text-align:center; color:#666; padding: 20px;">Nenhuma oportunidade encontrada.</div>`;
        return;
    }

    grid.innerHTML = lista.map(op => {
        let badgeClass = "badge-success";
        let textoBotao = "Inscrever-se";
        let disabled = "";

        if (op.status === "Encerrado") {
            badgeClass = "badge-neutral";
            textoBotao = "Encerrado";
            disabled = "disabled style='opacity:0.5; cursor:not-allowed'";
        } else if (op.status === "Em Breve") {
            badgeClass = "badge-warning";
            textoBotao = "Aguarde";
            disabled = "disabled";
        }

        return `
            <div class="course-card">
                <div class="course-header" style="font-size: 40px; background: #fafafa;">
                    ${op.imagem}
                </div>
                <div class="course-body">
                    <div>
                        <div class="course-meta">
                            <span class="badge ${badgeClass}" style="font-size: 10px;">${op.status.toUpperCase()}</span>
                            <span>⏱ ${op.carga}</span>
                        </div>
                        <h4 class="course-title">${op.titulo}</h4>
                        <p style="font-size: 12px; color: #777;">Encerra em: <strong>${op.prazo}</strong></p>
                    </div>
                    <button class="btn btn-primary btn-small" style="width:100%; margin-top:15px;" ${disabled}>
                        ${textoBotao}
                    </button>
                </div>
            </div>
        `;
    }).join("");
}

// ===============================
// RENDER FAQ & DOCS
// ===============================
function renderFAQ() {
    const container = document.getElementById("faq-container");
    if (!container) return;
    container.innerHTML = faqDB.map(f => `
        <div class="faq-card">
            <div class="faq-title">${f.pergunta}</div>
            <div class="faq-sub">${f.resposta}</div>
        </div>
    `).join("");
}

function renderDocs() {
    const container = document.getElementById("docs-container");
    if (!container) return;

    container.innerHTML = docsDB.map(d => `
        <div class="doc-card">
            <div class="doc-title">${d.titulo}</div>
            <div class="doc-sub">Categoria: ${d.categoria}</div>
            <div class="doc-sub">
                Acesso: 
                <span class="doc-badge ${d.acesso === "Público" ? "badge-success" : "badge-warning"}" style="background-color: ${d.acesso === 'Público' ? '#28a745' : '#ffc107'}; color: ${d.acesso === 'Público' ? 'white' : 'black'};">
                    ${d.acesso}
                </span>
            </div>
            <a href="${d.link}" class="btn btn-primary btn-small" style="margin-top:10px; width: fit-content;" target="_blank">Download</a>
        </div>
    `).join("");
}

// ===============================
// NAVEGAÇÃO E UTILITÁRIOS
// ===============================
function setupBotoesNavegacao() {
    // Redirecionamento para Login
    document.getElementById("btn-login")?.addEventListener("click", () => {
        window.location.href = "./pages/login/loginscreen.html";
    });

    // SCROLL SUAVE PARA FAQ
    document.getElementById("btn-ajuda-scroll")?.addEventListener("click", () => {
        const secaoFaq = document.getElementById("secao-faq");
        if (secaoFaq) {
            secaoFaq.scrollIntoView({ behavior: "smooth" });
        }
    });
}

function setupAcessoRapido() {
    const modalAcesso = document.getElementById("modal-acesso");
    const btnAcessoRapido = document.getElementById("btn-acesso-rapido");
    const inputSenha = document.getElementById("senha-acesso");

    if (!modalAcesso || !btnAcessoRapido) return;

    const SENHA_ACESSO_RAPIDO = "PPC@dev";

    btnAcessoRapido.addEventListener("click", () => {
        modalAcesso.style.display = "flex";
        inputSenha.value = "";
        inputSenha.focus();
    });

    window.fecharAcessoRapido = () => modalAcesso.style.display = "none";

    window.validarAcessoRapido = () => {
        if (inputSenha.value.trim() === SENHA_ACESSO_RAPIDO) {
            localStorage.setItem("modo_prototipo", "true");
            window.location.href = "./pages/common/routerPerfil.html";
        } else {
            alert("Senha inválida.");
        }
    };
}