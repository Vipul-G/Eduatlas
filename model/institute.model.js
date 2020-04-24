const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courseSchema = new Schema({
  name: {type: String, required: 'Branch name is requires', lowercase: true},
  code: {type: Number, unique: true, set: parseNumber},
  fees: {type: Number, set: parseNumber},
  discription: {type: String, default: ''},
  gst: { 
      type: String,
      enum: ['inclusive', 'exclusive'],
      default: 'exclusive'
  },
  totalFee: {type: Number, set: parseNumber}
});

const batchSchema = new Schema({
  course: {type: String, required: true},
  code: {type: String, required: true},
  description: {type: String}
});

const discountSchema = new Schema({
  code: {type: Number, set: parseNumber},
  description: {type: String},
  amount: {type: Number, set: parseNumber}
})

const recieptConfigSchema = new Schema({
  businessName: { type: String },

  address: {type: String, required: false},

  gstNumber: { type: Number, set: parseNumber },

  termsAndCondition: { type: String, required: false },

  fee: { type: String, enum: ['Collection Basis', 'Course Fee Basis'] }


}, {_id: false});

const instituteSchemsa = new Schema({
    basicInfo: new Schema({
        logo:  { data: Buffer, contentType: String},
        name: { type: String, required: [true, 'Institute name is required'] },
        instituteContact: { type: Number, required: [true, 'Phone is required'] },
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

    batch: {type: [batchSchema], default: []},

    discount: { type: [discountSchema], default: [] },

    reciept: { type: recieptConfigSchema, default: null }


});

function parseNumber(value) {
  if(value == '') {
    return null
  }
  return parseInt(value);
}

module.exports = mongoose.model('Institute', instituteSchemsa);