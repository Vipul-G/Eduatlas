const instituteRouter = require('express').Router();
const instituteController = require('../controller/institute');
const couseConroller = require('../controller/course');
const checkAuth = require('../middleware/checkAuth');
const checkPayment = require('../middleware/checkPayment');
const extractFile = require('../middleware/file');

instituteRouter.post('/addInstitute', checkAuth, checkPayment, extractFile, instituteController.addInstitute);
instituteRouter.get('/all', checkAuth, checkPayment, instituteController.getAllInstitutes);
instituteRouter.delete('/:id', checkAuth, instituteController.deleteInstitute);
instituteRouter.get('/oneInstitute/:id', checkAuth, instituteController.getOneInstitute);
instituteRouter.put('/updateInstitute/:id', checkAuth, instituteController.updateInstitute);

instituteRouter.route('/course').all(checkAuth);
instituteRouter.post('/course/addCourse', couseConroller.addCourse);
instituteRouter.post('/course/addBatch', couseConroller.addBatch);
instituteRouter.post('/course/addDiscount', couseConroller.addDiscount);
module.exports = instituteRouter; 