document.addEventListener("DOMContentLoaded", () => {
    const abrirModalPromos = document.getElementById("promos-btn");
    const modalPromos = document.getElementById("promos-modal");
    const cerrarModalPromos = document.getElementById("promos-cerrar");
    const formPromos = document.getElementById("promos-form");
    const inputHidePromos = document.querySelector("#promos-form input[type=hidden]");

    const abrirModalRangos = document.getElementById("rangos-btn");
    const modalRangos = document.getElementById("rangos-modal");
    const cerrarModalRangos = document.getElementById("rangos-cerrar");
    const formRangos = document.getElementById("rangos-form");
    const inputHideRangos = document.querySelector("#rangos-form input[type=hidden]");

    const abrirModalEventos = document.getElementById("eventos-btn");
    const modalEventos = document.getElementById("eventos-modal");
    const cerrarModalEventos = document.getElementById("eventos-cerrar");
    const formEventos = document.getElementById("eventos-form");
    const inputHideEventos = document.querySelector("#eventos-form input[type=hidden]");

    const abrirModalLecturas = document.getElementById("lecturas-btn");
    const modalLecturas = document.getElementById("lecturas-modal");
    const cerrarModalLecturas = document.getElementById("lecturas-cerrar");
    const formLecturas = document.getElementById("lecturas-form");
    const inputHideLecturas = document.querySelector("#lecturas-form input[type=hidden]");

    const modalClientes = document.getElementById("clientes-modal");
    const cerrarModalClientes = document.getElementById("clientes-cerrar");

    const abrirModalAdmYEmp = document.getElementById("admyemp-btn");
    const modalAdmYEmp = document.getElementById("admyemp-modal");
    const cerrarModalAdmYEmp = document.getElementById("admyemp-cerrar");
    const formAdmYEmp = document.getElementById("admyemp-form");
    const inputHideAdmYEmp = document.querySelector("#admyemp-form input[type=hidden]");

    const btnLogout = document.getElementById("logout");

    if (abrirModalPromos) {
        abrirModalPromos.addEventListener("click", () => {
            formPromos.reset();
            inputHidePromos.value = "Guardar";
            modalPromos.style.display = "block";
        });
        cerrarModalPromos.addEventListener("click", () => {
            modalPromos.style.display = "none";
        });
    }


    abrirModalRangos.addEventListener("click", () => {
        formRangos.reset();
        inputHideRangos.value = "Guardar";
        modalRangos.style.display = "block";
    });
    cerrarModalRangos.addEventListener("click", () => {
        modalRangos.style.display = "none";
    });

    abrirModalEventos.addEventListener("click", () => {
        formEventos.reset();
        inputHideEventos.value = "Guardar";
        modalEventos.style.display = "block";
    });
    cerrarModalEventos.addEventListener("click", () => {
        modalEventos.style.display = "none";
    });

    abrirModalLecturas.addEventListener("click", () => {
        formLecturas.reset();
        inputHideLecturas.value = "Guardar";
        modalLecturas.style.display = "block";
    });
    cerrarModalLecturas.addEventListener("click", () => {
        modalLecturas.style.display = "none";
    });

    cerrarModalClientes.addEventListener("click", () => {
        modalClientes.style.display = "none";
    });

    abrirModalAdmYEmp.addEventListener("click", () => {
        formAdmYEmp.reset();
        inputHideAdmYEmp.value = "Guardar";
        modalAdmYEmp.style.display = "block";
    });
    cerrarModalAdmYEmp.addEventListener("click", () => {
        modalAdmYEmp.style.display = "none";
    });

    if (window.innerWidth <= 600) {
        const botones = document.querySelectorAll(".admin-nav a");
        const contenedor = document.getElementById("contenedor");
        const nav = document.getElementById("nav");
        const btnCerrar = document.querySelectorAll(".cerrar");

        const pressBtn = (btn) => {
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                contenedor.style.display = "block";
                nav.style.display = "none";
                btnLogout.style.display = "block";
                requestAnimationFrame(() => {
                    const target = document.querySelector(btn.getAttribute('href'));
                    target.scrollIntoView({ behavior: 'smooth' });
                });
            });
        }

        botones.forEach(btn => {
            pressBtn(btn);
        });

        btnCerrar.forEach(btn => {
            btn.addEventListener("click", () => {
                contenedor.style.display = "none";
                nav.style.display = "flex";
                btnLogout.style.display = "none";
            });
        });
    }

});