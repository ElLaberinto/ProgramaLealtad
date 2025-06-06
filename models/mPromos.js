import pool from "../databases/database.js";

const mPromos = {
    getAll: async () => {
        try{
            const result = await pool.query(`SELECT * FROM dbc.PROMOS
                                        ORDER BY pro_id`);
            return result.rows;
        } catch(err) {
            throw { status:500 };
        }
    },
    getActives: async () => {
        try{
            const result = await pool.query(`SELECT * FROM dbc.PROMOS
                                        WHERE pro_status
                                        ORDER BY pro_id`);
            return result.rows;
        } catch(err) {
            throw { status:500 };
        }
    },
    getOne: async (id) => {
        try{
            const result = await pool.query(`SELECT * FROM dbc.PROMOS
                                        WHERE pro_id = $1`, [id]);
            return result.rows[0];
        } catch(err) {
            throw { status:500 };
        }
    },
    insert: async (name, points) => {
        try{
            const result = await pool.query(`INSERT INTO dbc.PROMOS
                                        (pro_name, pro_points) VALUES
                                        ($1, $2) RETURNING pro_id`, [name, points]);
            return result.rows[0].pro_id;
        } catch(err) {
            return 0;
        }
    },
    addExpiration: async (id, expiration) => {
        try{
            const result = await pool.query(`UPDATE dbc.PROMOS
                                        SET pro_expiration = $2
                                        WHERE pro_id = $1`, [id, expiration]);
            return result.rowCount;
        } catch(err) {
            return 0;
        }
    },
    powerOff: async (id) => {
        try{
            const result = await pool.query(`UPDATE dbc.PROMOS
                                        SET pro_status = FALSE
                                        WHERE pro_id = $1`, [id]);
            return result.rowCount;
        } catch(err) {
            throw { status:500 };
        }
    },
    powerOn: async (id) => {
        try{
            const result = await pool.query(`UPDATE dbc.PROMOS 
                                        SET pro_status = TRUE
                                        WHERE pro_id = $1`, [id]);
            return result.rowCount;
        } catch(err) {
            throw { status:500 };
        }
    },
    edit: async (id, newFields) => {
        try{
            const allowedFields = ['pro_name', 'pro_points'];
            const keys = Object.keys(newFields).filter(key => allowedFields.includes(key));
            if (keys.length === 0) throw { status: 400, message: "Campos inválidos para actualizar" };
            const setClause = keys.map((key, idx) => `${key} = $${idx + 2}`).join(', ');
            const values = keys.map(k => newFields[k]);
            const result = await pool.query(`UPDATE dbc.PROMOS SET ${setClause}
                                        WHERE pro_id = $1`, [id, ...values]);
            return result.rowCount;
        } catch(err) {
            throw { status:500 };
        }
    },
    delete: async (id) => {
        try{
            const result = await pool.query(`DELETE FROM dbc.PROMOS 
                                        WHERE pro_id = $1`, [id]);
            return result.rowCount;
        } catch(err) {
            throw { status:500 };
        }
    }
};

export default mPromos;