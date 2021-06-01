const express = require('express')//importamos express
const app = express()//creamos la app
const path=require('path')//se encarga de usar el caracter adecuado segun el sistema
const bodyParser = require('body-parser')//funcion libreria toma la peticion antes y desp convierte a un objeto js
//http://localhost:3000/

//middlewares
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


app.get('/',function(req,res){//get peticion dominio mas una '/'
    let file = path.resolve('src','index.html')//envia la direccion completa sin problemas
    res.sendFile(file)//envia como respuesta el file
})

app.post('/', function(req,res){
    res.send(req.body)
})

// app.get('/viejo', function(req,res){
// res.send('nuevo ')
// })

// app.get('/nuevo', function(req,res){
// res.send('Esta es la nueva ubicacion')
// })

app.listen(3000)//en que puerto esta