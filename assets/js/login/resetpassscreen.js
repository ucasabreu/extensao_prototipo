const sendBtn = document.getElementById("sendBtn");
const newPassInput = document.getElementById("newPassInput");
const confirmPassInput = document.getElementById("confirmPassInput");
const popup = document.getElementById("popup");
const cancelBtn = document.getElementById("cancelButtom");

if (sendBtn) {
  sendBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const newPass = newPassInput ? newPassInput.value : "";
    const confirmPass = confirmPassInput ? confirmPassInput.value : "";

    if (newPass === confirmPass) {
      popup && popup.classList.add("show");
      setTimeout(() => {
        popup && popup.classList.remove("show");
        window.location.href = "loginscreen.html";
      }, 3000);
    } else {
      alert("As senhas não coincidem ❌");
    }
  });
}
