document.addEventListener("DOMContentLoaded", () => {
    const abrirModalPromos = document.getElementById("promos-btn");
    const modalPromos = document.getElementById("promos-modal");
    const cerrarModalPromos = document.getElementById("promos-cerrar");

    const abrirModalRangos = document.getElementById("rangos-btn");
    const modalRangos = document.getElementById("rangos-modal");
    const cerrarModalRangos = document.getElementById("rangos-cerrar");

    const abrirModalEventos = document.getElementById("eventos-btn");
    const modalEventos = document.getElementById("eventos-modal");
    const cerrarModalEventos = document.getElementById("eventos-cerrar");

    const abrirModalLecturas = document.getElementById("lecturas-btn");
    const modalLecturas = document.getElementById("lecturas-modal");
    const cerrarModalLecturas = document.getElementById("lecturas-cerrar");

    const abrirModalAdmYEmp = document.getElementById("admyemp-btn");
    const modalAdmYEmp = document.getElementById("admyemp-modal");
    const cerrarModalAdmYEmp = document.getElementById("admyemp-cerrar");

    abrirModalPromos.addEventListener("click", () => {
        modalPromos.style.display = "block";
    });
    cerrarModalPromos.addEventListener("click", () => {
        modalPromos.style.display = "none";
    });

    abrirModalRangos.addEventListener("click", () => {
        modalRangos.style.display = "block";
    });
    cerrarModalRangos.addEventListener("click", () => {
        modalRangos.style.display = "none";
    });

    abrirModalEventos.addEventListener("click", () => {
        modalEventos.style.display = "block";
    });
    cerrarModalEventos.addEventListener("click", () => {
        modalEventos.style.display = "none";
    });

    abrirModalLecturas.addEventListener("click", () => {
        modalLecturas.style.display = "block";
    });
    cerrarModalLecturas.addEventListener("click", () => {
        modalLecturas.style.display = "none";
    });

    abrirModalAdmYEmp.addEventListener("click", () => {
        modalAdmYEmp.style.display = "block";
    });
    cerrarModalAdmYEmp.addEventListener("click", () => {
        modalAdmYEmp.style.display = "none";
    });

});