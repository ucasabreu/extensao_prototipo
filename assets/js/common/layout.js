/* ====================================================================
   LAYOUT GLOBAL (HEADER, MENU E GERENCIAMENTO DE ABAS)
   Arquivo: assets/js/common/layout.js
   Descrição: Carrega a estrutura base e gerencia a navegação com persistência.
   ==================================================================== */

export async function carregarLayout(configMenu = []) {

    // 1. Carrega o HTML base (Header e containers)
    const container = document.getElementById("layout-area");
    try {
        // Ajuste o caminho se necessário (ex: ../common/layout.html)
        const resposta = await fetch("../common/layout.html");
        container.innerHTML = await resposta.text();
    } catch (e) {
        console.error("Erro ao carregar layout base:", e);
        return;
    }

    // ====================================================
    // [NOVO] LÓGICA DO BOTÃO PERFIL
    // ====================================================
    const btnPerfil = container.querySelector(".btn-perfil");
    if (btnPerfil) {
        // Adiciona o evento de clique para abrir a nova seção
        btnPerfil.addEventListener("click", abrirPaginaPerfil);
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

    // Atualiza info no Header (elementos já existem no HTML carregado acima)
    const elNome = document.getElementById("layout-nome");
    const elEmail = document.getElementById("layout-email");
    const elAvatar = document.getElementById("layout-avatar");

    if (elNome) elNome.textContent = usuarioAtual.nome;
    if (elEmail) elEmail.textContent = usuarioAtual.email;
    if (elAvatar) elAvatar.textContent = usuarioAtual.nome.charAt(0);

    // ====================================================
    // LÓGICA DO MENU COM PERSISTÊNCIA
    // ====================================================
    const menu = document.getElementById("layout-menu");
    menu.innerHTML = "";

    const chaveStorage = `abaAtiva_${perfil}`;
    const abaSalva = sessionStorage.getItem(chaveStorage);
    let algumaAbaFoiAtivada = false;

    // Função interna para ativar uma aba
    const ativarItem = (item, btnElement) => {
        // a. Atualiza visual dos botões
        document.querySelectorAll(".menu-item").forEach(el => el.classList.remove("active"));
        btnElement.classList.add("active");

        // b. Injeta o HTML da aba
        document.getElementById("layout-conteudo").innerHTML = item.content;

        // c. Atualiza Título e Descrição
        const tituloEl = document.getElementById("layout-titulo");
        const subEl = document.getElementById("layout-subtitulo");
        if (tituloEl) tituloEl.textContent = item.title || "Sistema de Extensão";
        if (subEl) subEl.textContent = item.description || "";

        // d. Salva estado
        sessionStorage.setItem(chaveStorage, item.label);

        // e. Executa script específico (Init)
        if (typeof item.onRender === 'function') {
            item.onRender();
        }
    };

    // Gera os botões
    configMenu.forEach((item) => {
        const btn = document.createElement("button");
        btn.classList.add("menu-item");
        btn.textContent = item.label;

        btn.addEventListener("click", () => ativarItem(item, btn));

        menu.appendChild(btn);

        // Verifica aba salva
        if (abaSalva && item.label === abaSalva) {
            ativarItem(item, btn);
            algumaAbaFoiAtivada = true;
        }
    });

    // Fallback para a primeira aba
    if (!algumaAbaFoiAtivada && configMenu.length > 0) {
        const primeiroBotao = menu.firstChild;
        if (primeiroBotao) ativarItem(configMenu[0], primeiroBotao);
    }
}

/* ====================================================
   FUNÇÃO AUXILIAR: ABRIR PERFIL
   Carrega o módulo sob demanda (Lazy Loading)
   ==================================================== */
async function abrirPaginaPerfil() {
    try {
        console.log("Carregando módulo de perfil...");
        
        // 1. Determina qual estratégia usar baseada no localStorage
        const tipoPerfil = localStorage.getItem("perfil") || "docente";
        let strategyModule;

        // Importa a estratégia correta dinamicamente
        // IMPORTANTE: Certifique-se de ter criado a pasta 'assets/js/strategies/'
        if (tipoPerfil === "docente") {
            strategyModule = await import('../strategies/perfil_docente.js');
        } else if (tipoPerfil.includes("coordenador")) {
            strategyModule = await import('../strategies/perfil_coordenador.js');
        } else if (tipoPerfil === "discente") {
            strategyModule = await import('../strategies/perfil_discente.js');
        } else {
            // FALLBACK: Se o perfil não for reconhecido, carrega Docente por segurança
            console.warn(`Perfil '${tipoPerfil}' não mapeado. Carregando padrão.`);
            strategyModule = await import('../../assets/js/strategies/perfil_docente.js');
        }

        // Pega a estratégia exportada (pega o primeiro objeto exportado do arquivo)
        const strategy = Object.values(strategyModule)[0]; 

        // 2. Importa o motor genérico (Visualizador)
        // Nota: './perfil.js' assume que layout.js e perfil.js estão na mesma pasta 'common'
        const { carregarViewPerfil, initPerfil } = await import('./perfil.js');
        
        // 3. Carrega HTML (Esqueleto)
        const html = await carregarViewPerfil();
        
        // 4. Substitui o conteúdo principal
        document.getElementById("layout-conteudo").innerHTML = html;
        
        // 5. INJETA A ESTRATÉGIA NO MOTOR!
        // Aqui o perfil.js recebe os dados específicos e preenche a tela
        initPerfil(strategy);
        
        // 6. Atualiza Header
        const tituloEl = document.getElementById("layout-titulo");
        const subEl = document.getElementById("layout-subtitulo");
        if (tituloEl) tituloEl.textContent = "Meu Perfil";
        if (subEl) subEl.textContent = "Gerencie seus dados e preferências";

        // 7. Remove seleção do menu principal
        document.querySelectorAll(".menu-item").forEach(b => b.classList.remove("active"));

    } catch (erro) {
        console.error("Erro ao carregar estratégia de perfil:", erro);
        alert("Erro ao carregar perfil. Verifique se os arquivos na pasta 'js/strategies/' existem.");
    }
}