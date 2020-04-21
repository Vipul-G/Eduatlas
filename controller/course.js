const Institute = require('../model/institute.model');
const schema = require('./service/joi');
const response = require('./service/response');

exports.addCourse = async (req, res, next) => {
    try{
    
        const branchId = req.params.branchId;
    
        const {error, value} = schema('addCourse').validate(req.body);
    
        if(!branchId || error) {
            const error = error ? 
            new Error('Insufficient parameter provided'):new Error('Branch Id not provided');
            error.statusCode = 400;
            throw error;
        }
    
        const updatedInstitute = await Institute.findByIdAndUpdate(branchId, { $push: { course: req.body } }, { new: true });
    
        res.status(204).json({'course': updatedInstitute.course});
    } catch(error) {
        console.log(error);
        response(res, error.statusCode || 500, error.message);
    }
};

exports.addBatch = async (req, res, next) => {
    try {

        const branchId = req.params.branchId;
    
        const {error, value} = schema('addBatch').validate(req.body);
    
        if(!branchId || error) {
            const error = error ? 
            new Error('Insufficient parameter provided'):new Error('Branch Id not provided');
            error.statusCode = 400;
            throw error;
        }

        const updatedInstitute = await Institute.findByIdAndUpdate(branchId, { $set: { batch: req.body } }, { new: true });

        res.status(204).json({ 'batch': updatedInstitute.batch });
    } catch(error) {
        console.log(error);
        response(res, error.statusCode || 500, error.message);
    }
};

exports.addDiscount = async (req, res, next) => {
    try {

        const branchId = req.params.branchId;
    
        const {error, value} = schema('addDiscount').validate(req.body);
    
        if(!branchId || error) {
            const error = error ? 
            new Error('Insufficient parameter provided'):new Error('Branch Id not provided');
            error.statusCode = 400;
            throw error;
        }

        const updatedInstitute = await Institute.findByIdAndUpdate(branchId, { $set: { discount: req.body } }, { new: true });

        res.status(204).json({ 'discount': updatedInstitute.discount });
    } catch(error) {
        console.log(error);
        response(res, error.statusCode || 500, error.message);
    }
};

exports.getCourse = async (req, res, next) => {
    try {

        const branchId = req.params.branchId;
    
        if(!branchId) {
            const error = new Error('Branch Id not provided');
            error.statusCode = 400;
            throw error;
        }

        const courses = await Institute.findById(branchId, {course: 1, _id: 0});

        res.status(204).json(courses);
    } catch(error) {
        console.log(error);
        response(res, error.statusCode || 500, error.message);
    }
};

