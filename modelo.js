//Dependencias
var mysql = require('mysql');
var jwt = require ('jsonwebtoken');
var nodemailer = require('nodemailer');
let modelo = {};

var hostBD = 'localhost';
var userBD = 'root';
var passBD = '';
var databaseBD = 'prueba';

modelo.inicio = function(nombre1, callback)
{
    callback(null,{nombre: nombre1, status: "Conectado"})
}


modelo.verificar = function(email,pass,callback)
{
    var conexion = mysql.createConnection({
        host: hostBD,
        user: userBD,
        pass: passBD,
        database: databaseBD
    });

    conexion.connect((err)=>
        {
    if (err) {

        console.log(err)
        
            }
        }
    );



    if(conexion)
    {
        var consulta = "select*from usuarios where correo ='" + email + "'and pass ='" + pass + "'";

        conexion.query(consulta, function(err,filas){

            if(err)
            {
                console.log(err);
            }
            else
            {
                if(filas.length >= 1)
                {
                    var token = jwt.sign({email: email}, 'claveToken2024');
                    callback(null,{status:"OK", datos: filas, toke: token,
                        mensaje: "Usuario encontrado"})
                }
                else
                {
                    callback(null,{status:"OK", datos: null,
                        mensaje: "Usuario no encontrado"})
                }
            }


        });
    }

    conexion.end();
   
}
module.exports = modelo;

modelo.enviarCorreo = function(email, token, callback){

    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'romans.minutti@gmail.com',
            pass: 'eazz bwdi wmiv vagd'
        }
    });

    let mailOptions = {

        from: 'romans.minutti@gmail.com',
        to: email,
        subject: 'Confirmacion del correo',
        html: '<p> Haz click en el siguiente link <a href="http://localhost:3000/verificarToken?token=' + token + '"> Haz click aqui </a>  </p>'
    }

    transporter.sendMail(mailOptions, (error,info)=>{

        if (error) {
            console.log("Error al enviar el correo:", error);
            
        } else {
            console.log("Correo enviado exitosamente");
            callback(null, {status: 'Ok', mensaje: 'Correo enviado exitosamente'});
        }
    })

}