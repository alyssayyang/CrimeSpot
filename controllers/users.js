const e = require('express');
const User = require('../models/User');
const ObjectId = require('mongodb').ObjectId;

module.exports.renderRegister = (req, res) => {
    res.render('register');
}

module.exports.register = async(req, res, next) => {
    try{
        const {username, useremail, password, type} = req.body;
        var usertype;
        if(type == 'on'){
            usertype = 'admin'
        }else{
            usertype = 'user'
        }
        const user = new User({username, useremail, usertype});
        const registeredUser = await User.register(user, password);
        console.log('you have registered')
        req.flash('success', 'you have registered');

        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'You have logged in');
            res.redirect('/home');
        })  
            
    } catch(e) {
        req.flash('error', e.message);
        console.log(e.message)
        res.redirect('login');
    }    

}

module.exports.renderLogin = (req, res) => {
    res.render('login');
}

module.exports.login = (req, res) => {
    try{
        req.flash('success', 'Welcome back!');
        const redirectUrl = req.session.returnTo || '/home';
        delete req.session.returnTo;
        res.redirect(redirectUrl);
    
    } catch(e) {
        req.flash('error', e.message);
        console.log(e.message)
        res.redirect('login');
    }   
    
}

//add update profile functions here

module.exports.logout = (req, res) => {
    req.logout(req.user, err => {
        if(err) return next(err);
        req.flash('success', 'You are logged out');
        res.redirect("/artpieces");
      });
}

module.exports.renderProfile = async (req, res) => {
    const user = req.user;
    res.render('profile',{User: user});
}


module.exports.renderEditProfile = async (req, res) => {
    const user = req.user;
    res.render('editprofile',{User: user});
}

module.exports.updateProfile = async(req, res) => {
    const {id} = req.user;

    const {newname,newemail} = req.body;

    const updateUser = await User.findByIdAndUpdate({_id:id},{username:newname, useremail:newemail});
    console.log({updateUser});
    res.render('login');
}
