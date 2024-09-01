
const express = require('express');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const medicoBD = require("./../models/medicoModel.js");

//Rutas de escucha (endpoint ) para medico ---

app.get("/", listarTodo);
app.post("/create", crear);
app.put("/:matricula", modificarMedico);
app.delete("/:matricula", eliminarMedico);
app.get("/byMatricula/:matricula", obtenerMedico);
app.get("/byEspecialidad/:especialidad", getByEspecialidad);


//Funciones utilizadas en endpoints ----

function listarTodo(req, res){              //BDgetAll
     medicoBD.metodos.getAll ((err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.json(result);
        }  
    });
};

function crear(req, res){                   //BD crearMedico
    medicoBD.metodos.crearMedico(req.body, (err, exito) => {
        if (err) {
            res.send(err);
        } else {
            res.json(exito);            
        }
    });
};

function modificarMedico (req, res){        //BD update
    datosMedico = req.body;
    deTalMedico = req.params.matricula;
    medicoBD.metodos.update(datosMedico, deTalMedico, (err, exito) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(exito);
        }
    });
};

function eliminarMedico (req,res) {         //BD eliminarMedico
    deTalMedico = req.params.matricula;
    medicoBD.metodos.eliminarMedico (deTalMedico, (err, exito) =>{
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(exito);
        }
        });
};

function obtenerMedico (req, res) {         //BD getMedico
    let esteMedico = req.params.matricula;
    medicoBD.metodos.getMedico(esteMedico, (err, exito) =>{
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(exito);
        }
        });
    };

function getByEspecialidad (req, res) {       //BD getEspecialidad
    especialidad = req.params.especialidad;
    medicoBD.metodos.getEspecialidad( especialidad, (err, exito) =>{
        if (err) {
            res.send(err);
        } else {
            res.json(exito);
        }
        });
};

 //exportamos app que es nuestro servidor express a la cual se le agregaron endpoinds de escucha
module.exports = app;