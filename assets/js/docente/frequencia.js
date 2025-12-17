/* ====================================================================
   MÓDULO DE FREQUÊNCIA (DOCENTE) - ATUALIZADO (COM PLANO DE ENSINO)
   ==================================================================== */

// MOCK: Atividades (Adicionada propriedade 'aberta' e o objeto 'plano')
const atividadesExecucao = [
    { 
        id: 1, 
        titulo: "Curso de Introdução ao Python", 
        inicio: "2025-02-01", 
        fim: "2025-02-28", 
        chTotal: 40,
        aberta: true,
        // DADOS DO PLANO (Baseado na imagem enviada)
        plano: {
            objetivos: "Capacitar alunos em lógica de programação.\n\nEspecíficos:\n- Ensinar sintaxe Python\n- Criar scripts básicos",
            metodologia: "Aulas práticas em laboratório.",
            cronograma: "4 Semanas intensivas.",
            avaliacao: "Frequência e Prova."
        },
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
        aberta: true,
        // Dados genéricos para o exemplo 2
        plano: {
            objetivos: "Auxiliar alunos do 1º período.",
            metodologia: "Plantão de dúvidas.",
            cronograma: "Semanal.",
            avaliacao: "Relatório final."
        },
        inscritos: [
            { id: 201, nome: "Pedro Santos", matricula: "2021050", horasComputadas: 10 },
            { id: 202, nome: "Lucas Mendes", matricula: "2021051", horasComputadas: 10 }
        ]
    }
];

// MOCK: Histórico de Registros (Mantido)
let historicoAulasDB = [
    { atividadeId: 1, data: "2025-02-01", horas: 4, presentes: 2 },
    { atividadeId: 1, data: "2025-02-02", horas: 4, presentes: 3 }
];

let presencasDB = [
    { atividadeId: 1, data: "2025-02-01", alunoId: 102, horas: 4 },
    { atividadeId: 1, data: "2025-02-01", alunoId: 104, horas: 4 }
];

export async function carregarViewFrequencia() {
    try {
        const response = await fetch('../../pages/docente/frequencia.html');
        return await response.text();
    } catch (e) { return "Erro ao carregar módulo."; }
}

export function initFrequencia() {
    carregarSelectAtividades();
    
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

function carregarSelectAtividades() {
    const select = document.getElementById("selAtividadeFreq");
    if(!select) return;

    select.innerHTML = atividadesExecucao.map(atv => {
        const statusLabel = atv.aberta ? "" : " (Encerrada)";
        return `<option value="${atv.id}">${atv.titulo} ${statusLabel} | ${formatarData(atv.inicio)} a ${formatarData(atv.fim)} | ${atv.chTotal}h</option>`
    }).join("");
}

/* ====================================================
   LÓGICA PRINCIPAL E VALIDAÇÕES
   ==================================================== */
window.carregarDadosFrequencia = () => {
    const tbody = document.getElementById("tb-frequencia");
    const idAtv = parseInt(document.getElementById("selAtividadeFreq").value);
    const dataSelecionada = document.getElementById("dataFrequencia").value;
    const horasInputEl = document.getElementById("horasDia");
    const horasInput = parseInt(horasInputEl.value) || 0;
    
    const atividade = atividadesExecucao.find(a => a.id === idAtv);
    const btnSalvar = document.getElementById("btnSalvarFreq");
    const btnEncerrar = document.getElementById("btnEncerrarTurma");

    if (!atividade) return;

    if (!atividade.aberta) {
        mostrarAlerta("warning", `🔒 <strong>Atividade Encerrada:</strong> Esta turma já foi consolidada. Não é possível alterar frequências.`);
        btnSalvar.disabled = true;
        btnEncerrar.disabled = true;
        btnEncerrar.textContent = "Turma Encerrada";
        horasInputEl.disabled = true;
        renderizarListaAlunos(tbody, atividade, idAtv, dataSelecionada, true); 
        return;
    } else {
        btnSalvar.disabled = false;
        btnEncerrar.disabled = false;
        btnEncerrar.textContent = "🔒 Encerrar Turma";
        horasInputEl.disabled = false;
    }

    if (dataSelecionada < atividade.inicio || dataSelecionada > atividade.fim) {
        mostrarAlerta("danger", `⛔ <strong>Data Inválida:</strong> Selecione uma data entre ${formatarData(atividade.inicio)} e ${formatarData(atividade.fim)}.`);
        tbody.innerHTML = `<tr><td colspan="5" align="center" style="color:#b01313">Data fora do período de execução.</td></tr>`;
        btnSalvar.disabled = true;
        return;
    }

    const maxHorasAluno = Math.max(...atividade.inscritos.map(a => a.horasComputadas));
    const jaRegistradoHoje = historicoAulasDB.some(h => h.atividadeId === idAtv && h.data === dataSelecionada);
    
    if (!jaRegistradoHoje && (maxHorasAluno + horasInput > atividade.chTotal)) {
        mostrarAlerta("warning", `⚠️ <strong>Atenção:</strong> Registrar ${horasInput}h hoje fará alguns alunos excederem a Carga Total (${atividade.chTotal}h). Verifique se o valor está correto.`);
    } else {
        mostrarAlerta("info", `Registrando frequência para <strong>${formatarData(dataSelecionada)}</strong>.`);
    }
    
    renderizarListaAlunos(tbody, atividade, idAtv, dataSelecionada, false);
};

function renderizarListaAlunos(tbody, atividade, idAtv, dataSelecionada, readOnly) {
    tbody.innerHTML = atividade.inscritos.map(aluno => {
        const jaTevePresenca = presencasDB.some(p => 
            p.atividadeId === idAtv && p.data === dataSelecionada && p.alunoId === aluno.id
        );
        const checked = jaTevePresenca ? "checked" : "";
        const disabled = readOnly ? "disabled" : "";

        const percentual = (aluno.horasComputadas / atividade.chTotal) * 100;
        let badgeStatus = "";
        
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
                    <input type="checkbox" class="chk-presenca" value="${aluno.id}" ${checked} ${disabled}>
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
}

window.salvarFrequencia = () => {
    const idAtv = parseInt(document.getElementById("selAtividadeFreq").value);
    const dataSelecionada = document.getElementById("dataFrequencia").value;
    const horasDia = parseInt(document.getElementById("horasDia").value);
    const checkboxes = document.querySelectorAll(".chk-presenca");
    
    if (horasDia <= 0) return alert("Informe a carga horária válida.");

    let presentesCount = 0;

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
                presencasDB.push({ atividadeId: idAtv, data: dataSelecionada, alunoId: alunoId, horas: horasDia });
                aluno.horasComputadas += horasDia;
            }
        } else {
            if (registroIndex !== -1) {
                presencasDB.splice(registroIndex, 1);
                aluno.horasComputadas -= horasDia;
            }
        }
    });

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

