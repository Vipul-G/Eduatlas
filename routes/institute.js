const instituteRouter = require('express').Router();
const instituteController = require('../controller/institute');
const checkAuth = require('../middleware/checkAuth');
const checkPayment = require('../middleware/checkPayment');
const extractFile = require('../middleware/file');

instituteRouter.post('/addInstitute', checkAuth, checkPayment, extractFile, instituteController.addInstitute);
instituteRouter.get('/all', checkAuth, checkPayment, instituteController.getAllInstitutes);

module.exports = instituteRouter; 