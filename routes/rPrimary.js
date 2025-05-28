import cPrimary from "../controllers/cPrimary.js";
import { Router } from "express";

const rPrimary = new Router();

rPrimary.get("/", cPrimary.home);
rPrimary.get("/programadepuntos", cPrimary.program);
rPrimary.get("/menu", cPrimary.menu);
rPrimary.get("/eventos", cPrimary.events);

export default rPrimary;