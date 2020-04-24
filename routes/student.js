const checkAuth = require('../middleware/checkAuth');

const studentRouter = require('express').Router({caseSensitive: true})
const studentController = require('../controller/student');

studentRouter.post('/add', checkAuth, studentController.addStudent);

studentRouter.get('/all/:instituteId', checkAuth, studentController.getAllStudents);
studentRouter.get('', checkAuth, studentController.getOneStudent);

studentRouter.put('', checkAuth, studentController.updateStudent);

studentRouter.delete('', checkAuth, studentController.deleteStudent);



module.exports = studentRouter;