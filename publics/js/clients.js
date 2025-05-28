document.addEventListener("DOMContentLoaded", () => {
    const btnAbrir = document.querySelector(".cliente-editar-btn");
    const modal = document.querySelector(".cliente-editar-modal");
    const btnCerrar = document.querySelector(".cliente-editar-cerrar");

    btnAbrir.addEventListener("click", () => {
        modal.style.display = "block";
    });

    btnCerrar.addEventListener("click", () => {
        modal.style.display = "none";
    });

    window.addEventListener("click", e => {
        if (e.target === modal)
            modal.style.display = "none";
    });
});