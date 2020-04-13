const bcrypt = require('bcrypt');

const User = require('../model/user.model');
const jwt = require("jsonwebtoken");

const schema = require('./service/joi');


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
      console.log('fetchUser pass -', typeof user.password, 'req.body.pass -', typeof req.body.password);
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      console.log('RESULT-', result);
      if (!result) {
        return res.status(401).json({
          message: 'Authentication failed'
        });
      }
      const token = jwt.sign({phone: fetchedUser.phone, userId: fetchedUser._id},
                      process.env.JWT_KEY, // specify jwt key in nodemon.json confige file in root directory
                      { expiresIn: "1h"  } // login session will expire in 1 hour
                            );
      res.status(200).json({
        token,
        expiresIn: 3600,
        phone: fetchedUser.phone
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

exports.deleteAllUsers = async (req, res, next) => {
  await User.deleteMany({});
  res.status(200).json({ 'message': 'All deleted' })
}

exports.getAllUsers = (req, res, next) => {
  User.find().then(users => res.send(users));
}