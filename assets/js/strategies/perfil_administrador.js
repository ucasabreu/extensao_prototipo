export const perfilAdministradorStrategy = {

    getHeaderData() {
        return {
            nome: "Administrador do Sistema",
            email: "admin@ufma.br",
            matricula: "ADM-0001",
            avatar: "A"
        };
    },

    getBasicData() {
        return {
            telefone: "(98) 99999-9999",
            endereco: "Campus Universitário"
        };
    },

    getVinculosData() {
        return {
            status: "Ativo",
            desde: "2023",
            papel: "Administrador Geral",
            unidade: "Pró-Reitoria / TI",
            grupos: [
                "Gestão do Sistema",
                "Auditoria Institucional"
            ]
        };
    },

    getComunicados() {
        return [
            {
                origem: "Sistema",
                data: "Hoje",
                titulo: "Acesso Administrativo",
                msg: "Você possui acesso total às funcionalidades do sistema."
            }
        ];
    },

    getHistorico() {
        return [
            {
                data: "Hoje",
                acao: "Login administrativo",
                detalhe: "Acesso ao painel ADM"
            },
            {
                data: "Ontem",
                acao: "Alteração de permissões",
                detalhe: "Perfil Discente Ofertante"
            }
        ];
    },

    getExtraTabs() {
        return [
            {
                id: "gestao",
                label: "Gestão",
                templateId: "tpl-gestao",
                fillData: (clone) => {
                    clone.getElementById("gestao-portaria").textContent = "Portaria nº 123/2024";
                    clone.getElementById("gestao-curso").value = "Sistema Institucional";
                    clone.getElementById("gestao-vigencia").textContent = "2024 - Atual";
                    clone.getElementById("gestao-docentes").textContent = "42";
                    clone.getElementById("gestao-email").value = "admin@ufma.br";
                }
            }
        ];
    }
};
