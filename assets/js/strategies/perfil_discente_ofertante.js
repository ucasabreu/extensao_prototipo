export const PerfilDiscenteOfertanteStrategy = {

    getHeaderData: () => ({
        nome: "Discente Ofertante",
        email: "ofertante@aluno.ufma.br",
        matricula: "Matrícula: 202312345",
        avatar: "D"
    }),

    getBasicData: () => ({
        telefone: "(98) 90000-0000",
        endereco: "Residência Acadêmica"
    }),

    getExtraTabs: () => [
        {
            id: "projetos",
            label: "Meus Projetos",
            templateId: "tpl-projetos",
            fillData: (container) => {
                container.querySelector("#proj-total").textContent = "3 ativos";
            }
        }
    ],

    getVinculosData: () => ({
        papel: "Discente Ofertante",
        unidade: "Curso de Computação",
        status: "Ativo",
        desde: "2023.1",
        grupos: ["Projeto Robótica", "Extensão IA"]
    }),

    getComunicados: () => [],
    getHistorico: () => []
};
