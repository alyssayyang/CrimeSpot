// Requiring modules
const express = require('express')
const db_user = require('./models/User')
const db_crimedata = require('./models/CrimeData')
const db_marker = require('./models/Marker')
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

const ObjectId = require('mongodb').ObjectId;

const requireLogin = (req, res, next) => {

    if (!req.session.user_id) {
        return res.redirect('/login')
    }
    next();
}

const requireAdmin = (req, res, next) => {
  const currentuser = req.session.user
  const id = req.session.user_id
  const type = req.session.usertype;
  console.log({currentuser})
  console.log({id})
  console.log({type})

  if(req.session.usertype != 'admin'){
    return res.send('requires admin access')
  }
  next();
}

app.get("/", async (req,res) =>  {


  
  res.render('register');
  // marker.save()
  //   .then((response) => {console.log("saved success")})
  //   .catch((error) => {
  //     console.log(error)
  //   })
  
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


app.get("/home",requireLogin,(req,res) => {
  res.render('home')
});


app.get('/register',(req,res)=>{
  res.render('register')
})

//TODO: check if two passwords are the same
app.post('/register', async (req,res) => {
  const {username, useremail, password, usertype} = req.body;

  const emailused = await db_user.validateEmail(useremail);
  if(emailused){
    res.render('login')
  }else{
    const user = new db_user({username,useremail,password,usertype})
    await user.save();
    req.session.user_id = user._id;
    req.session.usertype=user.usertype;
    res.render('home')
  }

})


app.get('/login', (req, res) => {
    res.render('login')
})

app.post('/login',async (req,res) => {
  const {useremail, password} = req.body;

  if(useremail == '' || password == '' ){
    // res.status(401).send();
    res.redirect('/login');
  }else{
    const emailused = await db_user.validateEmail(useremail);
    if(emailused){
      const foundUser = await db_user.findAndValidate(useremail,password);
      if(foundUser){
        req.session.user_id = foundUser._id;
        req.session.usertype=foundUser.usertype;
        // res.status(200).send();
        res.render('home');
      }else{
      //403 for incorrect password
      // res.status(403).send();
      res.redirect('/login');
      }
    }
    else{
      // res.status(401).send();
      res.redirect('/register')
    }
  }
})

app.get('/profile',requireLogin, async (req,res) => {
  const id = req.session.user_id;
  //find by object id
  const foundUser = await db_user.findOne(ObjectId(id));
  res.render('profile',{User: foundUser});
})

app.get('/editprofile', async (req,res) => {
  const id = req.session.user_id;
  console.log({id})
  const foundUser = await db_user.findOne(ObjectId(id));
  console.log({foundUser})
  res.render('editprofile',{User: foundUser});
})

app.post('/editprofile',async (req,res) => {

  const id = req.session.user_id;
  // const foundUser = await db_user.findOne(ObjectId(id));
  const {newname,newemail} = req.body;
  const updateUser = await db_user.findByIdAndUpdate({_id:id},{username:newname, useremail:newemail});
  console.log({updateUser})
  res.render('profile',{User: updateUser});
  // res.render('profile')
  // foundUser.useremail = newemail;
  // User.updateOne(foundUser);
})

app.get('/admin',requireAdmin,async(req,res) => {
  res.render('adminpage')
})

app.post('/admin', async(req,res) => {
  const{name,description,tx_coordinates} = req.body
  const coordinates=tx_coordinates.split(',')
  const marker = new db_marker
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
  await db_marker.create(marker);

  res.render('adminpage')
})


app.listen(port, hostname, () => {
    console.log("server started on port", port)
});