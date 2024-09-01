
require('rootpath')();

const mysql = require("mysql");
const config = require("./../config.json");
const { query } = require("express");
// Agregue las credenciales para acceder a su base de datos
const connection = mysql.createConnection(config.database);

connection.connect((err) => {
    if (err) {
        console.log(err.code);
    } else {
        console.log("BD medico conectada ...");
    }
});

var metodos = {};
//Listar todo
metodos.getAll = function (callback) {
    consulta = "select * from medico";
    connection.query(consulta, function (err, resultados, fields) {
        if (err) {
            callback(err);
            return;
        } else {
            callback(undefined, {
                message: "Resultados de la consulta ",
                detail: resultados
            });
        }
    })
}
//Crear medico
metodos.crearMedico = function (datosMedico, callback) {
    medico = [
        datosMedico.matricula,
        datosMedico.nombre,
        datosMedico.apellido,
        datosMedico.especialidad,
        datosMedico.observaciones
    ];

    consulta = "INSERT INTO MEDICO (matricula, nombre, apellido, especialidad, observaciones) VALUES (?, ?, ?, ?, ?)";

    connection.query(consulta, medico, (err, rows) => {
        if (err) {
            if (err.code = "ER_DUP_ENTRY") {
                callback({
                    message: "Ya existe el medico con la matricula: " + datosMedico.matricula,
                    detail: err.sqlMessage
                })
            } else {
                callback({
                    message: "Error desconocido",
                    detail: err.sqlMessage
                })
            }

        } else {
            callback(undefined, {
                message: "El medico: " + datosMedico.apellido + ", " + datosMedico.nombre + " se registro correctamente!",
                detail: rows
            })
        }
    });
};

//Modificar medico
metodos.update = function (datosMedico, deTalMedico, callback) {
    datos = [
        datosMedico.matricula,
        datosMedico.nombre,
        datosMedico.apellido,
        datosMedico.especialidad,
        datosMedico.observaciones,
        parseInt(deTalMedico)
    ];
    consulta = "update medico set matricula = ?, nombre = ?, apellido = ?, especialidad = ?, observaciones = ? WHERE matricula = ?";

    connection.query(consulta, datos, (err, rows) => {
        if (err) {
            callback(err);
        } else {
            if (rows.affectedRows == 0) {
                callback(undefined, {
                    message: "No se encontro ningun medico con la matricula: " + deTalMedico,
                    detail: rows
                })
            } else {
                if (rows.changedRows == 0) {
                    callback(undefined, {
                        message: `No se han realizado cambios en los datos del medico: ${datosMedico.apellido} , ${datosMedico.nombre} .
                            Los datos ingresados corresponden a los que han sido cargados en el sistema`,
                        detail: rows
                    })
                } else {
                    callback(undefined, {
                        message: "El medico: " + datosMedico.apellido + ", " + datosMedico.nombre + " se actualizo correctamente",
                        detail: rows
                    });
                }
            }
        }
    });
};

//EliminarMedico
metodos.eliminarMedico = function (deTalMedico, callback) {
    matricula = parseInt(deTalMedico);
    consulta = "delete from medico WHERE matricula = ?";

    connection.query(consulta, matricula, (err, rows) => {
        if (err) {
            callback(err);
        } else {
            if (rows.affectedRows == 0) {
                callback(undefined, {
                    message: "No se encontro ningun medico con la matricula: " + deTalMedico,
                    detail: rows
                })
            } else {
                callback(undefined,
                    `El medico con ${matricula} fue eliminado correctamente de la Base de Datos`);
            }
        }
    });
};

//Obtener Medico
metodos.getMedico = function (esteMedico, callback) {
    matricula = parseInt(esteMedico);
    consulta = "select * from medico where matricula = ?";

    connection.query( consulta, matricula, function (err, resultados, fields) {
        if (err) {
            callback(err);
        } else {
            if (resultados.length == 0) {
                callback(undefined, "no se encontro un medico con la matricula:" + matricula);
            } else {
                callback(undefined, {
                    messaje: "Resultados de la consulta",
                    detail: resultados
                });
            }
        }
    });
};

//Buscar por especialidad
metodos.getEspecialidad = function (especialidad, callback) {
    consulta = "select * from medico where especialidad = ?";

    connection.query( consulta, especialidad, function (err, resultados, fields) {
        if (err) {
            callback(err);
        } else {
            if (resultados.length == 0) {
                callback(undefined, "no se encontro un medico con la especialidad:" + especialidad);
            } else {
                callback(undefined, {
                    messaje: "Resultados de la consulta",
                    detail: resultados
                });
            }
        }
    });
};



module.exports = { metodos };


