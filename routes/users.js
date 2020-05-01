const express = require('express');
const authRouter = express.Router();
const checkOTP = require('../middleware/checkOTP');
const userConstroller = require('../controller/users');

authRouter.post('/signup', checkOTP, userConstroller.creatUser);

authRouter.post('/login', userConstroller.loginUser);

authRouter.get('/:phone', userConstroller.findUser);

authRouter.get('/sendOTP/:phone', userConstroller.sendOtp);

authRouter.patch('/resetPassword', checkOTP, userConstroller.resetPassword);


// authRouter.delete('', userConstroller.deleteAllUsers);

// authRouter.get('', userConstroller.getAllUsers);

module.exports = authRouter;
