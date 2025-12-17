/* =====================================================
   AUTH SERVICE
   MOCK CENTRAL / FUTURA API DE AUTENTICAÇÃO
===================================================== */

const API_BASE_URL = null; // futuro: "/api/auth"

/* =====================================================
   MOCKS – USUÁRIOS
===================================================== */
const usersMock = [
    { 
        id: 1, 
        nome: "Prof. Carlos Silva", 
        email: "docente@teste.com", 
        password: "123", 
        role: "docente" 
    },
    { 
        id: 2, 
        nome: "Coord. Maria Oliveira", 
        email: "coord@teste.com", 
        password: "123", 
        role: "coordenador_curso" 
    },
    { 
        id: 3, 
        nome: "Admin Geral", 
        email: "admin@teste.com", 
        password: "123", 
        role: "administrador" 
    },
    { 
        id: 4, 
        nome: "João Aluno", 
        email: "aluno@teste.com", 
        password: "123", 
        role: "discente" 
    },
    { 
        id: 5, 
        nome: "Ana Ofertante", 
        email: "oferta@teste.com", 
        password: "123", 
        role: "discenteOfertante" 
    }
];

/* =====================================================
   FUNÇÕES PÚBLICAS
===================================================== */

/**
 * Simula o login no sistema
 * Retorna o objeto do usuário se sucesso, ou null se falha
 */
export async function loginAuth(email, password) {
    if (API_BASE_URL) {
        // Exemplo futuro de conexão real
        const res = await fetch(`${API_BASE_URL}/login`, {
            method: "POST",
            body: JSON.stringify({ email, password })
        });
        return await res.json();
    }

    // Simulação local (delay de 500ms para parecer real)
    return new Promise((resolve) => {
        setTimeout(() => {
            const user = usersMock.find(u => u.email === email && u.password === password);
            // Retorna um clone para proteger o mock original
            resolve(user ? structuredClone(user) : null);
        }, 500); 
    });
}

/**
 * Salva a sessão do usuário no navegador
 */
export function saveSession(user) {
    localStorage.setItem("usuarioLogado", JSON.stringify(user));
}

/**
 * Remove a sessão (Logout)
 */
export function clearSession() {
    localStorage.removeItem("usuarioLogado");
}