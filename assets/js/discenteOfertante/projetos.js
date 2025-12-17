/* ====================================================
   MOCK
==================================================== */
const projetosDiscenteDB = [
    {
        id: 1,
        titulo: "Projeto Robótica Educacional",
        tipo: "Projeto",
        inicio: "2025-02-01",
        fim: "2025-06-30",
        ch: 80,
        status: "Em Execução",
        ano: 2025,
        semestre: 1,
        professorLider: "Ana Paula Souza"
    },
    {
        id: 2,
        titulo: "Curso de Introdução ao Python",
        tipo: "Curso",
        inicio: "2024-10-01",
        fim: "2024-11-30",
        ch: 40,
        status: "Encerrado",
        ano: 2024,
        semestre: 2,
        professorLider: "Carlos Henrique Lima"
    }
];

const atividadesCriadas = [
    {
        id: 1,
        titulo: "Projeto Robótica Educacional",
        inscritos: ["Ana Souza","Carlos Lima","Fernanda Alves"],
        parecer: {
            status: "Em análise",
            comentario: "Projeto interessante, preciso avaliar melhor a carga horária."
        }
    },
    {
        id: 2,
        titulo: "Curso de Introdução ao Python",
        inscritos: ["Lucas Rocha","Mariana Costa","João Pedro","Paula Mendes"],
        parecer: {
            status: "Aprovado",
            comentario: "Curso aprovado. Estrutura e proposta muito bem definidas."
        }
    }
];

/* ====================================================
   UTILITÁRIOS / HELPERS
==================================================== */
function formatarData(data) {
    if (!data) return "N/A";
    const [a, m, d] = data.split("-");
    return `${d}/${m}/${a}`;
}

function badgePorStatus(status) {
    if (status === "Em Execução") return "badge-success";
    if (status === "Aprovado") return "badge-info";
    if (status === "Encerrado") return "badge-neutral";
    return "badge-danger";
}

function statusParecerClass(status) {
    if (status === "Aprovado") return "status-aprovado";
    if (status === "Em análise") return "status-analise";
    return "status-ajustes";
}

function abrirModal(titulo, conteudo) {
    const modal = document.getElementById("modal-info");
    const body = modal.querySelector(".modal-body");
    const header = modal.querySelector(".modal-header h3");

    header.innerText = titulo;
    body.innerHTML = conteudo;
    modal.classList.remove("hidden");
}

function fecharModal() {
    const modal = document.getElementById("modal-info");
    modal.classList.add("hidden");
}

/* ====================================================
   VIEW / RENDER
==================================================== */

function renderizarProjetosDiscente() {
    const tbody = document.getElementById("tb-projetos-discente");
    if (!tbody) return;

    const termo = document.getElementById("buscaProjetoDiscente").value.toLowerCase();
    const status = document.getElementById("filtroStatusProjetoDiscente").value;
    const ano = document.getElementById("filtroAnoProjetoDiscente").value;
    const semestre = document.getElementById("filtroSemestreProjetoDiscente").value;
    const professor = document.getElementById("filtroProfessorProjetoDiscente").value;

    const lista = projetosDiscenteDB.filter(p => {
        const matchTexto = p.titulo.toLowerCase().includes(termo);
        const matchStatus = status === "todos" || p.status === status;
        const matchAno = ano === "todos" || p.ano === Number(ano);
        const matchSemestre = semestre === "todos" || p.semestre === Number(semestre);
        const matchProfessor = professor === "todos" || p.professorLider === professor;
        return matchTexto && matchStatus && matchAno && matchSemestre && matchProfessor;
    });

    if (lista.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" align="center">Nenhum projeto encontrado.</td></tr>`;
        return;
    }

    tbody.innerHTML = lista.map(p => `
        <tr>
            <td><strong>${p.titulo}</strong></td>
            <td>${p.tipo}</td>
            <td>${formatarData(p.inicio)} a ${formatarData(p.fim)}</td>
            <td>${p.ch}h</td>
            <td><span class="badge ${badgePorStatus(p.status)}">${p.status}</span></td>
            <td>${p.professorLider}</td>
        </tr>
    `).join("");
}

window.filtrarProjetosDiscente = renderizarProjetosDiscente;

function renderizarInformacoesDiscente() {
    const container = document.getElementById("lista-atividades-criadas");
    if (!container) return;

    if (atividadesCriadas.length === 0) {
        container.innerHTML = `<p class="tab-placeholder">Você ainda não criou nenhuma atividade.</p>`;
        return;
    }

    container.innerHTML = atividadesCriadas.map(a => {
        const projeto = projetosDiscenteDB.find(p => p.id === a.id);

        return `
        <div class="info-card linha">
            <div class="info-card-body">
                <p><strong>Título:</strong> ${a.titulo}</p>
                <p><strong>Status:</strong> <span class="status ${statusParecerClass(a.parecer.status)}">${a.parecer.status}</span></p>
                <p><strong>Professor Líder:</strong> ${projeto?.professorLider || "N/A"}</p>
                <p><strong>Inscritos:</strong> ${a.inscritos.length}</p>
                <p><strong>Período:</strong> ${formatarData(projeto?.inicio)} a ${formatarData(projeto?.fim)}</p>
                <p><strong>Carga Horária:</strong> ${projeto?.ch}h</p>
            </div>
            <div class="info-card-actions">
                <button class="info-btn" onclick="verInscritos(${a.id})">Ver inscritos</button>
                <button class="info-btn" onclick="verCronograma(${a.id})">Cronograma</button>
                <button class="info-btn" onclick="convidarDiscente(${a.id})">Convidar discente</button>
                <button class="info-btn primary" onclick="verParecer(${a.id})">Ver parecer</button>
            </div>
        </div>`;
    }).join("");
}

