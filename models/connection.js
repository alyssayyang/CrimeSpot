
const MongoClient = require('mongodb').MongoClient

class Connection {

    static async open() {
        MongoClient.connect("mongodb://127.0.0.1:27017/crimespot",(err,db) => {
        if(err){
            console.log(err);
        }else{
            var dbo = db.db('crimespot');
            var file = dbo.collection('crimedata').find({}).toArray(function(err, result) {
                    if (err) throw err;
                    //console.log(result[2].crimetype);
                    return result;
                    db.close();
                  });
            console.log(file);
            console.log("connection single skelton db connect success");
    }
});
    }

}

Connection.db = null
Connection.url = "mongodb://127.0.0.1:27017/crimespot"
Connection.options = {
    // bufferMaxEntries:   0,
    // reconnectTries:     5000,
    // useNewUrlParser:    true,
    // useUnifiedTopology: true,
}

module.exports = { Connection }