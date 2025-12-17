/* assets/js/services/propostas.service.js */

// --- MOCKS ---
const propostasDB = [
    { id: 101, titulo: "Inclusão Digital", docente: "Prof. Roberto", tipo: "Projeto", status: "aguardando", ch: 180, justificativa: "Necessário." },
    { id: 103, titulo: "Semana Eng.", docente: "Prof. Jorge", tipo: "Evento", status: "aprovada", ch: 40 }
];

const oportunidadesDB = [
    { id: 1, titulo: "Monitoria Algoritmos", responsavel: "Prof. Carlos", status: "pendente", ch: 60 }
];

// --- MÉTODOS ---

// VALIDAÇÃO (Propostas recebidas de docentes)
export async function getPropostasDocentes() { return structuredClone(propostasDB); }

export async function atualizarStatusProposta(id, novoStatus, motivo = null) {
    const p = propostasDB.find(x => x.id === id);
    if (p) p.status = novoStatus;
    return p;
}

// OPORTUNIDADES (Criadas pelo Coordenador ou validadas)
export async function getOportunidades() { return structuredClone(oportunidadesDB); }

export async function criarOportunidade(dados) {
    dados.id = Date.now();
    oportunidadesDB.unshift(dados);
}