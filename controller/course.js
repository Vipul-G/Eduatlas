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

exports.getCourse = async (req, res, next) => {

    try {

        const courseInfo = req.query; // suppose to contain instituteId and courseId

        if(!courseInfo.instituteId || !courseInfo.courseId) {
            const error = new Error('Course Information not provided');
            error.statusCode = 400;
            throw error
        }

        let course = await Institute.findOne({ _id: courseInfo.instituteId }, {course: 1, _id: 0});
        course = course.course;
        course = course.filter((c) => c._id == courseInfo.courseId);

        res.status(200).json(course);

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

exports.getBatche = async (req, res, next) => {
    try {

        const batchInfo = req.query; // suppose to contain instituteId and batchId

        if(!batchInfo.instituteId || !batchInfo.courseId) {
            const error = new Error('Batch Information not provided');
            error.statusCode = 400;
            throw error
        }

        let batch = await Institute.find({_id: batchInfo.instituteId}, {batch: 1, _id: 0});
        batch = batch.batch;
        batch = batch.filter((b) => b._id == batchInfo.batchId);

        res.status(200).json(batch);

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
            if(error) {
                console.log(error);
            }
            const err = error ? 
            new Error('Insufficient parameter provided'):new Error('Branch Id not provided');
            err.statusCode = 400;
            throw err;
        }

        const updatedInstitute = await Institute.findByIdAndUpdate(branchId, { $push: { discount: req.body } }, { new: true });

        res.status(201).json({ 'discount': updatedInstitute });
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

exports.getDiscount = async (req, res, next) => {
    try {

        const discountInfo = req.query; // suppose to contain instituteId and discountId

        if(!discountInfo.instituteId || !discountInfo.discountId) {
            const error = new Error('discount Information not provided');
            error.statusCode = 400;
            throw error
        }

        let discount = await Institute.find({_id: discountInfo.discountId}, {discount: 1, _id: 0});

        discount = discount.discount;

        discount = discount.filter(d => d._id == discountInfo.discountId);

        res.status(200).json(discount);

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

exports.addReciept = async (req, res, next) => {

try {

    const branchId = req.params.branchId;

    const {error, value} = schema('addReciept').validate(req.body);

    if(!branchId || error) {
        let err;
        if(error) {
            console.log(error);
            err = new Error('Insufficiant/Wrong parameters provided');
        }
        err = new Error('Institute Id not provided');
        err.statusCode = 400;
        throw err;
    }

    const updatedInst = await Institute.updateOne({_id: branchId},
        {$set: {reciept: req.body}});

    res.status(201).json(updatedInst);

} catch(error) {
    console.log(error);
    response(res, error.statusCode || 500, error.message)
}

};

exports.updateReciept = async (req, res, next) => {
try {

    const recieptInfo = req.query; // suppose to contain instituteId and recieptId

    if(!recieptInfo.instituteId || !recieptInfo.recieptId) {
        const error = new Error('reciept Information not provided');
        error.statusCode = 400;
        throw error
    }

    await Institute.updateOne(
        {_id: recieptInfo.instituteId},
        {$set: {reciept: req.body}});

    res.status(200).json({'message':'Updatted successfully'});

} catch(error) {
    console.log(error);
    response(res, error.statusCode || 500, error.message)
}


};

exports.getReciept = async (req, res, next) => {

    try {
        const branchId = req.params.branchId;
    
        if(!branchId) {
            const error = new Error('Branch Id not provided');
            error.statusCode = 400;
            throw error;
        }
    
        const reciept = await Institute.findById(branchId, {reciept: 1, _id: 0});
    
        res.status(200).json(reciept);
    
    } catch(error) {
        console.log(error);
        response(res, error.statusCode || 500, error.message);
    }

}

exports.deleteReciept = async (req, res, next) => {
    try {

        const recieptInfo = req.query; // suppose to contain instituteId and recieptId

        if(!recieptInfo.instituteId || !recieptInfo.recieptId) {
            const error = new Error('Reciept Information not provided');
            error.statusCode = 400;
            throw error
        }

        Institute.findOneAndUpdate(
            { _id: recieptInfo.instituteId },
            { $set: { reciept: null }},
            { new: true },
            function(err) {
                if (err) { throw err }
                res.status(200).json({'message':'Discount Deleted Successfully'})
            }
        )

    }catch(error) {
        console.log(error);
        response(res, error.statusCode || 500, error.message)
    }
};

