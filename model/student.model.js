const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const studentSchema = new Schema({

    instituteId : { type: String, require: 'Institude Id not provided', ref: 'Institute' },

    basicDetails : new Schema({

        name: { type: String, required: 'Name is required' },
        rollNumber: { type: String, required: 'Roll number is required' },
        email: { type: String, required: 'email is required'},
        studentContact: { type: Number, get: parseString,set: parseNumber,  required: [true, 'student contact required'] }

    }, {_id: false, toJSON: {getters: true}, toObject: {getters: true}}),

    parentDetails : new Schema({

        name: { type: String, lowercase: true, default: '' },
        parentContact: { type: Number, get: parseString,set: parseNumber, required: false },
        email: { type: String, default: '' },
        address: { type: String, default: '' },

    }, {_id: false, toJSON: {getters: true}, toObject: {getters: true}}),

    courseDetails : new Schema({

        course: { type: String, default: '' },
        batch: { type: String, default: '' },
        discount: { type: Number, get: parseString,set: parseNumber,  required: false },
        additionalDiscount: { type: Number, get: parseString,set: parseNumber, required: false },
        nextPayble: { type: String, default: '' },

    }, {_id: false, toJSON: {getters: true}, toObject: {getters: true}}),

    fee: new Schema({
        installmentNumber: { type: Number, get: parseString,set: parseNumber , required: false },
        nextInstallment: { type: Number, get: parseString,set: parseNumber, required: false },
        amountCollected: { type: Number, get: parseString,set: parseNumber, required: false },
        mode: { type: String, required: false }
    }, {_id: false, toJSON: {getters: true}, toObject: {getters: true}}),

    active: {type: Boolean, default: false}

}, {toJSON: {getters: true}, toObject: {getters: true}});

function parseNumber(value) {
    if(value == '' || value == null) {
      return null
    }
    return parseInt(value);
  }

function parseString(value) {
    if(value == null) {
        return '';
    }
    return value.toString();
}

module.exports = mongoose.model('Student', studentSchema);