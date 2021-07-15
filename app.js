const express = require('express')//importamos express
const app = express()//creamos la app
const path=require('path')//se encarga de usar el caracter adecuado segun el sistema
const bodyParser = require('body-parser')//funcion libreria toma la peticion antes y desp convierte a un objeto js
const products = require('./products')//el creado por mockaroo
const fs=require('fs')//para escribir en products,json y no en la variable product
// const { start } = require('repl')

//URL = Endpoints o algo asi
//http://localhost:3000/

//middlewares
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())



//ruta raiz siempre debe estar
app.get('/', function(req,res){
    res.json()
})



//http://localhost:3000/products?page=2&price_min=100  ejemplo de uso
//Collection conjunto de datos tienen la misma estructura
app.get('/products', function(req,res){
   //console.log(req.query.page)//(/products?price=algo)una query de un parametro price
    //http://localhost:3000/products?page=5 lo convierte en js y se muestra en la consola
   // let page=products.slice(0,10)//rebano el array en posiciones
    let results=[...products]
    if(Object.keys(req.query).length>0){//si tiene params busco los resultados( prices min max )
        if(req.query.price_min){
            results=products.filter(function(product){//products.product
                return Number(product.price.replace('$','')>=req.query.price_min)
            })
        }
        if(req.query.price_max){
            results=results.filter(function(product){//products.product
                return Number(product.price.replace('$','')<=req.query.price_max)
            })
        } 
    }else{
        results = products.slice(0,10)
    }
    if(req.query.hasOwnProperty('page')){//si tiene paginado,pagino los resultados
        //si page es 0 -> 0-10, si page es 1 ->11-20
        if(req.query.page){
          if (req.query.page > 0){
                start=req.query.page * 10
                end=start+10
                results=results.slice(start,end)
             }
        }//vas dividiendo en bloques la info
    }
    res.json(results)//respuesta
})



//Recursos
//http://localhost:3000/products/123 parametro (id) froma parte de la url 
app.get('/products/:id', function(req,res){//ruta para ver detalle con parametro con nombre id 
    //console.log(req.params.id)//para acceder a ese parametro designado en la url
    //el filter devuelve un array con multiples resultados
    // find devuelve un solo dato
    //http://localhost:3000/products/1 el id 1 devuelve el 1
    let product = products.find(function(product){
        return product.id==req.params.id
    })
    if(product){
        return res.json(product)
    }else{
        return res.status(404).send({message:'Este producto no existe, error 404 enviado'})
    }
    
})



app.post('/products', function(req,res){//recibimos info, crea datos el post 
    let newProduct={
        id:Date.now(),
        ...req.body
    }

    //obtener el contenido y desp interpetrarlo como un json para escribir en porducts.json,agregas el array, lo conviertes en string y guardas el contenido
    let content = fs.readFileSync('./products.json',{encoding:'utf8'})
    let array = JSON.parse(content)
    array.push(newProduct)
    content=JSON.stringify(array)
    fs.writeFileSync('./products.json',content)

    console.log(newProduct)
    if(true){//en el caso que salga mal
        res.status(403).json({message:'Cannot post'})//ves es postman que funcniona
    }
    res.status(201).json({message: "Created","id":newProduct})
})



app.patch('/products/:id', function(req,rest){
    //buscar el dato que voy a editar
    let index = products.findIndex(product => product.id == req.params.id)
    if(index==-1){
        return res.status(404).json({message: 'Not found'})//el respons no corta la respuesta, en caso de haber error por eso verificamos con un if y cortamos con return
    }
    let old = product[index]
    //editar ese dato
    let product ={
        ...product[index],//los... copia los valores del product estilo merge
        ...req.body,
        id: old.id,//para que no se sobreescriba el id lo ponemos a lo ultimo
    }
    product[index]=product
    //igual que en el post pero ya estan declaradas y no se pushea sino se modifica
    let content=JSON.stringify(product)
    fs.writeFileSync('./products.json',content)
    res.status(201).json({message: "success"})
})



app.delete('/products/:id', function(req,res){
    //parecido que el patch
    let content = fs.readFileSync('./products.json',{encoding:'utf8'})
    let products = JSON.parse(content)
    let index = products.findIndex(product => product.id == req.params.id)
    if(index==-1){//si no se encontro no existe
        return res.status(404).json({message: 'Not found'})//el respons no corta la respuesta, en caso de haber error por eso verificamos con un if y cortamos con return
    }
    //si existe...
    products = products.filter(product => product.id!=req.params.id)//busca todos los id que pide que no borre, para que el id que deseamos eliminar no este en la lista
    content=JSON.stringify(products)
    fs.writeFileSync('./products.json',content)
    res.status(201).json({message: "success"})
})



app.listen(3000)//en que puerto esta