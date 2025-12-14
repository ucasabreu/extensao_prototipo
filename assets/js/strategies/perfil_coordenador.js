/* ====================================================
   ESTRATÉGIA DE PERFIL: COORDENADOR DE CURSO
   ==================================================== */

export const PerfilCoordenadorStrategy = {
    
    // 1. Cabeçalho (Sidebar Vermelha)
    getHeaderData: () => ({
        nome: "Coord. Ana Maria",
        email: "ana.maria@ufma.br",
        matricula: "SIAPE: 19902020",
        avatar: "A"
    }),

    // 2. Aba "Editar Dados"
    getBasicData: () => ({
        telefone: "(98) 98888-1111",
        endereco: "Rua das Flores, 10, Renascença"
    }),

    // 3. ABAS EXTRAS (Aqui está a implementação que faltava!)
    getExtraTabs: () => [
        {
            id: "gestao",
            label: "Dados do Curso",
            templateId: "tpl-gestao", // Deve bater com o ID no HTML
            
            // Função que recebe o clone do HTML e preenche os dados
            fillData: (container) => {
                // Mock de dados do curso
                const dadosCurso = {
                    nome: "Engenharia de Software (Bacharelado)",
                    email: "coord.software@ufma.br",
                    portaria: "PORT/GR 123/2023",
                    vigencia: "2023 - 2025",
                    totalDocentes: "24 Ativos"
                };

                // Preenchimento dos campos usando os IDs que criamos
                container.querySelector("#gestao-curso").value = dadosCurso.nome;
                container.querySelector("#gestao-email").value = dadosCurso.email;
                container.querySelector("#gestao-portaria").textContent = dadosCurso.portaria;
                container.querySelector("#gestao-vigencia").textContent = dadosCurso.vigencia;
                container.querySelector("#gestao-docentes").textContent = dadosCurso.totalDocentes;
            }
        }
    ],

    // 4. Aba "Vínculos" (Obrigatória)
    getVinculosData: () => ({
        papel: "Coordenadora de Curso",
        unidade: "Coordenação B.C.C.",
        status: "Designada (Função Gratificada)",
        desde: "15/03/2023",
        grupos: [
            "NDE - Núcleo Docente Estruturante (Presidente)", 
            "Conselho de Centro (Membro)"
        ]
    }),

    // 5. Aba "Avisos"
    getComunicados: () => [
        { data: "Hoje", origem: "PROEC", titulo: "Relatório Anual", msg: "O prazo para envio do relatório consolidado do curso encerra em 10 dias." }
    ],

    // 6. Aba "Auditoria"
    getHistorico: () => [
        { data: "Hoje, 09:00", acao: "Login no sistema" },
        { data: "Ontem, 16:30", acao: "Deferiu solicitação", detalhe: "Aproveitamento de carga horária (Aluno: Bruno)" },
        { data: "12/02/2025", acao: "Publicou edital", detalhe: "Seleção de Monitoria 2025.1" }
    ]
};