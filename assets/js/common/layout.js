/* ====================================================================
   LAYOUT GLOBAL (HEADER, MENU E GERENCIAMENTO DE ABAS)
   Arquivo: assets/js/common/layout.js
   ==================================================================== */

export async function carregarLayout(configMenu = []) {

    // 1. Carrega o HTML base
    const container = document.getElementById("layout-area");
    if (!container) {
        console.error("Não encontrou #layout-area!");
        return;
    }

    try {
        const resposta = await fetch("../common/layout.html");
        if (!resposta.ok) {
            console.error("Erro ao carregar layout:", resposta.statusText);
            return;
        }
        container.innerHTML = await resposta.text();
    } catch (e) {
        console.error("Erro ao carregar layout base:", e);
        return;
    }

    // ====================================================
    // BOTÃO PERFIL
    // ====================================================
    const btnPerfil = container.querySelector(".btn-perfil");
    if (btnPerfil) {
        btnPerfil.addEventListener("click", abrirPaginaPerfil);
    }

    // ====================================================
    // DADOS DO USUÁRIO (COM SUPORTE A DISCENTE OFERTANTE)
    // ====================================================
    const perfil = localStorage.getItem("perfil") || "usuario";

    const dadosUsuario = {
        docente: { nome: "Docente", email: "docente@teste.com" },
        coordenador_curso: { nome: "Coordenador do Curso", email: "coord.curso@teste.com" },
        coordenador_geral: { nome: "Coordenador Geral", email: "coord.geral@teste.com" },
        discente: { nome: "Discente", email: "discente@aluno.ufma.br" },
        discenteOfertante: { nome: "Discente Ofertante", email: "discente.ofertante@aluno.ufma.br" }
    };

    const usuarioAtual = dadosUsuario[perfil] || { nome: "Usuário", email: "usuario@teste.com" };

    const elNome = document.getElementById("layout-nome");
    const elEmail = document.getElementById("layout-email");
    const elAvatar = document.getElementById("layout-avatar");

    if (elNome) elNome.textContent = usuarioAtual.nome;
    if (elEmail) elEmail.textContent = usuarioAtual.email;
    if (elAvatar) elAvatar.textContent = usuarioAtual.nome.charAt(0);

    // ====================================================
    // MENU COM PERSISTÊNCIA
    // ====================================================
    const menu = document.getElementById("layout-menu");
    if (!menu) {
        console.error("Não encontrou #layout-menu!");
        return;
    }
    menu.innerHTML = "";

    const chaveStorage = `abaAtiva_${perfil}`;
    const abaSalva = sessionStorage.getItem(chaveStorage);
    let algumaAbaFoiAtivada = false;

    const ativarItem = (item, btnElement) => {
        document.querySelectorAll(".menu-item").forEach(el => el.classList.remove("active"));
        btnElement.classList.add("active");

        document.getElementById("layout-conteudo").innerHTML = item.content;

        const tituloEl = document.getElementById("layout-titulo");
        const subEl = document.getElementById("layout-subtitulo");
        if (tituloEl) tituloEl.textContent = item.title || "Sistema de Extensão";
        if (subEl) subEl.textContent = item.description || "";

        sessionStorage.setItem(chaveStorage, item.label);

        if (typeof item.onRender === "function") {
            item.onRender();
        }
    };

    configMenu.forEach(item => {
        const btn = document.createElement("button");
        btn.classList.add("menu-item");
        btn.textContent = item.label;

        btn.addEventListener("click", () => ativarItem(item, btn));
        menu.appendChild(btn);

        if (abaSalva && item.label === abaSalva) {
            ativarItem(item, btn);
            algumaAbaFoiAtivada = true;
        }
    });

    if (!algumaAbaFoiAtivada && configMenu.length > 0) {
        ativarItem(configMenu[0], menu.firstChild);
    }
}

/* ====================================================
   ABRIR PERFIL (LAZY LOADING)
   ==================================================== */
async function abrirPaginaPerfil() {
    try {
        const tipoPerfil = localStorage.getItem("perfil") || "docente";
        let strategyModule;

        if (tipoPerfil === "docente") {
            strategyModule = await import('../strategies/perfil_docente.js');
        } else if (tipoPerfil.includes("coordenador")) {
            strategyModule = await import('../strategies/perfil_coordenador.js');
        } else if (tipoPerfil === "discente" || tipoPerfil === "discenteOfertante") {
            strategyModule = await import('../strategies/perfil_discente.js');
        } else {
            strategyModule = await import('../strategies/perfil_docente.js');
        }

        const strategy = Object.values(strategyModule)[0];
        const { carregarViewPerfil, initPerfil } = await import('./perfil.js');

        const html = await carregarViewPerfil();
        document.getElementById("layout-conteudo").innerHTML = html;

        initPerfil(strategy);

        const tituloEl = document.getElementById("layout-titulo");
        const subEl = document.getElementById("layout-subtitulo");
        if (tituloEl) tituloEl.textContent = "Meu Perfil";
        if (subEl) subEl.textContent = "Gerencie seus dados e preferências";

        document.querySelectorAll(".menu-item").forEach(b => b.classList.remove("active"));

    } catch (erro) {
        console.error("Erro ao carregar perfil:", erro);
        alert("Erro ao carregar perfil.");
    }
}