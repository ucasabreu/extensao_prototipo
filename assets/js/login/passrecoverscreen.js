const sendBtn = document.getElementById("sendBtn");
const codeInput = document.getElementById("codeInput");
const popup = document.getElementById("popup");
const cancelBtn = document.getElementById("cancelButtom");
if (sendBtn) {
  sendBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const code = codeInput ? codeInput.value : "";

    if (code === "teste@teste") {
      popup && popup.classList.add("show");

      setTimeout(() => {
        popup && popup.classList.remove("show");
      }, 3000);

      setTimeout(() => {
        window.location.href = "resetpassscreen.html";
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
