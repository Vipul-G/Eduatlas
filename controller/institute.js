const joi = require('@hapi/joi');

const Institute = require('../model/institute.model');

const schema = require('./service/joi');
const response = require('./service/response');

exports.addInstitute = async (req, res, next) => {
    try {
        req.body.basicInfo = JSON.parse(req.body.basicInfo);
        req.body.address = JSON.parse(req.body.address);
        req.body.category = JSON.parse(req.body.category);
        req.body.metaTag = JSON.parse(req.body.metaTag);
        console.log(req.body);
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
        
        institute = await Institute.create(tempObj);


        response(res, 201, 'Institute added successfully');

    } catch(error) {
        console.log(error, req.body);
        response(res, 500, 'Internal server error')
    }

};

exports.deleteInstitute = async (req, res, next) => {

    try {
        const contactNumber = req.params.contactNumber;
        await Institute.deleteOne({"basicInfo.contactNumber" : contactNumber});
        response(res, 202, 'Institute deleted successfully'); 
    } catch(error) {
        console.log(error);
        response(res, 500, 'Internal Server Error while performing Deletion');
    }

}

exports.getOneInstitute = async (req, res, next) => {
    try {

        console.log('get req hit')
        if (!req.params.contactNumber) {
            response(res, 400, 'Phone number is required');
            return;
        }

        const institute = await Institute.findOne({ "basicInfo.contactNumber": req.params.contactNumber });
        console.log(institute);
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
