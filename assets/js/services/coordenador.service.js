/* ====================================================================
   SERVICE: COORDENADOR
   Consolida dados de Dashboard, Comunicados e PPC
   Arquivo: assets/js/services/coordenador.service.js
   ==================================================================== */

// --- MOCK: Dashboard (Origem: dashboard_home.js) ---
const dashboardStats = {
    validacaoPendente: 3,
    discentesRisco: 5,
    atividadesAtivas: 12,
    solicitacoesAtrasadas: 2,
    
    // Dados Operacionais do Coordenador
    resumoCoordenador: {
        propostasPendentes: 3,      
        solicitacoesExternas: 4,    
        ultimaAcao: "10/05/2025",   
        status: "Dentro do prazo",  
        analisadasMes: 15           
    }
};

// --- MOCK: Comunicados (Origem: comunicados.js) ---
const comunicadosDB = [
    {
        id: 1,
        data: "12/12/2025",
        titulo: "Prazo para Relatório Final UCE",
        mensagem: "Prezados, o prazo final para submissão é dia 20/12. Não haverá prorrogação.",
        publico: "Formandos",
        canais: ["Sistema", "Email"],
        status: "Enviado",
        autor: "Coordenação"
    },
    {
        id: 2,
        data: "10/11/2025",
        titulo: "Abertura de Edital PIBEX",
        mensagem: "O edital para bolsas de extensão está aberto. Consultem o site da PROEC.",
        publico: "Todo o Curso",
        canais: ["Sistema", "Email"],
        status: "Falha Parcial",
        detalheErro: "5 emails retornaram (caixa cheia)",
        autor: "Coordenação"
    },
    {
        id: 3,
        data: "01/11/2025",
        titulo: "Manutenção no SIGAA",
        mensagem: "Sistema ficará indisponível no final de semana.",
        publico: "Institucional",
        canais: ["Sistema"],
        status: "Recebido",
        autor: "Reitoria / TI"
    }
];

// --- MOCK: PPC (Origem: ppc.js) ---
const ppcDB = [
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
        arquivo: "PPC_BCC_2023_VersaoFinal.pdf",
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
        arquivo: "PPC_Antigo_2018.pdf",
        tamanho: "1.8 MB",
        listaAlunos: [
            { matricula: "2018099", nome: "João Pedro Alves", situacao: "Formando", progresso: "95%" },
            { matricula: "2019100", nome: "Maria Helena", situacao: "Concluído", progresso: "100%" }
        ]
    }
];

/* =======================
   MÉTODOS EXPORTADOS
   ======================= */

// --- DASHBOARD ---
export async function getDashboardStats() {
    // Simula delay de rede
    return structuredClone(dashboardStats);
}

// --- COMUNICADOS ---
export async function getComunicados() {
    return structuredClone(comunicadosDB);
}

export async function criarComunicado(novoComunicado) {
    // Atribui ID único
    novoComunicado.id = Date.now();
    // Adiciona no topo da lista
    comunicadosDB.unshift(novoComunicado);
    return novoComunicado;
}

// --- PPC ---
export async function getPPCs() {
    return structuredClone(ppcDB);
}

export async function criarPPC(novoPPC) {
    // REGRA DE NEGÓCIO: Só pode haver um Vigente.
    // Encerra o atual antes de adicionar o novo.
    const atual = ppcDB.find(p => p.status === "Vigente");
    if (atual) {
        atual.status = "Encerrado";
    }

    novoPPC.id = Date.now();
    novoPPC.status = "Vigente"; // Garante que o novo entra como vigente
    novoPPC.dataCadastro = new Date().toLocaleDateString();
    
    ppcDB.unshift(novoPPC);
    
    return novoPPC;
}