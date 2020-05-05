const mongoose = require('mongoose');

const {user_role} = require('../clientStore');

// User registration schema
const userSchema = mongoose.Schema({

    name: {type: String, required: () => {
      return (this.role < 3) ? false : true;
    }},
    email:  {
        type: String,
        sparse: true,
        unique:true
    },
    phone: { type: Number, unique:true, set: parseNumber, required: [true, 'Phone is required'], minlength: 10, maxlength: 10 },

    password: { type: String, required: [true, 'Password is required'] },

    role : { type: Number,set: (value) => {
      if(typeof parseInt(value, 10) == 'number') {
        return parseInt(value, 10);
      }
      return user_role[value.toLowerCase()]
    }, required: [true, 'Role is required']},

    login: { type: Boolean, default: false }
}, {toJSON: {getters: true}, toObject: {getters: true}});
function parseNumber(value) {
    if(value == '') {
      return null
    }
    return parseInt(value);
  }

module.exports = mongoose.model('User', userSchema);

