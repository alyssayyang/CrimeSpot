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
mongoose.connect("mongodb://127.0.0.1:27017/crimespot", (err) => {
    if (err) {
        console.log("fail");
        console.log(err);
    } else {
        console.log("db connect success");
    }
});

app.get("/", (req, res) => {
    res.send('this is home page')
});

app.get("/home", (req, res) => {
    res.render("home")
});

app.get("/register", (req, res) => {
    res.render('register')
});

//TODO: check if two passwords are the same
app.post('/register', async(req, res) => {
    const { username, email, password, } = req.body;
    console.log(email);
    //in the schema, we have a function that would be called pre save()
    //in which we will save the hashed password
    const user = new User({ username, password })
    await user.save();
    req.session.user_id = user._id;
    res.redirect('/')
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.post('login', async(req, res) => {
    const { username, password } = req.body;
    const foundUser = await User.findAndValidate(username, password);
    const validPassword = await bcrypt.compare(password, user.password);

    if (foundUser) {
        req.session.user_id = foundUser._id;
        res.send('/secret')
    } else {
        res.send('denied')
    }
})

app.post('/logout', (req, res) => {
    req.session.user_id = null;
    res.redirect('/login')
})

app.get('/secret', requireLogin, (req, res) => {
    res.render('/secret')
})



app.listen(port, hostname, () => {
    console.log("server started on port", port)
});