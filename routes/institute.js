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

//@course Routes
instituteRouter.route('/course').all(checkAuth);

instituteRouter.post('/course/addCourse/:branchId', couseConroller.addCourse);
instituteRouter.post('/course/addBatch/:branchId', couseConroller.addBatch);
instituteRouter.post('/course/addDiscount/:branchId', couseConroller.addDiscount);

instituteRouter.get('/course/all/:branchId', couseConroller.getCourses);
instituteRouter.get('/course/batches/:branchId', couseConroller.getBatches);
instituteRouter.get('/course/discounts/:branchId', couseConroller.getDiscounts);

instituteRouter.patch('/course', couseConroller.updateCourse);
instituteRouter.patch('/course/batch', couseConroller.updateBatch);
instituteRouter.patch('/course/discount', couseConroller.updateDiscount);

instituteRouter.delete('/course', couseConroller.deleteCourse);
instituteRouter.delete('/course/batch', couseConroller.deleteBatch);
instituteRouter.delete('/course/discount', couseConroller.deleteDiscount);


module.exports = instituteRouter; 