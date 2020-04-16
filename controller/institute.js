const joi = require('@hapi/joi');

const Institute = require('../model/institute.model');

const schema = require('./service/joi');
const response = require('./service/response');
const fs = require('fs');
exports.addInstitute = async (req, res, next) => {
    try {
        req.body.basicInfo = JSON.parse(req.body.basicInfo);
        req.body.address = JSON.parse(req.body.address);
        req.body.category = JSON.parse(req.body.category);
        req.body.metaTag = JSON.parse(req.body.metaTag);
        console.log('MULTER',req.file);
        const image = {
            filename : req.file.filename,
            encoding: req.file.encoding
        }
        delete req.body.logo;
        const {error, value} = schema('addInstitute').validate(req.body);
        if(error) { 
            console.log(error);
            res.status(400).json({
             message: 'Insufficient/Wrong parameters provided'
            });
            return;
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

        fs.unlink(__dirname + "/../images/" + image.filename, (error) => {
            if(error) {
                console.log(error);
                const err = new Error('Error while deleting the image');
                err.statusCode = 500;
                throw err;
            }
            console.log('File Deleted successfully');
        });

        response(res, 201, 'Institute added successfully');

    } catch(error) {
        console.log(error, req.body);
        response(res, 500, 'Internal server error')
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

        console.log('get req hit')
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
        return;
    }

    const id = req.params.id;

    const updatedInstitute = await Institute.updateOne({ _id : id }, { $set: req.body }, { new: true });

    res.status(201).json({updatedInstitute});

} catch(error) {
    console.log(error);
    response(res, 500, 'Internal server error while updating the institutes');
}

};
