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
                    if (!res.ok) Swal.fire("❌ Error", "No se pudo usar el apagador", "error");
                    return res.json();
                })
                .then(data => {
                    if (!data.success) {
                        Swal.fire("❌ Error", "No se puede desactivar al único administrador", "error");
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
                            console.log("Response: ", res);
                            if(!res.ok) Swal.fire("❌ Error", "No se pudo usar el eliminador", "error");
                            if(res.ok) eliminador.closest("tr").remove();
                        })
                        .catch(err => console.error("Error en el eliminador: ", err));
                }
            });
        });
    });


});