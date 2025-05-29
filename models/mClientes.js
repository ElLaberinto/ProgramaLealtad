import pool from "../databases/database.js";

const mClientes = {
    getAll: async () => {
        try {
            const result = await pool.query("SELECT * FROM dbc.CLIENTS");
            return result.rows;
        } catch(err) {
            throw { status:500 };
        }
    },
    getOne: async (id) => {
        try {
            const result = await pool.query(`SELECT * FROM dbc.CLIENTS
                                    WHERE clt_id = $1`, [id]);
            return result.rows[0];
        } catch(err) {
            throw { status:500 };
        }
    },
    insert: async (id, phone, birthday, rank) => {
        try {
            const result = await pool.query(`INSERT INTO dbc.CLIENTS
                                (clt_id, clt_phone, clt_birthday, clt_rank) VALUES
                                ($1, $2, $3, $4)`, [id, phone, birthday, rank]);
            return result.rowCount > 0;
        } catch(err) {
            throw { status:500 };
        }
    },
    edit: async (id, newFields) => {
        try{
            console.log("Id: ", id);
            const allowedFields = ['clt_phone', 'clt_birthday'];
            console.log("newFields: ", newFields);
            const keys = Object.keys(newFields).filter(key => allowedFields.includes(key));
            console.log("Keys: ", keys);
            if (keys.length === 0) throw { status: 400, message: "Campos inválidos para actualizar" };
            const setClause = keys.map((key, idx) => `${key} = $${idx + 2}`).join(', ');
            console.log("Clausula: ", setClause);
            const values = keys.map(k => newFields[k]);
            console.log("Values: ", values);
            const result = await pool.query(`UPDATE dbc.CLIENTS SET ${setClause}
                                        WHERE clt_id = $1`, [id, ...values]);
            console.log("antes del return");
            return result.rowCount;
        } catch(err) {
            throw { status:500 };
        }
    },
    editRank: async (id, newRank) => {
        try{
            await pool.query(`UPDATE dbc.CLIENTS
                        SET clt_rank = $2
                        WHERE clt_id = $1`, [id, newRank]);
        } catch(err) {
            throw { status:500 };
        }
    },
    editPoints: async (id, points) => {
        try{
            await pool.query(`UPDATE dbc.CLIENTS
                        SET clt_points = clt_points + $2
                        WHERE clt_id = $1`, [id, points]);
        } catch(err) {
            throw { status:500 };
        }
    },
    repeatedPhone: async (phone) => {
        try{
            const result = await pool.query(`SELECT * FROM dbc.CLIENTS
                                        WHERE clt_phone = $1`, [phone]);
            return result.rowCount;
        } catch(err) {
            throw { status:500 };
        }
    }
};

export default mClientes;