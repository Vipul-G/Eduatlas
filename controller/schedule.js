const Schedule = require('../model/schedule.model');
const errorHandler = require('./service/errorHandler');
const schema = require('./service/joi');
const response = require('./service/response');

exports.addSchedule = async (req, res, next) => {
    try {
        const {error, value} = schema('addSchedule').validate(req.body);

        if(error) {
            console.log(error);
            const err = new Error('Wrong or insufficient parameters provided')
            err.statusCode = 400;
            throw err;
        }

        await Schedule.create(req.body);

        response(res, 201, "Schedule added successfully")

    } catch(error) {
       errorHandler(error, res);
    }
};

exports.updateSchedule =  async (req, res, next) => {
    try {

        // const scheduleId = req.params.scheduleId;

        // if(!scheduleId) {
        //     const err = new Error('scheduleId not provided')
        //     err.statusCode = 400;
        //     throw err;
        // }

        const scheduleInfo = req.query;
        
        if(!scheduleInfo.instituteId || !scheduleInfo.batchCode) {
            const err = new Error('schedule information not provided')
            err.statusCode = 400;
            throw err;
        }        

        const updatedSchedule = await Schedule.findOneAndUpdate({
            instituteId: scheduleInfo.instituteId,
            batchCode: scheduleInfo.batchCode
        }, {$set: req.body}, {new: true});

        res.status(200).json(updatedSchedule);

    } catch(error) {
       errorHandler(error, res);
    }
};

exports.getSchedule = async (req, res, next) => {
    try {
        const instituteId = req.query.instituteId;
        const many = req.query.many;
        if(!many || !instituteId) {
            const err = new Error('"many" and(or) "instituteId" query parameter not provided');
            err.statusCode = 400;
            throw err;
        }
        
        if (many == true) {

            const schedules = await Schedule.find({ instituteId });

            res.status(200).json(schedules);

        } else {
            const batchCode = req.query.batchCode;
            if(!batchCode) {
                const err = new Error('"batchCode" query parameter not provided');
                err.statusCode = 400;
                throw err;
            }

            const schedule = await Schedule.findOne({instituteId, batchCode});

            res.status(200).json(schedule);

        }

    } catch(error) {
        errorHandler(error, res)
    }
}

