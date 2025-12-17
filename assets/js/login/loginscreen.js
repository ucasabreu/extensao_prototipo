/* =====================================================
   LOGIN SCREEN – CONTROLE DE SESSÃO (MOCK)
   Arquivo: assets/js/login/login.js
   ===================================================== */

// =========================
// MOCK DE USUÁRIOS
// =========================
const usuariosMock = [
  {
    nome: "Discente Teste",
    email: "discente@teste.com",
    senha: "123456",
    perfil: "discente"
  },
  {
    nome: "Discente Ofertante",
    email: "ofertante@teste.com",
    senha: "123456",
    perfil: "discenteOfertante"
  },
  {
    nome: "Docente Teste",
    email: "docente@teste.com",
    senha: "123456",
    perfil: "docente"
  },
  {
    nome: "Coordenador de Curso",
    email: "coord@teste.com",
    senha: "123456",
    perfil: "coordenador_curso"
  },
  {
    nome: "Administrador do Sistema",
    email: "admin@teste.com",
    senha: "admin123456",
    perfil: "administrador"
  }
];

// =========================
// EVENTO DE LOGIN
// =========================
document.getElementById("loginButtom").addEventListener("click", (e) => {
  e.preventDefault();

  const email = document.getElementById("emailInput").value.trim();
  const senha = document.getElementById("passInput").value.trim();

  if (!email || !senha) {
    alert("Informe email e senha.");
    return;
  }

  const usuario = usuariosMock.find(
    u => u.email === email && u.senha === senha
  );

  if (!usuario) {
    alert("Email ou senha inválidos");
    return;
  }

  // =========================
  // SESSÃO
  // =========================
  localStorage.setItem("perfil", usuario.perfil);
  localStorage.setItem("email", usuario.email);
  localStorage.setItem("nome", usuario.nome);

  // =========================
  // REDIRECIONAMENTO
  // =========================
  const rotas = {
    discente: "/pages/discente/dashboard.html",
    discenteOfertante: "/pages/discenteOfertante/dashboard.html",
    docente: "/pages/docente/dashboard.html",
    coordenador_curso: "/pages/coordenador_curso/dashboard.html",
    administrador: "/pages/administrador/dashboard.html"
  };

  window.location.href = rotas[usuario.perfil];
});
