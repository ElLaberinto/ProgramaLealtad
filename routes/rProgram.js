import autentificador from "../middlewares/autentificador.js";
import cProgram from "../controllers/cProgram.js";
import upload from "../middlewares/upload.js";
import { Router } from "express";

const rProgram = new Router();

rProgram.post("/programadepuntos", autentificador.autentificarUsuario, 
    autentificador.autentificarPassword, cProgram.login);
rProgram.get("/clientes", cProgram.loginCliente);
rProgram.get("/admins", cProgram.loginAdmin);
rProgram.get("/logout", cProgram.logout);
rProgram.post("/subirTicket", upload.single("img"), cProgram.subirTicket);

export default rProgram;
