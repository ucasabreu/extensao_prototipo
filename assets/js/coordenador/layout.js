/* ====================================================================
   LAYOUT GLOBAL (HEADER, MENU E GERENCIAMENTO DE ABAS)
   Arquivo: assets/js/common/layout.js
   Descrição: Carrega a estrutura base e gerencia a navegação com persistência.
   ==================================================================== */

export async function carregarLayout(configMenu = []) {

    // 1. Carrega o HTML base (Header e containers)
    const container = document.getElementById("layout-area");
    try {
        const resposta = await fetch("../common/layout.html");
        container.innerHTML = await resposta.text();
    } catch (e) {
        console.error("Erro ao carregar layout base:", e);
        return;
    }

    // 2. Configurações do Usuário (Simulação)
    const perfil = localStorage.getItem("perfil") || "usuario";
    
    const dadosUsuario = {
        docente: { nome: "Docente", email: "docente@teste.com" },
        coordenador_curso: { nome: "Coordenador do Curso", email: "coord.curso@teste.com" },
        coordenador_geral: { nome: "Coordenador Geral", email: "coord.geral@teste.com" },
        discente: { nome: "Discente", email: "discente@aluno.ufma.br" }
    };

    const usuarioAtual = dadosUsuario[perfil] || { nome: "Usuário", email: "usuario@teste.com" };

    // Atualiza info no Header
    document.getElementById("layout-nome").textContent = usuarioAtual.nome;
    document.getElementById("layout-email").textContent = usuarioAtual.email;
    document.getElementById("layout-avatar").textContent = usuarioAtual.nome.charAt(0);

    // ====================================================
    // LÓGICA DO MENU COM PERSISTÊNCIA (CORREÇÃO DO REFRESH)
    // ====================================================
    const menu = document.getElementById("layout-menu");
    menu.innerHTML = "";

    // Chave única para salvar a aba deste perfil específico
    const chaveStorage = `abaAtiva_${perfil}`;
    const abaSalva = sessionStorage.getItem(chaveStorage);
    
    let algumaAbaFoiAtivada = false;

    // Função interna para ativar uma aba
    const ativarItem = (item, btnElement) => {
        // a. Atualiza visual dos botões (remove active de todos e adiciona no atual)
        document.querySelectorAll(".menu-item").forEach(el => el.classList.remove("active"));
        btnElement.classList.add("active");

        // b. Injeta o HTML da aba no container principal
        document.getElementById("layout-conteudo").innerHTML = item.content;

        // c. Atualiza Título e Descrição no Header
        const tituloEl = document.getElementById("layout-titulo");
        const subEl = document.getElementById("layout-subtitulo");
        if (tituloEl) tituloEl.textContent = item.title || "Sistema de Extensão";
        if (subEl) subEl.textContent = item.description || "";

        // d. SALVA O ESTADO (Para não perder ao dar refresh)
        sessionStorage.setItem(chaveStorage, item.label);

        // e. Executa script específico da página (onRender), se houver
        if (typeof item.onRender === 'function') {
            item.onRender();
        }
    };

    // Gera os botões do menu
    configMenu.forEach((item) => {
        const btn = document.createElement("button");
        btn.classList.add("menu-item");
        btn.textContent = item.label;

        // Evento de clique
        btn.addEventListener("click", () => ativarItem(item, btn));
        
        menu.appendChild(btn);

        // VERIFICAÇÃO DE INICIALIZAÇÃO:
        // Se a label deste item for igual à que estava salva, ativa ele agora.
        if (abaSalva && item.label === abaSalva) {
            ativarItem(item, btn);
            algumaAbaFoiAtivada = true;
        }
    });

    // FALLBACK: 
    // Se for o primeiro acesso (sem aba salva) ou se a aba salva não existir mais,
    // ativa a primeira opção automaticamente.
    if (!algumaAbaFoiAtivada && configMenu.length > 0) {
        const primeiroBotao = menu.firstChild; // Pega o botão DOM criado acima
        if (primeiroBotao) {
            ativarItem(configMenu[0], primeiroBotao);
        }
    }
}