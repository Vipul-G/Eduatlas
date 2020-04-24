const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const studentSchema = new Schema({

    instituteId : { type: Schema.Types.ObjectId, require: 'Institude Id not provided', ref: 'Institute' },

    basicDetails : new Schema({

        name: { type: String, required: 'Name is required' },
        rollNumber: { type: String, required: 'Roll number is required' },
        email: { type: String, required: 'email is required'},
        studentContact: { type: Number, set: parseNumber, required: false }

    }, {_id: false}),

    parentDetails : new Schema({

        name: { type: String, required: false, lowercase: true },
        parentContact: { type: Number, set: parseNumber, required: false },
        email: { type: String, required: false },
        address: { type: String, required: false },

    }, {_id: false}),

    courseDetails : new Schema({

        course: { type: String, required: false },
        batch: { type: String, required: false },
        discount: { type: Number, set: parseNumber, required: false },
        additionalDiscount: { type: Number, set: parseNumber, required: false },
        nextPayble: { type: String, required: false },

    }, {_id: false}),

    fee: new Schema({
        installmentNumber: { type: Number, set: parseNumber ,required: false },
        nextInstallment: { type: Number, set: parseNumber, required: false },
        amountCollected: { type: Number, set: parseNumber, required: false },
        mode: { type: String, required: false }
    }, {_id: false}),

    active: {type: Boolean, default: false}

});

function parseNumber(value) {
    if(value == '') {
      return null
    }
    return parseInt(value);
  }

module.exports = mongoose.model('Student', studentSchema);