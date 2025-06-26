import pool from "../databases/database.js";


const mInicio = {
    inicializar: async () => {
        try{
            await pool.query(`DROP TABLE IF EXISTS dbc.clients CASCADE`);
            await pool.query(`DROP TABLE IF EXISTS dbc.users CASCADE`);
            await pool.query(`CREATE TABLE IF NOT EXISTS dbc.users
(
    usr_id bigserial NOT NULL,
    usr_name text NOT NULL,
    usr_mail text,
    usr_password text NOT NULL,
    usr_role text NOT NULL,
    usr_status boolean DEFAULT true,
    CONSTRAINT users_usr_mail_key UNIQUE (usr_mail),
    CONSTRAINT users_usr_role_check CHECK (usr_role = ANY (ARRAY['Cliente'::text, 'Empleado'::text, 'Administrador'::text]))
)`);
            await pool.query(`CREATE TABLE IF NOT EXISTS dbc.clients
(
    clt_id integer NOT NULL,
    clt_phone character varying(10) NOT NULL,
    clt_birthday date,
    clt_points integer DEFAULT 0,
    clt_rank text NOT NULL,
    CONSTRAINT clients_clt_phone_key UNIQUE (clt_phone),
    CONSTRAINT clients_clt_id_fkey FOREIGN KEY (clt_id)
        REFERENCES dbc.users (usr_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT clients_clt_rank_fkey FOREIGN KEY (clt_rank)
        REFERENCES dbc.ranks (ran_name) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)`);
            await pool.query(`INSERT INTO dbc.users
(usr_name, usr_mail, usr_password, usr_role) VALUES
('Diego Mozo', 'hezekiah001002@gmail.com', '$2a$10$qZ7FtTwvNLZDuQ/oIuIxCe95e5OeUbCN4kdkB0JNsFjIihyRHYoTq', 'Administrador')`);
        } catch (err) {
            throw { satuts: 500 }
        }
    }
}


export default mInicio;