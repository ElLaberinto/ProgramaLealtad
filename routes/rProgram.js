import autentificador from "../middlewares/autentificador.js";
import cProgram from "../controllers/cProgram.js";
import { Router } from "express";

const rProgram = new Router();

rProgram.post("/programadepuntos", autentificador.autentificarUsuario, 
    autentificador.autentificarPassword, cProgram.login);
rProgram.get("/clientes", cProgram.loginCliente);
rProgram.get("/admins", cProgram.loginAdmin);

export default rProgram;
