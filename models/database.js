

mongoose = require('mongoose')
mongoose.set('strictQuery', false);

// const MongoClient = require('mongodb').MongoClient
const myurl = "mongodb://127.0.0.1:27017/crimespot"
// const myurl = "mongodb://0.0.0.0:27017/crimespot"


mongoose.connect(myurl)
const database = mongoose.connection;


//database.on means it will connect to the database, and throws any error if the connection fails
database.on('error',(error) => {
  console.log(error)
})

//database.once means it will run only one time. If it is successful, it will show a message that says Database Connected.
database.once('connected',() => {
  console.log('database connected')
})

function get(){
    
}


