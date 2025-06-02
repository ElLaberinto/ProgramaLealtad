import cProgram from "../controllers/cProgram.js";
import cAdmins from "../controllers/cAdmins.js";
import cActions from "../controllers/cActions.js";
import { Router } from "express";

const rApis = new Router();

rApis.get("/autocompletarClientes", cProgram.autocompletarClientes);
rApis.get("/autocompletarPromos", cProgram.autocompletarPromos);
rApis.post("/altaAdmnEmp", cAdmins.addAdminEmp);
rApis.post("/altaCliente", cAdmins.addClient);
rApis.post("/newPromo", cAdmins.addPromo);
rApis.post("/newRank", cAdmins.addRank);
rApis.post("/newEvent", cAdmins.addEvent);
rApis.post("/newReading", cAdmins.addReading);
rApis.patch("/apagador", cActions.apagador);
rApis.delete("/eliminador", cActions.eliminador);
rApis.patch("/editor", cActions.editor);
rApis.get("/comparePassword", cProgram.comparePassword);
rApis.patch("/editarCliente", cProgram.editarCliente);
rApis.get("/obtenInfo", cActions.obtenInfo);

export default rApis;