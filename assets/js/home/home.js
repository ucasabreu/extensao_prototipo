console.log("✅ home.js carregado");

export function initHomeJS() {
    // ----------------------------
    // LOGIN PADRÃO
    // ----------------------------
    document.getElementById("btn-login")?.addEventListener("click", () => {
        window.location.href = "/pages/login/loginscreen.html";
    });

    // ----------------------------
    // CENTRAL DE AJUDA
    // ----------------------------
    document.getElementById("btn-ajuda")?.addEventListener("click", () => {
        window.location.href = "/pages/ajuda/faq.html";
    });

    // =====================================================
    // ACESSO RÁPIDO (PROTÓTIPO / ADMIN)
    // =====================================================
    const modalAcesso = document.getElementById("modal-acesso");
    const btnAcessoRapido = document.getElementById("btn-acesso-rapido");
    const inputSenha = document.getElementById("senha-acesso");

    if (!modalAcesso || !btnAcessoRapido || !inputSenha) {
        console.error("❌ Elementos do Acesso Rápido não encontrados");
        return;
    }

    const SENHA_ACESSO_RAPIDO = "PPC@dev";

    btnAcessoRapido.addEventListener("click", () => {
        modalAcesso.style.display = "flex";
        inputSenha.value = "";
        inputSenha.focus();
    });

    window.fecharAcessoRapido = () => modalAcesso.style.display = "none";

    window.validarAcessoRapido = () => {
        const senhaDigitada = inputSenha.value.trim();
        if (senhaDigitada === SENHA_ACESSO_RAPIDO) {
            localStorage.setItem("modo_prototipo", "true");
            window.location.href = "/pages/common/routerPerfil.html";
        } else {
            alert("Senha inválida. Acesso não autorizado.");
            inputSenha.focus();
        }
    };

    window.addEventListener("click", (e) => {
        if (e.target === modalAcesso) fecharAcessoRapido();
    });

    // ===============================
    // MOCK - PROPOSTAS DE EXTENSÃO
    // ===============================
    const propostasDB = [
        { titulo: "Projeto de Robótica Educacional", categoria: "Tecnologia", acesso: "Público" },
        { titulo: "Oficina de Artes Integradas", categoria: "Cultura", acesso: "Público" },
        { titulo: "Programa de Voluntariado", categoria: "Social", acesso: "Público" },
        { titulo: "Pesquisa em Sustentabilidade", categoria: "Meio Ambiente", acesso: "Restrito" }
    ];

    // ===============================
    // RENDER PROPOSTAS (ADMIN)
    // ===============================
    function renderPropostasAdmin() {
        const container = document.getElementById("propostas-admin-container");
        if (!container) return;

        container.innerHTML = propostasDB.map(p => `
            <div class="proposta-card">
                <div class="proposta-title">${p.titulo}</div>
                <div class="proposta-sub">Categoria: ${p.categoria}</div>
                <span class="proposta-badge ${p.acesso === "Público" ? "badge-publico" : "badge-restrito"}">
                    ${p.acesso}
                </span>
            </div>
        `).join("");
    }

    document.addEventListener("DOMContentLoaded", renderPropostasAdmin);
}
