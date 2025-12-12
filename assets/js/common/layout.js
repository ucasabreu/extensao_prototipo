export async function carregarLayout(configMenu = []) {

    // Carrega o layout base
    const container = document.getElementById("layout-area");
    const resposta = await fetch("../common/layout.html");
    container.innerHTML = await resposta.text();

    // Recupera o perfil salvo no login
    const perfil = localStorage.getItem("perfil") || "usuario";

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

    // Atualiza informações do usuário
    document.getElementById("layout-nome").textContent = nomes[perfil];
    document.getElementById("layout-email").textContent = emails[perfil];
    document.getElementById("layout-avatar").textContent = nomes[perfil].charAt(0);

    // Renderiza menu
    const menu = document.getElementById("layout-menu");
    menu.innerHTML = "";

    configMenu.forEach(item => {
        const btn = document.createElement("button");
        btn.classList.add("menu-item");
        btn.textContent = item.label;

        btn.addEventListener("click", () => {
            document.querySelectorAll(".menu-item").forEach(el => el.classList.remove("active"));
            btn.classList.add("active");
            document.getElementById("layout-conteudo").innerHTML = item.content;
        });

        menu.appendChild(btn);
    });

    // Ativa automaticamente a primeira aba
    if (configMenu.length > 0) {
        document.querySelector(".menu-item").classList.add("active");
        document.getElementById("layout-conteudo").innerHTML = configMenu[0].content;
    }
}