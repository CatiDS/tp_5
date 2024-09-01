
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
        console.log("BD ingreso conectada ...");
    }
});

var metodos = {};
//Listar todo
// metodos.getAll = function (callback) {
//     consulta = "select * from ingreso";
//     connection.query(consulta, function (err, resultados, fields) {
//         if (err) {
//             callback(err);
//             return;
//         } else {
//             callback(undefined, {
//                 message: "Resultados de la consulta ",
//                 detail: resultados
//             });
//         }
//     }) ``
// }

// Reto opcional: mejorar la última operación relacionada a listar ingresos para que la respuesta 
// contenga dos campos extras: ApeNomPaciente (apellido y nombre del paciente) y 
// ApeNomMedico (apellido y nombre del médico)  
metodos.getAll = function (callback) {
    consulta = `select concat (paciente.apellido,", ", paciente.nombre) as ApeNomPaciente, concat(medico.apellido,", ", medico.nombre) as ApeNomMedico,
     ingreso.id_ingreso, ingreso.fecha_ingreso, ingreso.nro_habitacion, ingreso.nro_cama , ingreso.observaciones, ingreso.nro_historial_paciente, ingreso.matricula_medico 
     from paciente inner join ingreso on(paciente.nro_historial_clinico = ingreso.nro_historial_paciente) inner join medico on (ingreso.matricula_medico= medico.matricula)`;
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





//Crear ingreso
metodos.crearIngreso = function (datosIngreso, callback) {
    ingreso = [
        // datosIngreso.id_ingreso,     no lo cargo porque es auto incremental
        datosIngreso.fecha_ingreso,
        datosIngreso.nro_habitacion,
        datosIngreso.nro_cama,
        datosIngreso.observaciones,
        datosIngreso.nro_historial_paciente,
        datosIngreso.matricula_medico
    ];

    consulta = "INSERT INTO INGRESO ( fecha_ingreso, nro_habitacion, nro_cama, observaciones, nro_historial_paciente, matricula_medico) VALUES (?, ?, ?, ?, ?, ?)";

    connection.query(consulta, ingreso, (err, rows) => {
        if (err) {
            if (err.code = "ER_DUP_ENTRY") {
                callback({
                    message: `No se ha podido cargar el ingreso, revisar si son correctos los siguientes datos: nro_historial_paciente , matricula_medico.
                                Alguno de ellos no corresponde a un registro en la base de datos. `,              
                    detail: err 
                })
            } else {
                callback({
                    message: "Error desconocido",
                    detail: err.sqlMessage
                })
            }

        } else {
            callback(undefined, {
                message: "El ingreso se registro correctamente!",
                detail: rows
            })
        }
    });
};


module.exports = { metodos };


