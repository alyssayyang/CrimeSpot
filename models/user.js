const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const passportLocalMongoose = require('passport-local-mongoose')
/*
user schema has changed
*/
const userSchema = new mongoose.Schema({
    username: {
        type: String,
    },
    password: {
        type: String,
    },
    useremail: {
        type:String,
    },
    usertype:{
        type: String,
    }
})

userSchema.plugin(passportLocalMongoose);


module.exports = mongoose.model('User',userSchema);