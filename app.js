// URL:  http://localhost:5000
//importamos los modulos
const express = require('express') 
const mongoose = require('mongoose')
const Clientes = require('./data/Clientes')

const app = express() //invocando el express

const Name_DB = 'dataClient' // Nombre de la database
const DB_USER = 'elias'
const DB_PASSWORD = 'elias'

// =======Configuracion de mi compañero=======
// const DB_USER = 'cristhian'
// const DB_PASSWORD = 'cristhian'
// ===========================================

app.use(express.json()) //requiridos

app.get('/', (req, res) => {
    res
        .send(//Codigo HTML de la pagina principal
        '<html><title>MiApi</title><body><h1> Data de Clientes </h1><a href= "/clientes">Lista de Clientes</a></body></html>'
        )
})

// Read: todos los items
app.get('/clientes', async (req, res) => {
    try {
        const clientes = await Clientes.find()
        res.status(200).json(clientes)
    } catch (error) {
        res.status(500).json({ error: error })
    }
})

// Read: un item
app.get('/clientes/:id', async (req, res) => {
    const id = req.params.id // extraer id del dato
    try {
        const client = await Clientes.findOne({_id: id})
        if(!client){
            res.status(422).json({ message: 'Cliente no encontrado'})
            return
        }
        res.status(200).json(client)
    } catch (error) {
        res.status(500).json({ error: error })
    }
})

// Create
app.post('/clientes', async (req, res) => { // async -> await
    const { dni, apellido, nombre, edad } = req.body
    if(!dni || !apellido || !nombre || !edad) {
        res.status(422).json({ error: 'Proveer el dni, apellido, nombre y la edad del cliente'})
        return
    }
    if(typeof dni !== "number" || typeof edad !== "number"){  //Si se ingresa un str en id, dni o edad
        res.status(422).send({ error: 'Ingrese solo números para el dni y la edad'})
        return
    }
    if(typeof apellido !== "string" || typeof nombre !== "string"){
        res.status(422).send({ error: 'No puede ingresar números en el apellido y el nombre'})
    return
    }
    const client = {
        dni,
        apellido,
        nombre,
        edad,
    }
    try {
        await Clientes.create(client)
        res.status(201).json({ message:'!Ha sido creado un nuevo cliente!'})
    } catch (error) {
        res.status(500).json({ error: error}) // la mejor alternativa es crear un log de errores
    }
})

// Update
app.patch('/clientes/:id', async (req, res) => {
    const id = req.params.id
    const { apellido, nombre, edad } = req.body
    const updatedClient = {
        apellido,
        nombre,
        edad,
    }
    try {
        const updateClient = await Clientes.updateOne({_id: id}, updatedClient)
        if(updateClient.matchedCount === 0){
            res.status(422).json({message: 'Cliente no encontrado'})
            return
        }
        res.status(200).json({updatedClient})
    } catch (error) {
        res.status(500).json({ error: error })
    }  
})

// Delete
app.delete('/clientes/:id', async (req, res) => {
    const id = req.params.id
    const client = await Clientes.findOne({_id: id})
    if(!client){
        res.status(422).json({message: 'Cliente no encontrado'})
        return
    }
    try {
        await Clientes.deleteOne({_id: id})
        res.status(200).json({message: 'Cliente removido'})
    } catch (error) {
        res.status(500).json({ error: error })
    }
})

mongoose.connect(
    //`mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.dmxxpiz.mongodb.net/${Name_DB}?retryWrites=true&w=majority` // obs
    // Despues de .net/  colocar el nombre de la base de datos de Mongo
    `mongodb+srv://${DB_USER}:${DB_PASSWORD}@myapi.hxjesbx.mongodb.net/${Name_DB}?retryWrites=true&w=majority`

    ).then(() => {
        console.log('Connectado al MONGODB')
        app.listen(5000)
    })
    .catch((err) => {
        console.log(err)
})

app.all('*', (req, res) => {
    res
        .status(404) //Error
        .send('<h1>NO ENCONTRADO</h1>') //Pagina por defecto cuando no se encuentra la direccion url
})