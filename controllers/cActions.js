import mUsers from "../models/mUsers.js";
import mPromos from "../models/mPromos.js";
import mRanks from "../models/mRanks.js";
import mEvents from "../models/mEvents.js";
import mReadings from "../models/mReadings.js";
import mClientes from "../models/mClientes.js";

import hasheador from "../utils/hasheo.js"

const modelos = {
    promos: { modelo: mPromos, campo: 'pro_status' },
    rangos: { modelo: mRanks, campo: 'ran_status' },
    eventos: { modelo: mEvents, campo: 'evt_status' },
    lecturas: { modelo: mReadings, campo: 'rdn_status' },
    clientes: { modelo: mUsers, campo: 'usr_status' },
    admyemp: { modelo: mUsers, campo: 'usr_status' }
};

const cActions = {
    apagador: async (req, res) => {
        const { id, section } = req.body;
        try {
            const mod = modelos[section];
            if (!mod) return res.sendStatus(400);
            const data = await mod.modelo.getOne(id);
            const status = data[mod.campo];
            if (status) {
                let problem = false;
                if (section == "admyemp") {
                    const admins = await mUsers.getActiveAdmins();
                    problem = admins.length == 1;
                    if (problem) return res.json({ success: false, message: "No se puede apagar al único administrador" });
                }
                if (section == "rangos") {
                    const rank = await mRanks.getOne(id);
                    problem = await mClientes.usedRank(rank.ran_name);
                    if (problem) return res.json({ success: false, message: "Existe al menos un cliente usando el rango y no se puede apagar" });
                }
                await mod.modelo.powerOff(id);
                res.json({ success: true, status: false });
            } else {
                await mod.modelo.powerOn(id);
                res.json({ success: true, status: true });
            }
        } catch (err) {
            res.json({ success: false, message: `Error en el apagador` });
        }
    },
    eliminador: async (req, res) => {
        const { id, section } = req.body;
        try {
            const mod = modelos[section];
            if (!mod) return res.json({ success: false, message: "Error en el eliminador" });
            if (section == "rangos") {
                const rank = await mRanks.getOne(id);
                const problem = await mClientes.usedRank(rank.ran_name);
                if (problem) return res.json({ success: false, message: "Existe al menos un cliente usando el rango y no se puede eliminar" });
            }
            await mod.modelo.delete(id);
            res.json({ success: true });
        } catch (err) {
            res.json({ success: false, message: "Error en el eliminador" });
        }
    },
    obtenInfo: async (req, res) => {
        const { id, sec } = req.query;
        try {
            switch (sec) {
                case "promos":
                    const promo = await mPromos.getOne(id);
                    if (!promo) return res.json({ success: false, error: "Promoción no encontrada" });
                    return res.json({ success: true, promo });
                case "rangos":
                    const rank = await mRanks.getOne(id);
                    if (!rank) return res.json({ success: false, error: "Rango no encontrado" });
                    return res.json({ success: true, rank });
                case "eventos":
                    const event = await mEvents.getOne(id);
                    if (!event) return res.json({ success: false, error: "Evento no encontrado" });
                    return res.json({ success: true, event });
                case "lecturas":
                    const reading = await mReadings.getOne(id);
                    if (!reading) return res.json({ success: false, error: "Lectura no encontrada" });
                    return res.json({ success: true, reading });
                case "clientes":
                    const client = await mClientes.getOne(id);
                    if (!client) return res.json({ success: false, error: "Cliente no encontrado" });
                    const user = await mUsers.getOne(id);
                    if (!user) return res.json({ success: false, error: "Usuario no encontrado" });
                    return res.json({ success: true, user, client });
                case "admyemp":
                    const usera = await mUsers.getOne(id);
                    if (!usera) return res.json({ success: false, error: "Usuario no encontrado" });
                    return res.json({ success: true, usera });
                default:
                    return res.json({ success: false, error: "Error interno" });
            }
        } catch (err) {
            res.json({ success: false, error: "Error interno al obtener información" });
        }

    },
    editor: async (req, res) => {
        const { id, section } = req.query;
        const arrayInputs = req.body;
        try {
            const cambios = []
            const campos = {}
            arrayInputs.forEach(input => {
                if (input.value != input.original && !input.name.startsWith("add")) cambios.push(input);
            });
            let menos = 0;
            switch (section) {
                case "promos":
                    for (const input of cambios) {
                        if (input.dbName) campos[input.dbName] = input.value;
                        if (input.name == "promos_expiration") {
                            if (input.value == "") {
                                menos += 1;
                                input.value = null;
                            }
                            menos += 1;
                            await mPromos.addExpiration(id, input.value);
                        }
                    };
                    if (cambios.length - menos > 0) await mPromos.edit(id, campos);
                    return res.json({ success: true });
                case "rangos":
                    cambios.forEach(async input => {
                        campos[input.dbName] = input.value;
                    });
                    if (cambios.length > 0) await mRanks.edit(id, campos);
                    return res.json({ success: true });
                case "eventos":
                    cambios.forEach(async input => {
                        console.log("Input: ", input);
                        if (input.dbName) campos[input.dbName] = input.value;
                        if(input.name == "eventos_cost" && input.value == "") menos+=2;
                        if(input.name == "eventos_deposit" && input.value == "") menos+=1;
                    });
                    if (cambios.length - menos > 0) await mEvents.edit(id, campos);
                    return res.json({ success: true });
                case "lecturas":
                    cambios.forEach(async input => {
                        campos[input.dbName] = input.value;
                    });
                    if (cambios.length > 0) await mReadings.edit(id, campos);
                    return res.json({ success: true });
                case "clientes":
                    const campos2 = {}
                    let cambios1 = 0, cambios2 = 0
                    for (const input of cambios) {
                        if (input.name == "clientes_rank") {
                            await mClientes.editRank(id, input.value);
                        }
                        if (input.name == "clientes_password") {
                            const hashedPassword = await hasheador.hash(input.value);
                            input.value = hashedPassword;
                        }
                        if (input.dbName) {
                            if (input.dbName.startsWith("clt")) {
                                campos[input.dbName] = input.value;
                                cambios1 += 1;
                            } else if (input.dbName.startsWith("usr")) {
                                campos2[input.dbName] = input.value;
                                cambios2 += 1;
                            }
                        }
                    };
                    if (cambios1 > 0) await mClientes.edit(id, campos);
                    if (cambios2 > 0) await mUsers.edit(id, campos2);
                    return res.json({ success: true });
                case "admyemp":
                    for (const input of cambios) {
                        if (input.name == "admyemp_password") {
                            const hashedPassword = await hasheador.hash(input.value);
                            input.value = hashedPassword;
                        }
                        campos[input.dbName] = input.value;
                    }
                    if (cambios.length > 0) await mUsers.edit(id, campos);
                    return res.json({ success: true });
            }
        } catch (err) {
            res.json({ success: false, message: "Error en el editor" });
        }
    }
};

export default cActions;