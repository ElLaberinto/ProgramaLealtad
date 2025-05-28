import pool from "./../databases/database.js"

const mMenu = {
    getAll: async () => {
        try{
            const result = await pool.query("SELECT * FROM dbc.MENU");
            return result.rows;
        } catch(err) {
            throw { status: 500 }
        }
    },
    getActives: async () => {
        try{
            const result = await pool.query(`SELECT * FROM dbc.MENU
                                        WHERE mnu_status`);
            return result.rows;
        } catch(err) {
            throw { status: 500 }
        }
    },
    getOne: async (id) => {
        try{
            const result = await pool.query(`SELECT * FROM dbc.MENU
                                        WHERE mnu_id = $1`, [id]);
            return result.rows[0];
        } catch(err) {
            throw { status: 500 }
        }
    },
}

export default mMenu;