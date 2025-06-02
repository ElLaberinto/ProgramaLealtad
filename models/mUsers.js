import pool from "../databases/database.js";

const mUsers = {
    getAll: async () => {
        try {
            const result = await pool.query("SELECT * FROM dbc.USERS");
            return result.rows;
        } catch (err) {
            throw { status: 500 };
        }
    },
    getOne: async (id) => {
        try {
            const result = await pool.query(`SELECT * FROM dbc.USERS
                                    WHERE usr_id = $1`, [id]);
            return result.rows[0];
        } catch (err) {
            throw { status: 500 };
        }
    },
    getByMail: async (mail) => {
        try {
            const result = await pool.query(`SELECT * FROM dbc.USERS
                                    WHERE usr_mail = $1`, [mail]);
            return result.rows[0];
        } catch (err) {
            throw { status: 500 };
        }
    },
    getActives: async () => {
        try {
            const result = await pool.query(`SELECT * FROM dbc.USERS
                                            WHERE usr_status`);
            return result.rows;
        } catch (err) {
            throw { status: 500 };
        }
    },
    getClients: async () => {
        try {
            const result = await pool.query(`SELECT * FROM dbc.USERS
                                            WHERE usr_role = 'Cliente'`);
            return result.rows;
        } catch (err) {
            throw { status: 500 };
        }
    },
    getActiveClients: async () => {
        try {
            const result = await pool.query(`SELECT * FROM dbc.USERS
                                            WHERE usr_role = 'Cliente' AND usr_status`);
            return result.rows;
        } catch (err) {
            throw { status: 500 };
        }
    },
    getEmployees: async () => {
        try {
            const result = await pool.query(`SELECT * FROM dbc.USERS
                                            WHERE usr_role = 'Empleado'`);
            return result.rows;
        } catch (err) {
            throw { status: 500 };
        }
    },
    getActiveEmployees: async () => {
        try {
            const result = await pool.query(`SELECT * FROM dbc.USERS
                                            WHERE usr_role = 'Empleado' AND usr_status`);
            return result.rows;
        } catch (err) {
            throw { status: 500 };
        }
    },
    getAdmins: async () => {
        try {
            const result = await pool.query(`SELECT * FROM dbc.USERS
                                            WHERE usr_role = 'Administrador'`);
            return result.rows;
        } catch (err) {
            throw { status: 500 };
        }
    },
    getActiveAdmins: async () => {
        try {
            const result = await pool.query(`SELECT * FROM dbc.USERS
                                            WHERE usr_role = 'Administrador' AND usr_status`);
            return result.rows;
        } catch (err) {
            throw { status: 500 };
        }
    },
    insert: async (name, mail, hashedPassword, role) => {
        try {
            const result = await pool.query(`INSERT INTO dbc.USERS
                                    (usr_name, usr_mail, usr_password, usr_role) VALUES
                                    ($1, $2, $3, $4) RETURNING usr_id`,
                [name, mail, hashedPassword, role]);
            return result.rows[0].usr_id;
        } catch (err) {
            throw { status: 500 };
        }
    },
    powerOff: async (id) => {
        try {
            const result = await pool.query(`SELECT * FROM dbc.USERS WHERE usr_id = $1`, [id]);
            const role = result.rows[0].usr_role;
            if (role === 'Administrador') {
                console.log("Inicio dle if");
                const activeAdmins = await pool.query(`SELECT * FROM dbc.USERS
                                                    WHERE usr_role = 'Administrador' AND usr_status`);
                const countAdmins = activeAdmins.rowCount;
                if (countAdmins > 1) {
                    const result = await pool.query(`UPDATE dbc.USERS
                                                SET usr_status = FALSE
                                                WHERE usr_id = $1`, [id]);
                    return result.rowCount;
                } else {
                    throw { status: 400, message: "No se puede eliminar el único administrador" };
                }
            } else {
                const result = await pool.query(`UPDATE dbc.USERS
                                            SET usr_status = FALSE
                                            WHERE usr_id = $1`, [id]);
                return result.rowCount;
            }
        } catch (err) {
            throw { status: 500 };
        }
    },
    powerOn: async (id) => {
        try {
            const result = await pool.query(`UPDATE dbc.USERS
                                SET usr_status = TRUE
                                WHERE usr_id = $1`, [id]);
            return result.rowCount;
        } catch (err) {
            throw { status: 500 };
        }
    },
    edit: async (id, newFields) => {
        try {
            const allowedFields = ['usr_name', 'usr_mail', 'usr_password'];
            const keys = Object.keys(newFields).filter(key => allowedFields.includes(key));
            if (keys.length === 0) throw { status: 400, message: "Campos inválidos para actualizar" };
            const setClause = keys.map((key, idx) => `${key} = $${idx + 2}`).join(', ');
            const values = keys.map(k => newFields[k]);
            const result = await pool.query(`UPDATE dbc.USERS SET ${setClause}
                                        WHERE usr_id = $1`, [id, ...values]);
            console.log("justo antes del return");
            return result.rowCount;
        } catch (err) {
            throw { status: 500 };
        }
    },
    repeatedMail: async (mail) => {
        try{
            const result = await pool.query(`SELECT * FROM dbc.USERS
                                    WHERE usr_mail = $1`, [mail.toLowerCase()]);
            return result.rowCount;
        } catch(err) {
            throw { status: 500 };
        }
    }
};

export default mUsers;