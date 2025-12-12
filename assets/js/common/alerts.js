/* ===============================
   SISTEMA GLOBAL DE TOASTS
=============================== */

function showToast(type, message) {
    const container = document.getElementById("toast-container");

    const toast = document.createElement("div");
    toast.classList.add("toast", `toast-${type}`);
    toast.textContent = message;

    container.appendChild(toast);

    // Remover após 3s
    setTimeout(() => {
        toast.style.animation = "toastHide 0.4s forwards";
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}

/* ===============================
   SISTEMA GLOBAL DE ALERTAS INLINE
=============================== */

function createAlert(type, message) {
    const div = document.createElement("div");
    div.classList.add("alert", `alert-${type}`);
    div.textContent = message;
    return div;
}