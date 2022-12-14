const mongoose = require('mongoose');



const markerSchema = new mongoose.Schema({
    name: String,
    type:{
        type: String,
        enum:['geojson']
    },
    geometry: {
      type: {
        type: String, // Don't do `{ location: { type: String } }`
        enum: ['Point'], // 'location.type' must be 'Point'
        required: true
      },
      coordinates: {
        type: [Number],
        required: true
      }
    },
    properties:{
        title: {
            type: String
        },
        description: {
            type: String
        }
    },
    versionKey: false
});

markerSchema.statics.addmarker = async function(name,coordinates,description){
  

}


module.exports = mongoose.model('Marker', markerSchema);