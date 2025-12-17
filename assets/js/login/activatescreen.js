const verifyBtn = document.getElementById("verifyBtn");
const codeInput = document.getElementById("codeInput");
const popup = document.getElementById("popup");
const cancelBtn = document.getElementById("cancelButtom");
if (verifyBtn) {
  verifyBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const code = codeInput ? codeInput.value : "";

    if (code === "1234") {
      popup && popup.classList.add("show");

      setTimeout(() => {
        popup && popup.classList.remove("show");
      }, 3000);
    } else {
      alert("Código inválido ❌");
    }
  });
} else {
  console.warn(
    "verifyBtn não encontrado — verifique se o script foi carregado (veja Network/Console)"
  );
}

if (cancelBtn) {
  cancelBtn.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = "loginscreen.html";
  });
}
