export const PerfilDiscenteStrategy = {
    // ... header e basic data ...

    // Abas EXTRAS
    getExtraTabs: () => [
        { id: "academico", label: "Acadêmico", templateId: "tpl-academico", fillData: null }
    ],

    // --- DADOS PARA AS ABAS OBRIGATÓRIAS ---
    getVinculosData: () => ({
        papel: "Discente Regular",
        unidade: "Engenharia de Software",
        status: "Matriculado",
        desde: "2021.1",
        grupos: ["Empresa Júnior"]
    }),

    getComunicados: () => [
        { data: "12/02/2025", origem: "Coordenação", titulo: "Renovação de Matrícula", msg: "Fique atento aos prazos." }
    ],

    getHistorico: () => [
        { data: "Hoje, 09:00", acao: "Login no sistema" },
        { data: "10/02/2025", acao: "Solicitou inscrição", detalhe: "Curso de Python" }
    ]
};