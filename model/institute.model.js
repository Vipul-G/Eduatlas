const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const instituteSchemsa = new Schema({
    basicInfo: new Schema({
        logo:  { data: Buffer, contentType: String},
        name: { type: String, required: [true, 'Institute name is required'] },
        contactNumber: { type: Number, required: [true, 'Phone is required'] },
    }),

    address: new Schema({
        addressLine: { type: String },
        locality: { type: String },
        state: { type: String},
        city: { type: String },
        pin: { type: Number }
    }),

    location: {
        type: {
          type: String,
          enum: ['Point'],
          default: 'Point'
        },
        coordinates: {
          type: [Number],
          default: [0,0]
        }
    },

    category: [String],

    metaTag: [String]

});

module.exports = mongoose.model('Institute', instituteSchemsa);