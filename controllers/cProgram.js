import mUsers from "../models/mUsers.js";
import mClientes from "../models/mClientes.js";
import mRanks from "../models/mRanks.js";
import mPromos from "../models/mPromos.js";
import mBuys from "../models/mBuys.js";
import mEvents from "../models/mEvents.js";
import mReadings from "../models/mReadings.js";

import error from "../middlewares/errors.js"


const cProgram = {
    login: async (req, res) => {
        const usuario = req.data;
        req.session.usuario = usuario;
        try {
            if(usuario.usr_role === "Cliente") {
                return res.json({ success: true, rol: "Cliente" });
            } else {
                return res.json({ success: true, rol: "Admin" });
            }
        } catch(err) {
            return res.status(500).json({ error: "Error del servidor" });
        }
    },
    loginCliente: async (req, res) => {
        try{
            const usuario = req.session.usuario;
            const cliente = await mClientes.getOne(usuario.usr_id);
            const listaPromos = await mPromos.getActives();
            const buysList = await mBuys.getByClient(usuario.usr_id);
        res.render("client", { usuario, cliente, listaPromos, buysList });
        } catch(err) {
            error.e500(req, res, err);
        } 
    },
    loginAdmin: async (req, res) => {
        try{
            const usuario = req.session.usuario;
            const listaUsuarios = await mUsers.getAll();
            const listaClientes = await mClientes.getAll();
            const listaPromos = await mPromos.getAll();
            const ranksList = await mRanks.getAll();
            const eventsList = await mEvents.getAll();
            const readingsList = await mReadings.getAll();
        res.render("admin", { usuario, listaPromos, listaUsuarios, listaClientes, ranksList, eventsList, readingsList});
        } catch(err) {
            error.e500(req, res, err);
        } 
    },
    autocompletarClientes: async (req, res) => {
        const { q } = req.query;
        try{
            const listaUsuarios = await mUsers.getActiveClients();

        const resultados = [];

        for (const usuario of listaUsuarios) {
            const cliente = await mClientes.getOne(usuario.usr_id);
            const match =
                usuario.usr_name.toLowerCase().includes(q.toLowerCase()) ||
                usuario.usr_mail.toLowerCase().includes(q.toLowerCase()) ||
                cliente.clt_phone.includes(q);

            if (match) {
                const rango = await mRanks.getOneName(cliente.clt_rank);
                let cashback = null;
                if(rango.ran_status)
                    cashback = rango.ran_cashback;
                else cashback = -100;
                const objeto = {
                    id: usuario.usr_id,
                    name: usuario.usr_name,
                    mail: usuario.usr_mail,
                    phone: cliente.clt_phone,
                    birthday: cliente.clt_birthday,
                    points: cliente.clt_points,
                    rank: cliente.clt_rank,
                    cashback: cashback
                };
                resultados.push(objeto);
            }
        }
            res.json(resultados);
        }catch(err){
            error.e500(req, res, err);
        }
    },
    autocompletarPromos: async (req, res) => {
        const { q, p } = req.query;
        const points = Number(p);
        try{
            const listaPromos = await mPromos.getActives();
        const resultados = [];
        for (const promo of listaPromos) {
            const match =
                promo.pro_name.toLowerCase().includes(q.toLowerCase()) && promo.pro_points <= points
            if (match) {
                const objeto = {
                    id: promo.pro_id,
                    name: promo.pro_name,
                    points: promo.pro_points
                };
                resultados.push(objeto);
            }
        }
            res.json(resultados);
        }catch(err){
            error.e500(req, res, err);
        }
    }
};

export default cProgram;