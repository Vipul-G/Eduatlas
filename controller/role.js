const errorHandler = require('../service/errorHandler');
const response = require('../service/response');
const schema = require('../service/joi');
const bcrypt = require('bcrypt');
const User = require('../model/user.model');
const {NewUser} = require('../clientStore');

exports.assignRole = async (req, res, next) => {
    try {

        const {error, value} = schema('assignRole').validate(req.body);

        if(error) {
            console.log(error);
            const err = new Error('Insufficient or wrong parameters provided');
            err.statusCode = 400;
            throw err;
        }

        const role = req.user.role; // only Institute can assign role

        if(role != 4) {
            response(res, 401, 'Not Authorized to assign role');
            next(new Error('User is not authorized to assign role'));
            return;
        }

        if(parseInt(req.body.role, 10) >= 3) {
            response(res, 405, `Role ${req.body.role} can not be assigned`);
            next(new Error('Wrong Role passed'));
            return;
        }

        const hash = await bcrypt.hash(req.body.password, 10);
        req.body.password = hash;
        
        const user = new NewUser(req.body.phone, new User(req.body));

        response(res, 201, 'Role assigned successfully');

    } catch(error) {
        errorHandler(error, res);
    }
};