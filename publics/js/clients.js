document.addEventListener("DOMContentLoaded", () => {
    const btnAbrir = document.querySelector(".cliente-editar-btn");
    const modal = document.querySelector(".cliente-editar-modal");
    const btnCerrar = document.querySelector(".cliente-editar-cerrar");
    const form = document.getElementById("editar-form");
    const btnLogout = document.getElementById("logout");

    const userFields = ["name", "mail", "password"];

    btnAbrir.addEventListener("click", async () => {
        if (typeof Swal !== "undefined") {
            Swal.fire({
            title: 'Confirmación para edición',
            text: 'Por favor, ingresa tu contraseña para continuar:',
            input: 'password',
            inputPlaceholder: 'Contraseña',
            inputAttributes: {
                maxlength: 100,
                autocapitalize: 'off',
                autocorrect: 'off'
            },
            showCancelButton: true,
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Cancelar',
            preConfirm: (password) => {
                if (!password) {
                    Swal.showValidationMessage('La contraseña es requerida');
                }
                return password;
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                const password = result.value;
                const hashedPassword = btnAbrir.dataset.hashedPassword;
                const response = await fetch(`/api/comparePassword?p=${encodeURIComponent(password)}&h=${encodeURIComponent(hashedPassword)}`);
                const res = await response.json();
                if (res.success) modal.style.display = "block";
                else Swal.fire("❌ Error", res.error);
            }
        });
        } else {
            alert("😥 No disponible \n Acude a \"El Laberinto\" a que te ayuden con la edición");
        }
        
    });

    btnCerrar.addEventListener("click", () => {
        modal.style.display = "none";
    });

    window.addEventListener("click", e => {
        if (e.target === modal)
            modal.style.display = "none";
    });

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const inputs = form.querySelectorAll("input[name]");
        const cambios = [];
        let cambiosUser = {}
        let cambiosClient = {};
        let originalMail;
        let cambiaPassword = false;
        inputs.forEach(input => {
            const original = input.dataset.original;
            const actual = input.value;
            if (input.name == "mail") originalMail = input.dataset.original;
            if (actual && original != actual) {
                if (input.name == "password") cambiaPassword = true;
                cambios.push(input.dataset.name);
                console.log("Cambios: ", cambios);
                if (userFields.includes(input.name)) {
                    console.log("User");
                    cambiosUser[input.dataset.field] = input.value;
                } else {
                    console.log("Client");
                    cambiosClient[input.dataset.field] = input.value;
                }
                console.log("User: ", cambiosUser);
                console.log("Client: ", cambiosClient);
            }
        });
        if (cambios.length == 0) {
            modal.style.display = "none";
            Swal.fire("❌ Cambios no realizados", "No hiciste ninguna modificación");
            return;
        }
        if (cambiaPassword) {
            Swal.fire({
                title: "¿Seguro de cambiar contraseña?",
                text: "Se detectó un cambio en la contraseña y se cerrará sesión al hacer el cambio",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Sí, editar",
                cancelButtonText: "Cancelar"
            }).then(async result => {
                if (!result.isConfirmed) {
                    modal.style.display = "none";
                    Swal.fire("❌ Cambios no realizados", "Rechazaste la edición para conservar tu contraseña");
                    return;
                } else {
                    try {
                        fetch("/api/editarCliente", {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ cambiosUser, cambiosClient, originalMail })
                        }).then(res => {
                            if (!res.ok) Swal.fire("❌ Error", "No se pudo editar", "error");
                            return res.json();
                        }).then(data => {
                            if (!data.success) {
                                Swal.fire("❌ Error", data.error);
                                return;
                            }
                            modal.style.display = "none";
                            Swal.fire("✅ Cambios realizados", `Cambios: ${cambios}`)
                                .then(() => {
                                    return Swal.fire({ icon: "info", title: "ℹ️ Nota", text: "Cerrando sesión para ver cambios.", });
                                })
                                .then(() => {
                                    window.location.href = "/logout";
                                });
                        });
                    } catch (err) {
                        Swal.fire("❌ Cambios no realizados", `Error al editar: ${err}`);
                    }
                }
            });
        } else {
            try {
                fetch("/api/editarCliente", {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ cambiosUser, cambiosClient, originalMail })
                }).then(res => {
                    if (!res.ok) Swal.fire("❌ Error", "No se pudo editar", "error");
                    return res.json();
                }).then(data => {
                    console.log("Data: ", data);
                    if (!data.success) {
                        Swal.fire("❌ Error", "Celular o correo ya ocupados", "error");
                        return;
                    }
                    modal.style.display = "none";
                    Swal.fire("✅ Cambios realizados", `Cambios: ${cambios}`)
                        .then(() => {
                            Swal.fire({ icon: "info", title: "ℹ️ Nota", text: "Reinicia sesión para ver los cambios reflejados.", });
                        });
                });
            } catch (err) {
                Swal.fire("❌ Cambios no realizados", `Error al editar: ${err}`);
            }
        }
    });

    btnLogout.addEventListener("click", () => {
        Swal.fire({
            title: "¿Seguro quieres cerrar la sesión?",
            text: "Tendrás que volver a ingresar tus datos",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sí, salir",
            cancelButtonText: "Cancelar"
        }).then(async result => {
            if (result.isConfirmed) {
                window.location.href = "/logout";
            }
        });
    });

    if (window.innerWidth < 600) {
        const btnPerfil = document.getElementById("aperfil");
        const btnPuntos = document.getElementById("apuntos");
        const btnHistorial = document.getElementById("ahistorial");
        const contenido = document.getElementById("contenido");
        const nav = document.getElementById("nav");
        const btnCerrar = document.querySelectorAll(".cerrar");

        const pressBtn = (btn) => {
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                contenido.style.display = "block";
                nav.style.display = "none";
                nav.style.position = "absolute";
                requestAnimationFrame(() => {
                    const target = document.querySelector(btn.getAttribute('href'));
                    target.scrollIntoView({ behavior: 'smooth' });
                });
            });
        }

        pressBtn(btnPerfil);
        pressBtn(btnPuntos);
        pressBtn(btnHistorial);

        btnCerrar.forEach(btn => {
            btn.addEventListener("click", () => {
                contenido.style.display = "none";
                nav.style.display = "flex";
                nav.style.position = "relative";
            });
        });
    }
});