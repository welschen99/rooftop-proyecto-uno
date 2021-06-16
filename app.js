const express = require('express')//importamos express
const app = express()//creamos la app
const path=require('path')//se encarga de usar el caracter adecuado segun el sistema
const bodyParser = require('body-parser')//funcion libreria toma la peticion antes y desp convierte a un objeto js
const products = require('./data')

//http://localhost:3000/

//middlewares
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', function(req,res){
    res.json()
})

app.get('/products', function(req,res){
    console.log(req.query.price)
    //http://localhost:3000/products?page=5 lo convierte en js y se muestra en la consola
    res.json(products)
})
//http://localhost:3000/products para verlo

app.get('/products/:id', function(req,res){
    console.log(req.params.id)//para acceder a ese parametro designado en la url
    res.json()
})

app.post('/products', function(req,res){
    console.log(req.body)
    if(true){
        res.status(403).json({message:'Cannot post'})//ves es postman que funcniona
    }
    res.json()
})

app.patch('/products/:id', function(req,rest){
    res.json()
})

app.delete('/products/:id', function(req,res){
    res.json()
})

app.listen(3000)//en que puerto esta