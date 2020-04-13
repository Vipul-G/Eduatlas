const express = require('express');
const authRouter = express.Router();

const userConstroller = require('../controller/users');

/* 
* @POST
* create new users. 
*/
authRouter.post('/signup', userConstroller.creatUser);

/* 
* @POST 
* login users. 
*/
authRouter.post('/login', userConstroller.loginUser);

/* 
* @GET
* get user. 
*/
authRouter.get('/:phone', userConstroller.findUser);

// authRouter.delete('', userConstroller.deleteAllUsers);

// authRouter.get('', userConstroller.getAllUsers);

module.exports = authRouter;
