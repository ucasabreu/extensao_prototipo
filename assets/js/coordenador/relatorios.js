/* ====================================================================
   MÓDULO DE RELATÓRIOS (COORDENADOR)
   Arquivo: assets/js/coordenador/relatorios.js
   Ajuste: Baseado em 'notas de Relatorios.txt'
   ==================================================================== */

export async function carregarViewRelatorios() {
    try {
        const response = await fetch('../../pages/coordenador_curso/relatorios.html');
        const html = await response.text();
        return html;
    } catch (error) {
        console.error("Erro view relatorios:", error);
        return "Erro ao carregar módulo de relatórios.";
    }
}

// Inicializador chamado pelo Dashboard
export function initRelatorios() {
    console.log("Iniciando Relatórios...");
    renderizarKPIsRelatorios();
}

/* =======================
   LÓGICA DE DADOS (KPIs)
   ======================= */
function renderizarKPIsRelatorios() {
    // Simulação de dados agregados do curso
    // Num sistema real, viria do backend filtrado pelo período selecionado
    document.getElementById("kpi-rel-oportunidades").textContent = "15";
    document.getElementById("kpi-rel-discentes").textContent = "120";
    document.getElementById("kpi-rel-horas-ok").textContent = "4.500h";
    document.getElementById("kpi-rel-horas-pend").textContent = "320h";
}

window.atualizarDadosRelatorio = () => {
    // Simula refresh com loading
    const btns = document.querySelectorAll(".kpi-value");
    btns.forEach(b => b.textContent = "...");
    
    setTimeout(() => {
        renderizarKPIsRelatorios();
        if(window.showToast) showToast("info", "Dados atualizados com sucesso.");
    }, 800);
};

/* =======================
   AÇÕES DE RELATÓRIO
   ======================= */

// Visualizar (RI-3) - Abre Modal com tabela simples
window.visualizarRelatorio = (tipo) => {
    const tituloMap = {
        'oportunidades': 'Relatório de Oportunidades',
        'discentes': 'Relatório de Progresso Discente',
        'horas': 'Consolidado de Horas de Extensão',
        'uce': 'Prévia: Relatório Oficial UCE'
    };

    document.getElementById("tituloPreview").textContent = tituloMap[tipo] || "Relatório";
    
    // Gera conteúdo dummy baseado no tipo
    let htmlContent = "";
    
    if(tipo === 'oportunidades') {
        htmlContent = `
            <table class="global-table">
                <thead><tr><th>Atividade</th><th>Tipo</th><th>Vagas</th><th>Status</th></tr></thead>
                <tbody>
                    <tr><td>Semana Tech</td><td>Evento</td><td>150</td><td><span class="badge badge-success">Concluído</span></td></tr>
                    <tr><td>Curso Python</td><td>Curso</td><td>40</td><td><span class="badge badge-success">Ativo</span></td></tr>
                    <tr><td>Monitoria Java</td><td>Monitoria</td><td>2</td><td><span class="badge badge-warning">Pendente</span></td></tr>
                </tbody>
            </table>`;
    } else if(tipo === 'discentes') {
        htmlContent = `
            <table class="global-table">
                <thead><tr><th>Matrícula</th><th>Nome</th><th>Progresso</th><th>Situação</th></tr></thead>
                <tbody>
                    <tr><td>2023001</td><td>Ana Clara</td><td>33%</td><td><span class="badge badge-neutral">Regular</span></td></tr>
                    <tr><td>2020055</td><td>João Pedro</td><td>11%</td><td><span class="badge badge-danger">Em Risco</span></td></tr>
                    <tr><td>2019100</td><td>Maria Helena</td><td>100%</td><td><span class="badge badge-success">Concluído</span></td></tr>
                </tbody>
            </table>`;
    } else {
        htmlContent = `<p style="padding:20px; text-align:center;">Visualização gráfica não disponível para este formato. Por favor, exporte o arquivo.</p>`;
    }

    document.getElementById("conteudoPreview").innerHTML = htmlContent;
    document.getElementById("modalRelatorioPreview").style.display = "flex";
};

// Exportar (RF-R4)
window.exportarRelatorio = (tipo, formato) => {
    const periodo = document.getElementById("relFiltroPeriodo").value;
    
    if(confirm(`Confirmar exportação do ${tipo.toUpperCase()} em ${formato.toUpperCase()}?\nPeríodo referência: ${periodo}`)) {
        // Simula download
        setTimeout(() => {
            if(window.showToast) showToast("success", `Arquivo gerado: relatorio_${tipo}_${periodo}.${formato}`);
        }, 1000);
    }
};

// Utilitários
window.fecharModalR = (id) => document.getElementById(id).style.display = "none";