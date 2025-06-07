document.addEventListener("DOMContentLoaded", () => {
    const listaProductos = document.querySelectorAll(".menu-producto");
    const modal = document.getElementById("modal");
    const modalImg = document.getElementById("modal-img");
    const modalNombre = document.getElementById("modal-nombre");
    const modalPrecio = document.getElementById("modal-precio");
    const btnCerrar = document.getElementById("cerrar");

    listaProductos.forEach(producto =>{
        producto.addEventListener('click', () => {
            const inputUrl = producto.querySelector("input");
            if (inputUrl.value) {
                modal.style.display = "block";
                modalImg.src = inputUrl.value;
                modalNombre.innerText = producto.dataset.name;
                modalPrecio.innerText = producto.dataset.price;
            }
        });
    });

    btnCerrar.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', e => {
        if (e.target === modal)
            modal.style.display = 'none';
    });

});