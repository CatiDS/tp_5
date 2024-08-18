// codigo encargado de gestionar los datos con la BD de los medicos

const mysql = require("mysql");  // agregue las credenciales para acceder a la BD
//---------------------------------------------------------------------
const connection = mysql.createConnection({             //conexion a BD
    host: "localhost",
    user: "root",
    password: "admin",
    database: "clinica",
});

connection.connect((err) => {
    if (err) {
        console.log(err.code);
    } else {
        console.log("BD conectada ...");
    }
});
//------------------------------------------------------------------------

metodos.getAll = function (callback) {
    consulta = "select * from medico";
    connection.query(consulta, function (err, resultados, fields) {
        if (err) {
            callback(err);
            return;
        } else {
            callback(undefined, {
                messaje: "Resultados de la consulta",
                detail: resultados,
            });
        }
    });
}

metodos.getMedico = function (matricula, callback) {
    consulta = "select * from medico where matricula = ?";

    connection.query(consulta, matricula, function (err, resultados, fields) {
        if (err) {
            callback(err);
            return;
        } else {
            if (resultados.length == 0) {
                callback(undefined, "No se encontro un medico con la matricula: " + req.params.matricula);
            } else {
                callback(undefined, {
                    message: "Resultado de la consulta",
                    detail: resultados,
                });
            }
        }
    });

}




metodos.crearMedico = function (datosMedico, callback) {
    query =
        "INSERT INTO MEDICO (matricula, nombre, apellido, especialidad, observaciones) VALUES (?, ?, ?, ?, ?)";

    medico = [
        datosMedico.matricula,
        datosMedico.nombre,
        datosMedico.apellido,
        datosMedico.especialidad,
        datosMedico.observaciones,
    ];

    connection.query(query, medico, (err, rows) => {
        if (err) {
            callback(err)
        } else {
            callback(undefined, {
                message:
                    "el medico " +
                    datosMedico.nombre +
                    " " +
                    datosMedico.apellido +
                    "se registro correctamente",
                detail: rows,
            })
        }
    });
}

metodos.deleteMedico = function (matricula, callback) {


    query = "delete from medico where matricula =?";
    connection.query(query, matricula, function (err, rows, fields) {
        if (err) {
            callback.json({
                message: "Ha ocurrido un error",
                detail: err,
            });
            return;
        }

        if (rows.affectedRows == 0) {
            callback(undefined, "No se encontro un medico con la matricula " + matricula);
        } else {
            callback(undefined, "El medico " + matricula + " fue eliminado de la base de datos.");
        }
    });
}

var metodos = {getAll, getMedico, crearMedico, deleteMedico };


module.exports = { metodos };
