document.addEventListener("DOMContentLoaded", () => {
    const carrusel = document.querySelector('.home-carrusel');
    const imagenes = document.querySelectorAll('.home-carrusel img');
    const total = imagenes.length;
    let index = 0;

    function obtenerImagenesVisibles() {
        const anchoViewport = window.innerWidth;
        if (anchoViewport <= 600) return 1;
        else if (anchoViewport <= 1024) return 2;
        else return 4;
    };

    function obtenerAnchoImagen() {
        return carrusel.querySelector("img").offsetWidth;
    };

    function clonarImagenes() {
        carrusel.querySelectorAll(".clon").forEach(clon => clon.remove());
        for(let i=0; i < obtenerImagenesVisibles(); i++){
            const clon = imagenes[i].cloneNode(true);
            clon.classList.add("clon");
            carrusel.appendChild(clon);
        };
    }

    function moverCarrusel() {
        const imagenesVisibles = obtenerImagenesVisibles();
        const anchoImagen = obtenerAnchoImagen();
        clonarImagenes();
        index = (index + 1) % (total + 2);
        if(index - 1 < total){
            carrusel.style.transition = "transform 2s ease-in-out";
            carrusel.style.transform = `translateX(-${index * anchoImagen}px)`;
        }else{  
            carrusel.style.transition = "none";
            carrusel.style.transform = "translateX(0px)";
            index = 0;
        }
        

    };

    setInterval(moverCarrusel, 2000);
})