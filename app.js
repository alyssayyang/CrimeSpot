// Requiring modules
const express = require('express');
const session = require('express-session')
const app = express();
const mysql = require('mysql');
const dotenv = require('dotenv');
const path = require('path');
const { Static } = require('vue');
const ejsMate = require('ejs-mate');

//my computer's router address
const hostname = 'localhost';
const port = 5500;
const passport =  require('passport');



app.engine('ejs',ejsMate);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({extended:'false'}));
app.use(express.json());

app.use(session({ secret: 'cats'}));
app.use(passport.initialize());
app.use(passport.session());

require('./authenticate');

function isLoggedIn(req,res,next){
  req.user ? next() : res.sendStatus(401);
}

// app.use('/',indexRouter);
// app.use('/users',usersRouter);


var con = mysql.createConnection({
    database:"crimeMap",
    host: "localhost",
    user: "root",
    password: "ERdf1234"
});
  
  con.connect(function(err) {
    if (err) throw err;
    console.log("db Connected!");
  });

  app.get("/",(req,res) => {
    res.send('<a href="auth/google">Authenticate with Google</a>')
  });

  app.get('/auth/google',
    passport.authenticate('google',{scope: ['email','profile']})
  );

  app.get('/google/callback',
    passport.authenticate('google',{
      successRedirect: '/protected',
      failureRedirect: '/auth/failure',
    })
  );

  app.get('/protected',isLoggedIn,(req, res) => {
    res.send("hello");
  });

  app.get('/logout',(req,res) => {
    req.logout();
    res.send("logged out");
  })

  app.get('/auth/failure',(req,res) => {
    alert('something wrong')
  })

  //the website we want to protect unless user is logged in



  // app.get('/google/callback',passport.authenticate( 'google', {
  //   successRedirect: '/home',
  //   failureRedirect: '/auth/google'
  // }));

  app.get("/home",(req,res) => {
    res.render("home")
  });

  app.get("/login",(req,res) => {
    res.render("login")
  });

  app.post("/auth/register",(req,res)=>{
    const {name, email, password, password_confirm} = req.body
    
  });

  app.listen(port,hostname, () => {
    console.log("server started on port",port)
  });

