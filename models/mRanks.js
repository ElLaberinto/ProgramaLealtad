import pool from "../databases/database.js";

const mRanks = {
    getAll: async () => {
        try{
            const result = await pool.query(`SELECT * FROM dbc.RANKS
                                        ORDER BY ran_id`);
            return result.rows;
        } catch(err) {
            throw { status:500 };
        }
    },
    getActives: async () => {
        try{
            const result = await pool.query(`SELECT * FROM dbc.RANKS
                                        WHERE ran_status
                                        ORDER BY ran_id`);
            return result.rows;
        } catch(err) {
            throw { status:500 };
        }
    },
    getOne: async (id) => {
        try{
            const result = await pool.query(`SELECT * FROM dbc.RANKS
                                        WHERE ran_id = $1`, [id]);
            return result.rows[0];
        } catch(err) {
            throw { status:500 };
        }
    },
    getOneName: async (name) => {
        try{
            const result = await pool.query(`SELECT * FROM dbc.RANKS
                                        WHERE ran_name = $1`, [name]);
            return result.rows[0];
        } catch(err) {
            throw { status:500 };
        }
    },
    insert: async (name, cashback) => {
        try{
            const result = await pool.query(`INSERT INTO dbc.RANKS 
                                        (ran_name, ran_cashback) VALUES
                                        ($1, $2) RETURNING ran_id`, [name, cashback]);
            return result.rows[0].ran_id;
        } catch(err) {
            throw { status:500 };
        }
    },
    powerOff: async (id) => {
        try{
            const result = await pool.query(`UPDATE dbc.RANKS 
                                        SET ran_status = FALSE
                                        WHERE ran_id = $1`, [id]);
            return result.rowCount;
        } catch(err) {
            throw { status:500 };
        }
    },
    powerOn: async (id) => {
        try{
            const result = await pool.query(`UPDATE dbc.RANKS 
                                        SET ran_status = TRUE
                                        WHERE ran_id = $1`, [id]);
            return result.rowCount;
        } catch(err) {
            throw { status:500 };
        }
    },
    edit: async (id, newFields) => {
        try{
            const allowedFields = ['ran_name', 'ran_cashback'];
            const keys = Object.keys(newFields).filter(key => allowedFields.includes(key));
            if (keys.length === 0) throw { status: 400, message: "Campos inválidos para actualizar" };
            const setClause = keys.map((key, idx) => `${key} = $${idx + 2}`).join(', ');
            const values = keys.map(k => newFields[k]);
            const result = await pool.query(`UPDATE dbc.RANKS SET ${setClause}
                                        WHERE ran_id = $1`, [id, ...values]);
            return result.rowCount;
        } catch(err) {
            throw { status:500 };
        }
    },
    delete: async (id) => {
        try{
            const result = await pool.query(`DELETE FROM dbc.RANKS 
                                        WHERE ran_id = $1`, [id]);
            return result.rowCount;
        } catch(err) {
            throw { status:500 };
        }
    },
    repeatedName: async (name) => {
        try{
            const result = await pool.query(`SELECT * FROM dbc.RANKS
                                        WHERE ran_name = $1`, [name]);
            return result.rowCount;
        } catch(err) {
            throw { status:500 };
        }
    }
};

export default mRanks;