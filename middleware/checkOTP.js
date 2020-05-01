const response = require('../service/response');
let otp;
module.exports = (req, res, next) => {
    otp = require('../config').sms.otp;
    console.log('=====req.body=====> ', req.body);
    if(otp < 0) {
        response(res, 400, 'OTP has not been generated yet');
        next(new Error('OTP has not been generated yet'));
    }
    else if(!req.body.otp || otp == null) {
        (otp == null) ?
      response(res, 400, 'OTP Expired') :
      response(res, 400, 'OTP not provided');
        next(new Error('OTP Error'));
    }
    else if(otp !== req.body.otp) {
        response(res, 400, 'Incorrect OTP');
        next(new Error('Incorrect OTP'));
    } 
    else if(req.query.varify == true && otp === req.body.otp) {
        response(res, 200, 'OTP varified')
        return;
    }
    else {
        if (otp == req.body.otp) {
            next();
            return;
        }
        next(new Error('Unknown OTP error'));
    }
};