
const express = require('express');
const app = express();
const morgan = require("morgan");


 app.use(express.json());
 app.use(express.urlencoded({ extended: true }));
app.use(morgan("tiny"));
morgan(":method :url :status :res[content-length] - :response-time ms");

const config = require("./config.json");

const medicoController = require("./controller/medicoController.js");
app.use("/api/medico", medicoController);
const pacienteController = require("./controller/pacienteController.js");
app.use("/api/paciente", pacienteController);
const ingresoController = require("./controller/ingresoController.js");
app.use("/api/ingreso", ingresoController);

app.listen(config.server.port , (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Sevidor encendido y escuchando en el puerto " + config.server.port);
    }
  });