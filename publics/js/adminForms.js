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
    const formsTicket = document.querySelectorAll(".form-ticket");
    const clientsForm = document.getElementById("clientes-form");
    const menuForm = document.getElementById("menu-form");

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
                if (data.hide == "Guardar") {
                    console.log("Inicio");
                    const response = await fetch(route, {
                        method: "POST",
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data)
                    });
                    console.log("Response: ", response);
                    const text = await response.text();
                    const result = JSON.parse(text);
                    if (result.success) {
                        Swal.fire("✅ Agregado correctamente", result.message || "", "success");
                        alert("Agregado correctamente");
                        form.reset();
                    } else {
                        Swal.fire("❌ Error al agregar", result.message || "No se pudo agregar correctamente", "error");
                        alert("Error al agregar");
                    }
                } else if (data.hide == "Editar") {
                    const allInputs = form.querySelectorAll("input[name]");
                    const inputs = Array.from(allInputs).filter(input => input.type != "hidden");
                    const select = form.querySelector("select");
                    inputs.forEach(input => { if (input.type == "checkbox") input.value = input.checked ? "on" : "off"; });
                    const arrayInputs = inputs.map(input => ({
                        name: input.name, value: input.value,
                        original: input.dataset.original, dbName: input.dataset.dbName
                    }));
                    if (select) {
                        arrayInputs.push({ name: select.name, value: select.value, original: select.dataset.original, dbName: select.dataset.dbName });
                    }
                    const inputHide = form.querySelector(`input[type="hidden"]`);
                    const id = data.id;
                    const section = inputHide.dataset.section;
                    const response = await fetch(`/api/editor?id=${id}&section=${section}`, {
                        method: "PATCH",
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(arrayInputs)
                    });
                    if (!response.ok) {
                        alert("❌ Error en la edición");
                        return Swal.fire("❌ Error al editar", "Hubo un error interno con la edición");
                    }
                    const result = await response.json();
                    if (!result.success) {
                        alert("❌ Error en la edición");
                        return Swal.fire("❌ Error al editar", result.message);
                    }
                    if (typeof Swal !== "undefined") {
                        Swal.fire("✅ Editado correctamente", "Reiniciando sesión para ver cambios")
                            .then(() => {
                                localStorage.setItem('redirectSection', section);
                                window.location.replace("/admins");
                            });
                    } else {
                        alert("✅ Editado correctamente\nReiniciando sesión para ver cambios");
                        localStorage.setItem('redirectSection', section);
                        window.location.replace("/admins");
                    }
                } else {
                    alert("❌ Error interno")
                    Swal.fire({ icon: 'error', title: 'Error', text: "Error en la información" });
                }
            } catch (err) {
                alert("❌ Error interno")
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

    const btnAdd = (btn, container, name, dbname) => {
        btn.addEventListener("click", () => {
            const div = document.createElement("div");
            div.style.display = "flex";
            div.style.flexDirection = "row"
            const input = document.createElement("input");
            input.type = "text";
            input.name = name;
            input.required = true;
            input.dataset.original = "";
            input.dataset.dbName = dbname;
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

    btnAdd(newDate, dates, "eventos_dates[]", "evt_dates");

    btnAdd(newSchedule, schedules, "eventos_schedules[]", "evt_schedules");

    formSubmit(eventsForm, "/api/newEvent");

    formSubmit(readingsForm, "/api/newReading");

    formSubmit(clientsForm, "");

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
                const data = await res.json();
                if (data.message === "Ticket ya registrado") {
                    alert("⚠️ Cuidado, este ticket ya estaba en sistema");
                } else if (res.ok) {
                    alert("✅ Compra registrada correctamente");
                    Swal.fire({ title: 'Éxito', text: 'Compra registrada correctamente', icon: 'success' });
                }

                const previewRed = document.getElementById("preview-red");
                const previewReg = document.getElementById("preview-reg");
                previewRed.style.display = previewReg.style.display = "none";
                form.reset();
            } catch (err) {
                alert("❌ Error interno")
                Swal.fire("❌ Error al registrar compra", res.error || "No se pudo registrar correctamente", "error");
            }
        });
    });

    menuForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        try {
            const res = await fetch('/subirFotoMenu', {
                method: 'POST',
                body: formData,
            });
            if (res.ok) {
                alert("✅ Foto guardada con éxito");
                Swal.fire({ title: 'Éxito', text: 'Foto guardada correctamente', icon: 'success' });
            }
                
            const menuPreview = document.getElementById("menu-preview");
            menuForm.reset();
            menuPreview.style.display = "none";
        } catch (err) {
            alert("❌ Error interno")
            Swal.fire("❌ Error interno", "No se pudo guardar la foto");
        }
    });

});