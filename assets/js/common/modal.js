function openModal(id) {
    document.getElementById(id).style.display = "flex";
}

function closeModal(id) {
    document.getElementById(id).style.display = "none";
}

// Fecha ao clicar fora do modal
document.addEventListener("click", function(e) {
    if (e.target.classList.contains("modal-overlay")) {
        e.target.style.display = "none";
    }
});
