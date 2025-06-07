import pool from "./../databases/database.js"

const mMenu = {
    getAll: async () => {
        try{
            const result = await pool.query(`SELECT * FROM dbc.MENU 
                                        ORDER BY mnu_id`);
            return result.rows;
        } catch(err) {
            throw { status: 500 }
        }
    },
    getActives: async () => {
        try{
            const result = await pool.query(`SELECT * FROM dbc.MENU
                                        WHERE mnu_status
                                        ORDER BY mnu_id`);
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
    addUrl: async (id, url) => {
        try{
            await pool.query(`UPDATE dbc.MENU
                        SET mnu_url = $2
                        WHERE mnu_id = $1`, [id, url]);
        } catch(err) {
            throw { status: 500 }
        }
    }
}

export default mMenu;