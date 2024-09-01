const express = require('express');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const pacienteBD = require("./../models/pacienteModel");

//Rutas de escucha (endpoint ) para medico ---

app.get("/", listarTodo);
app.post("/create", crear);
app.put("/:nro_historial_clinico", modificarPaciente);
app.delete("/:nro_historial_clinico", eliminarPaciente);
app.get("/:nro_historial_clinico", obtenerPaciente);
app.get("/getbynss/:nss", getByNSS);


// //Funciones utilizadas en endpoints ----

function listarTodo(req, res){              //BDgetAll
     pacienteBD.metodos.getAll ((err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.json(result);
        }  
    });
};

function crear(req, res){                   //BD crearPaciente
    pacienteBD.metodos.crearPaciente(req.body, (err, exito) => {
        if (err) {
            res.json(err);
        } else {
            res.json(exito);            
        }
    });
};

function modificarPaciente (req, res){        //BD update
    datosPaciente = req.body;
    deTalPaciente = req.params.nro_historial_clinico;
    pacienteBD.metodos.update(datosPaciente, deTalPaciente, (err, exito) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(exito);
        }
    });
};

function eliminarPaciente (req,res) {         //BD eliminarPaciente
    deTalPaciente = req.params.nro_historial_clinico;
    pacienteBD.metodos.eliminarPaciente (deTalPaciente, (err, exito) =>{
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(exito);
        }
        });
};

function obtenerPaciente (req, res) {         //BD getPaciente
    let estePaciente = req.params.nro_historial_clinico;
    pacienteBD.metodos.getPaciente(estePaciente, (err, exito) =>{
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(exito);
        }
        });
    };

function getByNSS (req, res) {       //BD getNSS
    nss = req.params.nss;
    pacienteBD.metodos.getNSS( nss, (err, exito) =>{
        if (err) {
            res.send(err);
        } else {
            res.json(exito);
        }
        });
};

 //exportamos app que es nuestro servidor express a la cual se le agregaron endpoinds de escucha
module.exports = app;