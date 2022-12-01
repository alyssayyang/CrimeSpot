// Requiring modules
const express = require('express');
const User = require('./models/user');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const session = require('express-session');

const app = express();
const path = require('path');
const ejsMate = require('ejs-mate');
const user = require('./models/user');

//my computer's router address
const hostname = 'localhost';
const port = 3000;
mongoose = require('mongoose');


app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({ secret: 'customized secret' }))

const requireLogin = (req, res, next) => {
    if (!req.session.user_id) {
        return res.redirect('/login')
    }
    next();
}

const requireAdmin = (req, res, next) => {
  if(req.session.usertype != 'admin'){
    return res.send('requires admin access')
  }
  next();
}

mongoose.connect("mongodb://127.0.0.1:27017/crimespot",(err) => {
    if(err){
      console.log("fail");
      console.log(err);
    }else{
      console.log("db connect success");
    }
});

app.get("/",(req,res) => {
  // res.send('this is home page')
  res.render("register")
});

app.get("/home",requireLogin,requireAdmin,(req,res) => {
  res.render("home")
});

app.get("/register", (req, res) => {
    res.render('register')
});

//TODO: check if two passwords are the same
app.post('/register', async (req,res) => {
  const {username, useremail, password, usertype} = req.body;
  const user = new User({username,useremail,password,usertype})
  await user.save();
  req.session.user_id = user._id;
  console.log(user._id);
  req.session.usertype=user.usertype;
  res.redirect('/home')
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.post('/login',async (req,res) => {
  const {username, password} = req.body;
  const foundUser = await User.findAndValidate(username,password);
  // const validPassword = await bcrypt.compare(password,user.password);
  if(foundUser){
    req.session.user_id = foundUser._id;
    req.session.usertype=foundUser.usertype;
    res.render('home')
  }else{
    res.send("The user does not exist or the password does not match, please try again or register for new account");
  }
})


app.get('/profile', async (req,res) => {
  const id = req.session.user_id;
  const foundUser = await User.findOne({id});
  res.render('profile',{User: foundUser});
})

app.get('/editprofile', async (req,res) => {
  const id = req.session.user_id;
  const foundUser = await User.findOne({id});
  res.render('editprofile',{User: foundUser});
})


app.listen(port, hostname, () => {
    console.log("server started on port", port)
});