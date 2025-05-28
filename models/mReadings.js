import pool from "../databases/database.js";

const mReadings = {
    getAll: async () => {
        try {
            const result = await pool.query("SELECT * FROM dbc.READINGS");
            return result.rows;
        } catch(err) {
            throw { status: 500 };
        }
    },
    getOne: async (id) => {
        try {
            const result = await pool.query(`SELECT * FROM dbc.READINGS
                                        WHERE rdn_id = $1`, [id]);
            return result.rows[0];
        } catch(err) {
            throw { status: 500 };
        }
    },
    getActives: async () => {
        try {
            const result = await pool.query(`SELECT * FROM dbc.READINGS
                                        WHERE rdn_status`);
            return result.rows;
        } catch(err) {
            throw { status: 500 };
        }
    },
    insert: async (book, author, facilitator, schedule, type) => {
        try {
            const result = await pool.query(`INSERT INTO dbc.READINGS
                (rdn_book, rdn_author, rdn_facilitator, rdn_schedule, rdn_type)
                VALUES ($1, $2, $3, $4, $5) RETURNING rdn_id`,
                [book, author, facilitator, schedule, type]);
            return result.rows[0].rdn_id;
        } catch(err) {
            throw { status: 500 };
        }
    },
    powerOff: async (id) => {
        try{
            const result = await pool.query(`UPDATE dbc.READINGS
                                        SET rdn_status = FALSE
                                        WHERE rdn_id = $1`, [id]);
            return result.rowCount;
        } catch(err) {
            throw { status: 500 };
        }
    },
    powerOn: async (id) => {
        try{
            const result = await pool.query(`UPDATE dbc.READINGS
                                        SET rdn_status = TRUE
                                        WHERE rdn_id = $1`, [id]);
            return result.rowCount;
        } catch(err) {
            throw { status: 500 };
        }
    },
    delete: async (id) => {
        try{
            const result = await pool.query(`DELETE FROM dbc.READINGS
                                        WHERE rdn_id = $1`, [id]);
            return result.rowCount;
        } catch(err) {
            throw { status: 500 }
        }
    }
};

export default mReadings;