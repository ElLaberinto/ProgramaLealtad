import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import express from "express";
import session from 'express-session';

import rPrimary from "./routes/rPrimary.js"
import rProgram from "./routes/rProgram.js";
import rApis from "./routes/rApis.js";
import error from "./middlewares/errors.js";

let app = express();
const port = process.env.PORT || 3000;
const __dirname = path.resolve();

app.use(helmet());
app.use(morgan("dev"));
app.use(cors({
  origin: true,
  credentials: true
}));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(express.static(path.join(__dirname, "publics")));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(session({
  secret: "C@f3t3r1@ElL@b3r1nt0",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,
    sameSite: 'none',
    httpOnly: true,
    maxAge: 1000 * 60 * 60
}
}));
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "img-src 'self' data: https://res.cloudinary.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com"
    ].join("; ")
  );
  next();
});

// Rutas y errores aquí
app.use(rPrimary);
app.use(rProgram);
app.use("/api", rApis)
app.use(error.e404);

console.log("Antes del listen");

app.listen(port, () => {
    console.log(`Servidor en puerto: ${port}`);
});