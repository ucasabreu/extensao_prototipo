document.querySelectorAll(".perfil-card").forEach(card => {
    card.addEventListener("click", () => {
        const perfil = card.getAttribute("data-perfil");

        // salvar perfil escolhido
        localStorage.setItem("perfil", perfil);

        const rotas = {
            docente: "../docente/dashboard.html",
            coordenador_curso: "../coordenador_curso/dashboard.html",
            coordenador_geral: "../coordenador_geral/dashboard.html"
        };

        window.location.href = rotas[perfil];
    });
});