const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Tên là bắt buộc'],
        trim: true,
        minlength: [2, 'Tên phải có ít nhất 2 ký tự']
    },
    age: {
        type: Number,
        required: [true, 'Tuổi là bắt buộc'],
        min: [6, 'Tuổi phải từ 6 trở lên'],
        max: [100, 'Tuổi không được vượt quá 100']
    },
    class: {
        type: String,
        required: [true, 'Lớp là bắt buộc'],
        trim: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Student', studentSchema);
