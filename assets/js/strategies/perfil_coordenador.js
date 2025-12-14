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

    // 3. ABAS EXTRAS
    getExtraTabs: () => [
        {
            id: "gestao",
            label: "Dados do Curso",
            templateId: "tpl-gestao", // Certifique-se que existe um <template id="tpl-gestao"> no HTML

            // Função que recebe o clone do HTML e preenche os dados
            fillData: (container) => {
                // Mock de dados do curso
                const dadosCurso = {
                    nome: "Engenharia de Software (Bacharelado)",
                    email: "coord.software@ufma.br",
                    portaria: "PORT/GR 123/2023",
                    vigencia: "2023 - 2025",
                    totalDocentes: "24 Ativos",
                    metaHoras: "360h (10% da C.H. Total)",
                    ppcAtivo: "PPC 2023.1 (Vigente)"
                };

                // --- FUNÇÃO AUXILIAR DE SEGURANÇA ---
                // Evita o erro "Cannot set properties of null" se um ID não existir
                const preencher = (seletor, valor, atributo = 'textContent') => {
                    const elemento = container.querySelector(seletor);
                    if (elemento) {
                        elemento[atributo] = valor;
                    } else {
                        // Aviso no console para ajudar a identificar IDs errados sem travar o sistema
                        console.warn(`[Perfil Coordenador] Elemento não encontrado: ${seletor}`);
                    }
                };

                // Preenchimento dos campos com segurança
                // Se for INPUT, usamos 'value'. Se for SPAN/DIV/P, usamos 'textContent'.
                
                // Assumindo que Nome e Email são inputs editáveis:
                preencher("#gestao-curso", dadosCurso.nome, 'value');
                preencher("#gestao-email", dadosCurso.email, 'value');

                // Assumindo que os demais são apenas textos de exibição:
                preencher("#gestao-portaria", dadosCurso.portaria);
                preencher("#gestao-vigencia", dadosCurso.vigencia);
                preencher("#gestao-docentes", dadosCurso.totalDocentes);
                
                // Requisito RF 007
                preencher("#gestao-meta-horas", dadosCurso.metaHoras);
                preencher("#gestao-ppc-ativo", dadosCurso.ppcAtivo);
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