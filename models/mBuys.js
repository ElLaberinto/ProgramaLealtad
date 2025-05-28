import pool from "../databases/database.js";

const mBuys = {
    getAll: async () => {
        try {
            const result = await pool.query("SELECT * FROM dbc.BUYS");
            return result.rows;
        } catch(err) {
            throw { status: 500 };
        }
    },
    getOne: async (id) => {
        try {
            const result = await pool.query(`SELECT * FROM dbc.BUYS
                                        WHERE buy_id = $1`, [id]);
            return result.rows[0];
        } catch(err) {
            throw { status: 500 };
        }
    },
    getByClient: async (client) => {
        try {
            const result = await pool.query(`SELECT * FROM dbc.BUYS
                                        WHERE buy_client = $1`, [client]);
            return result.rows;
        } catch(err) {
            throw { status: 500 };
        }
    },
    insert: async (client, total, ticket, date, points, url) => {
        try {
            const result = await pool.query(`INSERT INTO dbc.BUYS
                                        (buy_client, buy_total, buy_ticket, buy_date, buy_points, buy_url) 
                                        VALUES ($1, $2, $3, $4, $5, $6)`, 
                                        [client, total, ticket, date, points, url]);
            return result.rowCount;
        } catch(err) {
            throw { status: 500 };
        }
    }
};

export default mBuys;