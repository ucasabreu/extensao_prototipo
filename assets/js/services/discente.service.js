/* =====================================================
   DISCENTE SERVICE
   MOCK CENTRAL / FUTURA API
===================================================== */

/* =====================================================
   CONFIGURAÇÃO DE API
===================================================== */
const API_BASE_URL = null; // futuro: "/api/discente"

/* =====================================================
   MOCKS – DADOS
===================================================== */

const oportunidadesMock = [
    {
        id: 1,
        titulo: "Projeto de Robótica Educacional",
        descricao: "Atividades de robótica para ensino básico.",
        carga: 40,
        status: "Aberta",
        modalidade: "Presencial",
        semestre: "1",
        ano: "2025",
        curso: "CC",
        inscrito: false,
        progresso: 0
    },
    {
        id: 2,
        titulo: "Extensão Comunitária – Quilombo",
        descricao: "Apoio educacional em comunidades tradicionais.",
        carga: 60,
        status: "Em andamento",
        modalidade: "Presencial",
        semestre: "2",
        ano: "2025",
        curso: "EC",
        inscrito: true,
        progresso: 30
    },
    {
        id: 3,
        titulo: "Laboratório de IA",
        descricao: "Pesquisa aplicada em Inteligência Artificial.",
        carga: 80,
        status: "Aberta",
        modalidade: "Remoto",
        semestre: "1",
        ano: "2025",
        curso: "CC",
        inscrito: false,
        progresso: 0
    }
];

const solicitacoesMock = [
    { id: 1, atividadeId: 1, status: "Aceita" },
    { id: 2, atividadeId: 2, status: "Em andamento" },
    { id: 3, atividadeId: 1, status: "Recusada" },
    { id: 4, atividadeId: 3, status: "Recusada" }
];

const certificacoesMock = [
    { id: 1, nome: "Projeto de Robótica Educacional", provedor: "Universidade Federal", carga: 40, status: "Aprovada" },
    { id: 2, nome: "Extensão Comunitária – Quilombo", provedor: "Pró-Reitoria de Extensão", carga: 60, status: "Em análise" },
    { id: 3, nome: "Laboratório de IA", provedor: "Faculdade de Tecnologia", carga: 80, status: "Aprovada" }
];

const noticiasMock = [
    { id: 1, titulo: "Edital de Projetos de Extensão 2025", resumo: "Abertas as inscrições para projetos de extensão do ano de 2025.", data: "2025-02-10" },
    { id: 2, titulo: "Semana Acadêmica", resumo: "Confira a programação completa da Semana Acadêmica.", data: "2025-03-01" },
    { id: 3, titulo: "Novas oportunidades em IA", resumo: "Laboratórios de Inteligência Artificial com inscrições abertas.", data: "2025-03-15" }
];

/* =====================================================
   FUNÇÕES PÚBLICAS (USADAS PELOS JS)
===================================================== */

export async function getOportunidades() {
    if (API_BASE_URL) {
        const res = await fetch(`${API_BASE_URL}/oportunidades`);
        return await res.json();
    }
    return structuredClone(oportunidadesMock);
}

export async function getSolicitacoes() {
    if (API_BASE_URL) {
        const res = await fetch(`${API_BASE_URL}/solicitacoes`);
        return await res.json();
    }
    return structuredClone(solicitacoesMock);
}

export async function getCertificacoes() {
    if (API_BASE_URL) {
        const res = await fetch(`${API_BASE_URL}/certificacoes`);
        return await res.json();
    }
    return structuredClone(certificacoesMock);
}

export async function getNoticias() {
    if (API_BASE_URL) {
        const res = await fetch(`${API_BASE_URL}/noticias`);
        return await res.json();
    }
    return structuredClone(noticiasMock);
}