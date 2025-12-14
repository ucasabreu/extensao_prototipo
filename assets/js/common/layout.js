console.log("Carregando layout...");

export async function carregarLayout(configMenu = []) {
    // Pega o container principal onde o layout será injetado
    const container = document.getElementById("layout-area");
    if (!container) {
        console.error("Não encontrou #layout-area!");
        return;
    }
    
    // Carrega o HTML do layout
    try {
        const resposta = await fetch("../common/layout.html"); // path relativo ao HTML
        if (!resposta.ok) {
            console.error("Erro ao carregar layout:", resposta.status, resposta.statusText);
            return;
        }

        const html = await resposta.text();
        container.innerHTML = html;
        console.log("Layout carregado com sucesso!");
    } catch (err) {
        console.error("Falha no fetch do layout:", err);
        return;
    }

    // Recupera o perfil salvo (ou usa "usuario" como padrão)
    const perfil = localStorage.getItem("perfil") || "usuario";

    const nomes = {
        docente: "Docente",
        coordenador_curso: "Coordenador do Curso",
        coordenador_geral: "Coordenador Geral",
        discente: "Discente",
        discenteOfertante: "Discente Ofertante"
        
    };

    const emails = {
        docente: "docente@teste.com",
        coordenador_curso: "coord.curso@teste.com",
        coordenador_geral: "coord.geral@teste.com",
        discente: "discente@teste.com",
        discenteOfertante: "discent@teste.com"

    };

    // Atualiza info do usuário no layout
    document.getElementById("layout-nome").textContent = nomes[perfil] || "Usuário";
    document.getElementById("layout-email").textContent = emails[perfil] || "email@teste.com";
    document.getElementById("layout-avatar").textContent = (nomes[perfil] || "U").charAt(0);

    // ====================================================
    // Lógica do menu e troca de conteúdo
    // ====================================================
    const menu = document.getElementById("layout-menu");
    if (!menu) {
        console.error("Não encontrou #layout-menu!");
        return;
    }
    menu.innerHTML = "";

    const ativarItem = (item, btnElement) => {
        // Marca visual do botão ativo
        document.querySelectorAll(".menu-item").forEach(el => el.classList.remove("active"));
        btnElement.classList.add("active");

        // Troca conteúdo da aba
        const conteudo = document.getElementById("layout-conteudo");
        if (conteudo) {
            conteudo.innerHTML = item.content;
        }

        // Atualiza títulos
        const tituloEl = document.getElementById("layout-titulo");
        const subEl = document.getElementById("layout-subtitulo");
        if (tituloEl) tituloEl.textContent = item.title || "Sistema de Extensão";
        if (subEl) subEl.textContent = item.description || "";

        // Hook opcional por aba
        if (typeof item.onActivate === "function") {
            item.onActivate();
        }
    };

    // Cria botões do menu
    configMenu.forEach((item, index) => {
        const btn = document.createElement("button");
        btn.classList.add("menu-item");
        btn.textContent = item.label;

        btn.addEventListener("click", () => ativarItem(item, btn));
        menu.appendChild(btn);

        // Ativa o primeiro item automaticamente
        if (index === 0) {
            ativarItem(item, btn);
        }
    });
}
