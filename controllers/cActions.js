import mUsers from "../models/mUsers.js";
import mPromos from "../models/mPromos.js";
import mRanks from "../models/mRanks.js";
import mEvents from "../models/mEvents.js";
import mReadings from "../models/mReadings.js";

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
                await mod.modelo.powerOff(id);
                res.json({ success: true, status: false });
            } else {
                await mod.modelo.powerOn(id);
                res.json({ success: true, status: true });
            }
        } catch (err) {
            if(res.status === 400) res.json({ success: false });
            res.json({ success: false, message:"Error en el apagador" });
        }
    },
    eliminador: async (req, res) => {
        const { id, section } = req.body;
        try {
            const mod = modelos[section];
            if (!mod) return res.sendStatus(400);
            await mod.modelo.delete(id);
            res.sendStatus(200);
        } catch (err) {
            res.sendStatus(500);
        }
    }
};

export default cActions;