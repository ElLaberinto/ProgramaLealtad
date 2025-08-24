import mUsers from "../models/mUsers.js";
import mClientes from "../models/mClientes.js";
import mRanks from "../models/mRanks.js";
import mPromos from "../models/mPromos.js";
import mBuys from "../models/mBuys.js";
import mEvents from "../models/mEvents.js";
import mReadings from "../models/mReadings.js";

import hasheador from "../utils/hasheo.js"
import cloudinary from "../databases/cloudinary.js";

import error from "../middlewares/errors.js"
import mMenu from "../models/mMenu.js";


const cProgram = {
    login: async (req, res) => {
        const usuario = req.data;
        req.session.usuario = usuario;
        try {
            if (usuario.usr_role === "Cliente") {
                return res.json({ success: true, rol: "Cliente" });
            } else {
                return res.json({ success: true, rol: "Administrador" });
            }
        } catch (err) {
            return res.status(500).json({ error: "Error del servidor" });
        }
    },
    loginCliente: async (req, res) => {
        try {
            const usuario = req.session.usuario;
            if(usuario == undefined) {
                return res.redirect("/programadepuntos");
            }
            const cliente = await mClientes.getOne(usuario.usr_id);
            const listaPromos = await mPromos.getActives();
            const buysList = await mBuys.getByClient(usuario.usr_id);
            res.render("client", { usuario, cliente, listaPromos, buysList });
        } catch (err) {
            error.e500(req, res, err);
        }
    },
    loginAdmin: async (req, res) => {
        try {
            const usuario = req.session.usuario;
            if(usuario == undefined) {
                    error.e403(req, res);
                    return;
            }
            const listaUsuarios = await mUsers.getAll();
            const listaClientes = await mClientes.getAll();
            const listaPromos = await mPromos.getAll();
            const ranksList = await mRanks.getAll();
            const eventsList = await mEvents.getAll();
            const readingsList = await mReadings.getAll();
            res.render("admin", { usuario, listaPromos, listaUsuarios, listaClientes, ranksList, eventsList, readingsList });
        } catch (err) {
            error.e500(req, res, err);
        }
    },
    logout: async (req, res) => {
        req.session.destroy(err => {
            if (err) {
                console.error('Error al cerrar sesión:', err);
                return res.status(500).send('Error al cerrar sesión');
            }
            res.clearCookie('connect.sid');
            res.redirect('/programadepuntos');
        });
    },
    autocompletarClientes: async (req, res) => {
        const { q } = req.query;
        try {
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
                    if (rango.ran_status)
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
        } catch (err) {
            error.e500(req, res, err);
        }
    },
    autocompletarPromos: async (req, res) => {
        const { q, p } = req.query;
        const points = Number(p);
        try {
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
        } catch (err) {
            error.e500(req, res, err);
        }
    },
    autocompletarProductos: async (req, res) => {
        const { q } = req.query;
        try {
            const listaProductos = await mMenu.getAll();
            const resultados = [];
            for (const producto of listaProductos) {
                const match = producto.mnu_name.toLowerCase().includes(q.toLowerCase());
                if (match) {
                    const objeto = {
                        id: producto.mnu_id,
                        name: producto.mnu_name,
                        price: producto.mnu_price,
                        url: producto.mnu_url
                    };
                    resultados.push(objeto);
                }
            }
            res.json(resultados);
        } catch (err) {
            error.e500(req, res, err);
        }
    },
    comparePassword: async (req, res) => {
        const { p, h } = req.query;
        try {
            const okey = await hasheador.compare(p, h);
            if (okey) res.json({ success: true });
            else res.json({ success: false, error: "Contraseña incorrecta, si persiste el problema acude a El Laberinto para que te ayuden" });
        } catch (err) {
            res.json({ success: false, error: err });
        }
    },
    editarCliente: async (req, res) => {
        const { cambiosUser, cambiosClient, originalMail } = req.body;
        let problem = false;
        const cambiaUser = Object.keys(cambiosUser).length > 0
        const cambiaClient = Object.keys(cambiosClient).length > 0
        try {
            if (cambiosUser.usr_mail) {
                problem = await mUsers.repeatedMail(cambiosUser.usr_mail);
            }
            if (problem) {
                res.json({ success: false, error: "Correo en uso" });
                return;
            }
            if (cambiosClient.clt_phone) {
                problem = await mClientes.repeatedPhone(cambiosClient.clt_phone);
            }
            if (problem) {
                req.json({ success: false, error: "Celular ya registrado" });
                return;
            }
            const user = await mUsers.getByMail(originalMail);
            if (cambiaClient) {
                await mClientes.edit(user.usr_id, cambiosClient);
            }
            if (cambiaUser) {
                if (cambiosUser.usr_password) {
                    const hashedPassword = await hasheador.hash(cambiosUser.usr_password);
                    cambiosUser.usr_password = hashedPassword
                }
                await mUsers.edit(user.usr_id, cambiosUser);
            }
            res.json({ success: true });
        } catch (err) {
            res.json({ success: false, error: err });
        }
    },
    subirTicket: async (req, res) => {
        try {
            const file = req.file;
            const { hide, total, ticket, points } = req.body;
            if (ticket.length === 5) {
                let aux = ticket;
                ticket = "0" + aux;
            }
            if (mBuys.repeatedTicket(ticket)) res.status(409).json({ message: "Ticket ya registrado"});
            console.log(`Datos: ${hide}, ${total}, ${ticket}, ${points}`);
            console.log("File: ", file);
            const date = new Date().toISOString().split('T')[0];
            const streamUpload = () =>
                new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        { folder: 'Tickets' },
                        (error, result) => {
                            if (error) reject(error);
                            else resolve(result);
                        }
                    );
                    stream.end(file.buffer);
                });
            const resultado = await streamUpload();
            const url = resultado.secure_url;
            console.log("Url: ", url);
            await mBuys.insert(hide[1], total, ticket, date, points, url);
            console.log("Insertado ✅");
            await mClientes.editPoints(hide[1], points);
            console.log("Puntos actualizados 👌");
            res.status(200).json({ mensaje: 'Ticket subido correctamente' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Error al subir imagen' });
        }
    },
    subirFotoMenu: async (req, res) => {
        try {
            const file = req.file;
            const { id } = req.body;
            const streamUpload = () =>
                new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        { folder: 'Menu' },
                        (error, result) => {
                            if (error) reject(error);
                            else resolve(result);
                        }
                    );
                    stream.end(file.buffer);
                });
            const resultado = await streamUpload();
            const url = resultado.secure_url;
            await mMenu.addUrl(id, url);
            res.status(200).json({ mensaje: 'Foto subida correctamente' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Error al subir imagen' });
        }
    }
};

export default cProgram;