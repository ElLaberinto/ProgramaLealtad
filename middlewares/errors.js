const error = {
    //sin permiso para la ruta
    e403: (req, res, err) => {
        res.render("error", {
            title: "¡Error de acceso denegado!",
            emjs: "Lo siento, no tienes la autorización para acceder a esta ruta"
        });
    },
    //ruta no encontrada
    e404: (req, res, err) => {
        res.render("error", {
            title: "¡Error 404!",
            emsj: "La ruta que estas buscando no existe"
        })
    },
    //error interno
    e500: (req, res, err) => {
        console.error("💥 Error interno:", err);

        res.status(500).render("error", {
            title: "¡Error interno!",
            emjs: "Si llegaste aquí, algo salió mal. Por favor contacta a El Laberinto."
            });
    }
    
};

export default error;