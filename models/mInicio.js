import pool from "../databases/database.js";


const mInicio = {
    inicializar: async () => {
        try{
            const result = await pool.query(`SELECT length(usr_password), usr_password
FROM dbc.users
WHERE usr_mail = 'hezekiah001002@gmail.com';`);
            console.log(result.rows);
            await pool.query(`UPDATE dbc.users
SET usr_password = '$2a$10$qZ7FtTwvNLZDuQ/oIuIxCe95e5OeUbCN4kdkB0JNsFjIihyRHYoTq'
WHERE usr_mail = 'hezekiah001002@gmail.com'`)
        } catch (err) {
            throw { satuts: 500 }
        }
    }
}


export default mInicio;