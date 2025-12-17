/* ====================================================================
   SERVICE: ACADÊMICO
   Consolida dados de Discentes, Solicitações de Horas e Grupos
   Arquivo: assets/js/services/academico.service.js
   ==================================================================== */

// --- MOCK: Base de Alunos (Origem: discentes.js) ---
const discentesDB = [
    {
        id: 1,
        nome: "Ana Clara Souza",
        matricula: "2023001",
        ppc: "BCC-2023",
        situacao: "regular",
        horasConcluidas: 120,
        horasPendentes: 240,
        meta: 360,
        historico: [
            { id: 10, atividade: "Semana de Tecnologia 2024", ch: 20, data: "10/05/2024", status: "Validado", obs: "" },
            { id: 11, atividade: "Curso Online de Python", ch: 40, data: "15/06/2024", status: "Rejeitado", obs: "Certificado sem código de autenticidade." }
        ]
    },
    {
        id: 2,
        nome: "João Pedro Alves",
        matricula: "2020055",
        ppc: "BCC-2018",
        situacao: "risco",
        horasConcluidas: 40,
        horasPendentes: 320,
        meta: 360,
        historico: [
            { id: 20, atividade: "Palestra IA", ch: 10, data: "20/03/2024", status: "Validado", obs: "" }
        ]
    },
    {
        id: 3,
        nome: "Maria Helena",
        matricula: "2019100",
        ppc: "BCC-2018",
        situacao: "concluido",
        horasConcluidas: 360,
        horasPendentes: 0,
        meta: 360,
        historico: [
            { id: 30, atividade: "Monitoria Algoritmos", ch: 120, data: "10/12/2023", status: "Validado", obs: "" },
            { id: 31, atividade: "Projeto de Extensão Robótica", ch: 240, data: "20/12/2024", status: "Validado", obs: "" }
        ]
    }
];

// --- MOCK: Fila de Solicitações (Origem: discentes.js) ---
let solicitacoesDB = [
    {
        id: 501,
        alunoId: 1,
        nomeAluno: "Ana Clara Souza",
        atividade: "Workshop: Design Thinking",
        ch: 8,
        dataEnvio: new Date().toISOString().split('T')[0], // Hoje
        anexo: "certificado_workshop.pdf",
        status: "pendente"
    },
    {
        id: 502,
        alunoId: 2,
        nomeAluno: "João Pedro Alves",
        atividade: "Voluntariado Cruz Vermelha",
        ch: 60,
        dataEnvio: "2023-11-20", // Simulação de atraso
        anexo: "declaracao_voluntario.pdf",
        status: "pendente"
    }
];

// --- MOCK: Grupos e Docentes (Origem: grupos.js) ---
const docentesDisponiveis = [
    { id: 1, nome: "Prof. Dr. Carlos Mendes" },
    { id: 2, nome: "Profa. Dra. Ana Souza" },
    { id: 3, nome: "Prof. Ms. Roberto Campos" },
    { id: 4, nome: "Profa. Dra. Juliana Lima" },
    { id: 5, nome: "Prof. Dr. Marcos Vinicius" }
];

let gruposAtivos = [
    { id: 101, nome: "LAIS - Liga de I.A. e Saúde", tipo: "Liga Acadêmica", docente: "Profa. Dra. Ana Souza", email: "lais@ufma.br" },
    { id: 102, nome: "DevCommunity", tipo: "Núcleo de Pesquisa", docente: "Prof. Ms. Roberto Campos", email: "dev@ufma.br" }
];

let solicitacoesGrupos = [
    { id: 901, nome: "Liga de Robótica Educacional", tipo: "Liga Acadêmica", docente: "Prof. Dr. Marcos Vinicius", data: "14/12/2025" },
    { id: 902, nome: "Núcleo de Segurança Cibernética", tipo: "Núcleo de Pesquisa", docente: "Prof. Dr. Carlos Mendes", data: "15/12/2025" }
];

/* =======================
   MÉTODOS EXPORTADOS
   ======================= */

// --- DISCENTES ---
export async function getDiscentes() {
    return structuredClone(discentesDB);
}

export async function atualizarDiscente(id, dadosAtualizados) {
    // Simula atualização no banco
    const index = discentesDB.findIndex(d => d.id === id);
    if (index !== -1) {
        discentesDB[index] = { ...discentesDB[index], ...dadosAtualizados };
        return true;
    }
    return false;
}

// --- SOLICITAÇÕES DE HORAS ---
export async function getSolicitacoesHoras() {
    return structuredClone(solicitacoesDB);
}

export async function processarSolicitacaoHoras(id, decisao, parecer = "") {
    // 1. Atualiza Status da Solicitação
    const solicitacao = solicitacoesDB.find(s => s.id === id);
    if (!solicitacao) return false;

    solicitacao.status = decisao === 'deferir' ? 'aprovada' : 'rejeitada';

    // 2. Se deferido, impacta o Aluno (Regra de Negócio Centralizada)
    const aluno = discentesDB.find(a => a.id === solicitacao.alunoId);
    if (aluno) {
        const novoHistorico = {
            id: Date.now(),
            atividade: solicitacao.atividade + " (Externo)",
            ch: solicitacao.ch,
            data: new Date().toLocaleDateString(),
            status: decisao === 'deferir' ? "Validado" : "Rejeitado",
            obs: parecer
        };

        if (decisao === 'deferir') {
            aluno.horasConcluidas += solicitacao.ch;
            aluno.horasPendentes = Math.max(0, aluno.horasPendentes - solicitacao.ch);
        }
        
        aluno.historico.push(novoHistorico);
    }

    return true;
}

// --- GRUPOS ---
export async function getGruposAtivos() {
    return structuredClone(gruposAtivos);
}

export async function getSolicitacoesGrupos() {
    return structuredClone(solicitacoesGrupos);
}

export async function getDocentesDisponiveis() {
    return structuredClone(docentesDisponiveis);
}

export async function criarGrupo(novoGrupo) {
    novoGrupo.id = Date.now();
    gruposAtivos.push(novoGrupo);
    return novoGrupo;
}

export async function dissolverGrupo(id) {
    gruposAtivos = gruposAtivos.filter(g => g.id !== id);
    return true;
}

export async function removerSolicitacaoGrupo(id) {
    solicitacoesGrupos = solicitacoesGrupos.filter(s => s.id !== id);
    return true;
}