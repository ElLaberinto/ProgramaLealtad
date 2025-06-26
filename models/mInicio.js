import pool from "../databases/database.js";


const mInicio = {
    inicializar: async () => {
        try{
            const result = await pool.query(`SELECT * FROM dbc.USERS`);
            console.log(result.rows);
        } catch (err) {
            throw { satuts: 500 }
        }
    }
}


export default mInicio;