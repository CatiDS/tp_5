
const express = require('express');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const ingresoBD = require("./../models/ingresoModel.js");

//Rutas de escucha (endpoint ) para ingreso ---

app.get("/", listarTodo);
app.post("/create", crear);

//Funciones utilizadas en endpoints ----

function listarTodo(req, res){              //BDgetAll
     ingresoBD.metodos.getAll ((err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.json(result);
        }  
    });
};

function crear(req, res){                   //BD crearIngreso
    ingresoBD.metodos.crearIngreso(req.body, (err, exito) => {
        if (err) {
            res.send(err);
        } else {
            res.json(exito);            
        }
    });
};



 //exportamos app que es nuestro servidor express a la cual se le agregaron endpoinds de escucha
module.exports = app;