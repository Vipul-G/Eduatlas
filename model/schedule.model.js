const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schedule schema
const scheduleSchema = new Schema({
    instituteId: {type: Schema.Types.ObjectId, ref: 'Institute', required: true},
    batchCode: {type: String},
    scheduleStart: {type: Date, required: false},
    scheduleEnd: {type: Date, required: false},
    topic: {type: String},
    teacher: {type: String},
    recurrence: {type: Boolean, default: false},
    letter: {type: String, default: 'pending'}
});

module.exports = mongoose.model('Schedule', scheduleSchema);