import pool from "../databases/database.js";

const mEvents = {
    getAll: async () => {
        try {
            const result = await pool.query("SELECT * FROM dbc.EVENTS");
            return result.rows;
        } catch(err) {
            throw { status: 500 };
        }
    },
    getOne: async (id) => {
        try {
            const result = await pool.query(`SELECT * FROM dbc.EVENTS
                                        WHERE evt_id = $1`, [id]);
            return result.rows[0];
        } catch(err) {
            throw { status: 500 };
        }
    },
    getActives: async () => {
        try {
            const result = await pool.query(`SELECT * FROM dbc.EVENTS
                                        WHERE evt_status`);
            return result.rows;
        } catch(err) {
            throw { status: 500 };
        }
    },
    insert: async (name, instructor, duration, dates, schedules, cost, deposit) => {
        try {
            const result = await pool.query(`INSERT INTO dbc.EVENTS
                (evt_name, evt_instructor, evt_duration, evt_dates, evt_schedules, evt_cost, evt_deposit)
                VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING evt_id`,
                [name, instructor, duration, dates, schedules, cost, deposit]);
            return result.rows[0].evt_id;
        } catch(err) {
            throw { status: 500 };
        }
    },
    powerOff: async (id) => {
        try{
            const result = await pool.query(`UPDATE dbc.EVENTS 
                                        SET evt_status = FALSE
                                        WHERE evt_id = $1`, [id]);
            return result.rowCount;
        } catch(err) {
            throw { status: 500 };
        }
    },
    powerOn: async (id) => {
        try{
            const result = await pool.query(`UPDATE dbc.EVENTS 
                                        SET evt_status = TRUE
                                        WHERE evt_id = $1`, [id]);
            return result.rowCount;
        } catch(err) {
            throw { status: 500 };
        }
    },
    delete: async (id) => {
        try{
            const result = await pool.query(`DELETE FROM dbc.EVENTS 
                                        WHERE evt_id = $1`, [id]);
            return result.rowCount;
        } catch(err) {
            throw { status: 500 }
        }
    }
};

export default mEvents;