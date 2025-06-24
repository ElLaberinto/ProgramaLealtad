import pool from "../databases/database.js";


const mInicio = {
    inicializar: async () => {
        try{
            await pool.query(`CREATE SCHEMA IF NOT EXISTS dbc`);
            await pool.query(`CREATE TABLE IF NOT EXISTS dbc.menu
(
    mnu_id serial NOT NULL,
    mnu_category NOT NULL,
    mnu_name text NOT NULL,
    mnu_description,
    mnu_price numeric(6,2) NOT NULL,
    mnu_url text,
    mnu_status boolean DEFAULT true,
    CONSTRAINT menu_mnu_category_check CHECK (mnu_category = ANY (ARRAY['Café y bebidas'::text, 'Nuestras creaciones'::text, 'De la cocina'::text, 'Paquetes'::text, 'Para llevar'::text, 'Paquetes Para Llevar'::text]))
)`);
            await pool.query(`CREATE TABLE IF NOT EXISTS dbc.events
(
    evt_id serial NOT NULL,
    evt_name text NOT NULL,
    evt_instructor text NOT NULL,
    evt_duration integer NOT NULL,
    evt_dates text[] NOT NULL,
    evt_schedules text[] NOT NULL,
    evt_cost numeric(6,2) NOT NULL,
    evt_deposit numeric(6,2) NOT NULL,
    evt_status boolean DEFAULT true,
)`);
            await pool.query(`CREATE TABLE IF NOT EXISTS dbc.readings
(
    rdn_id serial NOT NULL,
    rdn_book text NOT NULL,
    rdn_author text NOT NULL,
    rdn_facilitator text NOT NULL,
    rdn_schedule text NOT NULL,
    rdn_type text NOT NULL,
    rdn_status boolean DEFAULT true,
    CONSTRAINT readings_rdn_type_check CHECK (rdn_type = ANY (ARRAY['Semanal'::text, 'Quincenal'::text, 'Mensual'::text]))
)`);
            await pool.query(`CREATE TABLE IF NOT EXISTS dbc.ranks
(
    ran_id serial NOT NULL,
    ran_name text NOT NULL,
    ran_cashback integer NOT NULL,
    ran_status boolean DEFAULT true,
    CONSTRAINT ranks_ran_name_key UNIQUE (ran_name)
)`);
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
            await pool.query(`CREATE TABLE IF NOT EXISTS dbc.promos
(
    pro_id serial NOT NULL,
    pro_name text NOT NULL,
    pro_points integer NOT NULL,
    pro_status boolean DEFAULT true,
    pro_expiration date
)`);
            await pool.query(`CREATE TABLE IF NOT EXISTS dbc.buys
(
    buy_id bigserial NOT NULL,
    buy_client integer NOT NULL,
    buy_total numeric(6,2) NOT NULL,
    buy_ticket integer NOT NULL,
    buy_date date NOT NULL,
    buy_points integer NOT NULL,
    buy_url
)`);
            await pool.query(`INSERT INTO dbc.users
(usr_name, usr_mail, usr_password, usr_role) VALUES
('Diego Mozo', 'hezekiah001002@gmail.com', '$2a$10$qZ7FtTwvNLZDuQ/oIuIxCe95e5OeUbCN4kdkB0JNsFjIihyRHYoTq', 'Administrador');`);
        } catch (err) {
            throw { satuts: 500 }
        }
    }
}


export default mInicio;