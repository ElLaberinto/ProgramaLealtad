document.addEventListener("DOMContentLoaded", () => {
    const apagadores = document.querySelectorAll(".admin-apagador");
    const eliminadores = document.querySelectorAll(".admin-eliminador");
    const editores = document.querySelectorAll(".admin-editor");

    apagadores.forEach(apagador => {
        if (apagador.dataset.st === "true") {
            apagador.style.backgroundColor = "rgba(0, 254, 84, 0.8)";
        } else {
            apagador.style.backgroundColor = "rgba(254, 25, 84, 0.8)";
        }
        apagador.addEventListener("click", () => {
            const id = apagador.dataset.id;
            const section = apagador.dataset.sec;
            const celda = document.querySelector(`td[data-status-id="${id}"][data-section="${section}"]`);
            fetch("/api/apagador", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, section })
            })
                .then(res => {
                    if (!res.ok) {
                        alert("❌ Error al usar apagador");
                        Swal.fire("❌ Error", "No se pudo usar el apagador", "error");
                    } 
                    return res.json();
                })
                .then(data => {
                    if (!data.success) {
                        alert("❌ Error");
                        Swal.fire("❌ Error", data.message);
                        return;
                    }
                    apagador.dataset.st = data.status.toString();
                    if (apagador.dataset.st === "true") {
                        celda.textContent = "Activo";
                        apagador.style.backgroundColor = "rgba(0, 254, 84, 0.8)";
                    } else {
                        celda.textContent = "Inactivo";
                        apagador.style.backgroundColor = "rgba(254, 25, 84, 0.8)";
                    }
                })
                .catch(err => console.error("Error en el apagador:", err));
        });
    });

    eliminadores.forEach(eliminador => {
        eliminador.addEventListener("click", () => {
            Swal.fire({
                title: "¿Estás seguro?",
                text: "Esta acción eliminará el elemento permanentemente.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Sí, eliminar",
                cancelButtonText: "Cancelar"
            }).then(result => {
                if (result.isConfirmed) {
                    const id = eliminador.dataset.id;
                    const section = eliminador.dataset.sec;
                    fetch("/api/eliminador", {
                        method: "DELETE",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ id, section })
                    })
                        .then(res => {
                            if(!res.ok){
                                alert("❌ Error al usar eliminador");
                                Swal.fire("❌ Error", "No se pudo usar el eliminador", "error");
                            } 
                            return res.json();
                        })
                        .then(data => {
                            if(!data.success) {
                                alert("❌ Error");
                                return Swal.fire("❌ Error", data.message);
                            } 
                            window.location.href = `/admins#${section}`
                        })
                        .catch(err => console.error("Error en el eliminador: ", err));
                }
            });
        });
    });

    editores.forEach(async editor => {
        editor.addEventListener("click", async () => {
            const id = editor.dataset.id;
            const section = editor.dataset.sec;
            const response = await fetch(`/api/obtenInfo?id=${id}&sec=${section}`);
            const info = await response.json();
            if(!info || !info.success) {
                alert("❌ Error de base de datos");
                return Swal.fire("❌ Error", "Error al obtener información de la base de datos");
            } 
            const modal = document.getElementById(`${section}-modal`)
            const form = document.getElementById(`${section}-form`);
            const inputsHide = form.querySelectorAll(`input[type="hidden"]`);
            const allInputs = form.querySelectorAll("input[name]");
            const inputs = Array.from(allInputs).filter(input => input.type != "hidden");
            const select = form.querySelector("select");
            form.reset();
            inputsHide[0].value = "Editar";
            inputsHide[1].value = id;
            modal.style.display = "block";
            switch(section) {
                case "promos":
                    inputs[0].value = inputs[0].dataset.original = info.promo.pro_name;
                    inputs[1].value = inputs[1].dataset.original = info.promo.pro_points;
                    if(info.promo.pro_expiration == null) {
                        inputs[2].disabled = true;
                        inputs[2].dataset.original = "";
                        inputs[3].checked = true;
                        inputs[3].dataset.original = "on";
                    } else {
                        const fechaFormateada = new Date(info.promo.pro_expiration).toISOString().split('T')[0];
                        inputs[2].disabled = false;
                        inputs[2].value = inputs[2].dataset.original = fechaFormateada;
                        inputs[3].dataset.original = "off";
                    }
                    break;
                case "rangos":
                    inputs[0].value = inputs[0].dataset.original = info.rank.ran_name;
                    inputs[1].value = inputs[1].dataset.original = info.rank.ran_cashback;
                    break;
                case "eventos":
                    let i = 3;
                    const dates = info.event.evt_dates.length;
                    const schedules = info.event.evt_schedules.length;
                    const buttons = form.querySelectorAll(`input[type="button"]`);
                    const btnCerrar = form.querySelectorAll("button");
                    if(btnCerrar) btnCerrar.forEach(btn => { btn.click(); });                    
                    for(let j = 1; j < dates; j++) buttons[0].click();
                    for(let j = 1; j < schedules; j++) buttons[1].click();
                    const newAllInputs = form.querySelectorAll("input[name]");
                    const newInputs = Array.from(newAllInputs).filter(input => input.type != "hidden");
                    newInputs[0].value = newInputs[0].dataset.original = info.event.evt_name;
                    newInputs[1].value = newInputs[1].dataset.original = info.event.evt_instructor;
                    newInputs[2].value = newInputs[2].dataset.original = info.event.evt_duration;
                    for(let j = 0; j < dates; j++) {
                        newInputs[i].value = newInputs[i].dataset.original = info.event.evt_dates[j];
                        newInputs[i].dataset.dbName = "evt_dates";
                        i++;
                    }
                    i++;
                    for(let j = 0; j < schedules; j++) {
                        newInputs[i].value = newInputs[i].dataset.original = info.event.evt_schedules[j];
                        newInputs[i].dataset.dbName = "evt_schedules";
                        i++;
                    }
                    i++;
                    if(info.event.evt_cost == 0) {
                        newInputs[i].disabled = true;
                        newInputs[i].dataset.original = "";
                        newInputs[i+1].checked = true;
                        newInputs[i+1].dataset.original = "on";
                        newInputs[i+2].disabled = true;
                        newInputs[i+2].dataset.original = "";
                        newInputs[i+3].checked = false;
                        newInputs[i+3].dataset.original = "off";
                        newInputs[i+3].disabled = true;
                    } else {
                        newInputs[i].value = newInputs[i].dataset.original = info.event.evt_cost;
                        newInputs[i].disabled = false;
                        newInputs[i+1].checked = false;
                        newInputs[i+1].dataset.original = "off";
                        if(info.event.evt_deposit == 0) {
                            newInputs[i+2].disabled = true;
                            newInputs[i+2].dataset.original = "";
                            newInputs[i+3].checked = true;
                            newInputs[i+3].dataset.original = "on";
                        } else {
                            newInputs[i+2].value = newInputs[i+2].dataset.original = info.event.evt_deposit;
                            newInputs[i+2].disabled = false;
                            newInputs[i+3].checked = false;
                            newInputs[i+3].dataset.original = "off";
                        }
                    } 
                    break;
                case "lecturas":
                    inputs[0].value = inputs[0].dataset.original = info.reading.rdn_book;
                    inputs[1].value = inputs[1].dataset.original = info.reading.rdn_author;
                    inputs[2].value = inputs[2].dataset.original = info.reading.rdn_facilitator;
                    inputs[3].value = inputs[3].dataset.original = info.reading.rdn_schedule;
                    select.value = select.dataset.original = info.reading.rdn_type;
                    break;
                case "clientes":
                    inputs[0].value = inputs[0].dataset.original = info.user.usr_name;
                    if(info.user.usr_mail == null) {
                        inputs[1].value = inputs[1].dataset.original = "N/A";
                    } else {
                        inputs[1].value = inputs[1].dataset.original = info.user.usr_mail;
                    }
                    inputs[2].value = inputs[2].dataset.original = info.client.clt_phone;
                    const fechaFormateada = new Date(info.client.clt_birthday).toISOString().split('T')[0];
                    inputs[3].value = inputs[3].dataset.original = fechaFormateada;
                    select.value = select.dataset.original = info.client.clt_rank;
                    break;
                case "admyemp":
                    inputs[0].value = inputs[0].dataset.original = info.usera.usr_name;
                    inputs[1].value = inputs[1].dataset.original = info.usera.usr_mail;
                    inputs[2].value = inputs[2].dataset.original = "*****";
                    select.value = select.dataset.original = info.usera.usr_role;
                    select.disabled = true;
                    break;
            }
        });  
    });

});