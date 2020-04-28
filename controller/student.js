const response = require('./service/response')
const schema = require('./service/joi');
const Student = require('../model/student.model');

exports.addStudent = async (req, res, next) => {
try {

    const {error, value} = schema('addStudent').validate(req.body);
    if(error) {
        console.log(error);
        return res.status(400).json({
         message: error.message
        });
    }

    if(req.body.courseDetails.batch.length) {
        req.body.active = true;
    }
    await Student.create(req.body);

    response(res, 201, 'Student added successfully');

} catch(error) {
    console.log(error);
    response(res, 500, error.message);
}
};

exports.getAllStudents = async (req, res, next) => {
try {

    const instituteId = req.params.instituteId;
    if(!instituteId) {
        const error = new Error('Institute id not provided');
        error.prototype.statusCode = 400;
        throw error; 
    } 

    const students = await Student.find({instituteId});

    res.status(200).json(students);

} catch(error) {
    console.log(error);
    const statusCode = error.prototype.statusCode || 500;
    response(res, statusCode, error.message);
}    

};

exports.getOneStudent = async (req, res, next) => {

try {
    const studentInfo = req.query;
    if(!studentInfo.instituteId || !studentInfo.studentEmail) {
        const error = new Error('Student info not provided');
        error.statusCode = 400;
        throw error; 
    }

    let student;

    if(studentInfo.anouncement) {

        student = await Student.findOne({
            instituteId: studentInfo.instituteId,
            "basicDetails.studentEmail": studentInfo.studentEmail
        }, { anouncement: 1, _id: 0 });

    } else {
        student = await Student.findOne({
            instituteId: studentInfo.instituteId,
            "basicDetails.studentEmail": studentInfo.studentEmail
        });
    }

    res.status(200).json({student});

} catch(error) {

    console.log(error);

    response(res, error.statusCode||500, error.message);

}
    
    
    

};

exports.updateStudent = async (req, res, next) => {
try {

    const studentInfo = req.query;


    const {error, value} = schema('addStudent').validate(req.body);
    if(!studentInfo.instituteId || !studentInfo.studentEmail || error) {
        let err;
        if(error) {
            console.log(error);
            err = new Error('Insufficient/Wrong parameters provided');
        } else {
            err = new Error('Student info not provided');
        }
        err.statusCode = 400;
        throw err; 
    }
    if(req.body.courseDetails.batch.length) {
        req.body.active = true;
    } else {
        req.body.active = false;
    }

    
    const updatedStudent = await Student.findOneAndUpdate({
        instituteId: studentInfo.instituteId,
        "basicDetails.studentEmail": studentInfo.studentEmail
    }, {$set: req.body}, {new: true});

    res.status(200).json(updatedStudent);

} catch(error) {
    console.log(error);
    response(res, error.prototype.statusCode || 500, error.message);
}

};

exports.deleteStudent = async (req, res, next) => {
try {

    const studentInfo = req.query;
    console.log('StudentInfo', studentInfo);
    if(!studentInfo.instituteId || !studentInfo.studentEmail) {
        const error = new Error('Student info not provided');
        error.statusCode = 400;
        throw error; 
    }
    console.log('StudentInfo', studentInfo);
    await Student.findOneAndDelete({
        instituteId: studentInfo.instituteId,
        "basicDetails.studentEmail": studentInfo.studentEmail 
    });

    res.status(202).json({ 'message': 'Student deleted successfully' });

} catch(error) {
    console.log('========================')
    console.log(error);
    response(res, error.prototype.statusCode || 500, error.message);
}

};

