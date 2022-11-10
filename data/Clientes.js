const mongoose = require('mongoose')

const Clientes = mongoose.model('Cliente', {
    dni: Number,
    apellido: String,
    nombre: String,
    edad: Number,
})

module.exports = Clientes