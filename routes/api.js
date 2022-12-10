const express = require('express');
const router = express.Router();
const Model = require('../models/CrimeData')

// const database= require('../models/database')

let MongoClient = require('mongodb').MongoClient;
const myurl = "mongodb://127.0.0.1:27017/crimespot"


router.get('/getAll', async (req,res) => {
    try{
        MongoClient.connect(myurl,function(err,db){
            if(err) throw err;
            var dbo = db.db('crimespot');
            dbo.collection('crimedata').find({}).toArray()
            .then(response => res.status(200).json(response))
            .catch(error => console.log(error));
        })

    }catch(error){
        res.status(500).json({message:error})
    }
})

router.get('/getOne/:id',async (req,res) => {
    try{
        res.render('getone')
    }catch(error){
        res.status(500).json({message: error})
    }
})

router.post('/post',async (req,res) => {
    const data = new Model({
        crimetype: req.body.crimetype,
        code: req.body.code,
        year: req.body.year,
        crimerate: req.body.crimerate
    })

    try{
        const dataToSave =  await data.save()
        res.status(200).json(dataToSave)
    }
    catch(error){
        res.status(400).json({message: error.message})
    }
})

router.patch('/patch/:id',async (req,res) => {
    try {
        const id = req.params.id;
        const dataToUpdate = req.body;
        const options = { new : true}
        const result = await Model.findByIdAndUpdate(id,dataToUpdate,options)
        
        res.send(result)
    }catch(error){
        res.status(400).json({message: error.message})
    }
})

router.delete('/delete/:id',(req,res) => {
    try{
        Model.findByIdAndDelete(req.params.id)
        res.send(`${req.body.name} has been deleted`)
    }
    catch(error){
        res.status(400).json({message: error.message})
    }
})


module.exports = router;