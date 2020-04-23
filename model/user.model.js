const mongoose = require('mongoose');


const userSchema = mongoose.Schema({

    name: { type: String, required: [true, 'Name is required'] },
    email:  {
        type: String,
        unique:true,
        required: 'Please enter your email',
        trim: true,
        lowercase:true
    },
    phone: { type: Number, required: [true, 'Phone is required'], minlength: 10, maxlength: 10 },
    password: { type: String, required: [true, 'Password is required'] },
    role : { type: String, uppercase: true, required: [true, 'Role is required'] }
});

module.exports = mongoose.model('User', userSchema);
