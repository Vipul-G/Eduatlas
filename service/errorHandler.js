const response = require('../service/response');
function errorHandler(error, res) {
    const statusCode = error.statusCode || 500;
    if(statusCode === 500) {
        console.log(error);
    }
    response(res, statusCode, error.message);
}

module.exports = errorHandler;