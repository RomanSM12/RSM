//Dependencias
const express = require('express')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken');


//Modelos
const modelo = require("./modelo.js")
const { error } = require('console')

const app = express()

app.use(bodyParser.urlencoded({extended: false }))
app.use(bodyParser.json())

app.get('/', function (req, res) {

    modelo.inicio("Cynthia",function(err, filas)
    {
        if (err) {

            return res.status(500).json({error: "Ocurrió un error"})

        } else {
            
            return res.json(filas);
        }
    })




  //res.send('Hello World')
})

app.get('/verificar', function(req,res){

    var email = req.query.email;
    var pass = req.query.pass;

    modelo.verificar(email,pass, function(err,filas){

        if (err) {
            
            return res.status(500).json({error: "Ocurrió un error inesperado"})

        } else {

            return res.json(filas);
            
        }
    })
        
})

app.post('/enviarCorreo', function(req,res){

    var email = req.body.email;
    var token = req.body.token;

    modelo.enviarCorreo(email,token, function(err, filas){
        
        if (err) {
            
            return res.status(500).json({error: "Ocurrió un error inesperado"})

        } else {

            return res.json(filas);
            
        }
    })
    
    console.log(token);

})

// Nueva ruta para verificar el token
app.get('/verificarToken', function(req, res) {
    var token = req.query.token; // Recupera el token desde el parámetro de consulta

    if (!token) {
        return res.status(400).json({ error: 'Token no proporcionado' });
    }

    // Verifica el token con jwt.verify
    jwt.verify(token, 'claveToken2024', function(err, filas){
        if (err) {
            return res.status(500).json({ status: "Ocurrió un error", mensaje: err });
        }else{
          
           return res.status(200).json({ status:"Todo OK", mensaje: filas });
        }
        
        
    })
})


app.listen(3000)