const checkAuth = require('../middleware/checkAuth');

const studentRouter = require('express').Router({caseSensitive: true})
const studentController = require('../controller/student');

studentRouter.post('/add', checkAuth, studentController.addStudent);

studentRouter.get('/all', checkAuth, studentController.getAllStudents);

studentRouter.put('/:id', checkAuth, studentController.updateStudent);

studentRouter.delete('/:id', checkAuth, studentController.deleteStudent);



module.exports = studentRouter;