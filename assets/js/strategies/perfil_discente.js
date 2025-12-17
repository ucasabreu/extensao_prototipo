/* =====================================================
   STRATEGY — PERFIL DISCENTE
   Contexto: Aluno participante de ações de extensão
   ===================================================== */

export const PerfilDiscenteStrategy = {

    /* =================================================
       HEADER DO PERFIL
       ================================================= */
    getHeaderData: () => ({
        nome: "Discente",
        email: "discente@aluno.ufma.br",
        matricula: "Matrícula: 202312345",
        avatar: "D"
    }),

    /* =================================================
       DADOS BÁSICOS (ABA EDITAR DADOS)
       ================================================= */
    getBasicData: () => ({
        nomeCivil: "Aluno Exemplo",
        emailInstitucional: "discente@aluno.ufma.br",
        telefone: "(98) 90000-0000",
        endereco: "São Luís - MA"
    }),

    /* =================================================
       VÍNCULOS ACADÊMICOS
       ================================================= */
    getVinculosData: () => ({
        papel: "Discente",
        curso: "Ciência da Computação",
        turno: "Integral",
        periodoAtual: "5º período",
        status: "Ativo",
        ingressouEm: "2022.2",
        grupos: [
            "Projeto Robótica Educacional",
            "Programa Extensão Digital"
        ]
    }),

    /* =================================================
       COMUNICADOS / AVISOS
       ================================================= */
    getComunicados: () => ([
        {
            titulo: "Inscrição aprovada",
            descricao: "Você foi aprovado na oportunidade Robótica Educacional.",
            data: "2024-04-10"
        },
        {
            titulo: "Novo edital disponível",
            descricao: "Edital de extensão 2024.1 aberto.",
            data: "2024-03-28"
        }
    ]),

    /* =================================================
       HISTÓRICO DO PERFIL
       (Discente NÃO possui auditoria administrativa)
       ================================================= */
    getHistorico: null,

    /* =================================================
       ABAS EXTRAS (DISCENTE NÃO POSSUI)
       ================================================= */
    getExtraTabs: () => [],

    /* =================================================
       CONTROLE DE ABAS VISÍVEIS
       PERFIL DISCENTE É SIMPLES
       ================================================= */
    allowedTabs: [
        "editar",       // Editar Dados
        "vinculos",     // Vínculos Acadêmicos
        "avisos",       // Comunicados
        "preferencias", // Preferências
        "acessibilidade"
    ]
};
