const Institute = require('../model/institute.model');
const schema = require('./service/joi');
const response = require('./service/response');

exports.addCourse = async (req, res, next) => {
    try{
    
        const branchId = req.params.branchId;
    
        const {error, value} = schema('addCourse').validate(req.body);
    
        if(!branchId || error) {
            if (error) { console.log(error) }
            const err = (error!=undefined) ? 
            new Error('Insufficient parameter provided'):new Error('Branch Id not provided');
            err.statusCode = 400;
            throw err;
        }
    
        const updatedInstitute = await Institute.findByIdAndUpdate(branchId, { $push: { course: req.body } }, { new: true });
    
        res.status(204).json({'course': updatedInstitute.course});
    } catch(error) {
        console.log(error);
        response(res, error.statusCode || 500, error.message);
    }
};

exports.deleteCourse = async (req, res, next) => {
    try {

        const courseInfo = req.query; // suppose to contain instituteId and courseId

        if(!courseInfo.instituteId || !courseInfo.courseId) {
            const error = new Error('Course Information not provided');
            error.statusCode = 400;
            throw error
        }

        Institute.findOneAndUpdate(
            { _id: courseInfo.instituteId },
            { $pull: { course: { _id: courseInfo.courseId} } },
            { new: true },
            function(err) {
                if (err) { throw err }
                res.status(200).send('Course Deleted Successfully')
            }
        )

    } catch(error) {
        console.log(error);
        response(res, error.statusCode || 500, error.message);
    }
};

exports.updateCourse = async (req, res, next) => {
    try {

        const courseInfo = req.query; // suppose to contain instituteId and courseId

        if(!courseInfo.instituteId || !courseInfo.courseId) {
            const error = new Error('Course Information not provided');
            error.statusCode = 400;
            throw error
        }

        await Institute.updateOne(
            {_id: courseInfo.instituteId, "course._id": courseInfo.courseId},
            {$set: req.body});

        res.status(200).send('Updatted successfully');

    } catch(error) {
        console.log(error);
        response(res, error.statusCode || 500, error.message);
    }
};

exports.getCourses = async (req, res, next) => {
    try {

        const branchId = req.params.branchId;
    
        if(!branchId) {
            const error = new Error('Branch Id not provided');
            error.statusCode = 400;
            throw error;
        }

        const courses = await Institute.findById(branchId, {course: 1, _id: 0});

        res.status(200).json(courses);
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

        const updatedInstitute = await Institute.findByIdAndUpdate(branchId, { $push: { batch: req.body } }, { new: true });

        res.status(204).json({ 'batch': updatedInstitute.batch });
    } catch(error) {
        console.log(error);
        response(res, error.statusCode || 500, error.message);
    }
};

exports.updateBatch = async (req, res, next) => {
    try {

        const batchInfo = req.query; // suppose to contain instituteId and batchId

        if(!batchInfo.instituteId || !batchInfo.batchId) {
            const error = new Error('Batch Information not provided');
            error.statusCode = 400;
            throw error
        }

        await Institute.updateOne(
            {_id: batchInfo.instituteId, "batch._id": batchInfo.batchId},
            {$set: req.body});

        res.status(200).send('Updatted successfully');

    } catch(error) {
        console.log(error);
        response(res, error.statusCode || 500, error.message);
    }
};

exports.deleteBatch = async (req, res, next) => {
    try {

        const batchInfo = req.query; // suppose to contain instituteId and batchId

        if(!batchInfo.instituteId || !batchInfo.batchId) {
            const error = new Error('Batch Information not provided');
            error.statusCode = 400;
            throw error
        }

        Institute.findOneAndUpdate(
            { _id: batchInfo.instituteId },
            { $pull: { batch: { _id: batchInfo.batchId} } },
            { new: true },
            function(err) {
                if (err) { throw err }
                res.status(200).send('Batch Deleted Successfully')
            }
        )

    } catch(error) {
        console.log(error);
        response(res, error.statusCode || 500, error.message);
    }
};

exports.getBatches = async (req, res, next) => {

    try {
        const branchId = req.params.branchId;
    
        if(!branchId) {
            const error = new Error('Branch Id not provided');
            error.statusCode = 400;
            throw error;
        }
    
        const batches = await Institute.findById(branchId, {batch: 1, _id: 0});
    
        res.status(200).json(batches);
    
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

        const updatedInstitute = await Institute.findByIdAndUpdate(branchId, { $push: { discount: req.body } }, { new: true });

        res.status(204).json({ 'discount': updatedInstitute.discount });
    } catch(error) {
        console.log(error);
        response(res, error.statusCode || 500, error.message);
    }
};

exports.updateDiscount = async (req, res, next) => {
    try {

        const discountInfo = req.query; // suppose to contain instituteId and discountId

        if(!discountInfo.instituteId || !discountInfo.discountId) {
            const error = new Error('Discount Information not provided');
            error.statusCode = 400;
            throw error
        }

        await Institute.updateOne(
            {_id: discountInfo.instituteId, "discount._id": discountInfo.batchId},
            {$set: req.body});

        res.status(200).send('Updatted successfully');

    } catch(error) {
        console.log(error);
        response(res, error.statusCode || 500, error.message);
    }
};

exports.deleteDiscount = async (req, res, next) => {
    try {

        const discountInfo = req.query; // suppose to contain instituteId and discountId

        if(!discountInfo.instituteId || !discountInfo.discountId) {
            const error = new Error('Discount Information not provided');
            error.statusCode = 400;
            throw error
        }

        Institute.findOneAndUpdate(
            { _id: discountInfo.instituteId },
            { $pull: { discount: { _id: discountInfo.discountId} } },
            { new: true },
            function(err) {
                if (err) { throw err }
                res.status(200).send('Discount Deleted Successfully')
            }
        )

    } catch(error) {
        console.log(error);
        response(res, error.statusCode || 500, error.message);
    }
};


exports.getDiscounts = async (req, res, next) => {

    try {
        const branchId = req.params.branchId;
    
        if(!branchId) {
            const error = new Error('Branch Id not provided');
            error.statusCode = 400;
            throw error;
        }
    
        const discounts = await Institute.findById(branchId, {discount: 1, _id: 0});
    
        res.status(200).json(discounts);
    
    } catch(error) {
        console.log(error);
        response(res, error.statusCode || 500, error.message);
    }
    };

