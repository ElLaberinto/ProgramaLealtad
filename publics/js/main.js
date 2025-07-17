document.addEventListener("DOMContentLoaded", () => {
    const pathname = window.location.pathname;
    const options = document.querySelectorAll(".header-cup-img");

    const header = document.querySelector(".header");
    const btnHamburguer = document.getElementById("header-ham");
    const btnCerrar = document.getElementById("header-cerrar");

    /*const creartodo = document.getElementById("creartodo");

    creartodo.addEventListener("click", async () => {
        await fetch('/api/inicializar')
    });*/
    
    options.forEach(path => {
        if(path.dataset.path === pathname) path.src = "/media/Coffee.png"
        else path.src = ""
        if(path.dataset.path === 'programadepuntos' && (pathname === 'clientes' || pathname === 'admins')) path.src = "/media/Coffee.png"
    });

    btnHamburguer.addEventListener("click", () => {
        btnHamburguer.style.display = "none";
        header.style.left = "0%";
    });

    btnCerrar.addEventListener("click", () => {
        btnHamburguer.style.display = "flex";
        header.style.left = "-100%";
    });

});
