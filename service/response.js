module.exports = function (res, statusCode, message) {
    res.status(statusCode).json({message});
}