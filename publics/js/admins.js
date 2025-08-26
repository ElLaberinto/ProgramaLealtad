document.addEventListener("DOMContentLoaded", () => {
    const inputTicketReg = document.getElementById("reg-img");
    const previewTicketReg = document.getElementById("preview-reg");
    const inputClienteReg = document.getElementById("reg-cliente");
    const listaClientesReg = document.getElementById("lista-clientes-reg")
    const inputTotalReg = document.getElementById("reg-tot");
    const inputPuntosReg = document.getElementById("reg-pts");
    const inputHideReg = document.getElementById("reg-hide");

    const inputTicketRed = document.getElementById("red-img");
    const previewTicketRed = document.getElementById("preview-red");
    const inputClienteRed = document.getElementById("red-cliente");
    const listaClientesRed = document.getElementById("lista-clientes-red");
    const inputPromoRed = document.getElementById("red-promo");
    const listaPromosRed = document.getElementById("lista-promos-red");
    const inputPuntosRed = document.getElementById("red-pts");
    const inputHideRed = document.getElementById("red-hide");

    const inputProducto = document.getElementById("menu-producto");
    const listaProductos = document.getElementById("lista-menu");
    const inputHideMenu = document.getElementById("menu-hide");
    const inputImgMenu = document.getElementById("menu-img");
    const previewImgMenu = document.getElementById("menu-preview");

    const btnLogout = document.getElementById("logout");

    const verification = () => {
        const hash = window.location.hash;
        const rol = document.getElementById("rol");
        if ((hash === "#admyemp" || hash === "#rangos" || hash === "#eventos" || hash === "#lecturas") && rol.value === "Empleado") {
            window.location.hash = "#registro";
            alert("Acceso denegado a esta sección");
        }
    };
    window.addEventListener('hashchange', verification);
    window.addEventListener('DOMContentLoaded', verification);

    let clientes = [];
    let promos = [];
    let clienteSeleccionado = null;

    const debounce = (func, delay) => {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func.apply(this, args);
            }, delay);
        };
    };

    const calcularPuntos = () => {
        const total = parseFloat(inputTotalReg.value);
        if (clienteSeleccionado && !isNaN(total)) {
            inputPuntosReg.value = Math.round((total * clienteSeleccionado.cashback / 100));
        } else {
            inputPuntosReg.value = "";
        }
    };

    const obtenerPuntos = () => {
        const promo = inputPromoRed.value;
        if (promo) {
            const points = Math.round(parseFloat(-promo.split(",")[1].trim()));
            inputPuntosRed.value = points;
        } else {
            inputPuntosRed.value = "";
        }
    }

    const completarClientes = async (input, lista, funcionPuntos, inputHide) => {
        const query = input.value;
        if (query.length < 3) {
            lista.innerHTML = "";
            return;
        }
        const res = await fetch(`/api/autocompletarClientes?q=${encodeURIComponent(query)}`);
        clientes = await res.json();
        lista.innerHTML = "";
        clientes.forEach(cliente => {
            const li = document.createElement("li");
            li.textContent = `${cliente.name} , ${cliente.phone} , ${cliente.mail}`;
            li.addEventListener("click", () => {
                input.value = li.textContent;
                clienteSeleccionado = cliente;
                lista.innerHTML = "";
                funcionPuntos();
                inputHide.value = cliente.id;
            });
            lista.appendChild(li);
        })
    };

    inputTicketReg.addEventListener("change", e => {
        const image = e.target.files[0];
        if (image) {
            const reader = new FileReader();
            reader.onload = e2 => {
                previewTicketReg.src = e2.target.result;
                previewTicketReg.style.display = "block";
            };
            reader.readAsDataURL(image);
        }
    });

    inputClienteReg.addEventListener("input", debounce(() => {
        completarClientes(inputClienteReg, listaClientesReg, calcularPuntos, inputHideReg);
    }, 500));

    inputTotalReg.addEventListener("input", debounce(calcularPuntos, 500));

    inputTicketRed.addEventListener("change", e => {
        const image = e.target.files[0];
        if (image) {
            const reader = new FileReader();
            reader.onload = e2 => {
                previewTicketRed.src = e2.target.result;
                previewTicketRed.style.display = "block";
            };
            reader.readAsDataURL(image);
        }
    });

    inputClienteRed.addEventListener("input", debounce(() => {
        completarClientes(inputClienteRed, listaClientesRed, obtenerPuntos, inputHideRed);
    }, 500));

    inputPromoRed.addEventListener("input", async () => {
        const query = inputPromoRed.value;
        if (query.length < 3) {
            listaPromosRed.innerHTML = "";
            return;
        }
        let points = -1;
        if (clienteSeleccionado) points = clienteSeleccionado.points;
        const res = await fetch(`/api/autocompletarPromos?q=${encodeURIComponent(query)}&p=${points}`);
        promos = await res.json();
        listaPromosRed.innerHTML = "";
        promos.forEach(promo => {
            const li = document.createElement("li");
            li.textContent = `${promo.name} , ${promo.points}`;
            li.addEventListener("click", () => {
                inputPromoRed.value = li.textContent;
                listaPromosRed.innerHTML = "";
                obtenerPuntos();
            });
            listaPromosRed.appendChild(li);
        });
    });

    inputProducto.addEventListener("input", async () => {
        const query = inputProducto.value;
        if (query.length < 2) {
            listaProductos.innerHTML = "";
            return;
        }
        const res = await fetch(`/api/autocompletarProductos?q=${encodeURIComponent(query)}`);
        const productos = await res.json();
        listaProductos.innerHTML = "";
        productos.forEach(producto => {
            const li = document.createElement("li");
            li.textContent = `${producto.name} , $${Math.floor(producto.price)}`;
            li.addEventListener("click", () => {
                if (producto.url != null) {
                    alert("⚠️ Este producto ya tiene foto");
                    Swal.fire("❌ Error", "El producto que elegiste ya tiene una foto asociada");
                    inputProducto.value = listaProductos.innerHTML = "";
                    return;
                }
                inputProducto.value = li.textContent;
                listaProductos.innerHTML = "";
                inputHideMenu.value = producto.id;
            });
            listaProductos.appendChild(li);
        });
    });

    inputImgMenu.addEventListener("change", e => {
        const image = e.target.files[0];
        if (image) {
            const reader = new FileReader();
            reader.onload = e2 => {
                previewImgMenu.src = e2.target.result;
                previewImgMenu.style.display = "block";
            };
            reader.readAsDataURL(image);
        }
    });

    btnLogout.addEventListener("click", () => {
        if (typeof Swal !== "undefined" && Swal.fire) {
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
        } else {
            alert("Tu sesión se cerrará \n Vuelve pronto ✌️");
            window.location.href = "/logout";
        }

    });

});