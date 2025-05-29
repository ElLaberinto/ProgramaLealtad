document.addEventListener("DOMContentLoaded", () => {
    const altaForm = document.getElementById("alta-form");
    const admYEmpForm = document.getElementById("admyemp-form");
    const promosForm = document.getElementById("promos-form");
    const expiration = document.getElementById("promos-expiration");
    const noExpiration = document.getElementById("promos-noexp");
    const rangosForm = document.getElementById("rangos-form");
    const eventsForm = document.getElementById("eventos-form");
    const cost = document.getElementById("eventos-cost");
    const deposit = document.getElementById("eventos-deposit");
    const noCost = document.getElementById("eventos-nocost");
    const noDeposit = document.getElementById("eventos-nodeposit");
    const dates = document.getElementById("container-dates");
    const newDate = document.getElementById("eventos-add-date");
    const schedules = document.getElementById("container-schedules");
    const newSchedule = document.getElementById("eventos-add-schedule");
    const readingsForm = document.getElementById("lecturas-form");
    const formsTicket = document.querySelectorAll(".form-ticket")

    const formSubmit = (form, route) => {
        form.addEventListener("submit", async e => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = {};
            formData.forEach((value, key) => {
                if (data[key]) {
                    if (!Array.isArray(data[key])) {
                        data[key] = [data[key]];
                    }
                    data[key].push(value);
                } else {
                    data[key] = value;
                }
            });
            try {
                console.log("Data: ", data);
                /*
                const allInputs = form.querySelectorAll("input[name]");
                const inputs = allInputs.filter(input => input.name != hide);
                */
                const response = await fetch(route, {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                const text = await response.text();
                const result = JSON.parse(text);
                if (result.success) {
                    Swal.fire("✅ Agregado correctamente", result.message || "", "success");
                    form.reset();
                } else {
                    Swal.fire("❌ Error al agregar", result.error || "No se pudo agregar correctamente", "error");
                }
            } catch (err) {
                Swal.fire({ icon: 'error', title: 'Error al registrar', text: err.message });
            }
        });
    }

    formSubmit(altaForm, "/api/altaCliente");

    noExpiration.addEventListener("change", () => {
        if (noExpiration.checked) {
            expiration.value = "";
            expiration.disabled = true;
        } else {
            expiration.disabled = false;
        }
    });

    formSubmit(promosForm, "/api/newPromo");

    formSubmit(rangosForm, "/api/newRank");

    noCost.addEventListener("change", () => {
        if (noCost.checked) {
            cost.value = "";
            cost.disabled = true;
            deposit.value = "";
            deposit.disabled = true;
            noDeposit.checked = false;
            noDeposit.disabled = true;
        } else {
            cost.disabled = false;
            deposit.disabled = false;
            noDeposit.disabled = false;
        }
    });

    noDeposit.addEventListener("change", () => {
        if (noDeposit.checked) {
            deposit.value = "";
            deposit.disabled = true;
        } else {
            deposit.disabled = false;
        }
    });

    const btnAdd = (btn, container, name) => {
        btn.addEventListener("click", () => {
            const div = document.createElement("div");
            div.style.display = "flex";
            div.style.flexDirection = "row"
            const input = document.createElement("input");
            input.type = "text";
            input.name = name;
            input.required = true;
            const btn = document.createElement("button");
            btn.innerText = "X";
            btn.style.position = "absolute";
            btn.style.left = "100%"
            btn.addEventListener("click", () => {
                btn.closest("div").remove();
            });
            div.appendChild(input);
            div.appendChild(btn);
            container.appendChild(div);
        });
    }

    btnAdd(newDate, dates, "eventos_dates[]");

    btnAdd(newSchedule, schedules, "eventos_schedules[]");

    formSubmit(eventsForm, "/api/newEvent");

    formSubmit(readingsForm, "/api/newReading");

    formSubmit(admYEmpForm, "/api/altaAdmnEmp");

    formsTicket.forEach(form => {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            const form = e.target;
            const formData = new FormData(form);
            try {
                const res = await fetch('/subirTicket', {
                    method: 'POST',
                    body: formData,
                });
                console.log("Res: ", res);
                if(res.ok)
                    Swal.fire({ title: 'Éxito', text: 'Compra registrada correctamente', icon: 'success'});
                form.reset();
                } catch (err) {
                    Swal.fire("❌ Error al registrar compra", result.error || "No se pudo registrar correctamente", "error");
                }
            });
    });

});