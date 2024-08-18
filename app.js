const express = require('express');
var app = express();
const morgan = require('morgan');
const medicoBD = require("./modelos/medicosModel");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("tiny"));
morgan(":method :url :status :res[content-length] - :response-time ms");


app.get("/", (req, res) => {
    res.send("Pagina de inicio funcionando perfectamente ...");
});


app.listen(8080, (err) => {
    if (err) {
        console.log(err);
        return;
    } else {
        console.log("Servicio encendido escuchando en el puerto 8080");
    }
});