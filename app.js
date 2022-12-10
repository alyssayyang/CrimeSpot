// Requiring modules
const express = require('express')
const db_user = require('./models/User')
const db_crimedata = require('./models/CrimeData')
const bodyParser = require('body-parser')
const session = require('express-session')

const app = express()
const path = require('path')
const ejsMate = require('ejs-mate')
const { render } = require('ejs')
const { collection } = require('./models/User')
const { ppid } = require('process')


//my computer's router address
const hostname = 'localhost'
const port = 3000


app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use("/static", express.static('./static/'))

app.use(express.static(__dirname + '/public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());
app.use(session({ secret: 'customized secret' }))

const api = require('./routes/api.js')
app.use('/api',api)

const database= require('./models/database')


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


app.get("/",(req,res) => {
  // res.send('this is home page')
  res.render("register")
});

app.get('/getcrime',(req,res) => {
  MongoClient.connect(myurl)
    .then(client =>{
    const db = client.db('crimespot');
    const collection = db.collection('crimedata');
    collection.find({}).toArray()
    .then(response => data = res.status(200).json(response))
    .catch(error => console.log(error));
  });
})

// const data =  getdata();
// getdata().then(res => data = res);

// an example of getting data
// app.get("/",(req,res) => {
//   const collection = req.app.locals.collection;
//   collection.find({}).toArray()
//   .then(response => res.status(200).json(response))
//   .catch(error => console.log(error));
// });


app.get("/home",requireLogin,requireAdmin, (req,res) => {
  res.render('home')
});



//TODO: check if two passwords are the same
app.post('/register', async (req,res) => {
  const {username, useremail, password, usertype} = req.body;
  const user = new db_user({username,useremail,password,usertype})
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
  const foundUser = await db_user.findAndValidate(username,password);
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
  const foundUser = await db_user.findOne({id});
  res.render('profile',{db_user: foundUser});
})

app.get('/editprofile', async (req,res) => {
  const id = req.session.user_id;
  const foundUser = await db_user.findOne({id});
  res.render('editprofile',{User: foundUser});
})

app.post('/editprofile',async (req,res) => {
  console.log('woot');
  const id = req.session.user_id;
  const foundUser = await db_user.findOne({id});
  console.log(req.body);
  console.log('woot');
  
  const {newemail} = req.body;

  console.log(newemail);
  console.log('woot');

  res.redirect('profile')
  // foundUser.useremail = newemail;
  // User.updateOne(foundUser);
})


app.listen(port, hostname, () => {
    console.log("server started on port", port)
});