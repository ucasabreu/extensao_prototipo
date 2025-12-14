/* ====================================================================
   LÓGICA DA VISÃO GERAL (DOCENTE)
   Arquivo: assets/js/docente/visao_geral.js
   Requisitos: RF011, RF015, RF019, RF020, RN006
   ==================================================================== */

// MOCK: Dados do Docente com casos de uso específicos
const dadosDocente = {
    // Lista unificada para facilitar
    itens: [
        { 
            id: 1,
            titulo: "Curso de Python Básico", 
            categoria: "Atividade", // Já aprovada
            tipo: "Curso", 
            inicio: "2025-01-10",
            fim: "2025-02-10", // Futuro
            inscritos: 35,
            vagas: 40,
            pendentes: 5, // Inscrições para aprovar
            frequenciaMedia: "85%",
            status: "Em Execução"
        },
        { 
            id: 2,
            titulo: "Semana da Engenharia 2025", 
            categoria: "Proposta", // Ainda não aprovada
            tipo: "Evento", 
            inicio: "2025-05-20",
            fim: "2025-05-25",
            inscritos: 0,
            vagas: 150,
            pendentes: 0,
            frequenciaMedia: "-",
            status: "Em Análise"
        },
        { 
            id: 3,
            titulo: "Workshop de IoT", 
            categoria: "Atividade",
            tipo: "Workshop", 
            inicio: "2024-11-01",
            fim: "2024-11-05", // Passado -> Deve encerrar
            inscritos: 20,
            vagas: 20,
            pendentes: 0,
            frequenciaMedia: "60%", // ALERTA: Frequência baixa
            status: "Aguardando Encerramento" // Estado implícito RF020
        }
    ],
    grupos: [
        { nome: "Liga de Robótica", membros: 12 },
        { nome: "Grupo de Pesquisa IA", membros: 5 }
    ]
};

export async function carregarVisaoGeralDocente() {
    try {
        const response = await fetch('../../pages/docente/visao_geral.html');
        return await response.text();
    } catch (error) {
        console.error("Erro ao carregar view docente:", error);
        return "Erro ao carregar painel.";
    }
}

export function initVisaoGeralDocente() {
    renderizarDashboardDocente();
}

function renderizarDashboardDocente() {
    const itens = dadosDocente.itens;

    // 1. Cálculos de KPI
    const inscricoesPendentes = itens.reduce((acc, i) => acc + (i.pendentes || 0), 0);
    const ativas = itens.filter(i => i.status === "Em Execução").length;
    const paraEncerrar = itens.filter(i => i.status === "Aguardando Encerramento").length;

    document.getElementById("kpi-doc-inscricoes").textContent = inscricoesPendentes;
    document.getElementById("kpi-doc-ativas").textContent = ativas;
    document.getElementById("kpi-doc-encerrar").textContent = paraEncerrar;

    // 2. Renderizar Tabela
    const tbody = document.getElementById("tb-minhas-atividades");
    tbody.innerHTML = itens.map(item => {
        let badgeClass = "badge-neutral";
        let acaoBtn = "";

        // Lógica de Status e Ações
        if (item.status === "Em Execução") {
            badgeClass = "badge-success";
            acaoBtn = `<button class="btn-small btn-small-info" title="Lançar Frequência">📝 Diário</button>`;
        } else if (item.status === "Em Análise") {
            badgeClass = "badge-warning";
            acaoBtn = `<button class="btn-small btn-small-secondary" title="Ver Detalhes">👁️ Ver</button>`;
        } else if (item.status === "Aguardando Encerramento") {
            badgeClass = "badge-danger"; // Urgente
            acaoBtn = `<button class="btn-small btn-small-success" title="Emitir Certificados">🏁 Encerrar</button>`;
        }

        // Diferenciação Visual Proposta vs Atividade
        const iconCategoria = item.categoria === "Proposta" ? "📄" : "🚀";

        return `
            <tr>
                <td><strong>${item.titulo}</strong></td>
                <td><span style="font-size:12px; color:#555;">${iconCategoria} ${item.categoria}</span></td>
                <td><span style="font-size:12px;">${formatarData(item.inicio)}</span></td>
                <td>${item.inscritos} / ${item.vagas}</td>
                <td><span class="badge ${badgeClass}">${item.status}</span></td>
                <td class="actions">${acaoBtn}</td>
            </tr>
        `;
    }).join("");

    // 3. Renderizar Alertas (Lógica de Negócio)
    const containerAlertas = document.getElementById("lista-alertas-docente");
    let htmlAlertas = "";

    // Alerta de Frequência (RN006)
    const frequenciaCritica = itens.filter(i => i.frequenciaMedia !== "-" && parseInt(i.frequenciaMedia) < 75);
    if (frequenciaCritica.length > 0) {
        frequenciaCritica.forEach(f => {
            htmlAlertas += `
                <div class="alert alert-danger" style="margin-bottom:0; font-size:12px; padding:10px;">
                    <strong>Frequência Crítica:</strong> A atividade "${f.titulo}" está com média de ${f.frequenciaMedia}. Alunos podem não ser certificados.
                </div>`;
        });
    }

    // Alerta de Inscrições
    if (inscricoesPendentes > 0) {
        htmlAlertas += `
            <div class="alert alert-warning" style="margin-bottom:0; font-size:12px; padding:10px;">
                Você tem <strong>${inscricoesPendentes} novas inscrições</strong> aguardando validação.
            </div>`;
    }

    if (htmlAlertas === "") {
        htmlAlertas = `<div style="text-align:center; color:#666; font-size:13px; padding:10px;">✅ Tudo em dia!</div>`;
    }
    containerAlertas.innerHTML = htmlAlertas;

    // 4. Renderizar Grupos
    const containerGrupos = document.getElementById("lista-grupos-docente");
    containerGrupos.innerHTML = dadosDocente.grupos.map(g => `
        <div class="grupo-item">
            <span style="font-weight:600; color:#333;">${g.nome}</span>
            <span class="badge badge-neutral" style="font-size:11px;">${g.membros} membros</span>
        </div>
    `).join("");
}

function formatarData(dataStr) {
    const [ano, mes, dia] = dataStr.split("-");
    return `${dia}/${mes}/${ano}`;
}