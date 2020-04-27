const Institute = require('../model/institute.model');
const Student = require('../model/student.model');
const schema = require('./service/joi');
const response = require('./service/response');
const fs = require('fs');

function deleteImage({filename}) {
    fs.unlink(__dirname + "/../images/" + filename, (error) => {
        if(error) {
            console.log(error);
            const err = new Error('Error while deleting the image');
            err.statusCode = 500;
            throw err;
        }
        console.log('File Deleted successfully');
    }); 
}

exports.addInstitute = async (req, res, next) => {
    let image;
    try {
        req.body.basicInfo = JSON.parse(req.body.basicInfo);
        req.body.address = JSON.parse(req.body.address);
        req.body.category = JSON.parse(req.body.category);
        req.body.metaTag = JSON.parse(req.body.metaTag);
        console.log('MULTER',req.file);
        image = {
            filename : req.file.filename,
            encoding: req.file.encoding
        }
        delete req.body.logo;
        const {error, value} = schema('addInstitute').validate(req.body);
        if(error) { 
            console.log(error);
            const err = new Error('Insufficiant/wrong parameter provided');
            err.statusCode = 400;
            throw err;
        }
        let institute;

        if(!req.user.phone) {
            throw new Error('req.user.phone is empty');
        }

        const tempObj = Object.assign({}, req.body);
        tempObj.userPhone = req.user.phone;
        
        institute = new Institute;

        institute.basicInfo = Object.assign({}, req.body.basicInfo); 
        institute.basicInfo.logo.data = fs.readFileSync(__dirname + "/../images/" + image.filename);
        institute.basicInfo.logo.contentType = 'image/png'; 

        institute.address = Object.assign({}, req.body.address);

        institute.category = req.body.category;

        institute.metaTag = req.body.metaTag;

        institute.userPhone = req.user.phone;

        await institute.save();

        deleteImage(image);

        response(res, 201, 'Institute added successfully');

    } catch(error) {
        console.log(error, req.body);
        deleteImage(image);
        response(res, error.statusCode || 500, error.message);
    }

};

exports.deleteInstitute = async (req, res, next) => {

    try {
        const id = req.params.id;
        if(!id) {
            return response(res, 400, 'Intitute Id not provided');
        }
        await Institute.findByIdAndDelete(id);
        response(res, 202, 'Institute deleted successfully'); 
    } catch(error) {
        console.log(error);
        response(res, 500, 'Internal Server Error while performing Deletion');
    }

}

exports.getOneInstitute = async (req, res, next) => {
    try {
        if (!req.params.id) {
            response(res, 400, 'Institute id is required');
            return;
        }
        const institute = await Institute.findById(req.params.id);
        res.status(200).json({ institute });

    } catch(error) {
        console.log(error);
        response(res, 500, 'Internal server error while getting institute')
    }
}

exports.getAllInstitutes = async (req, res, next) => {
    try {
        const institutes = await Institute.find({ userPhone: req.user.phone });
       
        res.status(200).json({
            'institutes': institutes
        })
    } catch(error) {
        console.log(error);
        response(res, 500, error.message);
    }

}

exports.updateInstitute = async (req, res, next) => {

try {

    if (!req.params.id) {
        response(res, 400, 'Institute id not provided');
        const err = new Error('Institute id not provided');
        err.statusCode = 400;
        throw err;
    }

    const id = req.params.id;


    const updatedInstitute = await Institute.findByIdAndUpdate(id, { $set: req.body }, { new: true });

    res.status(201).json({updatedInstitute});

} catch(error) {
    console.log(error);
    response(res, error.statusCode||500, error.message);
}

};

exports.makeAnouncement = async (req, res, next) => {

    try {

        const instituteIds = req.body.instituteIds;
        const studentEmails = req.body.studentEmails;

        if(!instituteIds && !studentEmails) {
            const err = new Error('Institude ids or student Emails not provided');
            err.statusCode = 400;
            throw err;
        }

        if (instituteIds && instituteIds.length) {
            Student.updateMany({instituteId: {$in: instituteIds}}, {
                $set: {anouncement: req.body.anouncement}
            });
        }

        if (studentEmails && studentEmails.length) {
            Student.updateMany({"basicDetails.email": {$in: instituteIds}}, {
               $setOnInsert: { anouncement: req.body.anouncement}
            });
        }
      

    } catch(error) {
        console.log(error);
        response(res, error.statusCode||500, error.message);
    }

};
