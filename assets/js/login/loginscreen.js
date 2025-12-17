const testUser = {
  email: "teste@teste",
  password: "teste123",
};

const emailInput = document.getElementById("emailInput");
const passInput = document.getElementById("passInput");
const loginBtn = document.getElementById("loginButtom");

if (loginBtn) {
  loginBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const email = emailInput ? emailInput.value : "";
    const password = passInput ? passInput.value : "";

    if (email === testUser.email && password === testUser.password) {
      window.location.href = "homescreen.html";
    } else {
      alert("Email ou senha inválidos ❌");
    }
  });
}
