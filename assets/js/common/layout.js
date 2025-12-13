export async function carregarLayout(configMenu = []) {

    // Carrega o layout base
    const container = document.getElementById("layout-area");
    const resposta = await fetch("../common/layout.html");
    container.innerHTML = await resposta.text();

    // Recupera o perfil salvo (lógica existente)
    const perfil = localStorage.getItem("perfil") || "usuario";
    
    // Dados mockados de usuário (mantendo sua lógica atual)
    const nomes = {
        docente: "Docente",
        coordenador_curso: "Coordenador do Curso",
        coordenador_geral: "Coordenador Geral"
    };
    const emails = {
        docente: "docente@teste.com",
        coordenador_curso: "coord.curso@teste.com",
        coordenador_geral: "coord.geral@teste.com"
    };

    // Atualiza user info
    document.getElementById("layout-nome").textContent = nomes[perfil] || "Usuário";
    document.getElementById("layout-email").textContent = emails[perfil] || "email@teste.com";
    document.getElementById("layout-avatar").textContent = (nomes[perfil] || "U").charAt(0);

    // ====================================================
    // LÓGICA DO MENU E TÍTULOS DINÂMICOS
    // ====================================================
    const menu = document.getElementById("layout-menu");
    menu.innerHTML = "";

    // Função auxiliar para trocar conteúdo e títulos
    const ativarItem = (item, btnElement) => {
        // 1. Atualiza abas (visual)
        document.querySelectorAll(".menu-item").forEach(el => el.classList.remove("active"));
        btnElement.classList.add("active");

        // 2. Atualiza conteúdo central
        document.getElementById("layout-conteudo").innerHTML = item.content;

        // 3. ATUALIZA TÍTULO E SUBTÍTULO (HEADER)
        const tituloEl = document.getElementById("layout-titulo");
        const subEl = document.getElementById("layout-subtitulo");

        if (tituloEl) tituloEl.textContent = item.title || "Sistema de Extensão";
        if (subEl) subEl.textContent = item.description || "";
    };

    // Gera os botões do menu
    configMenu.forEach((item, index) => {
        const btn = document.createElement("button");
        btn.classList.add("menu-item");
        btn.textContent = item.label; // Nome da aba (curto)

        // Evento de click
        btn.addEventListener("click", () => ativarItem(item, btn));

        menu.appendChild(btn);

        // Ativa o primeiro item automaticamente ao carregar
        if (index === 0) {
            ativarItem(item, btn);
        }
    });
}