window.abrirConsolidacao = () => {
    const idAtv = parseInt(document.getElementById("selAtividadeFreq").value);
    const atividade = atividadesExecucao.find(a => a.id === idAtv);
    
    if (!atividade) return;
    if (!atividade.aberta) return alert("Esta atividade já está encerrada.");

    const tbody = document.getElementById("tb-consolidacao-corpo");
    
    tbody.innerHTML = atividade.inscritos.map(aluno => {
        const percentual = (aluno.horasComputadas / atividade.chTotal) * 100;
        const isApto = percentual >= 75;
        
        const statusStyle = isApto 
            ? 'color: #155724; background-color: #d4edda; font-weight: bold;' 
            : 'color: #721c24; background-color: #f8d7da; font-weight: bold;';
        
        const statusLabel = isApto ? "APTO (Aprovado)" : "INAPTO (Reprovado)";
        const icon = isApto ? "✅" : "❌";

        return `
            <tr>
                <td>${aluno.nome}</td>
                <td>${aluno.horasComputadas}h / ${atividade.chTotal}h</td>
                <td>${percentual.toFixed(1)}%</td>
                <td><span style="padding: 4px 8px; border-radius: 4px; font-size: 12px; ${statusStyle}">${icon} ${statusLabel}</span></td>
            </tr>
        `;
    }).join("");

    document.getElementById("modalConsolidacao").style.display = "flex";
}

window.confirmarEncerramento = () => {
    const idAtv = parseInt(document.getElementById("selAtividadeFreq").value);
    const atividade = atividadesExecucao.find(a => a.id === idAtv);

    if (atividade) {
        atividade.aberta = false;
        console.log("Enviando dados...", atividade.inscritos);
        fecharModalFreq('modalConsolidacao');
        if (window.showToast) window.showToast("success", "Atividade encerrada! Certificados gerados para alunos aptos.");
        carregarSelectAtividades(); 
        carregarDadosFrequencia(); 
    }
}

/* ====================================================
   NOVA FUNÇÃO: VER PLANO DE ENSINO
   ==================================================== */
window.verPlanoAtividade = () => {
    const idAtv = parseInt(document.getElementById("selAtividadeFreq").value);
    const atividade = atividadesExecucao.find(a => a.id === idAtv);

    if (!atividade) return;

    // Se não houver plano, usa placeholder
    const plano = atividade.plano || { 
        objetivos: "Não definido.", 
        metodologia: "Não definido.", 
        cronograma: "Não definido.",
        avaliacao: "Não definido."
    };

    // Preenche os campos do Modal
    document.getElementById("lblPlanoTitulo").innerText = atividade.titulo;
    // O uso de replace(/\n/g, '<br>') garante que quebras de linha apareçam
    document.getElementById("txtPlanoObjetivos").innerHTML = plano.objetivos.replace(/\n/g, '<br>');
    document.getElementById("txtPlanoMetodologia").innerHTML = plano.metodologia.replace(/\n/g, '<br>');
    document.getElementById("txtPlanoCronograma").innerHTML = plano.cronograma.replace(/\n/g, '<br>');
    document.getElementById("txtPlanoAvaliacao").innerHTML = plano.avaliacao.replace(/\n/g, '<br>');

    document.getElementById("modalPlano").style.display = "flex";
}

// Histórico e Utilitários (Mantidos)
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