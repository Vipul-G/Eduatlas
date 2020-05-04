const express = require('express');
const authRouter = express.Router();
const checkOTP = require('../middleware/checkOTP');
const userConstroller = require('../controller/users');

authRouter.post('/signup', userConstroller.creatUser);

authRouter.post('/login', userConstroller.loginUser);

authRouter.get('/varifyOTP', userConstroller.varyfyOTP);

authRouter.get('/:phone', userConstroller.findUser);

authRouter.get('/sendOTP/:phone', userConstroller.sendOtp);

authRouter.patch('/resetPassword', userConstroller.varyfyOTP , userConstroller.resetPassword);


// authRouter.delete('', userConstroller.deleteAllUsers);

// authRouter.get('', userConstroller.getAllUsers);

module.exports = authRouter;
