import mEvents from "../models/mEvents.js";
import mReadings from "../models/mReadings.js";
import mMenu from "../models/mMenu.js";

import error from "../middlewares/errors.js";

const cPrimary = {
    home: (req, res) => {
        res.render("home");
    },
    program: (req, res) => {
        if(req.session.usuario) {
            if(req.session.usuario.usr_role == "Cliente") {
                return res.redirect("/clientes");
            } else {
                return res.redirect("/admins");
            }
        }
        res.render("program");
    },
    events: async (req, res) => {
        try {
            const eventsList = await mEvents.getAll();
            const readingsList = await mReadings.getActives();
            res.render("events", { eventsList, readingsList });
        } catch (err) {
            error.e500(req, res, err);
        }
    },
    menu: async (req, res) => {
        const categoriesList = [
            "Café y bebidas",
            "Nuestras creaciones",
            "De la cocina",
            "Paquetes",
            "Para llevar",
            "Paquetes Para Llevar"
        ];
        try {
            const menu = await mMenu.getActives();
            res.render("menu", { menu, categoriesList });
        } catch (err) {
            error.e500(req, res, err);
        }
    }
};

export default cPrimary;