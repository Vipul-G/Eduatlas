const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const studentSchema = new Schema({

    instituteId : { type: String, require: 'Institude Id not provided', ref: 'Institute' },

    basicDetails : new Schema({

        name: { type: String, required: 'Name is required' },
        rollNumber: { type: String, required: 'Roll number is required' },
        email: { type: String, required: false},
        contactNumber: { type: Number, required: 'Student contact is required', unique: true }

    }, {_id: false}),

    parentDetails : new Schema({

        name: { type: String, required: false, lowercase: true },
        contactNumber: { type: Number, required: false },
        email: { type: String, required: false },
        address: { type: String, required: false },

    }, {_id: false}),

    courseDetails : new Schema({

        course: { type: String, required: false },
        batch: { type: String, required: false },
        discount: { type: Number, required: false },
        additionalDiscount: { type: Number, required: false },
        nextPayble: { type: Date, required: false },

    }, {_id: false}),

    fees: new Schema({
        installmentNumber: { type: Number, required: false },
        nextInstallment: { type: Number, required: false },
        amountCollected: { type: Number, required: false },
        mode: { type: String, required: false }
    }, {_id: false})

});

module.exports = mongoose.model('Student', studentSchema);