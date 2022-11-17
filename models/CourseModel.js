const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    courseName: {
        type: String,
        required: true,
    },
    courseDescription: {
        type: String,
        required: true,
    },
    videoUrl: [{
        type: String,
        required: true,
    }],
    topicPart: [{
        type: String,
        required: true,
    }],
    courseItem:[{
        type: String,
        required: true,
    }],
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Category',
        required:true,
    },
    duration:{
        type:String,
        required:true,
    },
    isApproved:{
        type:Boolean,
        default:false,        
    }

});


courseSchema.method('toJSON', function(){
    const { __v, ...object } = this.toObject();
    const { _id:id, ...result } = object;
    return { ...result, id };
});

exports.Course = mongoose.model('Course', courseSchema);
exports.courseSchema = courseSchema;