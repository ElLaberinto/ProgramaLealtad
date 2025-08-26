document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");

    loginForm.addEventListener("submit", async e => {
        e.preventDefault();
        const form = e.target;
        const data = { USER: form.USER.value, PASS: form.PASS.value };
        try {
            const response = await fetch("/programadepuntos", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
                credentials: "include"
            });
            const result = await response.json();
            if(result.error) {
                alert("❌ Error");
                Swal.fire("❌ Error", result.error, "error");
            } else if (result.success) {
                if (result.rol === "Cliente") {
                    window.location.href = "/clientes";
                } else {
                    window.location.href = "/admins";
                }
            }
        } catch (err) {
            alert("⚠️ Error del servidor");
            Swal.fire("⚠️ Error del servidor", err.message, "error");
        }
    });
});