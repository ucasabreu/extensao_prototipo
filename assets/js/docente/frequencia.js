/* ====================================================================
   MÓDULO DE FREQUÊNCIA (DOCENTE) - VERSÃO REFINADA
   ==================================================================== */

// MOCK: Atividades (Com dados para validação de carga total)
const atividadesExecucao = [
    { 
        id: 1, 
        titulo: "Curso de Introdução ao Python", 
        inicio: "2025-02-01", 
        fim: "2025-02-28", 
        chTotal: 40,
        inscritos: [
            { id: 102, nome: "Maria Oliveira", matricula: "2023002", horasComputadas: 32 },
            { id: 104, nome: "Ana Clara", matricula: "2023004", horasComputadas: 20 },
            { id: 107, nome: "João Silva", matricula: "2023001", horasComputadas: 38 }
        ]
    },
    { 
        id: 2, 
        titulo: "Monitoria de Algoritmos", 
        inicio: "2025-03-01", 
        fim: "2025-07-01", 
        chTotal: 60,
        inscritos: [
            { id: 201, nome: "Pedro Santos", matricula: "2021050", horasComputadas: 10 },
            { id: 202, nome: "Lucas Mendes", matricula: "2021051", horasComputadas: 10 }
        ]
    }
];

// MOCK: Histórico de Registros (Estrutura simples para o Gap image_6bf827.png)
// Agora armazenamos o resumo do dia também para facilitar o histórico
let historicoAulasDB = [
    { atividadeId: 1, data: "2025-02-01", horas: 4, presentes: 2 },
    { atividadeId: 1, data: "2025-02-02", horas: 4, presentes: 3 }
];

let presencasDB = [
    { atividadeId: 1, data: "2025-02-01", alunoId: 102, horas: 4 },
    { atividadeId: 1, data: "2025-02-01", alunoId: 104, horas: 4 }
    // ... outros registros
];

export async function carregarViewFrequencia() {
    try {
        const response = await fetch('../../pages/docente/frequencia.html');
        return await response.text();
    } catch (e) { return "Erro ao carregar módulo."; }
}

export function initFrequencia() {
    carregarSelectAtividades();
    
    // Deep Linking
    if (window.idOportunidadeFrequencia) {
        const select = document.getElementById("selAtividadeFreq");
        if (select) {
            select.value = window.idOportunidadeFrequencia;
            window.idOportunidadeFrequencia = null;
        }
    }

    const hoje = new Date().toISOString().split('T')[0];
    document.getElementById("dataFrequencia").value = hoje;

    carregarDadosFrequencia();
}

// Dropdown Rico
function carregarSelectAtividades() {
    const select = document.getElementById("selAtividadeFreq");
    if(!select) return;

    select.innerHTML = atividadesExecucao.map(atv => 
        `<option value="${atv.id}">${atv.titulo} | ${formatarData(atv.inicio)} a ${formatarData(atv.fim)} | ${atv.chTotal}h</option>`
    ).join("");
}

/* ====================================================
   LÓGICA PRINCIPAL E VALIDAÇÕES
   ==================================================== */
window.carregarDadosFrequencia = () => {
    const tbody = document.getElementById("tb-frequencia");
    const idAtv = parseInt(document.getElementById("selAtividadeFreq").value);
    const dataSelecionada = document.getElementById("dataFrequencia").value;
    const horasInput = parseInt(document.getElementById("horasDia").value) || 0;
    
    const atividade = atividadesExecucao.find(a => a.id === idAtv);
    const alerta = document.getElementById("alertaFrequencia");
    const btnSalvar = document.getElementById("btnSalvarFreq");

    if (!atividade) return;

    // 1. Validação de Data (RF019-CT004)
    if (dataSelecionada < atividade.inicio || dataSelecionada > atividade.fim) {
        mostrarAlerta("danger", `⛔ <strong>Data Inválida:</strong> Selecione uma data entre ${formatarData(atividade.inicio)} e ${formatarData(atividade.fim)}.`);
        tbody.innerHTML = `<tr><td colspan="5" align="center" style="color:#b01313">Data fora do período de execução.</td></tr>`;
        btnSalvar.disabled = true;
        return;
    }

    // 2. Validação de Carga Horária Total (Crítico - image_6bf808.png)
    // Verifica se adicionar essa carga vai estourar o total da atividade para algum aluno (simplificado: verifica pelo aluno com mais horas)
    const maxHorasAluno = Math.max(...atividade.inscritos.map(a => a.horasComputadas));
    
    // Verifica se já existe registro nesse dia para não somar duplicado na validação
    const jaRegistradoHoje = historicoAulasDB.some(h => h.atividadeId === idAtv && h.data === dataSelecionada);
    
    if (!jaRegistradoHoje && (maxHorasAluno + horasInput > atividade.chTotal)) {
        mostrarAlerta("warning", `⚠️ <strong>Atenção:</strong> Registrar ${horasInput}h hoje fará alguns alunos excederem a Carga Total (${atividade.chTotal}h). Verifique se o valor está correto.`);
        // Não bloqueia, mas avisa (dependendo da regra da instituição, poderia bloquear)
    } else {
        mostrarAlerta("info", `Registrando frequência para <strong>${formatarData(dataSelecionada)}</strong>.`);
    }
    
    btnSalvar.disabled = false;

    // 3. Renderização
    tbody.innerHTML = atividade.inscritos.map(aluno => {
        const jaTevePresenca = presencasDB.some(p => 
            p.atividadeId === idAtv && p.data === dataSelecionada && p.alunoId === aluno.id
        );
        const checked = jaTevePresenca ? "checked" : "";

        const percentual = (aluno.horasComputadas / atividade.chTotal) * 100;
        let badgeStatus = "";
        
        // Status Parcial
        if (percentual >= 75) {
            badgeStatus = `<span class="badge badge-success">Apto (${percentual.toFixed(0)}%)</span>`;
        } else if (percentual >= 50) {
            badgeStatus = `<span class="badge badge-warning">Em Curso (${percentual.toFixed(0)}%)</span>`;
        } else {
            badgeStatus = `<span class="badge badge-danger">Baixa Freq. (${percentual.toFixed(0)}%)</span>`;
        }

        return `
            <tr>
                <td style="text-align: center;">
                    <input type="checkbox" class="chk-presenca" value="${aluno.id}" ${checked}>
                </td>
                <td><strong>${aluno.nome}</strong></td>
                <td>${aluno.matricula}</td>
                <td>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <div style="flex: 1; height: 6px; background: #e0e0e0; border-radius: 3px; width: 80px;">
                            <div style="width: ${Math.min(percentual, 100)}%; height: 100%; background: #5d0b0b; border-radius: 3px;"></div>
                        </div>
                        <span style="font-size: 12px;">${aluno.horasComputadas}/${atividade.chTotal}h</span>
                    </div>
                </td>
                <td>${badgeStatus}</td>
            </tr>
        `;
    }).join("");
};

