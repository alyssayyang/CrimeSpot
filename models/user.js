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
    password: {
        type: String,
        required:[true,'Password cannot be blank']
    },
    useremail: {
        type:String,
        required:[true,'Password cannot be blank']
    },
    usertype:{
        type: String,
    }
})

userSchema.statics.findAndValidate = async function (useremail, password
    ){
        const foundUser = await this.findOne({useremail});
        const isValid = await bcrypt.compare(password,foundUser.password)
        return isValid ? foundUser : false; 
    }

userSchema.statics.validateEmail = async function(useremail){
    const foundUser = await this.findOne({useremail});
    return foundUser ? true : false;
}   

    
// userSchema.statics.validateAdminAccess = async function(username){
//     const foundUser = await this.findOne({ username });
//     if(foundUser.usertype == 'admin'){
//         return true;
//     }else{
//         return false;
//     }
// }


userSchema.pre('save',async function(next){
    this.password = await bcrypt.hash(this.password,12);
    this.usertype = this.usertype == 'on' ? 'admin' : 'user';
    next();
})

module.exports = mongoose.model('User',userSchema);