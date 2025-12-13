/* ====================================================================
   MÓDULO DE PROJETO PEDAGÓGICO (PPC)
   Arquivo: assets/js/coordenador/ppc.js
   ==================================================================== */

// MOCK: Banco de Dados de PPCs (Agora com nome do arquivo)
let ppcDB = [
    {
        id: 1,
        codigo: "BCC-2023",
        curso: "Ciência da Computação",
        inicio: "2023.1",
        fim: "2027.2",
        horasMinimas: 360,
        status: "Vigente",
        alunosVinculados: 120,
        concluintes: 32,
        responsavel: "Prof. Carlos (Coord)",
        dataCadastro: "10/01/2023",
        arquivo: "PPC_BCC_2023_VersaoFinal.pdf", // [NOVO]
        tamanho: "2.4 MB",
        listaAlunos: [
            { matricula: "2023001", nome: "Ana Clara Souza", situacao: "Regular", progresso: "33%" },
            { matricula: "2023002", nome: "Bruno Lima", situacao: "Regular", progresso: "45%" },
            { matricula: "2023005", nome: "Carlos Eduardo", situacao: "Em Risco", progresso: "10%" }
        ]
    },
    {
        id: 2,
        codigo: "BCC-2018",
        curso: "Ciência da Computação",
        inicio: "2018.1",
        fim: "2022.2",
        horasMinimas: 300,
        status: "Encerrado",
        alunosVinculados: 18,
        concluintes: 15,
        responsavel: "Profa. Ana (Ex-Coord)",
        dataCadastro: "15/02/2018",
        arquivo: "PPC_Antigo_2018.pdf", // [NOVO]
        tamanho: "1.8 MB",
        listaAlunos: [
            { matricula: "2018099", nome: "João Pedro Alves", situacao: "Formando", progresso: "95%" },
            { matricula: "2019100", nome: "Maria Helena", situacao: "Concluído", progresso: "100%" }
        ]
    }
];

export async function carregarViewPPC() {
    try {
        const response = await fetch('../../pages/coordenador_curso/ppc.html');
        return await response.text();
    } catch (error) {
        console.error("Erro view PPC:", error);
        return "Erro ao carregar módulo.";
    }
}

export function initPPC() {
    renderizarPPCVigente();
    renderizarArquivoVigente(); // [NOVO]
    renderizarHistorico();
    renderizarImpacto();
}

/* =======================
   RENDERIZAÇÃO
   ======================= */

function renderizarPPCVigente() {
    const container = document.getElementById("container-ppc-vigente");
    if(!container) return;

    const vigente = ppcDB.find(p => p.status === "Vigente");

    if (vigente) {
        container.innerHTML = `
            <div style="font-size: 14px; margin-bottom: 10px;">
                <strong>Código:</strong> ${vigente.codigo}
            </div>
            <div style="font-size: 14px; margin-bottom: 10px;">
                <strong>Vigência:</strong> ${vigente.inicio} a ${vigente.fim}
            </div>
            <div style="background: #f8efda; padding: 15px; border-radius: 8px; text-align: center; margin: 15px 0;">
                <div style="font-size: 12px; color: #666;">Carga Horária Mínima</div>
                <div style="font-size: 32px; font-weight: bold; color: #5d0b0b;">${vigente.horasMinimas}h</div>
            </div>
            <div style="font-size: 12px; color: #888;">
                Cadastro: ${vigente.dataCadastro} (${vigente.responsavel})
            </div>
        `;
        document.getElementById("ppc-meta-horas").textContent = vigente.horasMinimas + "h";
    } else {
        container.innerHTML = `<div class="alert alert-danger">Nenhum PPC Vigente!</div>`;
    }
}

// [NOVO] Renderiza o Card de Arquivo
function renderizarArquivoVigente() {
    const container = document.getElementById("container-arquivo-vigente");
    if(!container) return;

    const vigente = ppcDB.find(p => p.status === "Vigente");

    if (vigente) {
        container.innerHTML = `
            <div style="font-size: 30px;">📄</div>
            <div style="flex: 1; overflow: hidden;">
                <div style="font-weight: bold; color: #333; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${vigente.arquivo}</div>
                <div style="font-size: 11px; color: #888;">PDF • ${vigente.tamanho}</div>
            </div>
            <button class="btn-small btn-small-info" onclick="alert('Baixando ${vigente.arquivo}...')">⬇ Baixar</button>
        `;
    } else {
        container.innerHTML = `<span style="font-size:12px; color:#999;">Sem arquivo cadastrado.</span>`;
    }
}

function renderizarHistorico() {
    const tbody = document.getElementById("tb-historico-ppc");
    if(!tbody) return;

    const lista = ppcDB.sort((a,b) => b.id - a.id);

    tbody.innerHTML = lista.map(p => {
        let badge = "badge-neutral";
        if (p.status === "Vigente") badge = "badge-success";
        if (p.status === "Encerrado") badge = "badge-danger";

        return `
            <tr>
                <td><strong>${p.codigo}</strong></td>
                <td>${p.inicio} - ${p.fim}</td>
                <td>${p.horasMinimas}h</td>
                <td>${p.alunosVinculados}</td>
                <td><span class="badge ${badge}">${p.status.toUpperCase()}</span></td>
                <td class="actions">
                    <button class="btn-small btn-small-info" onclick="verDetalhesPPC(${p.id})">🔍 Ver</button>
                </td>
            </tr>
        `;
    }).join("");
}

