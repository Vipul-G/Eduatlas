const checkAuth = require('../middleware/checkAuth');

const studentRouter = require('express').Router({caseSensitive: true})
const studentController = require('../controller/student');

studentRouter.post('/add', checkAuth, studentController.addStudent);


module.exports = studentRouter;