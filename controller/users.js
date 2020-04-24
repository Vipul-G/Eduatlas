const bcrypt = require('bcrypt');

const User = require('../model/user.model');
const jwt = require("jsonwebtoken");

const schema = require('./service/joi');
const response = require('./service/response');

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
        const user = new User(req.body);
        user.save().then(result => {
            res.status(201).json({
                message: 'User created',
                result
            });
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                message: 'Invalid authentication credentials!'
            });
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


exports.sendOtp = async (req, res, next) => {
  try {

    if (!req.body.phone) {
      response(res, 400, 'Phone number not provided');
      return;
    }
    const phone = req.body.phone;

    const user = await User.findOne({phone})

    if(!user) {
      response(res, 404, 'User not found');
      return;
    }
    exports.otp = 1234;
    response(res, 200, 'OTP has been send to ' + phone);
  } catch(error) {
    console.log(error);
    response(res, 500, 'Internal server error');
  }
};

// exports.forgotPassword = async (req, res, next) => {

//   if(!req.body.otp) {
//     response(res, 400, 'No OTP provided')
//   }

//   if (req.body.otp === otp) {
//     response(res, 200, 'OTP validation successfull')
//   } else {
//     response(res, 404, ' OTP validation failed')
//   }

// }

exports.resetPassword = async (req, res, next) => {

  try {
    const {error, value} = schema('resetPassword').validate(req.body);

    if (error) {
      response(res, 400, 'Wrong/Insufficient parameters provided');
      return;
    }

    const updatedUser = await User.updateOne({phone : req.body.phone}, {password : req.body.password});

    if(updatedUser) {
      response(res, 201, 'User updated successfully');
    }


  } catch(error) {
    console.log(error);
    response(res, 500, 'Internal Server error');
  }

}



// exports.deleteAllUsers = async (req, res, next) => {
//   await User.deleteMany({});
//   res.status(200).json({ 'message': 'All deleted' })
// }

// exports.getAllUsers = (req, res, next) => {
//   User.find().then(users => res.send(users));
// }