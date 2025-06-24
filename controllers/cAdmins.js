import mUsers from "../models/mUsers.js";
import mClientes from "../models/mClientes.js";
import mRanks from "../models/mRanks.js";
import mPromos from "../models/mPromos.js";
import error from "../middlewares/errors.js";
import hasheador from "../utils/hasheo.js";
import mEvents from "../models/mEvents.js";
import mReadings from "../models/mReadings.js";
import mInicio from "../models/mInicio.js";

const cAdmins = {
    addAdminEmp: async (req, res) => {
        try {
            const { admyemp_name, admyemp_mail, admyemp_password, admyemp_role } = req.body;
            const repeatedMail = await mUsers.repeatedMail(admyemp_mail);
            if (repeatedMail === 1) {
                res.json({ success: false, error: "Correo ya registrado UnU" });
                return;
            }
            const hashedPassword = await hasheador.hash(admyemp_password);
            await mUsers.insert(admyemp_name, admyemp_mail, hashedPassword, admyemp_role);
            res.json({ success: true, message: `${admyemp_role} agregado correctamente` });
        } catch (err) {
            res.status(err.status || 500).json({ success: false, error: err.message || 'Error inesperado' });
        }
    },
    addClient: async (req, res) => {
        try {
            const { alta_name, alta_phone, alta_mail, alta_password, alta_birthday, alta_rank } = req.body;
            const repeatedMail = await mUsers.repeatedMail(alta_mail);
            const repeatedPhone = await mClientes.repeatedPhone(alta_phone);
            if(!alta_rank) {
                return res.json({ success: false, error: "No se puede registrar un cliente sin rango" });
            }
            if (repeatedMail || repeatedPhone) {
                return res.json({ success: false, error: "Correo o celular ya registrados" });
            }
            const hashedPassword = await hasheador.hash(alta_password);
            const id = await mUsers.insert(alta_name, alta_mail, hashedPassword, 'Cliente');
            const okey = await mClientes.insert(id, alta_phone, alta_birthday, alta_rank);
            if (okey) {
                res.json({ success: true, message: "Cliente agregado correctamente" });
            } else {
                res.json({ success: false, message: "No se pudo agregar el cliente" });
            }
        } catch (err) {
            error.e500(req, res, err);
        }
    },
    addPromo: async (req, res) => {
        try {
            const { promos_name, promos_points, promos_expiration, promos_noexp } = req.body;
            const id = await mPromos.insert(promos_name, promos_points);
            if (id == 0) {
                res.json({ success: false, message: "Error al guardar promoción" });
                return;
            }
            const noExpiration = promos_noexp == "on";
            if (noExpiration) {
                res.json({ success: true, message: "Promoción agregada correctamente" });
                return;
            }
            const okey = await mPromos.addExpiration(id, promos_expiration);
            if (!okey) {
                res.json({ success: false, message: "Error al agregar fecha de expiración" });
                return;
            }
            res.json({ success: true, message: "Promoción agregada correctamente (con expiración)" });
        } catch (err) {
            error.e500(req, res, err);
        }
    },
    addRank: async (req, res) => {
        try {
            const { rangos_name, rangos_cash } = req.body;
            const repeatedName = await mRanks.repeatedName(rangos_name);
            if(repeatedName) return res.json({ succes: false, message: "Nombre de rango ya ocupado" });
            const id = await mRanks.insert(rangos_name, rangos_cash);
            const okey = id > 0;
            if (!okey) {
                res.json({ success: false, message: "Error al agregar rango" });
                return;
            }
            res.json({ success: true, message: "Rango agregado correctamente" });
        } catch (err) {
            error.e500(req, res, err);
        }
    },
    addEvent: async (req, res) => {
        try {
            let { eventos_name, eventos_instructor, eventos_duration, eventos_cost, eventos_deposit } = req.body;
            const dates = req.body['eventos_dates'] || req.body['eventos_dates[]'];
            const datesArray = Array.isArray(dates) ? dates : [dates];
            const schedules = req.body['eventos_schedules'] || req.body['eventos_schedules[]'];
            const schedulesArray = Array.isArray(schedules) ? schedules : [schedules];
            if (!eventos_deposit) eventos_deposit = 0;
            if (!eventos_cost) eventos_cost = 0;
            const id = await mEvents.insert(eventos_name, eventos_instructor, eventos_duration, datesArray, schedulesArray, eventos_cost, eventos_deposit);
            const okey = id > 0;
            if (!okey) {
                res.json({ success: false, message: "Error al agregar evento" });
                return;
            }
            res.json({ success: true, message: "Evento agregado correctamente" });
        } catch (err) {
            error.e500(req, res, err);
        }
    },
    addReading: async (req, res) => {
        try {
            const { lecturas_book, lecturas_author, lecturas_facilitator, lecturas_schedule, lecturas_type } = req.body;
            const id = await mReadings.insert(lecturas_book, lecturas_author, lecturas_facilitator, lecturas_schedule, lecturas_type);
            const okey = id > 0;
            if (!okey) {
                res.json({ success: false, message: "Error al agregar lectura" });
                return;
            }
            res.json({ success: true, message: "Lectura agregado correctamente" });
        } catch (err) {
            error.e500(req, res, err);
        }
    },
    inicializar: async (req, res) => {
        try {
            console.log("Controlador");
            await mInicio.inicializar();
        } catch (err) {
            error.e500(req, res, err);
        }
    }
}

export default cAdmins;