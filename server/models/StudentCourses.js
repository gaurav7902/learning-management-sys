const mongoose = require("mongoose");

const StudentCoursesSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    courses: [
        {
            courseId: {
                type: String,
                required: true,
            },
            title: {
                type: String,
                required: true,
            },
            instructorId: {
                type: String,
                required: true,
            },
            instructorName: {
                type: String,
                required: true,
            },
            dateOfPurchase: {
                type: Date,
                default: Date.now,
            },
            courseImage: {
                type: String,
                required: true,
            },
        },
    ],
});

module.exports = mongoose.model("StudentCourses", StudentCoursesSchema);