window.salvarFrequencia = () => {
    const idAtv = parseInt(document.getElementById("selAtividadeFreq").value);
    const dataSelecionada = document.getElementById("dataFrequencia").value;
    const horasDia = parseInt(document.getElementById("horasDia").value);
    const checkboxes = document.querySelectorAll(".chk-presenca");
    
    if (horasDia <= 0) return alert("Informe a carga horária válida.");

    let presentesCount = 0;
    let atualizados = 0;

    checkboxes.forEach(chk => {
        const alunoId = parseInt(chk.value);
        const atividade = atividadesExecucao.find(a => a.id === idAtv);
        const aluno = atividade.inscritos.find(a => a.id === alunoId);

        const registroIndex = presencasDB.findIndex(p => 
            p.atividadeId === idAtv && p.data === dataSelecionada && p.alunoId === alunoId
        );

        if (chk.checked) {
            presentesCount++;
            if (registroIndex === -1) {
                // Adiciona presença
                presencasDB.push({ atividadeId: idAtv, data: dataSelecionada, alunoId: alunoId, horas: horasDia });
                aluno.horasComputadas += horasDia;
                atualizados++;
            }
        } else {
            if (registroIndex !== -1) {
                // Remove presença
                presencasDB.splice(registroIndex, 1);
                aluno.horasComputadas -= horasDia;
                atualizados++;
            }
        }
    });

    // Atualiza ou Cria registro no Histórico Geral da Aula
    const histIndex = historicoAulasDB.findIndex(h => h.atividadeId === idAtv && h.data === dataSelecionada);
    if (histIndex !== -1) {
        historicoAulasDB[histIndex].presentes = presentesCount;
        historicoAulasDB[histIndex].horas = horasDia;
    } else if (presentesCount > 0) {
        historicoAulasDB.push({ atividadeId: idAtv, data: dataSelecionada, horas: horasDia, presentes: presentesCount });
    }

    if (window.showToast) window.showToast("success", "Diário salvo com sucesso!");
    carregarDadosFrequencia();
};

/* ====================================================
   HISTÓRICO (Novo Recurso - image_6bf827.png)
   ==================================================== */
window.abrirHistorico = () => {
    const idAtv = parseInt(document.getElementById("selAtividadeFreq").value);
    const atividade = atividadesExecucao.find(a => a.id === idAtv);
    if(!atividade) return;

    document.getElementById("lblAtividadeHistorico").textContent = atividade.titulo;
    const tbody = document.getElementById("tb-historico-corpo");
    
    const registros = historicoAulasDB.filter(h => h.atividadeId === idAtv);

    if(registros.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" align="center">Nenhum registro encontrado.</td></tr>`;
    } else {
        tbody.innerHTML = registros.map(reg => `
            <tr>
                <td>${formatarData(reg.data)}</td>
                <td>${reg.horas}h</td>
                <td>${reg.presentes} presentes</td>
                <td><button class="btn-small btn-small-info" onclick="carregarDataHistorico('${reg.data}')">Ver</button></td>
            </tr>
        `).join("");
    }

    document.getElementById("modalHistorico").style.display = "flex";
};

window.carregarDataHistorico = (data) => {
    document.getElementById("dataFrequencia").value = data;
    fecharModalFreq('modalHistorico');
    carregarDadosFrequencia();
};

window.fecharModalFreq = (id) => document.getElementById(id).style.display = "none";

function mostrarAlerta(tipo, msg) {
    const alerta = document.getElementById("alertaFrequencia");
    alerta.style.display = "flex";
    alerta.className = `alert alert-${tipo}`;
    alerta.innerHTML = msg;
}

function formatarData(dataStr) {
    if(!dataStr) return "-";
    const [ano, mes, dia] = dataStr.split("-");
    return `${dia}/${mes}/${ano}`;
}