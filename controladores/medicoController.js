const express = require('express');
var app = express();
const mysql = require('mysql');
const morgan = require('morgan');

const medicoBD = require('./modelos/medicosModel');

//--------------------------------------------------------------
// Agregue las credenciales para acceder a su base de datos
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "admin",
    database: "clinica",
});

connection.connect((err) => {
    if (err) {
        console.log(err.code);
    } else {
        console.log("BD conectada");
    }
});

//---------------middleware (USE) -------------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("tiny"));
morgan(":method :url :status :res[content-length] - :response-time ms");
//----------------------------------------------------------------


//---------------RUTAS (ENDPOINTS)---------------------------------
app.get("/", (req, res) => {
    res.send("Pagina de inicio funcionando perfectamente ...");
});



//listar medicos ---->  getAll()
app.get("/api/medicos", (req, res) => {
    medicos = medicoBD.metodos.getAll((err, result) => {
        if (err) {
            res.send(err);
            return;
        } else {
            res.json(result);
        }
    }
    );
});



//obtener_datos_de_un_medico ---> getMedico()
app.get("/api/medicos/:matricula", (req, res) => {
    matricula = req.params.matricula;
    medicoBD.metodos.getMedico(matricula, (err, exito) => {
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(200).send(exito)
        }
    });
});

 
//crear medico  --------------> crearMedico()
app.post("/api/medico/create", function (req, res) {

    medicoBD.metodos.crearMedico(req.body, (err, exito) => {
        if (err) {
            res.json({
                message: "ha ocurrido un error",
                detail: err,
            });
            return;
        }
        res.json(exito);
    });
});


//eliminar un medico ---------------> deleteMedico()
app.delete("/api/medico/delete/:matricula", (req, res) => {
   
    medicoBD.metodos.deleteMedico ( req.params.matricula , (err, exito) => {
        if (err) {
            res.status(500).json(err);
        } else {
            res.send(exito);
        }
    })
});



app.listen(8080, () => {
    console.debug("App escuchando puerto :8080");
});
