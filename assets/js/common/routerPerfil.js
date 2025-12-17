// =====================================================
// PROTEÇÃO – ACESSO RÁPIDO / LOGIN
// =====================================================

const modoPrototipo = localStorage.getItem("modo_prototipo");
const perfilLogado = localStorage.getItem("perfil");

// se não veio do login nem do acesso rápido
if (!modoPrototipo && !perfilLogado) {
    alert("Acesso não autorizado.");
    window.location.href = "/index.html";
}

document.querySelectorAll(".perfil-card").forEach(card => {
    card.addEventListener("click", () => {
        const perfil = card.dataset.perfil;

        // 1. Limpa dados de sessões anteriores (CORREÇÃO AQUI)
        localStorage.removeItem("nome");
        localStorage.removeItem("email");

        // 2. Define o novo perfil
        localStorage.setItem("perfil", perfil);
        localStorage.removeItem("modo_prototipo");

        const rotas = {
            discente: "../discente/dashboard.html",
            docente: "../docente/dashboard.html",
            coordenador_curso: "../coordenador_curso/dashboard.html",
            coordenador_geral: "../coordenador_geral/dashboard.html",
            discenteOfertante: "../discenteOfertante/dashboard.html",
            administrador: "../administrador/dashboard.html"
        };

        window.location.href = rotas[perfil];
    });
});


