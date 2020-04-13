const joi = require('@hapi/joi');

const Institute = require('../model/institute.model');

const schema = require('./service/joi');
const response = require('./service/response');

exports.addInstitute = async (req, res, next) => {
    try {
        req.body.basicInfo = JSON.parse(req.body.basicInfo);
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
        
        institute = await Institute.create(req.body);


        response(res, 201, 'Institute added successfully');

    } catch(error) {
        console.log(error);
        response(res, 500, 'Internal server error')
    }

};

exports.getAllInstitutes = async (req, res, next) => {
    try {
        const institutes = await Institute.findById(req.body._id);
        res.status(200).json({
            'institutes': institutes
        })
    } catch(error) {
        response(res, 500, error.message);
    }

}
