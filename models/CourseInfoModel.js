const mongoose = require('mongoose');

const courseInfoSchema = new mongoose.Schema({
    courseName: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Course',
        required: true,
    },
    userWatch:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true,
    },
    courseProgress: {
        type: String,
        required: true,
    }    

});

courseInfoSchema.method('toJSON', function(){
    const { __v, ...object } = this.toObject();
    const { _id:id, ...result } = object;
    return { ...result, id };
});
exports.CourseInfo = mongoose.model('CourseInfo', courseInfoSchema);
exports.courseInfoSchema = courseInfoSchema;