function renderizarImpacto() {
    const vigente = ppcDB.find(p => p.status === "Vigente");
    const antigos = ppcDB.filter(p => p.status !== "Vigente");
    
    const totalAntigos = antigos.reduce((acc, curr) => acc + curr.alunosVinculados, 0);
    const totalConcluintes = ppcDB.reduce((acc, curr) => acc + (curr.concluintes || 0), 0);

    document.getElementById("ppc-impacto-atual").textContent = vigente ? vigente.alunosVinculados : 0;
    document.getElementById("ppc-impacto-antigo").textContent = totalAntigos;
    document.getElementById("ppc-concluintes").textContent = totalConcluintes;
}

/* =======================
   AÇÕES
   ======================= */

// [ATUALIZADO] Visualizar Detalhes com Download de Arquivo Antigo
window.verDetalhesPPC = (id) => {
    const p = ppcDB.find(item => item.id === id);
    if (!p) return;

    const linhasAlunos = (p.listaAlunos || []).map(a => `
        <tr>
            <td>${a.matricula}</td>
            <td>${a.nome}</td>
            <td>${a.progresso}</td>
            <td><span class="badge ${a.situacao === 'Em Risco' ? 'badge-danger' : 'badge-neutral'}">${a.situacao}</span></td>
        </tr>
    `).join("") || "<tr><td colspan='4'>Nenhum aluno vinculado.</td></tr>";

    const html = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
            <h3 style="margin:0; color:#5d0b0b;">${p.codigo}</h3>
            <span class="badge ${p.status === 'Vigente' ? 'badge-success' : 'badge-danger'}">${p.status}</span>
        </div>

        <div style="background:#fff; border: 1px solid #e3d8c7; border-radius:8px; padding:15px; margin-bottom:25px;">
            <div style="display:flex; justify-content:space-between; align-items:start; margin-bottom:15px;">
                <h4 style="margin:0; font-size:14px; color:#5d0b0b;">📜 Arquivo e Regras</h4>
                <button class="btn-small btn-small-secondary" onclick="alert('Baixando ${p.arquivo}...')">
                    📄 Baixar PDF Original
                </button>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; font-size: 14px;">
                <div><span style="color:#666;">Vigência:</span> <strong>${p.inicio} a ${p.fim}</strong></div>
                <div><span style="color:#666;">Carga Obrigatória:</span> <strong>${p.horasMinimas}h</strong></div>
                <div><span style="color:#666;">Arquivo:</span> ${p.arquivo} (${p.tamanho})</div>
                <div><span style="color:#666;">Cadastro:</span> ${p.dataCadastro}</div>
            </div>
        </div>

        <h4 style="font-size:14px; color:#333; margin-bottom:10px;">👥 Discentes Vinculados</h4>
        <div style="max-height:250px; overflow-y:auto; border:1px solid #eee; border-radius:8px;">
            <table class="global-table">
                <thead><tr><th>Matrícula</th><th>Nome</th><th>Progresso</th><th>Situação</th></tr></thead>
                <tbody>${linhasAlunos}</tbody>
            </table>
        </div>
    `;

    document.getElementById("corpoDetalhesPPC").innerHTML = html;
    document.getElementById("modalDetalhesPPC").style.display = "flex";
};

// [ATUALIZADO] Salvar com "Upload"
window.salvarNovoPPC = () => {
    const codigo = document.getElementById("ppcCodigo").value;
    const inicio = document.getElementById("ppcInicio").value;
    const horas = document.getElementById("ppcHoras").value;
    const arquivoInput = document.getElementById("ppcArquivo");

    if (!codigo || !inicio || !horas || arquivoInput.files.length === 0) {
        alert("Todos os campos, incluindo o Arquivo PDF, são obrigatórios.");
        return;
    }

    const nomeArquivo = arquivoInput.files[0].name;

    if (confirm("Confirmar cadastro e upload?\nO PPC atual será encerrado.")) {
        const atual = ppcDB.find(p => p.status === "Vigente");
        if (atual) atual.status = "Encerrado";

        ppcDB.unshift({
            id: Date.now(),
            codigo: codigo,
            curso: "Ciência da Computação",
            inicio: inicio,
            fim: document.getElementById("ppcFim").value || "Indefinido",
            horasMinimas: parseInt(horas),
            status: "Vigente",
            alunosVinculados: 0,
            concluintes: 0,
            responsavel: "Coordenação Atual",
            dataCadastro: new Date().toLocaleDateString(),
            arquivo: nomeArquivo, // Nome real do arquivo selecionado
            tamanho: "1.2 MB", // Simulação
            listaAlunos: []
        });

        window.fecharModalPPC();
        initPPC();
        if(window.showToast) showToast("success", "Novo PPC e arquivo cadastrados com sucesso!");
    }
};

window.abrirModalPPC = () => document.getElementById("modalNovoPPC").style.display = "flex";
window.fecharModalPPC = () => document.getElementById("modalNovoPPC").style.display = "none";