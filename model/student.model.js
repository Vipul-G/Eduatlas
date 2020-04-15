const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const studentSchema = new Schema({

    instituteId : { type: Schema.Types.ObjectId, require: 'Institude Id not provided' },

    basicDetails : new Schema({

        name: { type: String, required: 'Name is required' },
        rollNumber: { type: String, required: 'Roll number is required' },
        email: { type: String, required: false, unique: true },
        contactNumber: { type: Number, required: 'Student contact is required', unique: true }

    }, {id: false, }),

    parentDetails : new Schema({

        name: { type: String, required: 'Parent name is required', lowercase: true },
        contactNumber: { type: Number, required: 'Parent contact is required', unique: true },
        email: { type: String, required: false, unique: true },
        address: { type: String, required: false },

    }, {_id: false}),

    courseDetails : new Schema({

        course: { type: String, required: 'Course is required' },
        batch: { type: String, required: false },
        discount: { type: Number, required: false },
        additionalDiscount: { type: Number, required: false },
        nextPayble: { type: Date, required: false },

    }, {id: false}),

    fees: new Schema({
        installmentNumber: { type: Number, required: false },
        nextInstallment: { type: Number, required: false },
        amountCollected: { type: Number, required: false },
        mode: { type: String, required: false }
    }, {id: false})

});

module.exports = mongoose.model('Student', studentSchema);