const menu = [
    {   nombre: "Expresso", precio: 35, 
        url: "/media/expresso.jpg" },
    {   nombre: "Pan + cappuccino o latte", precio: 82, 
        url: "/media/pan+capu.jpg" },
];

document.addEventListener("DOMContentLoaded", () => {
    const listaProductos = document.querySelectorAll(".menu-producto");
    const modal = document.getElementById("modal");
    const modalImg = document.getElementById("modal-img");
    const modalNombre = document.getElementById("modal-nombre");
    const modalPrecio = document.getElementById("modal-precio");
    const btnCerrar = document.getElementById("cerrar");

    listaProductos.forEach(producto =>{
        producto.addEventListener('click', () => {
            
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