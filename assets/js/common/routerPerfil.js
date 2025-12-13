document.querySelectorAll(".perfil-card").forEach(card => {
    card.addEventListener("click", () => {
        const perfil = card.dataset.perfil;

        const rotas = {
            discente: "../discente/dashboard.html",
            docente: "../docente/dashboard.html",
            coordenador_curso: "../coordenador_curso/dashboard.html",
            coordenador_geral: "../coordenador_geral/dashboard.html"
        };

        if (rotas[perfil]) {
            window.location.href = rotas[perfil];
        } else {
            alert("Perfil não implementado.");
        }
    });
});

