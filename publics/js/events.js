document.addEventListener("DOMContentLoaded", () => {
    const eventosPasados = document.getElementById("eventos-pasados");
    const eventsModal = document.getElementById("eventos-modal");
    const btnCerrarEventos = document.getElementById("eventos-cerrar");
    const anchoViewport = window.innerWidth;

    eventosPasados.addEventListener('click', () => {
        eventsModal.style.display = 'block';
    })

    btnCerrarEventos.addEventListener('click', () => {
        eventsModal.style.display = 'none';
    });

    window.addEventListener('click', e => {
        if (e.target === eventsModal)
            eventsModal.style.display = 'none';
    });

    if(anchoViewport < 600){
        const eventosActualesTit = document.querySelector(".eventos-actuales-tit");
        const eventosLecturaTit = document.querySelector(".eventos-lectura-tit");
        const eventosActualesUl = document.querySelector(".eventos-actuales-ul");
        const eventosActualesBtn = document.querySelector(".eventos-actuales-btn");
        const eventosLecturaBtn = document.querySelector(".eventos-lectura-btn");
        const eventosLecturaMes = document.querySelector(".eventos-lectura-mes");
        const eventosLecturaQuincena = document.querySelector(".eventos-lectura-quincena");
        const eventosLecturaSemana = document.querySelector(".eventos-lectura-semana");
        
        eventosActualesBtn.style.display = "none";
        eventosLecturaBtn.style.display = "none";

        eventosActualesTit.addEventListener("click", () => {
            if(eventosActualesBtn.style.display === "none"){
                eventosActualesBtn.style.display = "block";
                eventosActualesUl.style.display = "block";
            }else{
                eventosActualesBtn.style.display = "none";
                eventosActualesUl.style.display = "none";
            };
        });

        eventosLecturaTit.addEventListener("click", () => {
            if(eventosLecturaBtn.style.display === "none"){
                eventosLecturaBtn.style.display = "block";
                eventosLecturaMes.style.display = "block";
                eventosLecturaQuincena.style.display = "block";
                eventosLecturaSemana.style.display = "block";
            }else{
                eventosLecturaBtn.style.display = "none";
                eventosLecturaMes.style.display = "none";
                eventosLecturaQuincena.style.display = "none";
                eventosLecturaSemana.style.display = "none";
            };
        });

    };
});
