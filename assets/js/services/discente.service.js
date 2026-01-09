/* =====================================================
   DISCENTE SERVICE
   MOCK CENTRAL / FUTURA API
===================================================== */

/* =====================================================
   CONFIGURACAO DE API
===================================================== */
const API_BASE_URL = null; // futuro: "/api/discente"

/* =====================================================
   MOCKS - DADOS
===================================================== */

const oportunidadesMock = [
    {
        id: 1,
        titulo: "Projeto de Robotica Educacional",
        descricao: "Oficinas de robotica para escolas publicas e kits didaticos.",
        carga: 40,
        status: "Aberta",
        modalidade: "Presencial",
        semestre: "1",
        ano: "2025",
        curso: "CC",
        inscrito: false,
        progresso: 0,
        vagas: 12,
        responsavel: "Profa. Ana Paula Souza"
    },
    {
        id: 2,
        titulo: "Extensao Comunitaria - Quilombo",
        descricao: "Apoio educacional e oficinas de letramento digital.",
        carga: 60,
        status: "Em andamento",
        modalidade: "Presencial",
        semestre: "2",
        ano: "2025",
        curso: "EC",
        inscrito: true,
        progresso: 45,
        vagas: 20,
        responsavel: "Prof. Marcos Pereira"
    },
    {
        id: 3,
        titulo: "Laboratorio de IA Aplicada",
        descricao: "Pesquisa aplicada em IA para saude e educacao.",
        carga: 80,
        status: "Aberta",
        modalidade: "Remoto",
        semestre: "1",
        ano: "2025",
        curso: "CC",
        inscrito: false,
        progresso: 0,
        vagas: 10,
        responsavel: "Profa. Carla Nunes"
    },
    {
        id: 4,
        titulo: "Mutirao de Regularizacao Urbana",
        descricao: "Levantamento urbanistico e orientacao juridica comunitaria.",
        carga: 50,
        status: "Encerrada",
        modalidade: "Presencial",
        semestre: "2",
        ano: "2024",
        curso: "EC",
        inscrito: false,
        progresso: 0,
        vagas: 25,
        responsavel: "Profa. Daniela Ramos"
    },
    {
        id: 5,
        titulo: "Clinica Escola de Empreendedorismo",
        descricao: "Mentorias para pequenos negocios e planejamento financeiro.",
        carga: 30,
        status: "Em andamento",
        modalidade: "Remoto",
        semestre: "1",
        ano: "2025",
        curso: "AD",
        inscrito: true,
        progresso: 70,
        vagas: 15,
        responsavel: "Prof. Paulo Freitas"
    },
    {
        id: 6,
        titulo: "Feira de Inovacao e Tecnologia",
        descricao: "Evento de divulgacao cientifica e prototipos de extensao.",
        carga: 20,
        status: "Concluído",
        modalidade: "Presencial",
        semestre: "2",
        ano: "2024",
        curso: "CC",
        inscrito: true,
        progresso: 100,
        vagas: 40,
        responsavel: "Profa. Elisa Martins"
    }
];

const solicitacoesMock = [
    {
        id: 1,
        atividadeId: 2,
        status: "Aceita",
        dataSolicitacao: "15/01/2025",
        dataAtualizacao: "20/01/2025"
    },
    {
        id: 2,
        atividadeId: 1,
        status: "Pendente",
        dataSolicitacao: "22/02/2025",
        dataAtualizacao: "Aguardando analise"
    },
    {
        id: 3,
        atividadeId: 3,
        status: "Recusada",
        dataSolicitacao: "10/02/2025",
        dataAtualizacao: "12/02/2025",
        parecer: "Prerequisitos nao atendidos. Necessario ter cursado Programacao Avancada."
    },
    {
        id: 4,
        atividadeId: 5,
        status: "Em andamento",
        dataSolicitacao: "05/03/2025",
        dataAtualizacao: "Em avaliacao da coordenacao"
    },
    {
        id: 5,
        atividadeId: 6,
        status: "Aprovada",
        dataSolicitacao: "18/11/2024",
        dataAtualizacao: "25/11/2024"
    }
];

const certificacoesMock = [
    { id: 1, nome: "Feira de Inovacao e Tecnologia", provedor: "Pro-Reitoria de Extensao", carga: 20, status: "Aprovada" },
    { id: 2, nome: "Projeto de Robotica Educacional", provedor: "Universidade Federal", carga: 40, status: "Aprovada" },
    { id: 3, nome: "Clinica Escola de Empreendedorismo", provedor: "Escola de Negocios", carga: 30, status: "Aprovada" },
    { id: 4, nome: "Extensao Comunitaria - Quilombo", provedor: "Pro-Reitoria de Extensao", carga: 60, status: "Em análise" },
    { id: 5, nome: "Laboratorio de IA Aplicada", provedor: "Faculdade de Tecnologia", carga: 80, status: "Em análise" }
];

const noticiasMock = [
    { id: 1, titulo: "Edital de Projetos de Extensao 2025", resumo: "Inscricoes abertas para projetos com foco em impacto social.", data: "2025-02-10" },
    { id: 2, titulo: "Semana Academica", resumo: "Programacao confirmada com palestras e minicursos.", data: "2025-03-01" },
    { id: 3, titulo: "Novas oportunidades em IA", resumo: "Laboratorios com bolsas de extensao e pesquisa aplicada.", data: "2025-03-15" },
    { id: 4, titulo: "Chamada para monitores de extensao", resumo: "Vagas para apoio em oficinas e eventos comunitarios.", data: "2025-04-02" }
];

/* =====================================================
   FUNCOES PUBLICAS (USADAS PELOS JS)
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