/* ====================================================
   FUNÇÕES DOS BOTÕES FUNCIONAIS
==================================================== */

window.verParecer = function(id) {
    const atividade = atividadesCriadas.find(a => a.id === id);
    if (!atividade) return;

    abrirModal(
        `Parecer do Professor - ${atividade.titulo}`,
        `<p><strong>Status:</strong> ${atividade.parecer.status}</p>
         <p style="margin-top:10px;">${atividade.parecer.comentario}</p>`
    );
};

window.verInscritos = function(id) {
    const atividade = atividadesCriadas.find(a => a.id === id);
    if (!atividade) return;

    const lista = atividade.inscritos.map(nome => `<li>${nome}</li>`).join("");
    abrirModal(`Discentes Inscritos - ${atividade.titulo}`, `<ul>${lista}</ul>`);
};

window.verCronograma = function(id) {
    const projeto = projetosDiscenteDB.find(p => p.id === id);
    if (!projeto) return;

    abrirModal(
        `Cronograma - ${projeto.titulo}`,
        `<p><strong>Início:</strong> ${formatarData(projeto.inicio)}</p>
         <p><strong>Término:</strong> ${formatarData(projeto.fim)}</p>
         <p>Mais detalhes do cronograma podem ser adicionados aqui.</p>`
    );
};

window.convidarDiscente = function(id) {
    const atividade = atividadesCriadas.find(a => a.id === id);
    if (!atividade) return;

    abrirModal(
        `Convidar Discente - ${atividade.titulo}`,
        `<form id="form-convite">
            <label for="nomeDiscente">Nome do Discente:</label>
            <input type="text" id="nomeDiscente" name="nomeDiscente" placeholder="Digite o nome" required style="margin-top:5px; width:100%; padding:6px;">
            <button type="submit" class="info-btn primary" style="margin-top:10px;">Enviar Convite</button>
        </form>`
    );

    const form = document.getElementById("form-convite");
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const nome = form.nomeDiscente.value.trim();
        if (!nome) return;

        atividade.inscritos.push(nome);

        alert(`Convite enviado para ${nome}!`);
        fecharModal();
        renderizarInformacoesDiscente();
    });
};

/* ====================================================
   FILTROS / FORM
==================================================== */

function popularFiltroProfessor() {
    const select = document.getElementById("filtroProfessorProjetoDiscente");
    if (!select) return;

    const professores = [...new Set(projetosDiscenteDB.map(p => p.professorLider))];
    professores.forEach(nome => {
        const option = document.createElement("option");
        option.value = nome;
        option.textContent = nome;
        select.appendChild(option);
    });
}

function inicializarFormOportunidade() {
    const tipoParticipacao = document.getElementById("tipoParticipacao");
    const campoConvidados = document.getElementById("campo-convidados");
    if (tipoParticipacao && campoConvidados) {
        tipoParticipacao.addEventListener("change", () => {
            if (tipoParticipacao.value === "grupo" || tipoParticipacao.value === "liga") {
                campoConvidados.classList.remove("hidden");
            } else {
                campoConvidados.classList.add("hidden");
            }
        });
    }

    const modalidadeAtividade = document.getElementById("modalidadeAtividade");
    const campoLocal = document.getElementById("campo-local");
    if (modalidadeAtividade && campoLocal) {
        modalidadeAtividade.addEventListener("change", () => {
            if (modalidadeAtividade.value === "presencial") {
                campoLocal.classList.remove("hidden");
            } else {
                campoLocal.classList.add("hidden");
            }
        });
    }
}

/* ====================================================
   SUBMENU
==================================================== */

function inicializarSubmenu() {
    const botoes = document.querySelectorAll(".submenu-btn");
    const tabs = document.querySelectorAll(".tab-content");

    botoes.forEach(btn => {
        btn.addEventListener("click", () => {
            botoes.forEach(b => b.classList.remove("active"));
            tabs.forEach(t => t.classList.remove("active"));

            btn.classList.add("active");
            document.getElementById(btn.dataset.target).classList.add("active");
        });
    });
}

/* ====================================================
   INIT / EXPORTS
==================================================== */

export async function carregarProjetosDiscenteOfertante() {
    const response = await fetch("../../pages/discenteOfertante/projetos.html");
    return await response.text();
}

export function ativarProjetosDiscenteOfertante() {
    inicializarSubmenu();
    popularFiltroProfessor();
    inicializarFormOportunidade();
    renderizarProjetosDiscente();
    renderizarInformacoesDiscente();

    inicializarSelecaoAtividadeGerenciar?.();
    inicializarGerenciarSubmenu?.();
    popularSelectGerenciar?.();
}
