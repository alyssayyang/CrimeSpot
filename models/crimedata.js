const mongoose = require('mongoose');


const crimedataSchema = new mongoose.Schema({
    crimetype: {
        type: String
    },
    code: {
        type: String
    },
    year: {
        type: Number
    },
    crimerate:{
        type: Number
    }
})


module.exports = mongoose.model('CrimeData',crimedataSchema);