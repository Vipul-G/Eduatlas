const bcrypt = require('bcrypt');

const User = require('../model/user.model');
const jwt = require("jsonwebtoken");

const schema = require('../service/joi');
const response = require('../service/response');

const smsService = require('../service/sms');

const errorHandler = require('../service/errorHandler');
let newUser; // for create user api and otp varify api
const sms = require('../config').sms;
exports.creatUser = async (req, res, next) => {
  const {error, value} = schema('signup').validate(req.body, { abortEarly: true });

  if(error) {
    console.log(error);
    res.status(400).json({
      message: 'Insufficient parameters provided'
    }); 
    return;
  }

    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        req.body.password = hash;
        newUser = new User(req.body);
        response(res, 200, 'Varify OTP now')
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                message: 'Invalid authentication credentials!'
            });
        
    });
};


exports.loginUser = async (req, res, next) => {

  const { error, value } = schema('login').validate(req.body, {abortEarly: true});
  if(error) {
    console.log('Joi error - ', error);
    res.status(400).json({
      message: 'Wrong/Insufficient parameters provided'
    });
    return;
  }

    let fetchedUser;
  User.findOne({ phone: req.body.phone })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          message : 'Phone number not exists'
        });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      if (!result) {
        return res.status(401).json({
          message: 'Authentication failed'
        });
      }
      const token = jwt.sign({phone: fetchedUser.phone, userId: fetchedUser._id}, "specify jwt-key here");



      res.status(200).json({
        token,
        expiresIn: 3600,
        phone: fetchedUser.phone,
        userName: fetchedUser.name
      });
    })
    .catch(err => {
      console.log(err);
      return res.status(401).json({
        message: 'Invalid authentication credentials.'
      });
    });

}

exports.findUser = async (req, res) => {

  const phone = req.params.phone;

  if(!phone || (phone.toString().length != 10)) {
    res.status(400).json({ 'message': 'Wrong phone number' });
    return;
  }
  
  try {
    const user = await User.findOne({ phone: phone });
    res.status(200).json({"User": user});
  } catch(error) {
    console.log(error);
    res.status(500).json({ "message": error.message })
  }
}

function generateOTP() { 
  var digits = '0123456789'; 
  let OTP = ''; 
  for (let i = 0; i < 4; i++ ) { 
      OTP += digits[Math.floor(Math.random() * 10)]; 
  } 
  setTimeout(() => { sms.otp = -1 }, 60050);
  return OTP; 
} 
exports.sendOtp = async (req, res, next) => {
  try {

    const register = req.query.register;
    const phone = req.params.phone;

    if (!phone) {
      response(res, 400, 'Phone number not provided');
      return;
    }
    
    if(!register || register == false) {

      const user = await User.findOne({phone});

      if(!user) {
        response(res, 404, 'User not found with ' + phone);
        return;
      }

    } 
    
    sms.otp = '1234'//generateOTP();

    const smsRes = 'OTP send'//await smsService.sendSms(phone, 'Your OTP (One Time Password): ' + sms.otp); 

    response(res, 200, smsRes + ' to ' + phone);
  } catch(error) {
    console.log(error);
    response(res, 500, 'Internal server error');
  }
};

exports.resetPassword = async (req, res, next) => {

  try {
    const {error, value} = schema('resetPassword').validate(req.body);

    if (error) {
      console.log(error);
      const err = new Error('Wrong or Insufficient parameter provided');
      err.statusCode = 400;
      throw err;
    }
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        req.body.password = hash;
        return User.updateOne({phone : +req.body.phone}, {password : req.body.password});
        
     }).then((updatedUser) => {
      response(res, 200, 'Password updated successfully');
     }).catch(next);

    
  } catch(error) {
    errorHandler(error);
  }

}

exports.varyfyOTP = async (req, res, next) => {
  try {
  const type = req.query.varifyType;
  const isVarify = req.query.isVarify;
  const clientOTP = req.query.otp;
  
  if(!clientOTP || !type) {
    response(res, 400, 'Insufficient or Wrong parameters provided');
  }

  const otp = require('../config').sms.otp;
  if(otp < 0) {
      response(res, 400, 'OTP has not been generated yet');
      next(new Error('OTP has not been generated yet'));
  }
  else if(!clientOTP || otp == null) {
      (otp == null) ?
    response(res, 400, 'OTP Expired') :
    response(res, 400, 'OTP not provided');
      next(new Error('OTP Error'));
  }
  else if(otp !==clientOTP) {
      response(res, 400, 'Incorrect OTP');
      next(new Error('Incorrect OTP'));
  } 
  else if(otp ===clientOTP) {
      if(type == 'creatUser') {
        newUser.save().then((result) => {
          res.status(201).json({
            'message': 'User created',
            result
          }).catch(next);
        })
        return;
      } else if(type == 'forgotPassword') {
        if(isVarify == true) {
          response(res,200, 'OTP varified');
          return;
        }
        next();
        return;
      } else {
        response(res, 400, 'Varification type is not valid');
        return;
      }
  }
  else {
      next(new Error('Unknown OTP error'));
  }
} catch(error) {
  errorHandler(error, res);
}

};
// exports.deleteAllUsers = async (req, res, next) => {
//   await User.deleteMany({});
//   res.status(200).json({ 'message': 'All deleted' })
// }

// exports.getAllUsers = (req, res, next) => {
//   User.find().then(users => res.send(users));
// }