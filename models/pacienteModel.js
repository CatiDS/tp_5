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
        console.log("BD paciente conectada ...");
    }
});

var metodos = {};
//Listar todo
metodos.getAll = function (callback) {
    consulta = "select * from paciente";
    connection.query(consulta, function (err, resultados, fields) {
        if (err) {
            callback(err);
            return;
        } else {
            callback(undefined, {
                message: "Resultados de la consulta: Pacientes ",
                detail: resultados
            });
        }
    })
}
//Crear Paciente
metodos.crearPaciente = function (datosPaciente, callback) {
    paciente = [
        datosPaciente.nss,
        datosPaciente.nombre,
        datosPaciente.apellido,
        datosPaciente.domicilio,
        datosPaciente.codigo_postal,
        datosPaciente.telefono,
        datosPaciente.nro_historial_clinico,
        datosPaciente.observaciones
    ];

    consulta = "INSERT INTO PACIENTE (nss, nombre, apellido, domicilio, codigo_postal, telefono, nro_historial_clinico, observaciones) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

    connection.query(consulta, paciente, (err, rows) => {
        if (err) {
            if (err.code = "ER_DUP_ENTRY") {
                callback({
                    message: "Ya existe el paciente con el nro de historial clinico: " + datosPaciente.nro_historial_clinico,
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
                message: "El paciente: " + datosPaciente.apellido + ", " + datosPaciente.nombre + " se registro correctamente!",
                detail: rows
            })
        }
    });
};

//Modificar paciente
metodos.update = function (datosPaciente, deTalPaciente, callback) {
    datos = [
        datosPaciente.nss,
        datosPaciente.nombre,
        datosPaciente.apellido,
        datosPaciente.domicilio,
        datosPaciente.codigo_postal,
        datosPaciente.telefono,
        datosPaciente.nro_historial_clinico,
        datosPaciente.observaciones,
        parseInt(deTalPaciente)
    ];
    consulta = "update paciente set nss = ?, nombre = ?, apellido = ?, domicilio = ?, codigo_postal = ?, telefono = ?, nro_historial_clinico = ?, observaciones = ? WHERE nro_historial_clinico = ?";

    connection.query(consulta, datos, (err, rows) => {
        if (err) {
            callback(err);
        } else {
            if (rows.affectedRows == 0) {
                callback(undefined, {
                    message: "No se encontro ningun paciente con el nro_historial_clinico: " + deTalPaciente,
                    detail: rows
                })
            } else {
                if (rows.changedRows == 0) {
                    callback(undefined, {
                        message: `No se han realizado cambios en los datos del paciente: ${datosPaciente.apellido} , ${datosPaciente.nombre}. Los datos ingresados corresponden a los que han sido cargados en el sistema con anterioridad.`,
                        detail: rows
                    })
                } else {
                    callback(undefined, {
                        message: "El paciente: " + datosPaciente.apellido + ", " + datosPaciente.nombre + " se actualizo correctamente",
                        detail: rows
                    });
                }
            }
        }
    });
};

//EliminarPaciente
metodos.eliminarPaciente = function (deTalPaciente, callback) {
    nro_historial_clinico = parseInt(deTalPaciente);
    consulta = "delete from paciente WHERE nro_historial_clinico = ?";

    connection.query(consulta, nro_historial_clinico, (err, rows) => {
        if (err) {
            callback(err);
        } else {
            if (rows.affectedRows == 0) {
                callback(undefined, {
                    message: "No se encontro ningun paciente con el nro_historial_clinico: " + deTalPaciente,
                    detail: rows
                })
            } else {
                callback(undefined,
                    `El paciente con nro_historial_clinico: ${nro_historial_clinico} fue eliminado correctamente de la Base de Datos`);
            }
        }
    });
};

//Obtener Paciente
metodos.getPaciente = function (estePaciente, callback) {
    nro_historial_clinico = parseInt(estePaciente);
    consulta = "select * from paciente where nro_historial_clinico = ?";

    connection.query( consulta, nro_historial_clinico, function (err, resultados, fields) {
        if (err) {
            callback(err);
        } else {
            if (resultados.length == 0) {
                callback(undefined, "no se encontro un paciente con el nro_historial_clinico : " + nro_historial_clinico);
            } else {
                callback(undefined, {
                    messaje: "Resultados de la consulta",
                    detail: resultados
                });
            }
        }
    });
};

//Buscar por numero seguridad social NSS
metodos.getNSS = function (nss, callback) {
    consulta = "select * from paciente where nss = ?";

    connection.query( consulta, nss, function (err, resultados, fields) {
        if (err) {
            callback(err);
        } else {
            if (resultados.length == 0) {
                callback(undefined, "no se encontro un paciente con el Numero de Seguridad Social : " + nss);
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
