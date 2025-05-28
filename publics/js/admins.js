document.addEventListener("DOMContentLoaded", () => {
    const inputTicketReg = document.getElementById("reg-img");
    const previewTicketReg = document.getElementById("preview-reg");
    const inputClienteReg = document.getElementById("reg-cliente");
    const listaClientesReg = document.getElementById("lista-clientes-reg")
    const inputTotalReg = document.getElementById("reg-tot");
    const inputPuntosReg = document.getElementById("reg-pts");

    const inputTicketRed = document.getElementById("red-img");
    const previewTicketRed = document.getElementById("preview-red");
    const inputClienteRed = document.getElementById("red-cliente");
    const listaClientesRed = document.getElementById("lista-clientes-red");
    const inputPromoRed = document.getElementById("red-promo");
    const listaPromosRed = document.getElementById("lista-promos-red");
    const inputPuntosRed = document.getElementById("red-pts");

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
        if(clienteSeleccionado && !isNaN(total)) {
            inputPuntosReg.value = (total * clienteSeleccionado.cashback / 100).toFixed(2);
        } else {
            inputPuntosReg.value = "";
        }
    };

    const obtenerPuntos = () => {
        const promo = inputPromoRed.value;
        if(promo) {
            const points = parseFloat(promo.split(",")[1].trim()).toFixed(2);
            inputPuntosRed.value = points;
        } else {
            inputPuntosRed.value = "";
        }
    }
    
    const completarClientes = async (input, lista, funcionPuntos) => {
        const query = input.value;
        if(query.length < 3){
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
            });
            lista.appendChild(li);
        })
    };

    inputTicketReg.addEventListener("change", e => {
        const image = e.target.files[0];
        if(image){
            const reader = new FileReader();
            reader.onload = e2 => {
                previewTicketReg.src = e2.target.result;
                previewTicketReg.style.display = "block";
            };
            reader.readAsDataURL(image);
        }
    });

    inputClienteReg.addEventListener("input", debounce (() => {
        completarClientes(inputClienteReg, listaClientesReg, calcularPuntos);         
    }, 500));

    inputTotalReg.addEventListener("input", debounce(calcularPuntos, 500));

    inputTicketRed.addEventListener("change", e => {
        const image = e.target.files[0];
        if(image){
            const reader = new FileReader();
            reader.onload = e2 => {
                previewTicketRed.src = e2.target.result;
                previewTicketRed.style.display = "block";
            };
            reader.readAsDataURL(image);
        }
    });

    inputClienteRed.addEventListener("input", debounce (() => {
        completarClientes(inputClienteRed, listaClientesRed, obtenerPuntos);         
    }, 500));

    inputPromoRed.addEventListener("input", async () => {
        const query = inputPromoRed.value;
        if(query.length < 3){
            listaPromosRed.innerHTML = "";
            return;
        }
        let points = -1;
        if(clienteSeleccionado) points = clienteSeleccionado.points;
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
        })
    });

});