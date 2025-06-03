import mClientes from "../models/mClientes.js";
import mUsers from "../models/mUsers.js";
import hasheador from "../utils/hasheo.js";

const autentificador = {
    autentificarUsuario: async (req, res, next) => {
        try{
            const user = req.body.USER;
            if(!user)  return res.status(401).json({ message: "Usuario no proporcionado" });
            const listaUsuarios = await mUsers.getActives();
            let data = listaUsuarios.find( usuario => usuario.usr_mail == user );
            if(!data){
                const listaClientes = await mClientes.getAll();
                const cliente = listaClientes.find( cliente => cliente.clt_phone == user );
                if(!cliente){
                    return res.status(401).json({ error: "Usuario o contraseña incorrectos, si persiste el problema acude a El Laberinto para que te ayuden" });
                }
                data = await mUsers.getOne(cliente.clt_id);
            }
            req.data = data;
            next();
        } catch(err){
            next(err);
        }
    },
    autentificarPassword: async (req, res, next) => {
        try{
            const password = req.body.PASS;
            if(!password) return res.status(401).json({ message: "Contraseña no proporcionada" });
            const valid = await hasheador.compare(password, req.data.usr_password);
            if(!valid){
                return res.status(401).json({ error: "Usuario o contraseña incorrectos, si persiste el problema acude a El Laberinto para que te ayuden" });
            }
            next();
        } catch(err){
            next(err);
        }
    }
};

export default autentificador;