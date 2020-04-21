const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courseSchema = new Schema({
  name: {type: String, required: 'Branch name is requires', lowercase: true},
  code: {type: Number, unique: true, set: parseNumber},
  fee: {type: Number, set: parseNumber},
  gst: { 
      type: String,
      enum: ['inclusive', 'exclusive'],
      default: 'exclusive'
  },
  totalfee: {type: Number, set: parseNumber}
});

const batchSchema = new Schema({
  courseId: {type: mongoose.Types.ObjectId, ref: "Institute.course"},
  code: {type: String, unique: true},
  description: {type: String}
}, {_id: false});

const discountSchema = new Schema({
  code: {type: Number, set: parseNumber},
  description: {type: String},
  amount: {type: Number, set: parseNumber}
}, {_id: false})

const instituteSchemsa = new Schema({
    basicInfo: new Schema({
        logo:  { data: Buffer, contentType: String},
        name: { type: String, required: [true, 'Institute name is required'] },
        contactNumber: { type: Number, required: [true, 'Phone is required'] },
    }, {_id: false}),

    address: new Schema({
        addressLine: { type: String },
        locality: { type: String },
        state: { type: String},
        city: { type: String },
        pin: { type: Number }
    }, {_id: false}),

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

    metaTag: [String],

    userPhone: { type: Number, required: [true, 'User phone is require for aggregation'] },

    course : {type: [courseSchema], default: []},

    batch: {type: batchSchema, default: undefined},

    discount: { type: discountSchema, default: undefined }


});

function parseNumber(value) {
  if(value == '') {
    return null
  }
  return parseInt(value);
}

module.exports = mongoose.model('Institute', instituteSchemsa);