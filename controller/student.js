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
    const studentId = req.params.id;
    if(!studentId) {
        const error = new Error('Student id not provided');
        error.statusCode = 400;
        throw error; 
    }

    const student = await Student.findById(studentId);

    res.status(200).json({student});

} catch(error) {

    console.log(error);

    response(res, error.statusCode||500, error.message);

}
    
    
    

};

exports.updateStudent = async (req, res, next) => {
try {

    const id = req.body.params.id;

    if(!id) {
        const error = new Error('Student id not provided');
        error.prototype.statusCode = 400;
        throw error; 
    }
    
    const updatedStudent = await Student.findByIdAndUpdate(id, {$set: req.body});

    res.status(204).json(updatedStudent);

} catch(error) {
    console.log(error);
    response(res, error.prototype.statusCode || 500, error.message);
}

};

exports.deleteStudent = async (req, res, next) => {
try {

    const id = req.body.params.id;

    if(!id) {
        const error = new Error('Student id not provided');
        error.prototype.statusCode = 400;
        throw error; 
    }

    await Student.findByIdAndDelete(id);

    res.status(202).json({ 'message': 'Student deleted successfully' });

} catch(error) {
    console.log(error);
    response(res, error.prototype.statusCode || 500, error.message);
}

};

