const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    categoryName: {
        type: String,
        required: true,
    },
    categoryDescription: {
        type: String,
        required: true,
    }    

});

categorySchema.method('toJSON', function(){
    const { __v, ...object } = this.toObject();
    const { _id:id, ...result } = object;
    return { ...result, id };
});
exports.Category = mongoose.model('Category', categorySchema);
exports.categorySchema = categorySchema;