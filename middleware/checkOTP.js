const response = require('../controller/service/response');
const otp = require('../controller/users').otp;
module.exports = (req, res, next) => {
    if(!req.body.otp) {
        response(res, 404, 'Otp not provide')
        next(new Error('OTP not provided'));
    }
    else if(otp !== req.body.otp) {
        next(new Error('Incorrect OTP'))
    } else {
        next();
    }
};