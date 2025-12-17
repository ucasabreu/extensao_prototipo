/* ====================================================================
   MÓDULO DE PROJETO PEDAGÓGICO (PPC)
   Arquivo: assets/js/coordenador/ppc.js
   Refatorado para usar: coordenador.service.js
   ==================================================================== */

// 1. IMPORTAÇÃO DO SERVICE
import { getPPCs, criarPPC } from "../services/coordenador.service.js";

// 2. ESTADO LOCAL
let listaPPCs = [];

export async function carregarViewPPC() {
    try {
        const response = await fetch('../../pages/coordenador_curso/ppc.html');
        return await response.text();
    } catch (error) {
        console.error("Erro view PPC:", error);
        return "Erro ao carregar módulo.";
    }
}

// 3. INIT ASYNC
export async function initPPC() {
    // Busca os dados do Service
    listaPPCs = await getPPCs();

    // Renderiza a tela com os dados atualizados
    renderizarPPCVigente();
    renderizarArquivoVigente();
    renderizarHistorico();
    renderizarImpacto();
}

/* =======================
   RENDERIZAÇÃO
   ======================= */

function renderizarPPCVigente() {
    const container = document.getElementById("container-ppc-vigente");
    if(!container) return;

    // Usa a lista local
    const vigente = listaPPCs.find(p => p.status === "Vigente");

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
        const elMeta = document.getElementById("ppc-meta-horas");
        if(elMeta) elMeta.textContent = vigente.horasMinimas + "h";
    } else {
        container.innerHTML = `<div class="alert alert-danger">Nenhum PPC Vigente!</div>`;
    }
}

function renderizarArquivoVigente() {
    const container = document.getElementById("container-arquivo-vigente");
    if(!container) return;

    const vigente = listaPPCs.find(p => p.status === "Vigente");

    if (vigente && vigente.arquivo) {
        container.innerHTML = `
            <div style="font-size: 30px;">📄</div>
            <div style="flex: 1; overflow: hidden;">
                <div style="font-weight: bold; color: #333; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${vigente.arquivo}</div>
                <div style="font-size: 11px; color: #888;">PDF • ${vigente.tamanho || 'Unknown'}</div>
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

    // Ordena visualmente (ID decrescente)
    const listaOrdenada = [...listaPPCs].sort((a,b) => b.id - a.id);

    tbody.innerHTML = listaOrdenada.map(p => {
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
    const vigente = listaPPCs.find(p => p.status === "Vigente");
    const antigos = listaPPCs.filter(p => p.status !== "Vigente");
    
    const totalAntigos = antigos.reduce((acc, curr) => acc + curr.alunosVinculados, 0);
    const totalConcluintes = listaPPCs.reduce((acc, curr) => acc + (curr.concluintes || 0), 0);

    const elAtual = document.getElementById("ppc-impacto-atual");
    const elAntigo = document.getElementById("ppc-impacto-antigo");
    const elConcluintes = document.getElementById("ppc-concluintes");

    if(elAtual) elAtual.textContent = vigente ? vigente.alunosVinculados : 0;
    if(elAntigo) elAntigo.textContent = totalAntigos;
    if(elConcluintes) elConcluintes.textContent = totalConcluintes;
}

/* =======================
   AÇÕES
   ======================= */

window.verDetalhesPPC = (id) => {
    // Busca na lista local atualizada
    const p = listaPPCs.find(item => item.id === id);
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

// [ATUALIZADO] Salvar usando o Service
window.salvarNovoPPC = async () => {
    const codigo = document.getElementById("ppcCodigo").value;
    const inicio = document.getElementById("ppcInicio").value;
    const horas = document.getElementById("ppcHoras").value;
    const arquivoInput = document.getElementById("ppcArquivo");

    if (!codigo || !inicio || !horas || arquivoInput.files.length === 0) {
        alert("Todos os campos, incluindo o Arquivo PDF, são obrigatórios.");
        return;
    }

    const nomeArquivo = arquivoInput.files[0].name;

    if (confirm("Confirmar cadastro e upload?\nO PPC atual será encerrado automaticamente.")) {
        
        // Objeto a ser enviado (Status será tratado pelo Service)
        const novoPPC = {
            codigo: codigo,
            curso: "Ciência da Computação",
            inicio: inicio,
            fim: document.getElementById("ppcFim").value || "Indefinido",
            horasMinimas: parseInt(horas),
            alunosVinculados: 0,
            concluintes: 0,
            responsavel: "Coordenação Atual",
            arquivo: nomeArquivo,
            tamanho: "1.2 MB", // Simulação de backend
            listaAlunos: []
        };

        try {
            // 4. CHAMA O SERVICE
            await criarPPC(novoPPC);

            // Atualiza dados locais e re-renderiza
            window.fecharModalPPC();
            await initPPC(); // Recarrega tudo (vigente, histórico, impacto)

            if(window.showToast) showToast("success", "Novo PPC e arquivo cadastrados com sucesso!");
        } catch (e) {
            console.error(e);
            alert("Erro ao salvar PPC.");
        }
    }
};

window.abrirModalPPC = () => document.getElementById("modalNovoPPC").style.display = "flex";
window.fecharModalPPC = () => document.getElementById("modalNovoPPC").style.display = "none";