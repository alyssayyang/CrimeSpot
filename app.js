// Requiring modules
const express = require('express')
const User = require('./models/User')

const Marker = require('./models/Marker')
const bodyParser = require('body-parser')
const session = require('express-session')

const app = express()
const path = require('path')
const ejsMate = require('ejs-mate')
// const {render} = require('ejs')
// const { collection } = require('./models/User')
// const { ppid } = require('process')


//my computer's router address
const hostname = 'localhost'
const port = 3000


app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use("/static", express.static('./static/'))

app.use(express.static(__dirname + 'public'))
app.use(express.urlencoded({ extended:true }));
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());
app.use(session({ secret: 'customized secret' }))

const api = require('./routes/api.js')
app.use('/api',api)

const userRoutes = require('./routes/user');

//adding passport
const flash = require('connect-flash');
const LocalStrategy = require('passport-local');
const passport = require('passport')
const { initialize } = require('passport');

const sessionConfig = {
  secret: 'this',
  resave: false,
  saveUninitialized: true,
  cookie:{
      httpOnly: true,
      expires: Date.now() + 1000 * 60 * 60 * 24, // one day
      maxAge: 1000 * 60 * 60 * 24
  }
}

app.use(session(sessionConfig)); // must be used before passport session
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()); // how to store user in the session
passport.deserializeUser(User.deserializeUser());

const {isLoggedIn, isAdmin} = require('./middleware');


app.use((req,res,next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success'); // global
  res.locals.error = req.flash('error'); // global
  next();
})
//passport end

const ObjectId = require('mongodb').ObjectId;


app.use('/', userRoutes);

app.get('/',isLoggedIn,(req,res) => {
  res.render('home')
})

app.get('/getcrime',isLoggedIn,(req,res) => {
  MongoClient.connect(myurl)
    .then(client =>{
    const db = client.db('crimespot');
    const collection = db.collection('crimedata');
    collection.find({}).toArray()
    .then(response => data = res.status(200).json(response))
    .catch(error => console.log(error));
  });
})


app.get("/home",isLoggedIn,(req,res) => {
  res.render('home')
});

app.get('/admin',isAdmin,async(req,res) => {
  res.render('adminpage')
})

app.post('/admin', async(req,res) => {
  const{name,description,tx_coordinates} = req.body
  const coordinates=tx_coordinates.split(',')
  const marker = new Marker
  (
    {
    type: "geojson",
    geometry: 
    {
      type: "Point",
      coordinates: coordinates
    },
    properties:
    {
      description: description,
      title: name
    }
    }
  )
  await Marker.create(marker);

  res.render('adminpage')
})

app.all('*', (req, res, next) => {
  next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
  const {statusCode = 500, message = 'something went wrong'} = err;
  if (!err.message) err.message = 'Oh No, Something Went Wrong!'
  res.status(statusCode).render('error', { err })
}) 



app.listen(port, hostname, () => {
    console.log("server started on port", port)
});