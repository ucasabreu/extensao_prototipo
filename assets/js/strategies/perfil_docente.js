export const PerfilDocenteStrategy = {
    getHeaderData: () => ({
        nome: "Prof. Carlos Silva",
        email: "carlos.silva@ufma.br",
        matricula: "SIAPE: 20231001",
        avatar: "C"
    }),

    getBasicData: () => ({
        telefone: "(98) 99999-0000",
        endereco: "Av. dos Portugueses, S/N"
    }),

    // Abas EXTRAS (Só do Docente)
    getExtraTabs: () => [
        {
            id: "lattes",
            label: "Currículo Lattes",
            templateId: "tpl-lattes",
            fillData: (container) => {
                container.querySelector("input").value = "http://lattes.cnpq.br/123";
            }
        }
    ],

    // --- DADOS PARA AS ABAS OBRIGATÓRIAS ---
    
    getVinculosData: () => ({
        papel: "Docente Efetivo (40h DE)",
        unidade: "Departamento de Informática",
        status: "Ativo",
        desde: "10/02/2018",
        grupos: ["Liga de IA (Tutor)", "Colegiado de Curso (Membro)"]
    }),

    getComunicados: () => [
        { data: "15/02/2025", origem: "PROEC", titulo: "Edital de Extensão 2025", msg: "Submissões abertas até dia 30." }
    ],

    getHistorico: () => [
        { data: "Hoje, 08:30", acao: "Login no sistema" },
        { data: "Ontem, 14:20", acao: "Aprovou inscrição", detalhe: "Aluno João Silva" }
    ]
};