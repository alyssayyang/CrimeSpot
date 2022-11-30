const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
/*
user schema has changed
*/
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required:[true,'Username cannot be blank']
    },
    // email: {
    //     type: String,
    //     required:[true,'email cannot be blank']
    // },
    password: {
        type: String,
        required:[true,'Password cannot be blank']
    }
})

userSchema.statics.findAnd
Validate = async function (username, password
    ){
        const foundUser = await this.findOne({ username });
        const isValid = await bcrypt.compare(password,foundUser.password)
        return isValid ? foundUser : false; 
    }

userSchema.pre('save',async function(next){
    this.password = await bcrypt.hash(this.password,12);
    next();
})

module.exports = mongoose.model('User',userSchema);