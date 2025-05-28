import pool from "../databases/database.js";

const mRanks = {
    getAll: async () => {
        try{
            const result = await pool.query("SELECT * FROM dbc.RANKS");
            return result.rows;
        } catch(err) {
            throw { status:500 };
        }
    },
    getActives: async () => {
        try{
            const result = await pool.query(`SELECT * FROM dbc.RANKS
                                        WHERE ran_status`);
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
    delete: async (id) => {
        try{
            const result = await pool.query(`DELETE FROM dbc.RANKS 
                                        WHERE ran_id = $1`, [id]);
            return result.rowCount;
        } catch(err) {
            throw { status:500 };
        }
    }
};

export default mRanks;